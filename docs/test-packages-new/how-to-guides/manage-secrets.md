# Managing Secrets

Secrets provide secure handling of sensitive data like API keys, passwords, and tokens. QIT validates, injects, and redacts secrets automatically.

## How Secrets Work

1. **Declaration**: Packages declare required secrets in manifest
2. **Validation**: QIT checks all secrets exist before execution
3. **Injection**: Secrets passed as environment variables
4. **Redaction**: Values automatically hidden from output

## Declaring Secrets

In `manifest.json`:

```json
{
  "requires": {
    "secrets": [
      "STRIPE_TEST_KEY",
      "STRIPE_TEST_SECRET",
      "WEBHOOK_SIGNING_SECRET"
    ]
  }
}
```

## Setting Secrets

### Environment Variables

```bash
# Set individually
export STRIPE_TEST_KEY="sk_test_..."
export STRIPE_TEST_SECRET="..."
export WEBHOOK_SIGNING_SECRET="whsec_..."

# Run tests
qit run:e2e woocommerce --config=test.json
```

### From .env File

```bash
# Load from .env
source .env

# Or use dotenv
dotenv run qit run:e2e woocommerce
```

`.env` file:
```
STRIPE_TEST_KEY=sk_test_...
STRIPE_TEST_SECRET=...
WEBHOOK_SIGNING_SECRET=whsec_...
```

### CI/CD Systems

#### GitHub Actions
```yaml
- name: Run Tests
  env:
    STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
    STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
  run: qit run:e2e woocommerce
```

#### GitLab CI
```yaml
test:
  variables:
    STRIPE_TEST_KEY: $STRIPE_TEST_KEY
    STRIPE_TEST_SECRET: $STRIPE_TEST_SECRET
  script:
    - qit run:e2e woocommerce
```

#### Jenkins
```groovy
withCredentials([
  string(credentialsId: 'stripe-key', variable: 'STRIPE_TEST_KEY'),
  string(credentialsId: 'stripe-secret', variable: 'STRIPE_TEST_SECRET')
]) {
  sh 'qit run:e2e woocommerce'
}
```

## Validation

### Early Validation

Secrets are validated before any execution:

```
Missing required secrets:
  - STRIPE_TEST_KEY (required by: payment-tests)
  - WEBHOOK_SECRET (required by: webhook-tests)

Set these environment variables:
  export STRIPE_TEST_KEY='your-key'
  export WEBHOOK_SECRET='your-secret'
```

### Cross-Package Validation

QIT collects secrets from ALL packages:

```json
// Package A
{
  "requires": {
    "secrets": ["API_KEY"]
  }
}

// Package B
{
  "requires": {
    "secrets": ["API_SECRET"]
  }
}
```

Both must be set before execution starts.

## Using Secrets

### In Commands

Secrets are available as environment variables:

```json
{
  "run": [
    "API_KEY=$API_KEY npm test"
  ]
}
```

### In Test Code

JavaScript:
```javascript
const apiKey = process.env.STRIPE_TEST_KEY;
const apiSecret = process.env.STRIPE_TEST_SECRET;

test('process payment', async () => {
  const stripe = new Stripe(apiKey);
  // Use stripe client
});
```

PHP:
```php
$apiKey = getenv('STRIPE_TEST_KEY');
$apiSecret = getenv('STRIPE_TEST_SECRET');

$stripe = new \Stripe\StripeClient($apiKey);
```

Python:
```python
import os

api_key = os.environ['STRIPE_TEST_KEY']
api_secret = os.environ['STRIPE_TEST_SECRET']
```

## Automatic Redaction

Secret values are automatically hidden from output:

### Before Redaction
```
Setting up Stripe with key sk_test_51234567890abcdef...
Connection established to webhook whsec_abcdef123456...
```

### After Redaction
```
Setting up Stripe with key [REDACTED:STRIPE_TEST_KEY]...
Connection established to webhook [REDACTED:WEBHOOK_SECRET]...
```

### Redaction Rules

- Only actual secret values are redacted
- Secrets shorter than 4 characters are not redacted
- Secret names are preserved for debugging
- Redaction happens in real-time

## Secret Patterns

### API Keys

```json
{
  "requires": {
    "secrets": [
      "API_KEY",
      "API_SECRET",
      "API_ENDPOINT"
    ]
  }
}
```

Usage:
```javascript
const client = new APIClient({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  endpoint: process.env.API_ENDPOINT
});
```

### Database Credentials

```json
{
  "requires": {
    "secrets": [
      "TEST_DB_HOST",
      "TEST_DB_USER",
      "TEST_DB_PASS"
    ]
  }
}
```

Usage:
```javascript
const connection = mysql.createConnection({
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS
});
```

### OAuth Tokens

```json
{
  "requires": {
    "secrets": [
      "OAUTH_CLIENT_ID",
      "OAUTH_CLIENT_SECRET",
      "OAUTH_REDIRECT_URI"
    ]
  }
}
```

### Webhook Secrets

```json
{
  "requires": {
    "secrets": [
      "WEBHOOK_SIGNING_SECRET",
      "WEBHOOK_ENDPOINT_SECRET"
    ]
  }
}
```

## Best Practices

### 1. Use Descriptive Names

Good:
```json
"secrets": [
  "STRIPE_TEST_PUBLISHABLE_KEY",
  "STRIPE_TEST_SECRET_KEY",
  "STRIPE_WEBHOOK_SIGNING_SECRET"
]
```

Bad:
```json
"secrets": [
  "KEY1",
  "SECRET",
  "TOKEN"
]
```

### 2. Document Required Secrets

In package README:
```markdown
## Required Secrets

- `STRIPE_TEST_KEY`: Stripe test mode publishable key
- `STRIPE_TEST_SECRET`: Stripe test mode secret key
- `WEBHOOK_SECRET`: Stripe webhook signing secret

Get these from your Stripe dashboard.
```

### 3. Provide Examples

`.env.example`:
```
# Stripe Test Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_TEST_KEY=pk_test_...
STRIPE_TEST_SECRET=sk_test_...
WEBHOOK_SECRET=whsec_...
```

### 4. Group Related Secrets

```json
{
  "requires": {
    "secrets": [
      "PAYMENT_GATEWAY_API_KEY",
      "PAYMENT_GATEWAY_API_SECRET",
      "PAYMENT_GATEWAY_MERCHANT_ID",
      "SHIPPING_API_KEY",
      "SHIPPING_API_SECRET"
    ]
  }
}
```

### 5. Validate Format

In setup phase:
```json
{
  "setup": [
    "node ./scripts/validate-secrets.js"
  ]
}
```

`validate-secrets.js`:
```javascript
if (!process.env.STRIPE_TEST_KEY?.startsWith('pk_test_')) {
  throw new Error('STRIPE_TEST_KEY must be a test mode key');
}
```

## Security Considerations

### Don't Commit Secrets

`.gitignore`:
```
.env
.env.local
.env.*.local
secrets/
*.key
*.pem
```

### Use Test/Sandbox Credentials

Always use test mode credentials:
- Stripe: `sk_test_...` not `sk_live_...`
- PayPal: Sandbox not Production
- AWS: Test account not Production

### Rotate Regularly

- Change test credentials periodically
- Update CI/CD systems when rotated
- Document rotation procedures

### Limit Scope

Use credentials with minimal permissions:
- Read-only where possible
- Restricted to test resources
- Time-limited tokens

## Troubleshooting

### Secret Not Found

Error:
```
Missing required secrets:
  - API_KEY
```

Solution:
```bash
export API_KEY="your-key"
```

### Secret Not Redacted

Check:
- Secret value is longer than 3 characters
- Secret is actually being used
- Not using pattern-based redaction

### Secret in Wrong Format

Validate format in tests:
```javascript
if (!process.env.API_KEY || process.env.API_KEY.length < 10) {
  throw new Error('Invalid API_KEY format');
}
```

### Secret Not Available in Test

Ensure:
- Declared in manifest.json
- Set before running tests
- Correct variable name

## Advanced Patterns

### Dynamic Secrets

Load from external source:
```bash
export API_KEY=$(vault read -field=key secret/api)
qit run:e2e woocommerce
```

### Environment-Specific Secrets

```bash
# Development
export STRIPE_TEST_KEY=$DEV_STRIPE_KEY

# Staging  
export STRIPE_TEST_KEY=$STAGING_STRIPE_KEY
```

### Secret Validation Script

`validate-env.sh`:
```bash
#!/bin/bash

required_secrets=(
  "STRIPE_TEST_KEY"
  "STRIPE_TEST_SECRET"
  "WEBHOOK_SECRET"
)

missing=()
for secret in "${required_secrets[@]}"; do
  if [ -z "${!secret}" ]; then
    missing+=($secret)
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing secrets: ${missing[*]}"
  exit 1
fi
```

### Conditional Secrets

Only require if feature enabled:
```javascript
const secrets = ['BASE_API_KEY'];

if (process.env.ENABLE_STRIPE === 'true') {
  secrets.push('STRIPE_KEY', 'STRIPE_SECRET');
}

// manifest.json would list all possible secrets
```

---

## See also

- **[Manifest Schema](../reference/manifest-schema.md)** — Declaring secrets
- **[CLI Commands](../reference/cli-commands.md)** — Running tests with secrets
- **[CI/GitHub Actions](./ci-github-actions.md)** — Secrets in CI
- **[Environment Variables](../reference/environment-variables.md)** — QIT environment variables

---

**Last updated:** 2025-08-09