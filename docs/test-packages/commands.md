---
description: "Command reference for test package operations. Documents run:e2e (execute test packages with orchestration), env:up/env:down (start/stop local Docker environments), package:list/show/publish/download (registry operations). Covers all options with examples, environment variables, package discovery, command execution context (host vs Docker container for .sh scripts), output formats, debugging flags, common usage patterns, and migration guide from older CLI versions."
---

# Commands

## run:e2e

Execute test packages with full orchestration.

```bash
qit run:e2e <extension> [options]
```

### Basic Usage

```bash
# Run with default configuration
qit run:e2e woocommerce

# Run with specific config file
qit run:e2e woocommerce --config=test-config.json

# Run in verbose mode
qit run:e2e woocommerce --verbose

# Run specific PHP version
qit run:e2e woocommerce --php=8.2
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--config` | Configuration file path | `qit-config.json` |
| `--profile` | Test profile to use | `default` |
| `--environment` | Environment name from configuration | `default` |
| `--php` | PHP version | `8.1` |
| `--wordpress`, `--wp` | WordPress version | `latest` |
| `--woocommerce`, `--woo` | WooCommerce version | `latest` |
| `--plugin` | Additional plugins to install (see below) | None |
| `--theme` | Additional themes to install | None |
| `--zip` | Use a custom ZIP/directory/URL as the SUT build | None |
| `--test-package` | Test packages to include (multiple allowed) | `[]` |
| `--skip_activating_plugins` | Skip activating plugins | `false` |
| `--skip_activating_themes` | Skip activating themes | `false` |
| `--verbose` | Show all output (overrides CI mode) | `false` |
| `--` | Pass all following arguments to test framework | None |

### Passing Arguments to Test Framework

Use `--` to pass arguments directly to the test framework (e.g., Playwright):

```bash
# Pass fail-fast to Playwright
qit run:e2e woocommerce -- --fail-fast

# Pass multiple Playwright options
qit run:e2e woocommerce -- --headed --workers=2 --project=chromium

# Run specific tests with grep
qit run:e2e woocommerce -- --grep="checkout flow"

# Combine QIT options (before --) and test framework options (after --)
qit run:e2e woocommerce --verbose --config=test.json -- --fail-fast --headed

# Update Playwright snapshots
qit run:e2e woocommerce -- --update-snapshots

# Run with UI mode
qit run:e2e woocommerce -- --ui

# Note: --shard is not supported
# Tests will run without sharding
```

**Important**:
- Everything before `--` is handled by QIT
- Everything after `--` is passed to test framework commands in the `run` phase
- Arguments are only passed to `run` phase commands, not to `setup`, `teardown`, etc.

### Installing Plugins with --plugin

The `--plugin` option supports multiple formats for maximum flexibility:

#### Simple Slug (WordPress.org)
```bash
# Single plugin
qit run:e2e woocommerce --plugin=woocommerce-subscriptions

# Multiple plugins
qit run:e2e woocommerce --plugin=woocommerce-payments --plugin=contact-form-7
```

#### Local Paths
```bash
# Local directory
qit run:e2e woocommerce --plugin=./my-plugin

# Local zip file
qit run:e2e woocommerce --plugin=./builds/my-plugin.zip

# Absolute path
qit run:e2e woocommerce --plugin=/Users/developer/plugins/my-plugin.zip
```

#### Explicit Slug Format (Recommended for Local Plugins)

When using local paths, QIT infers the slug from the filename. To ensure the correct slug is used, specify it explicitly:

```bash
# Format: slug@path
qit run:e2e woocommerce --plugin=my-plugin@./builds/my-plugin-v2.0.0.zip

# Avoids slug inference warnings
qit run:e2e woocommerce --plugin=payment-gateway@../payment-gateway
```

**Why use explicit slugs?**
- Prevents slug inference errors
- Handles version numbers in filenames correctly (e.g., `plugin-1.2.3.zip`)
- Makes intent clear and maintainable
- Required when filename doesn't match plugin slug

#### Path Resolution

- **Relative paths** (`./plugin`, `../builds/plugin.zip`): Resolved from current working directory
- **Absolute paths** (`/full/path/to/plugin`): Used as-is
- **Configuration file paths**: Resolved relative to qit.json location

#### Examples

```bash
# Testing with development version of a plugin
qit run:e2e woocommerce \
  --plugin=woocommerce-payments \
  --plugin=my-plugin@./dist/my-plugin.zip

# CI pipeline with dynamic version
qit run:e2e woocommerce \
  --plugin=my-plugin@./artifacts/my-plugin-${VERSION}.zip

# Multiple test dependencies
qit run:e2e woocommerce \
  --plugin=woocommerce-subscriptions \
  --plugin=test-helper@./test-plugins/helper.zip \
  --plugin=./local-dev/custom-extension
```

### Exit Codes

- **0**: All test packages passed
- **1**: Test failures or configuration errors
- **3**: Infrastructure failures

### CI Mode

When `CI` environment variable is set:
- Output is suppressed (unless `--verbose`)
- Only essential information shown
- Errors always visible

```bash
# CI mode with suppressed output
CI=true qit run:e2e woocommerce

# CI mode with verbose output
CI=true qit run:e2e woocommerce --verbose
```

### Configuration File

The `--config` option points to a JSON file:

```json
{
  "test_packages": [
    "./packages/setup",
    "./packages/checkout-tests",
    "./packages/payment-tests"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "6.4",
    "woocommerce": "8.5"
  }
}
```

### Requirements

`run:e2e` requires:
- At least one test package (with `run` phase)
- Valid qit-test.json in each package
- Result paths for test packages
- All required secrets set

Fails if:
- No test packages configured
- Only utility packages present
- Missing required secrets
- Invalid manifests

## env:up

Set up test environment without running tests.

```bash
qit env:up <extension> [options]
```

### Basic Usage

```bash
# Set up environment only
qit env:up woocommerce

# Set up with global setup from packages
qit env:up woocommerce --global-setup --config=setup.json

# Set up specific versions
qit env:up woocommerce --php=8.2 --wordpress=6.4
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--global-setup` | Run globalSetup phase from packages | `false` |
| `--config` | Configuration file (when using --global-setup) | None |
| `--profile` | Test profile to use | `default` |
| `--environment` | Environment name from configuration | `default` |
| `--php` | PHP version | `8.1` |
| `--wordpress`, `--wp` | WordPress version | `latest` |
| `--woocommerce`, `--woo` | WooCommerce version | `latest` |
| `--plugin` | Additional plugins to install (same format as run:e2e) | None |
| `--theme` | Additional themes to install | None |
| `--skip_activating_plugins` | Skip activating plugins | `false` |
| `--skip_activating_themes` | Skip activating themes | `false` |

**Note:** The `--plugin` option works the same as in `run:e2e`. See the "Installing Plugins with --plugin" section above for detailed usage.

### With Global Setup

The `--global-setup` flag enables package execution:

```bash
qit env:up --global-setup --config=utilities.json
```

Configuration file:
```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wp": "stable",
      "woo": "stable",
      "utilities": [
        "./utilities/disable-onboarding",
        "woocommerce/sample-data:latest",
        "./utilities/configure-payment"
      ]
    }
  }
}
```

This will:
1. Set up the environment
2. Download registry utilities (if any)
3. Run globalSetup from all utilities
4. Leave environment running

### Use Cases

#### Development Environment
```bash
# Start environment for manual testing
qit env:up my-extension
```

#### Pre-configured Environment
```bash
# Set up with utilities (local and registry)
qit env:up --global-setup --config=setup.json
```

#### Utility Packages Only
```bash
# Works with only utility packages
qit env:up --global-setup --config=utilities.json
```

### Differences from run:e2e

| Aspect | `run:e2e` | `env:up --global-setup` |
|--------|-----------|--------------------------|
| Test packages required | Yes | No |
| Utility packages only | Fails | Works |
| Runs test phases | Yes | No |
| Collects results | Yes | No |
| Database snapshots | Yes | No |
| Package isolation | Yes | No |

## env:down

Tear down test environment.

```bash
qit env:down
```

Removes:
- Docker containers
- Temporary files
- Database dumps
- Test artifacts

## package:list

List available test packages from the registry.

```bash
qit package:list [options]
```

### Basic Usage

```bash
# List all packages
qit package:list

# List only utility packages
qit package:list --type=utility

# List only test packages
qit package:list --type=test

# Filter by namespace
qit package:list --namespace=woocommerce

# Combine filters
qit package:list --type=utility --namespace=woocommerce
```

### Options

| Option | Description | Values |
|--------|-------------|--------|
| `--type` | Filter by package type | `utility`, `test`, `all` (default) |
| `--namespace` | Filter by namespace | Any string |
| `--owned-only` | Show only packages you own | Boolean |
| `--limit` | Packages per page | Number (default: 20) |
| `--page` | Page number | Number (default: 1) |

### Output

```
Available Packages
==================

Package ID                                Version    Visibility
woocommerce/disable-onboarding:latest    1.0.0      Private     Utility
woocommerce/checkout-tests:latest        2.1.0      Public
vendor/payment-tests:latest              1.5.0      Public

Use qit package:download <package-id> to download a package
Use --type utility to show only utility packages
```

Utility packages are indicated in the output.

## package:show

Display detailed information about a specific package.

```bash
qit package:show <package-id> [options]
```

### Basic Usage

```bash
# Show package details
qit package:show woocommerce/disable-onboarding:latest

# JSON output
qit package:show woocommerce/disable-onboarding:latest --json
```

### Options

| Option | Description |
|--------|-------------|
| `--format` | Output format: `table` or `json` |
| `--json`, `-j` | Shorthand for `--format=json` |

### Output

```
Package Details: woocommerce/disable-onboarding:latest
==========================================================

Basic Information
-----------------
 Package ID   woocommerce/disable-onboarding:latest
 Type         Utility Package
 Namespace    woocommerce
 Version      1.0.0
 Visibility   Public

Description
-----------
 Disables WooCommerce onboarding wizards and admin notices

Tags
----
 setup, woocommerce, configuration

Requirements
------------
  Plugins:
    • woocommerce

Phases
------
  ✓ globalSetup:
        wp option set woocommerce_task_list_hidden yes
        wp option set woocommerce_onboarding_profile_completed yes
  ✗ run: (none - this is a utility package)

Use qit package:download woocommerce/disable-onboarding:latest to download
Add to your qit.json under "utilities" to use in environments
```

Shows:
- Package type (utility vs test)
- Description and tags
- Requirements (plugins, themes, secrets)
- Available phases
- Usage hints

## package:publish

Publish a test package to the registry.

```bash
qit package:publish <path> <version>
```

### Basic Usage

```bash
# Publish utility package
qit package:publish ./utilities/disable-onboarding 1.0.0

# Publish test package
qit package:publish ./tests/e2e 2.1.0
```

### Output

```
Publishing woocommerce/disable-onboarding:1.0.0...
✓ Package validated
✓ Package type: utility
✓ Uploaded to registry

Published successfully!
```

Package type is automatically detected from manifest:
- No `run` phase = utility package
- Has `run` phase = test package

## package:download

Download a package from the registry.

```bash
qit package:download <package-id>
```

Downloads package to local cache for inspection or local use.

## Environment Variables

### Secrets

Set required secrets as environment variables:

```bash
export STRIPE_KEY="sk_test_..."
export STRIPE_SECRET="..."
export WEBHOOK_SECRET="..."
```

### CI Mode

Enable CI mode for cleaner output:

```bash
export CI=true
```

Any truthy value enables CI mode:
- `CI=1`
- `CI=true`
- `CI=yes`
- `CI=anything`

### QIT Variables

Available in package commands:

| Variable | Description | Example |
|----------|-------------|---------|
| `QIT_SITE_URL` | WordPress site URL | `http://localhost:8080` |
| `QIT_WP_ADMIN` | Admin URL | `http://localhost:8080/wp-admin` |
| `QIT_DB_NAME` | Database name | `wordpress` |
| `QIT_DB_USER` | Database user | `root` |
| `QIT_DB_PASS` | Database password | `root` |
| `QIT_DB_HOST` | Database host | `db:3306` |

Use in commands:
```json
{
  "run": [
    "SITE_URL=$QIT_SITE_URL npm test"
  ]
}
```

## Package Discovery

QIT looks for packages in these locations:

1. Paths specified in configuration file
2. Current directory (if qit-test.json exists)
3. Subdirectories of specified paths

Example structure:
```
my-tests/
├── qit-config.json
├── packages/
│   ├── setup/
│   │   └── qit-test.json
│   ├── checkout/
│   │   └── qit-test.json
│   └── payment/
│       └── qit-test.json
```

Configuration:
```json
{
  "test_packages": [
    "./packages/setup",
    "./packages/checkout",
    "./packages/payment"
  ]
}
```

## Command Context

Commands run in different contexts:

### Host Commands
Marked with `[host]` in output:
- npm/yarn commands
- Local scripts
- File operations

```json
{
  "setup": [
    "npm install",
    "./scripts/prepare.sh"
  ]
}
```

### Container Commands
Run inside WordPress container:
- WP-CLI commands
- PHP scripts
- WordPress operations

```json
{
  "globalSetup": [
    "wp plugin install helper --activate",
    "wp user create test test@example.com"
  ]
}
```

## Output Format

### Standard Output
```
┌─ STARTING TEST RUN ────────────────────────────
│ Packages: 3 (2 test, 1 utility)
│ PHP: 8.2 | WordPress: 6.4 | WooCommerce: 8.5
└────────────────────────────────────────────────

┌─ GLOBAL SETUP ─────────────────────────────────
│ Running globalSetup from all packages...
│ ✓ [utilities/setup] wp plugin install helper
│ ✓ [tests/checkout] wp option set test yes
└────────────────────────────────────────────────

┌─ PACKAGE [1/3]: tests/checkout ────────────────
│ ➤ Setup phase
│ [host] npm install
│ ✓ Setup completed
│ 
│ ➤ Run phase
│ [host] npm test
│ ✓ Tests passed (10/10)
│ 
│ ➤ Teardown phase
│ ✓ Teardown completed
└────────────────────────────────────────────────
```

### CI Output (Suppressed)
```
┌─ STARTING TEST RUN ────────────────────────────
│ Packages: 3 (2 test, 1 utility)
└────────────────────────────────────────────────

┌─ PACKAGE [1/3]: tests/checkout ────────────────
│ [host] npm install
│ [host] npm test
│ ✓ Tests passed (10/10)
└────────────────────────────────────────────────
```

### Error Output
Always shown, even in CI mode:
```
┌─ PACKAGE [1/3]: tests/checkout ────────────────
│ ✗ Setup failed
│ 
│ Error: npm install failed
│ npm ERR! Missing package.json
└────────────────────────────────────────────────
```

## Debugging

### Verbose Mode
Force full output:
```bash
qit run:e2e woocommerce --verbose
```

### Test Specific Package
Run subset of packages:
```json
{
  "test_packages": [
    "./packages/checkout"
  ]
}
```

### Check Configuration
Validate without running:
```bash
qit validate-config test-config.json
```

### View Logs
Execution logs saved to:
- `./qit-results/logs/execution.log`
- `./qit-results/logs/debug.log`

## Common Patterns

### Running Specific Tests

You can filter tests by passing options to your test framework after `--`:

```bash
# Filter by tag/grep pattern
qit run:e2e woocommerce -- --grep="@checkout"

# Run tests with sharding for parallel execution
qit run:e2e woocommerce -- --shard=1/3

# Pass multiple Playwright options
qit run:e2e woocommerce -- --grep checkout --workers=4
```

Or in the package manifest:
```json
{
  "run": [
    "npm test -- --grep 'checkout'"
  ]
}
```

### Conditional Execution
```json
{
  "setup": [
    "[ -f .env ] || cp .env.example .env"
  ]
}
```

### Multiple Commands
```json
{
  "run": [
    "npm run build",
    "npm test"
  ]
}
```

### Environment-Specific Config
```bash
# Development
qit run:e2e woocommerce --config=dev.json

# Staging
qit run:e2e woocommerce --config=staging.json

# Production-like
qit run:e2e woocommerce --config=prod.json
```

## Migration Guide

### Removed Options

The following Playwright-specific options have been removed in favor of the `--` pass-through mechanism:

| Old Option | New Usage |
|------------|-----------|
| `--pw_test_tag=@tag` | `-- --grep=@tag` |
| `--shard=1/3` | Not supported |
| `--update_snapshots` | `-- --update-snapshots` |
| `--pw_options="args"` | `-- args` |
| `--ui` | `-- --ui` |
| `--codegen` | Use `env:up` then `npx playwright codegen` |

### Removed Functionality

The `up_only` mode has been removed. To start an environment without running tests, use `env:up`:

```bash
# Old way (removed)
# qit run:e2e woocommerce --up_only

# New way
qit env:up woocommerce
```

### Migration Examples

**Before:**
```bash
# Old way with removed options
qit run:e2e woocommerce --pw_test_tag="@smoke" --shard=1/2
qit run:e2e woocommerce --ui
qit run:e2e woocommerce --update_snapshots
qit run:e2e woocommerce --codegen
```

**After:**
```bash
# New way with -- pass-through
qit run:e2e woocommerce -- --grep="@smoke" --shard=1/2
qit run:e2e woocommerce -- --ui
qit run:e2e woocommerce -- --update-snapshots

# For codegen, use env:up instead
qit env:up woocommerce
source "$(qit env:source ...)"
npx playwright codegen $QIT_SITE_URL
```

### Why These Changes?

1. **Framework Agnostic**: The `--` mechanism works with any test framework, not just Playwright
2. **Cleaner Separation**: QIT options before `--`, test framework options after
3. **No Feature Loss**: All Playwright features still available, just passed differently
4. **Future Proof**: New test framework options automatically supported without QIT updates
5. **Simpler Codebase**: Removing framework-specific logic makes QIT more maintainable