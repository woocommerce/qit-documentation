# Your First Test Package in 10 Minutes

This tutorial walks you through creating, running, and understanding your first Test Package. By the end, you'll have a working test that can be combined with other packages.

## Prerequisites

- QIT CLI installed and authenticated
- Node.js and npm
- Basic familiarity with JavaScript

## Step 1: Scaffold Your Package (1 minute)

Create a new Test Package using the scaffold command:

```bash
# Replace 'your-extension-slug' with the slug of the extension you maintain
qit package:scaffold checkout-tests --package=your-extension-slug/checkout-tests
cd checkout-tests
```

This creates:
```
checkout-tests/
├── qit-test.json   # Test package manifest
├── package.json       # Node dependencies
├── playwright.config.js
└── tests/
    └── example.spec.js
```

## Step 2: Examine the Manifest (2 minutes)

Open `qit-test.json` to understand your package structure:

```json
{
  "package": "your-extension-slug/checkout-tests",
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

Key points:
- **package**: Your unique identifier (namespace/name format)
- **phases**: Commands that run during testing (npm install happens automatically)
- **results**: Where test output goes

## Step 3: Write Your Test (3 minutes)

Replace `tests/example.spec.js` with a real test:

```javascript
import { test, expect } from '@playwright/test';

test('checkout flow works', async ({ page, baseURL }) => {
  // Navigate to shop
  await page.goto(`${baseURL}/shop`);
  
  // Add first product to cart
  await page.locator('.add_to_cart_button').first().click();
  await page.waitForSelector('.added_to_cart');
  
  // Go to checkout
  await page.goto(`${baseURL}/checkout`);
  
  // Fill billing details
  await page.fill('#billing_first_name', 'Test');
  await page.fill('#billing_last_name', 'User');
  await page.fill('#billing_email', 'test@example.com');
  
  // Place order
  await page.click('#place_order');
  
  // Verify success
  await expect(page).toHaveURL(/order-received/);
  await expect(page.locator('.woocommerce-thankyou-order-received')).toBeVisible();
});
```

## Step 4: Test Locally (2 minutes)

Run your test package against your extension:

```bash
# Run your test package locally
qit run:e2e your-extension-slug --test-package=.
```

:::tip
For manual debugging while developing your tests, you can start an environment first:
```bash
# Start the environment
qit env:up

# Note the environment ID from the output (e.g., qitenv123abc...)
# Then source the environment variables in your terminal:
source "$(qit env:source qitenv123abc...)"

# Now you can:
# 1. Browse the site manually at the URL shown
# 2. Run your Playwright tests directly:
npx playwright test
```
:::

The command will:
1. Download and prepare your test package
2. Start a Docker environment with WordPress and WooCommerce
3. Install your extension
4. Run the test phases (setup → run → teardown)
5. Collect and display results

If your test passes, you'll see a summary showing the test results and options to view detailed reports.

## Step 5: Combine with Other Packages (2 minutes)

The real power comes from combining packages:

```bash
# Run your test WITH another extension's tests
qit run:e2e your-extension-slug \
  --test-package=. \
  --test-package=other-extension/compatibility-tests

# Or test multiple extensions together  
qit run:e2e your-extension-slug \
  --plugin=woocommerce-stripe \
  --test-package=. \
  --test-package=woocommerce-stripe/payment-tests
```

Each package runs in isolation (clean database state) but in the same environment.

## What You've Learned

✅ Test Packages are just Playwright tests with a manifest  
✅ The manifest defines how your package runs  
✅ Packages can be combined without conflicts  
✅ Each package gets a clean state via database snapshots

## Quick Reference

| Command | Purpose |
|---------|---------|
| `qit package:scaffold` | Create new package |
| `qit run:e2e --test-package=.` | Run local package |
| `qit package:publish` | Share your package |
| `qit package:search` | Find other packages |

---

**Time spent:** ~10 minutes  
**You now have:** A working Test Package that can be shared and combined with others