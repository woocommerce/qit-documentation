# How to Handle API Keys and Secrets

This guide shows how to securely manage sensitive data like API keys, passwords, and tokens in your Test Packages.

## The Problem

You need to test with real API keys but can't commit them to your repository.

## The Solution

QIT's secret management system that:
- Validates secrets exist before running
- Injects them as environment variables
- Automatically redacts them from logs

## Step-by-Step Guide

### 1. Declare Required Secrets

In your package's `qit-test.json`:

```json
{
  "package": "my-plugin/payment-tests",
  "requires": {
    "secrets": [
      "STRIPE_TEST_KEY",
      "STRIPE_TEST_SECRET",
      "WEBHOOK_SIGNING_SECRET"
    ]
  }
}
```

### 2. Use Secrets in Tests

Access secrets via environment variables:

```javascript
test('process payment with Stripe', async ({ page }) => {
  // Secrets are available as env vars
  const stripeKey = process.env.STRIPE_TEST_KEY;
  const stripeSecret = process.env.STRIPE_TEST_SECRET;
  
  // Use in your test
  await page.evaluate((key) => {
    window.Stripe = Stripe(key);
  }, stripeKey);
  
  // Make API calls
  const response = await fetch('https://api.stripe.com/v1/charges', {
    headers: {
      'Authorization': `Bearer ${stripeSecret}`
    }
  });
});
```

### 3. Provide Secrets When Running

#### Method 1: Environment Variables

```bash
export STRIPE_TEST_KEY="pk_test_..."
export STRIPE_TEST_SECRET="sk_test_..."
export WEBHOOK_SIGNING_SECRET="whsec_..."

qit run:e2e your-extension-slug --test-package=./payment-tests
```

#### Method 2: .env File

Create `.env` file:
```env
STRIPE_TEST_KEY=pk_test_...
STRIPE_TEST_SECRET=sk_test_...
WEBHOOK_SIGNING_SECRET=whsec_...
```

Load and run:
```bash
source .env && qit run:e2e your-extension-slug --test-package=./payment-tests
```

#### Method 3: Inline

```bash
STRIPE_TEST_KEY="pk_test_..." \
STRIPE_TEST_SECRET="sk_test_..." \
qit run:e2e your-extension-slug --test-package=./payment-tests
```

## Secret Validation

QIT validates before running:

```bash
$ qit run:e2e your-extension-slug --test-package=./payment-tests

Error: Missing required secrets for package 'my-plugin/payment-tests':
  - STRIPE_TEST_KEY (not set)
  - STRIPE_TEST_SECRET (not set)
  
Please set these environment variables and try again.
```

## Automatic Redaction

Secrets are hidden in logs:

```bash
Running test: process payment
  API Key: pk_test_[REDACTED]
  Making request to Stripe...
  Response: { id: "ch_[REDACTED]", amount: 1000 }
✓ Test passed
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Test with Secrets
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests with secrets
        env:
          STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
        run: |
          qit run:e2e your-extension-slug --test-package=./payment-tests
```

### GitLab CI

```yaml
test:
  script:
    - qit run:e2e your-extension-slug --test-package=./payment-tests
  variables:
    STRIPE_TEST_KEY: $STRIPE_TEST_KEY
    STRIPE_TEST_SECRET: $STRIPE_TEST_SECRET
```

## Best Practices

### 1. Use Test Keys Only

Never use production keys:
```javascript
// ✅ Good: Test key
const key = process.env.STRIPE_TEST_KEY; // pk_test_...

// ❌ Bad: Production key
const key = process.env.STRIPE_LIVE_KEY; // pk_live_...
```

### 2. Document Required Secrets

In your package README:

```markdown
## Required Secrets

This package requires:
- `STRIPE_TEST_KEY`: Stripe publishable test key
- `STRIPE_TEST_SECRET`: Stripe secret test key
- `WEBHOOK_SIGNING_SECRET`: Stripe webhook signing secret

Get these from: https://dashboard.stripe.com/test/apikeys
```

### 3. Provide Defaults for Non-Sensitive Config

```javascript
// Secrets for sensitive data
const apiKey = process.env.STRIPE_TEST_KEY; // Required

// Regular config with defaults
const apiUrl = process.env.STRIPE_API_URL || 'https://api.stripe.com';
const timeout = process.env.API_TIMEOUT || '30000';
```

### 4. Validate Secret Format

```javascript
test.beforeAll(() => {
  const key = process.env.STRIPE_TEST_KEY;
  
  if (!key?.startsWith('pk_test_')) {
    throw new Error('STRIPE_TEST_KEY must be a test publishable key');
  }
});
```

## Common Patterns

### Multiple Environment Secrets

For different environments:

```json
{
  "requires": {
    "secrets": [
      "STAGING_API_KEY",
      "STAGING_API_SECRET",
      "PRODUCTION_API_KEY",
      "PRODUCTION_API_SECRET"
    ]
  }
}
```

### Optional Secrets

Handle optional features:

```javascript
test('premium feature', async ({ page }) => {
  const premiumKey = process.env.PREMIUM_API_KEY;
  
  if (!premiumKey) {
    test.skip();
    return;
  }
  
  // Test premium features
});
```

### Secret Rotation

Support multiple keys:

```javascript
const keys = [
  process.env.API_KEY_PRIMARY,
  process.env.API_KEY_SECONDARY
].filter(Boolean);

const key = keys[0]; // Use primary, fallback to secondary
```

## Troubleshooting

### Secret Not Available in Test

Check the secret name matches exactly:
```bash
# Declared in manifest
"secrets": ["STRIPE_KEY"]

# Must set exactly
export STRIPE_KEY="..."  # ✅
export stripe_key="..."  # ❌ Wrong case
```

### Secrets Visible in Logs

Ensure you're not manually logging:
```javascript
// ❌ Bad: Manual logging
console.log(`Key: ${process.env.STRIPE_KEY}`);

// ✅ Good: Let QIT redact
// Secrets are automatically hidden
```

### CI Secrets Not Working

Verify CI environment:
```yaml
- name: Debug (remove after testing)
  run: |
    echo "Secrets configured:"
    [ -n "$STRIPE_TEST_KEY" ] && echo "✓ STRIPE_TEST_KEY" || echo "✗ STRIPE_TEST_KEY"
```