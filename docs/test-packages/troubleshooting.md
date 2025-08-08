# Troubleshooting

Common issues and solutions when working with Test Packages.

## Package Not Found

### Symptom
```
Error: Package not found: ./packages/checkout-tests
```

### Causes and Solutions

#### Wrong Path
Check the path in your configuration:
```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./packages/checkout-tests"  // Relative to config file
        ]
      }
    }
  }
}
```

Verify the directory exists:
```bash
ls -la packages/checkout-tests/
```

#### Missing manifest.json
Every package must have a manifest:
```bash
ls packages/checkout-tests/manifest.json
```

#### Case Sensitivity
Linux is case-sensitive:
```bash
# Wrong
"./packages/Checkout-Tests"

# Correct
"./packages/checkout-tests"
```

## Validation Errors

### Missing Required Fields

#### Symptom
```
Validation error: Package 'checkout-tests' missing required field 'namespace'
```

#### Solution
Add missing fields to manifest.json:
```json
{
  "package": "checkout-tests",
  "namespace": "mycompany",  // Add this
  "test_type": "e2e"
}
```

### Invalid Schema

#### Symptom
```
Validation error: test.results required for test packages
```

#### Solution
Test packages (with `run` phase) must have results:
```json
{
  "test": {
    "phases": {
      "run": ["npm test"]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

## Secret Validation Failures

### Missing Secrets

#### Symptom
```
Missing required secrets:
  - STRIPE_TEST_KEY (required by: payment-tests)
  - WEBHOOK_SECRET (required by: webhook-tests)
```

#### Solution
Set environment variables:
```bash
export STRIPE_TEST_KEY="sk_test_..."
export WEBHOOK_SECRET="whsec_..."
```

Or use .env file:
```bash
# .env
STRIPE_TEST_KEY=sk_test_...
WEBHOOK_SECRET=whsec_...

# Load before running
source .env
qit run:e2e woocommerce
```

### Secret Not Available in Test

#### Symptom
```javascript
TypeError: Cannot read property 'STRIPE_KEY' of undefined
```

#### Solution
1. Declare in manifest:
```json
{
  "requires": {
    "secrets": ["STRIPE_KEY"]
  }
}
```

2. Access correctly:
```javascript
const key = process.env.STRIPE_KEY;  // Correct
const key = STRIPE_KEY;  // Wrong
```

## Results Not Found

### CTRF File Missing

#### Symptom
```
Error: Results not found: ./test-results/ctrf.json
```

#### Causes and Solutions

#### Wrong Output Path
Ensure test framework outputs to correct path:
```javascript
// playwright.config.js
reporter: [
  ['ctrf-json', {
    outputFile: './test-results/ctrf.json'  // Must match manifest
  }]
]
```

#### Directory Not Created
Create directory in setup:
```json
{
  "setup": [
    "mkdir -p test-results"
  ]
}
```

#### Test Framework Not Configured
Install and configure CTRF reporter:
```bash
npm install --save-dev ctrf-playwright-reporter
```

### Blob Directory Empty

#### Symptom
```
Warning: Blob directory exists but is empty
```

#### Solution
Configure artifact generation:
```javascript
// playwright.config.js
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
},
outputDir: './test-results/artifacts'
```

## Command Failures

### Command Not Found

#### Symptom
```
/bin/sh: npm: command not found
```

#### Solutions

#### Install Dependencies
For host commands:
```json
{
  "setup": [
    "which npm || curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash",
    "npm ci"
  ]
}
```

#### Use Correct Context
Some commands need container context:
```json
{
  "globalSetup": [
    "wp plugin install helper"  // Runs in container
  ],
  "setup": [
    "[host] npm install"  // Explicitly run on host
  ]
}
```

### Permission Denied

#### Symptom
```
Permission denied: ./scripts/setup.sh
```

#### Solution
Make scripts executable:
```json
{
  "setup": [
    "chmod +x ./scripts/setup.sh",
    "./scripts/setup.sh"
  ]
}
```

Or in version control:
```bash
git update-index --chmod=+x scripts/setup.sh
```

## Database Issues

### Database Not Restored

#### Symptom
Tests see data from previous package.

#### Causes and Solutions

#### First Package Issue
First package doesn't get restore (by design):
```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./utilities/setup",  // No restore
          "./tests/checkout",   // Gets restore
    "./tests/payment"     // Gets restore
  ]
}
```

#### Restore Failed
Check logs for restore errors:
```
Failed to restore database snapshot
```

Common causes:
- Disk space full
- Database connection issues
- Corrupted snapshot

### Changes Not Persisting

#### Symptom
GlobalSetup changes not visible in tests.

#### Solution
Ensure globalSetup runs before snapshot:
```
1. GlobalSetup runs (changes persist)
2. Database snapshot taken
3. Each package starts from snapshot
```

## Output Issues

### No Output in CI

#### Symptom
CI shows minimal output.

#### Solution
Use verbose mode:
```bash
CI=true qit run:e2e woocommerce --verbose
```

Or check CI detection:
```bash
echo $CI  # Should show truthy value
```

### Output Not Redacted

#### Symptom
Secrets visible in output.

#### Causes and Solutions

#### Secret Too Short
Secrets < 4 characters aren't redacted:
```json
{
  "secrets": ["KEY"]  // Won't be redacted (too short)
}
```

#### Not Declared as Secret
Only declared secrets are redacted:
```json
{
  "requires": {
    "secrets": ["API_KEY"]  // Will be redacted
  }
}
```

## Test Execution Issues

### Tests Not Running

#### Symptom
Package skipped or not executing tests.

#### Solutions

#### Check for Run Phase
Test packages need run phase:
```json
{
  "test": {
    "phases": {
      "run": ["npm test"]  // Required for test packages
    }
  }
}
```

#### Verify Package Type
Utility packages don't run tests:
```json
// Utility package (no run phase)
{
  "test": {
    "phases": {
      "globalSetup": ["..."]
    }
  }
}
```

### Tests Timing Out

#### Symptom
```
Error: Test timeout of 30000ms exceeded
```

#### Solutions

#### Increase Timeout
```javascript
// playwright.config.js
module.exports = {
  timeout: 60000,  // 60 seconds
  expect: {
    timeout: 10000  // 10 seconds for assertions
  }
};
```

#### Check Network
Verify site is accessible:
```json
{
  "setup": [
    "curl -f $QIT_SITE_URL || exit 1",
    "npm test"
  ]
}
```

## Environment Issues

### Wrong PHP Version

#### Symptom
```
Error: PHP 8.2 required, got 7.4
```

#### Solution
Specify version:
```bash
qit run:e2e woocommerce --php=8.2
```

Or in config:
```json
{
  "environments": {
    "default": {
      "php": "8.2"
    }
  }
}
```

### Extension Not Active

#### Symptom
Extension not available in tests.

#### Solution
Check activation:
```bash
qit run:e2e my-extension --skip-activate=false
```

Or activate manually:
```json
{
  "globalSetup": [
    "wp plugin activate my-extension"
  ]
}
```

## CI/CD Issues

### GitHub Secrets Not Available

#### Symptom
Secrets undefined in GitHub Actions.

#### Solution
Use correct syntax:
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

And ensure secret exists in repository settings.

### Docker Not Available

#### Symptom
```
Cannot connect to Docker daemon
```

#### Solution
Ensure Docker installed and running:
```yaml
runs-on: ubuntu-latest  # Has Docker
```

Or install Docker:
```yaml
- name: Setup Docker
  run: |
    curl -fsSL https://get.docker.com | sh
```

## Performance Issues

### Slow Test Execution

#### Solutions

#### Cache Dependencies
```json
{
  "setup": [
    "[ -d node_modules ] || npm ci"  // Skip if cached
  ]
}
```

#### Parallel Execution
Split into multiple packages:
```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./tests/checkout",  // Run separately
          "./tests/payment"    // In CI matrix
  ]
}
```

#### Optimize Snapshots
Minimize globalSetup to reduce snapshot size.

### High Memory Usage

#### Solution
Limit concurrent tests:
```javascript
// playwright.config.js
module.exports = {
  workers: 2  // Limit parallel workers
};
```

## Debugging Techniques

### Enable Debug Output

```bash
DEBUG=* qit run:e2e woocommerce
```

### Run Single Package

```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./packages/checkout-tests"  // Only this one
        ]
      }
    }
  }
}
```

### Check Logs

```bash
# Execution log
cat qit-results/logs/execution.log

# Package output
cat qit-results/packages/checkout-tests/output.log
```

### Interactive Debugging

```javascript
// Add debugger statement
test('my test', async ({ page }) => {
  debugger;  // Pause here
  await page.goto('/');
});
```

Run with:
```bash
node --inspect-brk node_modules/.bin/playwright test
```

### Local Reproduction

Match CI environment:
```bash
# Same as CI
export CI=true
export STRIPE_KEY=$STRIPE_KEY
qit run:e2e woocommerce \
  --php=8.2 \
  --wordpress=6.4 \
  --config=test-config.json
```

## Migration Issues

### Unrecognized Options

#### Symptom
```
Error: Unrecognized option: --pw_test_tag
Error: Unrecognized option: --ui
Error: Unrecognized option: --codegen
```

#### Solution
These Playwright-specific options have been removed. Use the `--` pass-through instead:

```bash
# Old (no longer works)
qit run:e2e woocommerce --pw_test_tag="@smoke"
qit run:e2e woocommerce --ui

# New (correct way)
qit run:e2e woocommerce -- --grep="@smoke"
qit run:e2e woocommerce -- --ui
```

### Codegen Not Working

#### Symptom
```
Error: --codegen option has been removed
```

#### Solution
Use `env:up` to start an environment, then run Playwright codegen:

```bash
# Start environment
qit env:up woocommerce

# Load environment variables
source "$(qit env:source qitenv...)"

# Run codegen
npx playwright codegen $QIT_SITE_URL
```

### Options Not Being Passed

#### Symptom
Test framework options are not being applied.

#### Solution
Ensure you're using `--` to separate QIT options from test framework options:

```bash
# Wrong - options treated as QIT arguments
qit run:e2e woocommerce --fail-fast --headed

# Correct - options passed to test framework
qit run:e2e woocommerce -- --fail-fast --headed
```

### Sharding Not Working

#### Symptom
```
Warning: --shard is not supported with Test Packages.
```

#### Solution
Sharding is not supported with Test Packages. The `--shard` argument is filtered out and tests run normally without sharding.

If you need to run tests in parallel, you'll need to set up multiple CI jobs with different test configurations.

## Common Patterns After Migration

### Running Tests with Options

```bash
# Run specific tests
qit run:e2e woocommerce -- --grep="checkout"

# Run in headed mode with debugging
qit run:e2e woocommerce -- --headed --debug

# Update snapshots
qit run:e2e woocommerce -- --update-snapshots

# Run with multiple workers
qit run:e2e woocommerce -- --workers=4
```

### Combining QIT and Test Framework Options

```bash
# QIT options before --, test framework options after
qit run:e2e woocommerce \
  --config=test.json \
  --php=8.2 \
  --verbose \
  -- \
  --grep="@critical" \
  --fail-fast \
  --workers=2
```