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
| `--plugin` | Additional plugins to install | None |
| `--theme` | Additional themes to install | None |
| `--zip` | Use a custom ZIP/directory/URL as the SUT build | None |
| `--test-package` | Test packages to include (multiple allowed) | `[]` |
| `--skip_activating_plugins` | Skip activating plugins | `false` |
| `--skip_activating_themes` | Skip activating themes | `false` |
| `--pw_test_tag` | Playwright test tag filter | None |
| `--shard` | Playwright sharding (e.g., `1/3`) | None |
| `--update_snapshots` | Update Playwright snapshots | `false` |
| `--pw_options` | Additional Playwright options | None |
| `--ui` | Run Playwright in UI mode | `false` |
| `--codegen` | Run environment for Playwright Codegen | `false` |
| `--verbose` | Show all output (overrides CI mode) | `false` |

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
- Valid manifest.json in each package
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
| `--plugin` | Additional plugins to install | None |
| `--theme` | Additional themes to install | None |
| `--skip_activating_plugins` | Skip activating plugins | `false` |
| `--skip_activating_themes` | Skip activating themes | `false` |

### With Global Setup

The `--global-setup` flag enables package execution:

```bash
qit env:up woocommerce --global-setup --config=utilities.json
```

Configuration file:
```json
{
  "test_packages": [
    "./utilities/disable-onboarding",
    "./utilities/create-test-data",
    "./utilities/configure-payment"
  ]
}
```

This will:
1. Set up the environment
2. Run globalSetup from all packages
3. Leave environment running

### Use Cases

#### Development Environment
```bash
# Start environment for manual testing
qit env:up my-extension
```

#### Pre-configured Environment
```bash
# Set up with test data and configuration
qit env:up my-extension --global-setup --config=setup.json
```

#### Utility Packages Only
```bash
# Works with only utility packages
qit env:up my-extension --global-setup --config=utilities.json
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
2. Current directory (if manifest.json exists)
3. Subdirectories of specified paths

Example structure:
```
my-tests/
├── qit-config.json
├── packages/
│   ├── setup/
│   │   └── manifest.json
│   ├── checkout/
│   │   └── manifest.json
│   └── payment/
│       └── manifest.json
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

You can filter tests using Playwright's built-in options:

```bash
# Using --pw_test_tag to filter by tag
qit run:e2e woocommerce --pw_test_tag="@checkout"

# Using --shard for parallel execution
qit run:e2e woocommerce --shard="1/3"

# Using --pw_options for additional Playwright arguments  
qit run:e2e woocommerce --pw_options="--grep checkout --workers=4"
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