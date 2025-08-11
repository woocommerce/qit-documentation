# Publishing Focused Test Packages from Your E2E Suite

Sometimes you want to share specific test scenarios from your larger E2E suite as standalone packages. For example, publishing just your checkout tests so other extensions can verify they don't break your checkout flow.

## The Problem

You have a comprehensive E2E suite with dozens of tests, but you want to:
- Share only specific, relevant tests with the community
- Let others test compatibility with your critical flows
- Keep your internal tests private while sharing key scenarios

## The Solution: Playwright Projects

Use Playwright's project configuration to create focused test packages from your main suite.

## Example: Extracting Checkout Tests

### Your Main E2E Structure

```
your-plugin/
├── tests/
│   └── e2e/
│       ├── qit-test.json           # Your main package
│       ├── playwright.config.js     # Multiple projects defined
│       ├── package.json
│       └── tests/
│           ├── checkout/
│           │   ├── guest-checkout.spec.js
│           │   ├── customer-checkout.spec.js
│           │   └── payment-methods.spec.js
│           ├── cart/
│           │   └── cart-operations.spec.js
│           ├── admin/
│           │   └── settings.spec.js
│           └── api/
│               └── webhooks.spec.js
```

### Step 1: Configure Playwright Projects

In your `playwright.config.js`, define projects for different test groups:

```javascript
export default {
  testDir: './tests',
  
  projects: [
    {
      name: 'checkout',
      testMatch: /checkout\/.*.spec.js/,
    },
    {
      name: 'cart',
      testMatch: /cart\/.*.spec.js/,
    },
    {
      name: 'admin',
      testMatch: /admin\/.*.spec.js/,
    },
    {
      name: 'all',
      testMatch: /.*.spec.js/,
    }
  ],
  
  // ... rest of config
};
```

### Step 2: Create a Focused Package

Create a new directory for your shareable checkout package:

```bash
mkdir -p tests/packages/checkout
```

### Step 3: Create the Focused Manifest

Create `tests/packages/checkout/qit-test.json`:

```json
{
  "package": "your-extension-slug/checkout",
  "description": "Checkout flow tests for compatibility testing",
  "test": {
    "phases": {
      "run": [
        "cd ../../e2e && npx playwright test --project=checkout"
      ]
    },
    "results": {
      "ctrf-json": "../../e2e/results/ctrf.json",
      "blob-dir": "../../e2e/results/blob"
    }
  }
}
```

### Step 4: Add Package Dependencies

Create a minimal `tests/packages/checkout/package.json`:

```json
{
  "name": "your-extension-checkout-tests",
  "version": "1.0.0",
  "description": "Checkout compatibility tests",
  "scripts": {
    "test": "cd ../../e2e && npx playwright test --project=checkout"
  }
}
```

### Step 5: Test Your Focused Package

```bash
# Test the focused package
qit run:e2e your-extension-slug --test-package=./tests/packages/checkout

# Verify it only runs checkout tests
```

### Step 6: Publish the Focused Package

```bash
qit package:publish ./tests/packages/checkout --version=latest
```

## Alternative: Symlink Approach

If you want to avoid path navigation, use symlinks:

```bash
cd tests/packages/checkout
ln -s ../../e2e/playwright.config.js .
ln -s ../../e2e/tests/checkout tests
ln -s ../../e2e/node_modules .
```

Then your manifest can be simpler:

```json
{
  "package": "your-extension-slug/checkout",
  "test": {
    "phases": {
      "run": ["npx playwright test"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

## Best Practices

### What to Share

**Good candidates for focused packages:**
- Critical user flows (checkout, cart, account)
- Integration points (payment gateways, shipping)
- API endpoints other plugins might call
- Data structures others depend on

**Keep private:**
- Internal admin workflows
- Business logic tests
- Performance benchmarks
- Security test scenarios

### Versioning Strategy

Your focused packages can be published independently:

```bash
# Main E2E suite (could be private or public)
tests/e2e/  # Published as your-extension-slug/e2e:latest

# Focused packages (public)
tests/packages/checkout/  # Published as your-extension-slug/checkout:latest
tests/packages/api/       # Published as your-extension-slug/api:latest
```

### Documentation

Include a README in each published package:

```markdown
# Checkout Compatibility Tests

These tests verify that your extension doesn't break our checkout flow.

## What's Tested
- Guest checkout with default settings
- Customer checkout with saved payment methods
- Payment method switching

## Requirements
- WooCommerce 8.0+
- Checkout block enabled

## Usage
qit run:e2e your-plugin --test-package=our-plugin/checkout:latest
```

## Real-World Example

```bash
# WooCommerce Stripe might publish:
woocommerce-stripe/e2e           # Full suite (private)
woocommerce-stripe/checkout      # Just checkout with Stripe (public)
woocommerce-stripe/webhooks      # Webhook handling tests (public)
woocommerce-stripe/3ds           # 3D Secure flows (public)

# Other plugins can then test compatibility:
qit run:e2e my-checkout-plugin \
  --test-package=woocommerce-stripe/checkout:latest \
  --test-package=woocommerce-stripe/3ds:latest
```

## Troubleshooting

### "Tests not found"

Make sure your Playwright project name matches exactly:
```bash
npx playwright test --list --project=checkout
```

### Path Resolution Issues

Use absolute paths in CI environments:
```json
"run": ["cd $QIT_PACKAGE_DIR/../../e2e && npx playwright test --project=checkout"]
```

### Results Not Collected

Ensure result paths point to where Playwright actually writes them:
```json
"results": {
  "ctrf-json": "../../e2e/results/ctrf.json"
}
```

---

**Summary:** You can extract and publish focused test packages from your main E2E suite using Playwright projects. This lets you share critical test scenarios while keeping your full suite private.