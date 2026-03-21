/**
 * Remark plugin that replaces {{QIT_COMMAND:command:name}} placeholders
 * with auto-generated CLI --help output at build time.
 *
 * Boilerplate detection: instead of hardcoding which lines to strip,
 * we run --help for a sample of commands and detect lines that appear
 * in 80%+ of them (Symfony global options). These are stripped automatically.
 *
 * Usage in markdown:
 *   {{QIT_COMMAND:env:up}}
 *   {{QIT_COMMAND:run:security}}
 */

import { visit } from 'unist-util-visit';
import { execSync } from 'child_process';

const helpCache = new Map();
let boilerplateLines = null;

/**
 * Detect boilerplate lines by finding lines common across most commands.
 */
function detectBoilerplate(qitCliPath) {
  if (boilerplateLines) return;

  let commands;
  try {
    const raw = execSync(`php ${qitCliPath} list --raw 2>/dev/null`, { encoding: 'utf8' });
    commands = raw.split('\n').map(l => l.split(/\s+/)[0]).filter(Boolean);
  } catch {
    console.warn('[qit-cli-help] Could not run QIT CLI. Placeholders will not be replaced.');
    boilerplateLines = new Set();
    return;
  }

  // Sample up to 15 commands for boilerplate detection
  const sample = commands.slice(0, Math.min(commands.length, 15));
  const lineCounts = new Map();

  for (const cmd of sample) {
    try {
      const help = execSync(`php ${qitCliPath} ${cmd} --help 2>/dev/null`, { encoding: 'utf8' });
      const lines = help.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
      const seen = new Set();
      for (const line of lines) {
        if (!seen.has(line)) {
          lineCounts.set(line, (lineCounts.get(line) || 0) + 1);
          seen.add(line);
        }
      }
    } catch {
      // Skip commands that fail
    }
  }

  const threshold = sample.length * 0.8;
  const boilerplateNormalized = new Set(
    [...lineCounts.entries()]
      .filter(([, count]) => count >= threshold)
      .map(([line]) => line)
  );

  // Store normalized versions for matching, but we need to match against
  // original lines (with their original whitespace)
  boilerplateLines = boilerplateNormalized;
  console.log(`[qit-cli-help] Detected ${boilerplateLines.size} boilerplate lines from ${sample.length} commands (threshold: ${threshold})`);
  if (boilerplateLines.size > 0) {
    for (const line of [...boilerplateLines].slice(0, 5)) {
      console.log(`[qit-cli-help]   "${line}"`);
    }
    if (boilerplateLines.size > 5) console.log(`[qit-cli-help]   ... and ${boilerplateLines.size - 5} more`);
  }
}

/**
 * Get cleaned --help output for a command.
 */
function getHelp(command, qitCliPath) {
  if (helpCache.has(command)) return helpCache.get(command);

  detectBoilerplate(qitCliPath);

  let raw;
  try {
    raw = execSync(`php ${qitCliPath} ${command} --help 2>/dev/null`, { encoding: 'utf8' });
  } catch {
    console.warn(`[qit-cli-help] Failed to get help for "${command}"`);
    return `(Could not generate help for "qit ${command}". Run "qit ${command} --help" for options.)`;
  }

  const cleaned = raw
    .split('\n')
    .filter(line => !boilerplateLines.has(line.replace(/\s+/g, ' ').trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  helpCache.set(command, cleaned);
  return cleaned;
}

/**
 * Remark plugin: replaces {{QIT_COMMAND:xxx}} with CLI help code blocks.
 */
export default function qitCliHelp(options = {}) {
  const qitCliPath = options.qitCliPath || '/storage/qit/qit-cli/src/qit-cli.php';

  return (tree) => {
    // MDX comments become 'mdxFlowExpression' nodes with value like '/* QIT_COMMAND:run:security */'
    visit(tree, 'mdxFlowExpression', (node, index, parent) => {
      const match = node.value.match(/^\s*\/\*\s*QIT_COMMAND:([\w:_-]+)\s*\*\/\s*$/);
      if (!match) return;

      const command = match[1].replace(/_/g, ':');
      const help = getHelp(command, qitCliPath);

      // Replace the paragraph with a code block
      const codeNode = {
        type: 'code',
        lang: null,
        meta: null,
        value: help,
      };

      parent.children.splice(index, 1, codeNode);
      return index; // revisit this index since we replaced the node
    });
  };
}
