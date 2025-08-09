# Environment Variables Reference

Complete reference of environment variables available in Test Packages.

## QIT-Provided Variables

These variables are automatically set by QIT and available in all package commands:

| Variable | Description | Example |
|----------|-------------|---------|
| `QIT_SITE_URL` | WordPress site URL | `http://localhost:32781` |
| `QIT_WP_ADMIN` | WordPress admin URL | `http://localhost:32781/wp-admin` |
| `QIT_DB_NAME` | Database name | `wordpress` |
| `QIT_DB_USER` | Database username | `root` |
| `QIT_DB_PASS` | Database password | `root` |
| `QIT_DB_HOST` | Database host and port | `db:3306` |
| `QIT_PACKAGE_DIR` | Current package directory | `/workspace/packages/checkout` |
| `QIT_RESULTS_DIR` | Results output directory | `/workspace/qit-results` |

### Using QIT Variables

In package commands:
```json
{
  "run": [
    "BASE_URL=$QIT_SITE_URL npx playwright test"
  ]
}
```

In test code:
```javascript
// playwright.config.js
module.exports = {
  use: {
    baseURL: process.env.QIT_SITE_URL || 'http://localhost:8080'
  }
};
```

In shell scripts:
```bash
#!/bin/bash
echo "Testing site at: $QIT_SITE_URL"
wp --path=/var/www/html --url=$QIT_SITE_URL user list
```

## User-Defined Secrets

Secrets declared in manifest are available as environment variables:

```json
{
  "requires": {
    "secrets": [
      "STRIPE_TEST_KEY",
      "STRIPE_TEST_SECRET"
    ]
  }
}
```

Usage:
```javascript
const stripe = new Stripe(process.env.STRIPE_TEST_KEY);
```

## System Environment Variables

All system environment variables are passed through to commands:

| Variable | Description | Common Use |
|----------|-------------|------------|
| `PATH` | System path | Finding executables |
| `HOME` | User home directory | User configs |
| `USER` | Current username | Permissions |
| `CI` | CI mode indicator | Output control |
| `DEBUG` | Debug mode | Verbose logging |

## CI/CD Variables

### GitHub Actions
```yaml
env:
  CI: true
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  GITHUB_RUN_ID: ${{ github.run_id }}
```

### GitLab CI
```yaml
variables:
  CI: "true"
  CI_PROJECT_NAME: "$CI_PROJECT_NAME"
  CI_PIPELINE_ID: "$CI_PIPELINE_ID"
```

### Jenkins
```groovy
environment {
  CI = 'true'
  BUILD_NUMBER = "${env.BUILD_NUMBER}"
  JOB_NAME = "${env.JOB_NAME}"
}
```

## Special Environment Variables

### CI Mode

When `CI` environment variable is set (to any truthy value):
- Output is suppressed unless `--verbose`
- Only errors and essential info shown
- Progress indicators simplified

```bash
# Enable CI mode
export CI=true
export CI=1
export CI=yes
```

### Debug Mode

Enable debug output:
```bash
# QIT debug
export QIT_DEBUG=true

# Node.js debug
export DEBUG=*

# Playwright debug
export DEBUG=pw:api
```

## Setting Environment Variables

### Command Line

```bash
# Inline
STRIPE_KEY=sk_test_123 qit run:e2e woocommerce

# Export
export STRIPE_KEY=sk_test_123
qit run:e2e woocommerce
```

### .env File

```bash
# .env
STRIPE_KEY=sk_test_123
WEBHOOK_SECRET=whsec_456
API_ENDPOINT=https://api.example.com

# Load
source .env
qit run:e2e woocommerce
```

### Package Commands

Set variables within commands:
```json
{
  "run": [
    "NODE_ENV=test npm test",
    "HEADLESS=false npx playwright test"
  ]
}
```

## Variable Precedence

Order of precedence (highest to lowest):
1. Command-line inline variables
2. Exported shell variables
3. .env file variables
4. QIT-provided variables
5. System defaults

Example:
```bash
# QIT provides: QIT_SITE_URL=http://localhost:8080
# .env has: QIT_SITE_URL=http://test.local
# Export: export QIT_SITE_URL=http://override.local
# Inline: QIT_SITE_URL=http://inline.local qit run:e2e

# Result: http://inline.local wins
```

## Variables in Different Contexts

### Host Commands

Commands running on host have access to:
- All system environment variables
- User-defined secrets
- QIT variables
- Local shell environment

```json
{
  "setup": [
    { "command": "echo $HOME", "runs_on": "host" }
  ]
}
```

### Container Commands

Commands in WordPress container have:
- QIT variables
- User-defined secrets
- Limited system variables
- Container-specific paths

```json
{
  "globalSetup": [
    { "command": "wp option get home", "runs_on": "docker" }
  ]
}
```

## Common Patterns

### Base URL Configuration

```javascript
// playwright.config.js
module.exports = {
  use: {
    baseURL: process.env.QIT_SITE_URL || process.env.BASE_URL || 'http://localhost:8080'
  }
};
```

### Database Connection

```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.QIT_DB_HOST?.split(':')[0] || 'localhost',
  port: process.env.QIT_DB_HOST?.split(':')[1] || 3306,
  user: process.env.QIT_DB_USER || 'root',
  password: process.env.QIT_DB_PASS || 'root',
  database: process.env.QIT_DB_NAME || 'wordpress'
});
```

### API Configuration

```javascript
const config = {
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  endpoint: process.env.API_ENDPOINT || 'https://api.example.com',
  timeout: parseInt(process.env.API_TIMEOUT || '30000'),
  retries: parseInt(process.env.API_RETRIES || '3')
};
```

### Feature Flags

```javascript
const features = {
  useNewCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
  enableDebug: process.env.DEBUG === 'true',
  skipPayment: process.env.SKIP_PAYMENT === 'true'
};
```

## Troubleshooting

### Variable Not Available

Check variable is:
1. Exported in shell
2. Declared in manifest (for secrets)
3. Spelled correctly
4. Available in the execution context

```bash
# Debug: Print all variables
env | grep QIT
```

### Variable Not Substituted

Ensure proper syntax:
```json
{
  "run": [
    "$QIT_SITE_URL",        // Wrong - literal string
    "echo $QIT_SITE_URL",   // Correct - shell substitution
    "${QIT_SITE_URL:-default}" // Correct - with default
  ]
}
```

### Wrong Variable Value

Check precedence and source:
```bash
# See where variable is set
echo "Value: $MY_VAR"
env | grep MY_VAR
set | grep MY_VAR
```

## Security Notes

### Secret Redaction

Variables declared as secrets are automatically redacted:
```json
{
  "requires": {
    "secrets": ["API_KEY"]  // Will be redacted in output
  }
}
```

### Don't Log Secrets

Avoid logging sensitive values:
```javascript
// Bad
console.log(`API Key: ${process.env.API_KEY}`);

// Good
console.log(`API Key: ${process.env.API_KEY ? '[SET]' : '[NOT SET]'}`);
```

### Use Test Credentials

Always use test/sandbox credentials:
```bash
# Good
export STRIPE_KEY=sk_test_...

# Bad
export STRIPE_KEY=sk_live_...
```

---

## See also

- **[Managing Secrets](../how-to-guides/manage-secrets.md)** — Secret handling
- **[CLI Commands](./cli-commands.md)** — Command reference
- **[Manifest Schema](./manifest-schema.md)** — Declaring secrets
- **[Troubleshooting](../operations/troubleshooting.md)** — Common issues

---

**Last updated:** 2025-08-09