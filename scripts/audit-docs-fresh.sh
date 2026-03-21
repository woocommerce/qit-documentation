#!/bin/bash
# Run a fresh AI audit of the QIT docs with zero context.
# Requires: claude CLI (authenticated), docs running at localhost:3000
#
# Uses a temp dir with no CLAUDE.md so the AI has no project context.
# Output saved to audit-result.md

TMPDIR=$(mktemp -d)
OUTFILE="/storage/qit/docs-qit/audit-result.md"

cd "$TMPDIR"

echo "Running audit from clean directory: $TMPDIR"
echo "Output will be saved to: $OUTFILE"
echo "This may take several minutes..."
echo ""

PROMPT='You are evaluating documentation for a developer tool called QIT (Quality Insights Toolkit). Your task is to assess how well these docs would serve an AI agent helping a user with QIT.

The docs are running at http://localhost:3000/docs/

Using the Playwright MCP browser tools:

1. Start at http://localhost:3000/docs/ and read the introduction
2. Navigate through the sidebar. Read every top-level page and at least 2-3 pages from each section: Managed Tests, Test Packages, Test Configuration
3. Then try to answer these questions using ONLY what you learned from the docs:

QUESTIONS:
Q1: How do I run a security test on my plugin called my-awesome-plugin?
Q2: What options does the security test support, like versions etc?
Q3: How do I save my test settings so I do not retype them?
Q4: How do I test my plugin against PHP 8.3 and WordPress 6.4?
Q5: What is the difference between a managed test and a test package?
Q6: How do I create my first test package?
Q7: Can I run multiple test types in one command?

For each question, rate:
- Could you answer it: yes or no
- How many pages did you need to read: 1, 2-3, or 4+
- Was the answer clear or did you have to piece it together
- Was any information contradictory or confusing

Finally, give an overall score 1-10 for:
- Discoverability: How easy is it to find what you need
- Accuracy: Does the documentation seem trustworthy and precise
- Completeness: Are there obvious gaps
- Agent-readiness: Could an AI agent use these docs to help a user reliably

Be brutally honest. Quote specific text that confused you or was helpful.'

claude --model opus --dangerously-skip-permissions --output-format text -p "$PROMPT" 2>&1 | tee "$OUTFILE"

rm -rf "$TMPDIR"

echo ""
echo "Audit saved to: $OUTFILE"
