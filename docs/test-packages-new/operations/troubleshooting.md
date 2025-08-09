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
  "test_packages": [
    "./packages/checkout-tests"  // Relative to config file
  ]
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
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
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
Error: Results not found: ./results/ctrf.json
```

#### Causes and Solutions

#### Wrong Output Path
Ensure test framework outputs to correct path:
```javascript
// playwright.config.js
reporter: [
  ['playwright-ctrf-json-reporter', {
    outputFile: './results/ctrf.json'  // Must match manifest
  }]
]
```

#### Directory Not Created
Create directory in setup:
```json
{
  "setup": [
    "mkdir -p results"
  ]
}
```

#### Test Framework Not Configured
Install and configure CTRF reporter:
```bash
npm install --save-dev playwright-ctrf-json-reporter
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
outputDir: './results/blob'
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
    "which npm || (echo 'npm not found' && exit 1)",
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
    { "command": "npm install", "runs_on": "host" }  // Explicitly run on host
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
      "run": ["npx playwright test"]  // Required for test packages
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
    "npx playwright test"
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
  "environment": {
    "php": "8.2"
  }
}
```

### Extension Not Active

#### Symptom
Extension not available in tests.

#### Solution
Check that SUT is properly activated. The extension should be automatically activated unless you use `--skip_activating_plugins`.

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
Use multiple workers:
```bash
qit run:e2e woocommerce -- --workers=4
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
DEBUG=* qit run:e2e woocommerce --verbose
```

### Run Single Package

```json
{
  "test_packages": [
    "./packages/checkout-tests"  // Only this one
  ]
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

## Pass-through Arguments

### Symptom
Test framework options are not being applied.

### Solution
Use `--` to separate QIT options from test framework options:

```bash
# Wrong - options treated as QIT arguments
qit run:e2e woocommerce --headed --workers=2

# Correct - options passed to test framework
qit run:e2e woocommerce -- --headed --workers=2
```

### Common Pass-through Examples

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
  --project=chromium \
  --workers=2
```

### Sharding Note

The `--shard` option is not supported with Test Packages orchestration. Tests will run normally without sharding even if this option is passed.

## Common Error Messages

### "No test packages found"
- Check `test_packages` paths in qit.json
- Ensure at least one package has a `run` phase
- Verify manifest.json exists in each package

### "Environment setup failed"
- Check Docker is running
- Verify network connectivity
- Ensure sufficient disk space

### "Failed to collect results"
- Verify CTRF reporter is configured
- Check output paths match manifest
- Ensure tests actually generate results

---

## See also

- **[CLI Commands](../reference/cli-commands.md)** — Command reference
- **[Manifest Schema](../reference/manifest-schema.md)** — Package configuration
- **[Managing Secrets](../how-to-guides/manage-secrets.md)** — Secret handling
- **[Pass Playwright Options](../how-to-guides/pass-playwright-options.md)** — Using -- separator

---

**Last updated:** 2025-08-09