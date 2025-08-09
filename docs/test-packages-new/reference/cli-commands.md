# CLI Commands Reference

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
| `--config` | Configuration file path | `qit.json` |
| `--test-package` | Test packages to include (multiple allowed) | `[]` |
| `--php` | PHP version | `8.1` |
| `--wordpress`, `--wp` | WordPress version | `latest` |
| `--woocommerce`, `--woo` | WooCommerce version | `latest` |
| `--plugin` | Additional plugins to install | None |
| `--theme` | Additional themes to install | None |
| `--zip` | Use a custom ZIP/directory/URL as the SUT build | None |
| `--verbose` | Show all output (overrides CI mode) | `false` |
| `--` | Pass all following arguments to test framework | None |

### Passing Arguments to Test Framework

Use `--` to pass arguments directly to the test framework (e.g., Playwright):

```bash
# Pass multiple Playwright options
qit run:e2e woocommerce -- --headed --workers=2 --project=chromium

# Run specific tests with grep
qit run:e2e woocommerce -- --grep="@checkout"

# Update Playwright snapshots
qit run:e2e woocommerce -- --update-snapshots

# Note: --shard is not supported under run:e2e orchestration
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

---

## env:up

Start a persistent test environment without running tests.

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
| `--php` | PHP version | `8.1` |
| `--wordpress`, `--wp` | WordPress version | `latest` |
| `--woocommerce`, `--woo` | WooCommerce version | `latest` |
| `--plugin` | Additional plugins to install | None |
| `--theme` | Additional themes to install | None |

### With Global Setup

```bash
qit env:up woocommerce --global-setup --config=utilities.json
```

This will:
1. Set up the environment
2. Run globalSetup from all packages
3. Leave environment running

---

## env:down

Tear down test environment.

```bash
qit env:down [environment-id]
```

Removes:
- Docker containers
- Temporary files
- Database dumps
- Test artifacts

---

## env:list

List running environments.

```bash
qit env:list
```

Shows:
- Environment IDs
- URLs
- Status
- Creation time

---

## env:enter

Enter the PHP container shell.

```bash
qit env:enter [environment-id]
```

Provides interactive shell access to run WP-CLI commands:

```bash
# Inside container
wp plugin list
wp user create test test@example.com
wp option get blogname
```

---

## env:exec

Execute a command inside the container.

```bash
qit env:exec [environment-id] -- <command>
```

Example:
```bash
qit env:exec -- wp plugin list
qit env:exec -- wp user create test test@example.com
```

---

## env:reload

Reset environment to baseline state.

```bash
qit env:reload [environment-id]
```

Returns database to post-SUT setup state while keeping environment running.

---

## env:source

Get environment variables for shell.

```bash
source "$(qit env:source [environment-id])"
```

Sets:
- `QIT_SITE_URL`
- `QIT_WP_ADMIN`
- Database credentials
- Other environment variables

---

## package:scaffold

Create a new test package structure.

```bash
qit package:scaffold [options] <target_dir>
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--namespace` | Extension slug (your namespace) | Prompted |
| `--package` | Package name | `e2e` |
| `--framework` | Test framework | `playwright` |
| `--test-type` | Type of tests | `e2e` |
| `--only-manifest` | Skip npm scaffolding | `false` |

### Example

```bash
qit package:scaffold --namespace=woocommerce --package=checkout packages/checkout
```

Creates:
- `manifest.json`
- `bootstrap/` scripts
- `playwright.config.js`
- `package.json`
- Example test

---

## package:publish

Publish a package to the registry.

```bash
qit package:publish <package_dir>
```

Requirements:
- Valid manifest.json
- You must be a maintainer of the namespace

---

## package:list

List published packages.

```bash
qit package:list [namespace]
```

Shows:
- Package names
- Versions
- Published dates

---

## validate:e2e

Validate package configuration without running.

```bash
qit validate:e2e <package_dir>
```

Checks:
- Manifest schema
- Required fields
- Result paths
- Secret declarations

---

## report

Open the test report in browser.

```bash
qit report
```

Opens `qit-results/reports/index.html` in default browser.

---

## Environment Variables

### Required Secrets

Set as environment variables:

```bash
export STRIPE_TEST_KEY="sk_test_..."
export STRIPE_TEST_SECRET="..."
```

### CI Mode

```bash
export CI=true  # Enable CI mode (quiet output)
```

### QIT Variables (Available in Commands)

| Variable | Description | Example |
|----------|-------------|---------|
| `QIT_SITE_URL` | WordPress site URL | `http://localhost:8080` |
| `QIT_WP_ADMIN` | Admin URL | `http://localhost:8080/wp-admin` |
| `QIT_DB_NAME` | Database name | `wordpress` |
| `QIT_DB_USER` | Database user | `root` |
| `QIT_DB_PASS` | Database password | `root` |
| `QIT_DB_HOST` | Database host | `db:3306` |

---

## Command Execution Context

### Host Commands
Run on your machine (marked with `[host]` in output):
- npm/yarn commands
- Local scripts
- File operations

### Container Commands
Run inside WordPress container:
- WP-CLI commands
- PHP scripts
- WordPress operations

---

## Common Patterns

### Running Specific Tests

```bash
# Filter by tag/grep pattern
qit run:e2e woocommerce -- --grep="@checkout"

# Run with multiple workers
qit run:e2e woocommerce -- --workers=4

# Run in headed mode
qit run:e2e woocommerce -- --headed
```

### Development Workflow

```bash
# Start persistent environment
qit env:up woocommerce --global-setup --config=dev.json

# Load environment variables
source "$(qit env:source qitenv_...)"

# Run tests manually
npx playwright test --ui

# Reset if needed
qit env:reload

# Clean up
qit env:down
```

### CI Pipeline

```bash
# Set secrets
export STRIPE_TEST_KEY="${{ secrets.STRIPE_KEY }}"

# Run tests in CI mode
CI=true qit run:e2e woocommerce --config=ci.json

# Check exit code
if [ $? -eq 0 ]; then
  echo "Tests passed"
else
  echo "Tests failed"
fi
```

---

## See also

- **[Configuration Schema](./qit-json-schema.md)** — qit.json structure
- **[Manifest Schema](./manifest-schema.md)** — manifest.json structure  
- **[Environment Variables](./environment-variables.md)** — Complete QIT variable reference
- **[Pass Playwright Options](../how-to-guides/pass-playwright-options.md)** — Using the `--` separator

---

**Last updated:** 2025-08-09