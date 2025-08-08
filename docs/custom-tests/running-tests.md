# Running Tests

This guide explains how to execute Custom Test packages using the QIT CLI.

## Basic Usage

### Running Test Packages

The `run:e2e` command executes test packages:

```bash
qit run:e2e <extension> --config=<config-file>
```

**Requirements:**
- At least one test package (with a `run` phase)
- Configuration file listing packages to run
- Required secrets set as environment variables

### Configuration File

Create a configuration file that lists your packages:

```json
{
  "test_packages": [
    "./packages/utilities/setup",
    "./packages/tests/checkout",
    "./packages/tests/payment",
    "./packages/utilities/cleanup"
  ]
}
```

### Command Options

```bash
qit run:e2e woocommerce \
  --config=./test-config.json \
  --php=8.2 \
  --wordpress=latest \
  --woocommerce=8.0.0 \
  --verbose
```

**Available options:**
- `--config`: Path to configuration file (required)
- `--php`: PHP version (default: latest)
- `--wordpress`: WordPress version (default: latest)
- `--woocommerce`: WooCommerce version (default: latest)
- `--verbose`: Show all command output
- `--json`: Output results as JSON
- `--pw_options`: Additional Playwright options

## Package Execution Order

Packages execute in the order specified in the configuration:

1. **Global Setup Phase**
   - All packages' `globalSetup` commands run
   - Database snapshot is taken

2. **Package Loop**
   - For each package in order:
     - Restore database (if not first)
     - Run `setup` phase
     - Run `run` phase (test packages only)
     - Collect results (test packages only)
     - Run `teardown` phase

3. **Global Teardown Phase**
   - All packages' `globalTeardown` commands run

## Environment Setup Only

To set up an environment without running tests:

```bash
qit env:up woocommerce --global-setup --config=./setup-config.json
```

This is useful when:
- You only have utility packages
- You want to prepare an environment for manual testing
- You're debugging environment setup

## Secret Management

### Setting Secrets

Secrets must be set as environment variables before running tests:

```bash
export STRIPE_API_KEY='sk_test_...'
export PAYPAL_CLIENT_ID='...'
export CUSTOM_SECRET='...'

qit run:e2e woocommerce --config=./config.json
```

### Secret Validation

If required secrets are missing, you'll see:

```
Missing required secrets:
  - STRIPE_API_KEY
  - PAYPAL_CLIENT_ID

Set these environment variables:
  export STRIPE_API_KEY='your-key-here'
  export PAYPAL_CLIENT_ID='your-id-here'
```

### Secret Redaction

Secrets are automatically redacted from all output:
- Plain text occurrences
- URL-encoded versions
- Base64-encoded versions

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      CI: true  # Enable CI mode
      STRIPE_API_KEY: ${{ secrets.STRIPE_API_KEY }}
      PAYPAL_CLIENT_ID: ${{ secrets.PAYPAL_CLIENT_ID }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install QIT CLI
        run: |
          curl -sSL https://qit.woo.com/install.sh | bash
          
      - name: Run E2E Tests
        run: |
          qit run:e2e woocommerce \
            --config=./test-config.json \
            --verbose
```

### GitLab CI

```yaml
e2e-tests:
  image: php:8.2
  variables:
    CI: "true"
  before_script:
    - curl -sSL https://qit.woo.com/install.sh | bash
  script:
    - |
      export STRIPE_API_KEY=$STRIPE_API_KEY
      export PAYPAL_CLIENT_ID=$PAYPAL_CLIENT_ID
      qit run:e2e woocommerce --config=./test-config.json
```

## Output Management

### Standard Output

In normal mode, you see full output:

```
Running Test Packages
---------------------

┌─ PACKAGE [1/2]: my-company/checkout-tests:local ──────────────
│ Type: Local Package
├────────────────────────────────────────────────────────────────
│ ➤ Setup phase
│ [host] npm install
│ Installing dependencies...
│ added 150 packages in 3.2s
│ 
│ ➤ Run phase
│ [host] npx playwright test
│ Running 5 tests...
│ ✓ checkout.spec.js:10:5 › Guest checkout
│ ✓ checkout.spec.js:25:5 › Registered user checkout
│ ...
└────────────────────────────────────────────────────────────────
```

### CI Mode

With `CI=true`, output is suppressed:

```
Running Test Packages
---------------------

┌─ PACKAGE [1/2]: my-company/checkout-tests:local ──────────────
│ Type: Local Package
├────────────────────────────────────────────────────────────────
│ [host] npm install
│ [host] npx playwright test
│ [host] rm -rf temp
└────────────────────────────────────────────────────────────────
```

### Verbose Mode

Force full output even in CI:

```bash
CI=true qit run:e2e woocommerce --config=./config.json --verbose
```

## Debugging

### View Detailed Logs

Test artifacts are saved to temporary directories:

```bash
# After test run, check the output for:
# Artifacts saved to: /tmp/qit-e2e-artifacts-*/

ls -la /tmp/qit-e2e-artifacts-*/
```

Contents include:
- `ctrf/` - CTRF reports from all packages
- `blob/` - Screenshots, videos, logs
- `allure/` - Allure results (if configured)
- `logs/` - Command execution logs

### Interactive Debugging

Run tests with UI mode:

```bash
qit run:e2e woocommerce --config=./config.json --ui
```

This opens a browser window where you can:
- Watch tests execute
- Pause and inspect
- Debug failures interactively

### Common Issues

#### No Test Packages Found

```
Error: No test packages with run phase found. All packages are utility packages.
```

**Solution:** Ensure at least one package has a `run` phase and `results` configuration.

#### Missing Results

```
Error: Result collection failed: File ./results/ctrf.json does not exist
```

**Solution:** Ensure your test framework outputs CTRF to the specified path.

#### Package Not Found

```
Error: Package not found: ./packages/tests/checkout
```

**Solution:** Check that the path in your config file is correct.

## Advanced Usage

### Multiple Configurations

Organize different test scenarios:

```bash
# Smoke tests
qit run:e2e woocommerce --config=./configs/smoke-tests.json

# Full regression
qit run:e2e woocommerce --config=./configs/regression.json

# Payment gateway tests
qit run:e2e woocommerce --config=./configs/payment-tests.json
```

### Environment Variables

Pass additional environment variables:

```bash
QIT_DEBUG=1 \
CUSTOM_VAR=value \
qit run:e2e woocommerce --config=./config.json
```

### Running Locally

When you run `qit run:e2e`, QIT automatically handles the environment lifecycle:
1. Creates a disposable Docker environment
2. Installs WordPress, WooCommerce, and your extension
3. Runs your test packages
4. Tears down the environment afterward

This ensures a clean slate for each test run.

### Marketplace (Cloud) Environment

When tests run in the WooCommerce.com marketplace:
- Tests execute in QIT's cloud infrastructure
- Environment is completely isolated
- Results are reported back to the marketplace
- No local resources are used

## Examples

### Basic Test Run

```bash
# Set required secrets
export STRIPE_TEST_KEY='sk_test_...'

# Run tests
qit run:e2e woocommerce --config=./test.json
```

### CI Pipeline

```bash
#!/bin/bash
set -e

# Install dependencies
npm ci

# Set secrets from CI
export STRIPE_TEST_KEY=$CI_STRIPE_KEY
export PAYPAL_CLIENT_ID=$CI_PAYPAL_ID

# Run tests with CI optimizations
CI=true qit run:e2e woocommerce \
  --config=./test-config.json \
  --php=8.2 \
  --wordpress=6.4 \
  --woocommerce=8.0.0

# Check exit code
if [ $? -eq 0 ]; then
  echo "✅ All tests passed"
else
  echo "❌ Tests failed"
  exit 1
fi
```

### Local Development

```bash
# Run specific test package
cat > local-test.json << EOF
{
  "test_packages": [
    "./packages/utilities/quick-setup",
    "./packages/tests/feature-branch"
  ]
}
EOF

# Run with local changes
qit run:e2e woocommerce \
  --config=./local-test.json \
  --verbose \
  --ui  # Open browser for debugging
```

## Exit Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 0 | Success | All tests passed |
| 1 | Failure | Test failures, missing config, validation errors |
| 3 | Infrastructure | Docker issues, network problems |

## Next Steps

- [Understanding Lifecycle](./understanding-lifecycle.md) - Deep dive into execution phases
- [Package Structure](./package-structure.md) - Organizing your test packages
- [CI/CD Integration](./ci-integration.md) - Optimizing for continuous integration
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions