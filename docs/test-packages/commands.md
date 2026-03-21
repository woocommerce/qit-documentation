---
description: "Command reference for test package and environment operations. Auto-generated CLI usage for run:e2e, env:up, env:down, package:scaffold, package:publish, package:list, package:show, package:download. Also covers passthrough arguments (-- to forward flags to Playwright), command execution context (npm/npx run on host, everything else runs in Docker container, override with host:/docker: prefix), QIT environment variables ($QIT_SITE_URL etc.), common patterns, and migration guide from old CLI options."
---

# Commands

Run `qit <command> --help` for the most current options. The CLI usage sections below are auto-generated from the actual CLI.

## Passthrough Arguments

Use `--` to pass arguments directly to the test framework (e.g., Playwright):

```bash
# Filter tests by pattern
qit run:e2e woocommerce -- --grep="@checkout"

# Run in headed mode with specific workers
qit run:e2e woocommerce -- --headed --workers=2

# Run in UI mode
qit run:e2e woocommerce -- --ui
```

Everything after `--` is forwarded to the test framework unchanged.

## Command Execution Context

Commands in manifest phases auto-detect where to run:

- `npm` and `npx` commands run on the **host** (where Node.js is installed)
- Everything else runs in the **Docker container** (where WordPress lives)
- Override with `host:` or `docker:` prefix, or use `runs_on` in object command format

```json
{
  "phases": {
    "globalSetup": [
      "wp plugin install helper --activate",
      "docker:curl https://example.com/data.json -o /tmp/data.json"
    ],
    "setup": [
      "npm ci",
      "host:node scripts/prepare.js"
    ],
    "run": [
      "npx playwright test"
    ]
  }
}
```

## QIT Environment Variables

Available in all phase commands:

| Variable | Description |
|----------|-------------|
| `$QIT_SITE_URL` | WordPress site URL (e.g., `http://localhost:8080`) |
| `$QIT_ENV_ID` | Unique environment identifier |

Secrets declared in `requires.secrets` are also available as environment variables.

## Common Patterns

### Conditional Execution

```json
{
  "setup": [
    "[ -f .env ] || cp .env.example .env"
  ]
}
```

### Multiple Run Commands

```json
{
  "run": [
    "npm run build",
    "npx playwright test"
  ]
}
```

## Migration Guide

### Removed Options

Playwright-specific options have been replaced by the `--` pass-through:

| Old Option | New Usage |
|------------|-----------|
| `--pw_test_tag=@tag` | `-- --grep=@tag` |
| `--update_snapshots` | `-- --update-snapshots` |
| `--pw_options="args"` | `-- args` |
| `--ui` | `-- --ui` |
| `--codegen` | Use `env:up` then `npx playwright codegen` |
| `--shard=1/3` | Not supported with test package orchestration |
| `--up_only` | Use `qit env:up` instead |

### Migration Examples

**Before:**
```bash
qit run:e2e woocommerce --pw_test_tag="@smoke"
qit run:e2e woocommerce --ui
qit run:e2e woocommerce --update_snapshots
qit run:e2e woocommerce --codegen
```

**After:**
```bash
qit run:e2e woocommerce -- --grep="@smoke"
qit run:e2e woocommerce -- --ui
qit run:e2e woocommerce -- --update-snapshots

# For codegen, use env:up instead
qit env:up
source "$(qit env:source)"
npx playwright codegen $QIT_SITE_URL
```













<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Delete a test package from the QIT registry

Usage:
  package:delete [options] [--] <package_id>

Arguments:
  package_id             Package identifier in format namespace/package:version (e.g., woocommerce/e2e:latest)

Options:
      --config[=CONFIG]  Path to the qit.json configuration file
  -y, --yes              Skip confirmation prompt
      --format=FORMAT    Output format (table, json) [default: "table"]
```

*Auto-generated from `qit package:delete --help`.*
<!-- END GENERATED CLI REFERENCE -->
