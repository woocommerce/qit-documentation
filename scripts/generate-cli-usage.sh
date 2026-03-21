#!/bin/bash
# Injects CLI --help output into managed test doc pages.
# Run from the docs-qit root: ./scripts/generate-cli-usage.sh
#
# Requires: php, qit-cli source at /storage/qit/qit-cli/src

set -euo pipefail

QIT_CLI="/storage/qit/qit-cli/src/qit-cli.php"

# Symfony boilerplate to strip
STRIP_PATTERN='^\s+-(h|q|V|n)\b|ansi|no-interaction|--verbose\b|--quiet\b|--version\b|--help\b|Display help|Do not output any|Display this application|Force .or disable|Increase the verbosity'

START_MARKER="<!-- BEGIN GENERATED CLI REFERENCE -->"
END_MARKER="<!-- END GENERATED CLI REFERENCE -->"

inject_help() {
    local file="$1"
    local cmd="$2"

    local help_output
    help_output=$(php "$QIT_CLI" "$cmd" --help 2>&1 \
        | grep -v -E "$STRIP_PATTERN" \
        | sed '/^$/N;/^\n$/d')

    local block
    block=$(printf '\n%s\n## CLI Usage\n\n```\n%s\n```\n\n*Auto-generated from `qit %s --help`.*\n%s' \
        "$START_MARKER" "$help_output" "$cmd" "$END_MARKER")

    if grep -q "$START_MARKER" "$file" 2>/dev/null; then
        # Remove old generated block, append new one
        sed -i "/$START_MARKER/,/$END_MARKER/d" "$file"
    fi

    echo "$block" >> "$file"
}

declare -A PAGES=(
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

for cmd in "${!PAGES[@]}"; do
    file="${PAGES[$cmd]}"
    if [ -f "$file" ]; then
        echo "$cmd -> $(basename $file)"
        inject_help "$file" "$cmd"
    else
        echo "SKIP: $file not found"
    fi
done

echo "Done."
