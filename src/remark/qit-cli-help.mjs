/**
 * Remark plugin: replaces {/* QIT_COMMAND:command:name *\/} placeholders
 * with CLI --help output at build time.
 *
 * When CLI is available (local): runs --help live, updates cache file.
 * When CLI is unavailable (CI): reads from committed cache file.
 *
 * Boilerplate auto-detection: compares --help across commands, strips
 * lines appearing in 80%+ (Symfony global options).
 */

import { visit } from 'unist-util-visit';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = resolve(__dirname, '../../.cli-help-cache.json');

let cache = null;
let boilerplateLines = null;
let cliAvailable = null;
let cacheUpdated = false;

function loadCache() {
  if (cache !== null) return;
  if (existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
    } catch {
      cache = {};
    }
  } else {
    cache = {};
  }
}

let cacheSaved = false;

function saveCache() {
  if (!cacheUpdated || cacheSaved) return;
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n');
  console.log('[qit-cli-help] Cache updated.');
  cacheSaved = true;
}

function checkCli(qitCliPath) {
  if (cliAvailable !== null) return cliAvailable;
  try {
    execSync(`php ${qitCliPath} --version 2>/dev/null`, { encoding: 'utf8' });
    cliAvailable = true;
  } catch {
    cliAvailable = false;
    console.log('[qit-cli-help] CLI not available — using cached help output.');
  }
  return cliAvailable;
}

function detectBoilerplate(qitCliPath) {
  if (boilerplateLines) return;
  if (!checkCli(qitCliPath)) { boilerplateLines = new Set(); return; }

  let commands;
  try {
    const raw = execSync(`php ${qitCliPath} list --raw 2>/dev/null`, { encoding: 'utf8' });
    commands = raw.split('\n').map(l => l.split(/\s+/)[0]).filter(Boolean);
  } catch {
    boilerplateLines = new Set();
    return;
  }

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
    } catch { /* skip */ }
  }

  const threshold = sample.length * 0.8;
  boilerplateLines = new Set(
    [...lineCounts.entries()]
      .filter(([, count]) => count >= threshold)
      .map(([line]) => line)
  );
}

function getHelp(command, qitCliPath) {
  loadCache();
  detectBoilerplate(qitCliPath);

  if (checkCli(qitCliPath)) {
    let raw;
    try {
      raw = execSync(`php ${qitCliPath} ${command} --help 2>/dev/null`, { encoding: 'utf8' });
    } catch {
      // CLI failed for this command — use cache
      return cache[command] || `(Run "qit ${command} --help" for options.)`;
    }

    const cleaned = raw
      .split('\n')
      .filter(line => !boilerplateLines.has(line.replace(/\s+/g, ' ').trim()))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (cache[command] !== cleaned) {
      cache[command] = cleaned;
      cacheUpdated = true;
    }

    return cleaned;
  }

  // CLI not available — use cache
  return cache[command] || `(Run "qit ${command} --help" for options.)`;
}

export default function qitCliHelp(options = {}) {
  const qitCliPath = options.qitCliPath || '/storage/qit/qit-cli/src/qit-cli.php';

  return (tree) => {
    visit(tree, 'mdxFlowExpression', (node, index, parent) => {
      const match = node.value.match(/^\s*\/\*\s*QIT_COMMAND:([\w:_-]+)\s*\*\/\s*$/);
      if (!match) return;

      const command = match[1].replace(/_/g, ':');
      const help = getHelp(command, qitCliPath);

      parent.children.splice(index, 1, {
        type: 'code',
        lang: null,
        meta: null,
        value: help,
      });

      return index;
    });

    // Save cache after processing all files
    saveCache();
  };
}
