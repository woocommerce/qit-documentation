#!/bin/bash
# Generates command reference content from actual CLI --help output.
# Run from the docs-qit root: ./scripts/generate-command-reference.sh
#
# What it does:
# 1. Generates docs/reference/commands.md (full command reference)
# 2. Appends CLI usage section to each managed test page
#
# Requires: php, qit-cli source at /storage/qit/qit-cli/src

set -euo pipefail

QIT_CLI="/storage/qit/qit-cli/src/qit-cli.php"
COMMANDS_OUTPUT="docs/reference/commands.md"

# Symfony boilerplate options to strip
STRIP_PATTERN='^\s+-(h|q|V|n)\b|ansi|no-interaction|--verbose\b|--quiet\b|--version\b|--help\b|Display help|Do not output any|Display this application|Force .or disable|Increase the verbosity'

clean_help() {
    local cmd="$1"
    php "$QIT_CLI" "$cmd" --help 2>&1 \
        | grep -v -E "$STRIP_PATTERN" \
        | sed '/^$/N;/^\n$/d'
}

# Marker used to find and replace generated sections in existing files
START_MARKER="<!-- BEGIN GENERATED CLI REFERENCE -->"
END_MARKER="<!-- END GENERATED CLI REFERENCE -->"

# Append or replace CLI reference section in a doc file
inject_help() {
    local file="$1"
    local cmd="$2"
    local help_output
    help_output=$(clean_help "$cmd")

    local section
    section=$(cat <<EOF

${START_MARKER}
## CLI Usage

\`\`\`
${help_output}
\`\`\`

*Auto-generated from \`qit ${cmd} --help\`. Run the command for the most current options.*
${END_MARKER}
EOF
)

    if grep -q "$START_MARKER" "$file" 2>/dev/null; then
        # Replace existing generated section
        # Use perl for reliable multi-line replacement
        perl -i -0pe "s/${START_MARKER}.*?${END_MARKER}/${START_MARKER}\n## CLI Usage\n\n\`\`\`\n${help_output//\//\\/}\n\`\`\`\n\n*Auto-generated from \`qit ${cmd} --help\`. Run the command for the most current options.*\n${END_MARKER}/s" "$file"
    else
        # Append to end of file
        echo "$section" >> "$file"
    fi
}

echo "=== Generating full commands reference ==="

cat > "$COMMANDS_OUTPUT" << 'HEADER'
# Commands Reference

<!-- AUTO-GENERATED from CLI --help output. Do not edit manually. -->
<!-- Regenerate with: ./scripts/generate-command-reference.sh -->

Complete reference for all QIT CLI commands, generated from the actual CLI.

Run `qit <command> --help` for the most up-to-date information.

HEADER

# --- Run commands ---
echo "## Test Commands" >> "$COMMANDS_OUTPUT"
echo "" >> "$COMMANDS_OUTPUT"

for cmd in run:e2e run:activation run:security run:phpstan run:malware \
           run:validation run:plugin-check run:phpcompatibility \
           run:woo-e2e run:woo-api run:compatibility run:performance \
           run:group; do
    echo "  $cmd"
    echo "### \`qit $cmd\`" >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    clean_help "$cmd" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
done

# --- Environment commands ---
echo "## Environment Commands" >> "$COMMANDS_OUTPUT"
echo "" >> "$COMMANDS_OUTPUT"

for cmd in env:up env:down env:list env:source env:exec env:enter env:reset; do
    echo "  $cmd"
    echo "### \`qit $cmd\`" >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    clean_help "$cmd" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
done

# --- Package commands ---
echo "## Package Commands" >> "$COMMANDS_OUTPUT"
echo "" >> "$COMMANDS_OUTPUT"

for cmd in package:scaffold package:publish package:list package:show \
           package:download package:delete; do
    echo "  $cmd"
    echo "### \`qit $cmd\`" >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    clean_help "$cmd" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
done

# --- Other commands ---
echo "## Other Commands" >> "$COMMANDS_OUTPUT"
echo "" >> "$COMMANDS_OUTPUT"

for cmd in connect extensions sync; do
    echo "  $cmd"
    echo "### \`qit $cmd\`" >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    clean_help "$cmd" >> "$COMMANDS_OUTPUT"
    echo '```' >> "$COMMANDS_OUTPUT"
    echo "" >> "$COMMANDS_OUTPUT"
done

echo ""
echo "=== Injecting CLI usage into managed test pages ==="

# Map: command -> doc page
declare -A TEST_PAGES=(
    ["run:activation"]="docs/managed-tests/activation.md"
    ["run:security"]="docs/managed-tests/security.md"
    ["run:woo-e2e"]="docs/managed-tests/woo-e2e.md"
    ["run:woo-api"]="docs/managed-tests/woo-api.md"
    ["run:phpcompatibility"]="docs/managed-tests/phpcompatibility.md"
    ["run:phpstan"]="docs/managed-tests/phpstan.md"
    ["run:malware"]="docs/managed-tests/malware.md"
    ["run:validation"]="docs/managed-tests/validation.md"
    ["run:plugin-check"]="docs/managed-tests/plugin-check.md"
)

for cmd in "${!TEST_PAGES[@]}"; do
    file="${TEST_PAGES[$cmd]}"
    if [ -f "$file" ]; then
        echo "  $cmd -> $file"
        inject_help "$file" "$cmd"
    else
        echo "  SKIP: $file not found"
    fi
done

echo ""
echo "Done."
