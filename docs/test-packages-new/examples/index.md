# Examples

Complete, working examples of Test Packages for various scenarios.

## Basic E2E Test Package

### Playwright Checkout Tests

A complete example of a test package for WooCommerce checkout flow.

#### manifest.json
```json
{
  "package": "checkout-tests",
  "namespace": "woocommerce",
  "test_type": "e2e",
  "description": "WooCommerce checkout flow tests",
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install chromium"
      ],
      "run": [
        "npx playwright test"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

#### package.json
```json
{
  "name": "checkout-tests",
  "version": "1.0.0",
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "playwright-ctrf-json-reporter": "^1.0.0"
  }
}
```

#### playwright.config.js
```javascript
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: process.env.QIT_SITE_URL || 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  reporter: [
    ['playwright-ctrf-json-reporter', {
      outputFile: './results/ctrf.json'
    }],
    ['html', {
      outputFolder: './results/blob/html'
    }]
  ],
  outputDir: './results/blob'
};
```

#### tests/checkout.spec.js
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Checkout Flow', () => {
  test('guest checkout with simple product', async ({ page }) => {
    // Add product to cart
    await page.goto('/shop');
    await page.locator('.add_to_cart_button').first().click();
    await page.waitForSelector('.added_to_cart');
    
    // Go to checkout
    await page.goto('/checkout');
    
    // Fill billing details
    await page.fill('#billing_first_name', 'Test');
    await page.fill('#billing_last_name', 'User');
    await page.fill('#billing_address_1', '123 Test St');
    await page.fill('#billing_city', 'Test City');
    await page.fill('#billing_postcode', '12345');
    await page.fill('#billing_phone', '555-1234');
    await page.fill('#billing_email', 'test@example.com');
    
    // Select country/state
    await page.selectOption('#billing_country', 'US');
    await page.selectOption('#billing_state', 'CA');
    
    // Place order
    await page.click('#place_order');
    
    // Verify order received
    await page.waitForURL('**/order-received/**');
    await expect(page.locator('.woocommerce-thankyou-order-received'))
      .toContainText('Thank you. Your order has been received.');
  });
});
```

---

## Multi-Package Configuration

### Complete Test Suite with Utilities

`qit.json`:
```json
{
  "test_packages": [
    "./packages/setup",
    "./packages/smoke-tests",
    "./packages/checkout-tests",
    "./packages/payment-tests",
    "./packages/cleanup"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "latest"
  }
}
```

### Setup Utility Package

`packages/setup/manifest.json`:
```json
{
  "package": "setup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Test environment setup",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_profile_completed yes",
        "wp wc tool run install_pages --user=1",
        "wp wc payment_gateway update cod --enabled=true --user=1",
        "wp user create customer customer@test.com --role=customer"
      ]
    }
  }
}
```

---

## Payment Gateway Tests

### Stripe Integration Tests

`packages/stripe-tests/manifest.json`:
```json
{
  "package": "stripe-tests",
  "namespace": "payment-gateways",
  "test_type": "e2e",
  "description": "Stripe payment gateway tests",
  "requires": {
    "secrets": [
      "STRIPE_TEST_KEY",
      "STRIPE_TEST_SECRET",
      "STRIPE_WEBHOOK_SECRET"
    ]
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp option set woocommerce_stripe_settings '{\"enabled\":\"yes\",\"testmode\":\"yes\",\"test_publishable_key\":\"$STRIPE_TEST_KEY\",\"test_secret_key\":\"$STRIPE_TEST_SECRET\"}' --format=json"
      ],
      "setup": [
        "npm ci",
        "npx playwright install chromium"
      ],
      "run": [
        "npx playwright test"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

---

## API Testing Package

### WooCommerce REST API Tests

`packages/api-tests/manifest.json`:
```json
{
  "package": "api-tests",
  "namespace": "woocommerce",
  "test_type": "e2e",
  "description": "WooCommerce REST API tests",
  "requires": {
    "secrets": [
      "WC_API_KEY",
      "WC_API_SECRET"
    ]
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp user create apiuser api@test.com --role=administrator",
        "wp eval 'echo WC()->api->create_key(\"apiuser\", \"Test API\", \"read_write\");'"
      ],
      "setup": [
        "npm ci"
      ],
      "run": [
        "npm test"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

`packages/api-tests/tests/products.test.js`:
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: `${process.env.QIT_SITE_URL}/wp-json/wc/v3`,
  auth: {
    username: process.env.WC_API_KEY,
    password: process.env.WC_API_SECRET
  }
});

describe('Products API', () => {
  test('create simple product', async () => {
    const product = {
      name: 'Test Product',
      type: 'simple',
      regular_price: '19.99',
      description: 'Test product description',
      short_description: 'Short description',
      categories: [{ id: 1 }]
    };
    
    const response = await api.post('/products', product);
    expect(response.status).toBe(201);
    expect(response.data.name).toBe('Test Product');
  });
  
  test('list products', async () => {
    const response = await api.get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
```

---

## Database Testing

### Data Migration Tests

`packages/migration-tests/manifest.json`:
```json
{
  "package": "migration-tests",
  "namespace": "database",
  "test_type": "e2e",
  "description": "Database migration tests",
  "test": {
    "phases": {
      "globalSetup": [
        "wp db export /tmp/backup.sql",
        "wp plugin activate my-migration-plugin",
        "wp eval 'do_action(\"my_plugin_run_migration\");'"
      ],
      "run": [
        "npm test"
      ],
      "globalTeardown": [
        "wp db import /tmp/backup.sql"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

---

## Performance Testing

### Load Testing Package

`packages/performance-tests/manifest.json`:
```json
{
  "package": "performance-tests",
  "namespace": "performance",
  "test_type": "e2e",
  "description": "Performance and load tests",
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install chromium"
      ],
      "run": [
        "npx playwright test --workers=10"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob",
      "allure-dir": "./results/allure"
    }
  }
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

`.github/workflows/test.yml`:
```yaml
name: E2E Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install QIT CLI
        run: npm install -g @qit/cli
        
      - name: Authenticate QIT
        run: qit auth:login
        env:
          QIT_TOKEN: ${{ secrets.QIT_TOKEN }}
          
      - name: Run Tests
        run: qit run:e2e my-extension --config=qit.json
        env:
          STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
          
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: qit-results/
```

---

## Custom Test Frameworks

### Using Jest Instead of Playwright

`packages/jest-tests/manifest.json`:
```json
{
  "package": "jest-tests",
  "namespace": "custom",
  "test_type": "e2e",
  "description": "Tests using Jest framework",
  "test": {
    "phases": {
      "setup": [
        "npm ci"
      ],
      "run": [
        "npm test -- --json --outputFile=results/jest.json",
        "node ./scripts/convert-to-ctrf.js"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

`packages/jest-tests/scripts/convert-to-ctrf.js`:
```javascript
const fs = require('fs');

// Read Jest output
const jestResults = JSON.parse(
  fs.readFileSync('./results/jest.json', 'utf8')
);

// Convert to CTRF format
const ctrfResults = {
  tool: 'jest',
  results: {
    summary: {
      tests: jestResults.numTotalTests,
      passed: jestResults.numPassedTests,
      failed: jestResults.numFailedTests,
      skipped: jestResults.numPendingTests
    },
    tests: jestResults.testResults.flatMap(file =>
      file.assertionResults.map(test => ({
        name: test.title,
        status: test.status === 'passed' ? 'pass' : 'fail',
        duration: test.duration,
        message: test.failureMessages?.join('\n')
      }))
    )
  }
};

// Write CTRF output
fs.writeFileSync(
  './results/ctrf.json',
  JSON.stringify(ctrfResults, null, 2)
);
```

---

## See also

- **[Quickstart](../start-here/quickstart-scaffold-run-verify.md)** — Get started quickly
- **[Manifest Schema](../reference/manifest-schema.md)** — Complete manifest reference
- **[CLI Commands](../reference/cli-commands.md)** — Command reference
- **[CI/GitHub Actions](../how-to-guides/ci-github-actions.md)** — CI integration

---

**Last updated:** 2025-08-09