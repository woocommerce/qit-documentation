# Examples

Complete, working examples of Test Packages for various scenarios.

## Basic E2E Test Package

### Playwright Checkout Tests

`packages/checkout-tests/manifest.json`:
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
      ],
      "teardown": [
        "rm -rf test-results/temp"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/checkout-tests/package.json`:
```json
{
  "name": "checkout-tests",
  "version": "1.0.0",
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "ctrf-playwright-reporter": "^1.0.0"
  }
}
```

`packages/checkout-tests/playwright.config.js`:
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
    ['ctrf-playwright', {
      outputFile: './test-results/ctrf.json'
    }],
    ['html', {
      outputFolder: './test-results/artifacts/html'
    }]
  ],
  outputDir: './test-results/artifacts'
};
```

`packages/checkout-tests/tests/checkout.spec.js`:
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
    await expect(page).toHaveURL(/order-received/);
    await expect(page.locator('.woocommerce-thankyou-order-received'))
      .toContainText('Thank you. Your order has been received.');
  });
  
  test('member checkout with coupon', async ({ page }) => {
    // Login first
    await page.goto('/my-account');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'testpass123');
    await page.click('button[name="login"]');
    
    // Add product
    await page.goto('/shop');
    await page.locator('.add_to_cart_button').first().click();
    
    // Apply coupon in cart
    await page.goto('/cart');
    await page.fill('#coupon_code', 'TESTCOUPON');
    await page.click('button[name="apply_coupon"]');
    await expect(page.locator('.woocommerce-message'))
      .toContainText('Coupon code applied successfully');
    
    // Proceed to checkout
    await page.click('.checkout-button');
    
    // Place order (details pre-filled for logged-in user)
    await page.click('#place_order');
    
    // Verify
    await expect(page).toHaveURL(/order-received/);
  });
});
```

## Payment Gateway Test Package

### Stripe Integration Tests

`packages/stripe-tests/manifest.json`:
```json
{
  "package": "stripe-payment-tests",
  "namespace": "payment-gateways",
  "test_type": "e2e",
  "description": "Stripe payment gateway integration tests",
  "requires": {
    "secrets": [
      "STRIPE_TEST_PUBLISHABLE_KEY",
      "STRIPE_TEST_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET"
    ]
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp option set woocommerce_stripe_settings '{\"enabled\":\"yes\",\"testmode\":\"yes\",\"test_publishable_key\":\"$STRIPE_TEST_PUBLISHABLE_KEY\",\"test_secret_key\":\"$STRIPE_TEST_SECRET_KEY\"}' --format=json"
      ],
      "setup": [
        "npm ci",
        "npx playwright install"
      ],
      "run": [
        "npx playwright test stripe.spec.js"
      ],
      "globalTeardown": [
        "wp plugin deactivate woocommerce-gateway-stripe"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/stripe-tests/tests/stripe.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Stripe Payments', () => {
  test('successful payment with test card', async ({ page }) => {
    // Add product and go to checkout
    await page.goto('/shop');
    await page.click('.add_to_cart_button');
    await page.goto('/checkout');
    
    // Fill billing
    await page.fill('#billing_email', 'test@example.com');
    // ... other fields
    
    // Select Stripe payment
    await page.click('input[value="stripe"]');
    
    // Wait for Stripe iframe
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    
    // Enter card details
    await stripeFrame.locator('[placeholder="Card number"]')
      .fill('4242424242424242');
    await stripeFrame.locator('[placeholder="MM / YY"]')
      .fill('12/25');
    await stripeFrame.locator('[placeholder="CVC"]')
      .fill('123');
    
    // Place order
    await page.click('#place_order');
    
    // Verify success
    await expect(page).toHaveURL(/order-received/, { timeout: 15000 });
  });
  
  test('3D Secure authentication', async ({ page }) => {
    // Use 3DS test card
    const card = '4000002500003155';
    // ... test 3DS flow
  });
});
```

## API Test Package

### REST API Tests with Playwright

`packages/api-tests/manifest.json`:
```json
{
  "package": "woocommerce-api-tests",
  "namespace": "api",
  "test_type": "e2e",
  "description": "WooCommerce REST API tests using Playwright",
  "requires": {
    "secrets": ["WC_API_KEY", "WC_API_SECRET"]
  },
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install"
      ],
      "run": [
        "npx playwright test api.spec.js"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/api-tests/tests/api.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('WooCommerce API', () => {
  test('create and verify product via API', async ({ request }) => {
    const apiKey = process.env.WC_API_KEY;
    const apiSecret = process.env.WC_API_SECRET;
    const baseURL = process.env.QIT_SITE_URL;
    
    // Create product via API
    const createResponse = await request.post(`${baseURL}/wp-json/wc/v3/products`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
      },
      data: {
        name: 'Test Product',
        type: 'simple',
        regular_price: '9.99',
        description: 'Test product description'
      }
    });
    
    expect(createResponse.ok()).toBeTruthy();
    const product = await createResponse.json();
    expect(product.name).toBe('Test Product');
    
    // Verify product exists via UI
    const page = await context.newPage();
    await page.goto(`${baseURL}/product/${product.slug}`);
    await expect(page.locator('h1')).toContainText('Test Product');
  });
  
  test('update product stock via API', async ({ request }) => {
    const apiKey = process.env.WC_API_KEY;
    const apiSecret = process.env.WC_API_SECRET;
    const baseURL = process.env.QIT_SITE_URL;
    
    const updateResponse = await request.put(`${baseURL}/wp-json/wc/v3/products/1`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
      },
      data: {
        stock_quantity: 50,
        manage_stock: true
      }
    });
    
    expect(updateResponse.ok()).toBeTruthy();
    const product = await updateResponse.json();
    expect(product.stock_quantity).toBe(50);
  });
});
```

## Multi-Package Configuration

### Complete Test Suite

`qit.json`:
```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wordpress": "latest",
      "woocommerce": "latest"
    }
  },
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./packages/utilities/environment-setup",
          "./packages/smoke-tests",
          "./packages/checkout-tests",
          "./packages/payment-tests/stripe",
          "./packages/payment-tests/paypal",
          "./packages/api-tests",
          "./packages/utilities/cleanup"
        ],
        "environment": "default"
      }
    }
  }
}
```

### Environment Setup Utility

`packages/utilities/environment-setup/manifest.json`:
```json
{
  "package": "environment-setup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Configure test environment",
  "test": {
    "phases": {
      "globalSetup": [
        "wp core update-db",
        "wp plugin install wordpress-importer --activate",
        "wp import /app/sample-data.xml --authors=create",
        "wp wc tool run install_pages --user=1",
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_profile_completed yes",
        "wp user create testuser test@example.com --role=customer --user_pass=testpass123",
        "wp wc product create --name='Simple Product' --regular_price=9.99 --user=1",
        "wp post create --post_type=shop_coupon --post_title=TESTCOUPON --post_status=publish --meta_input='{\"discount_type\":\"percent\",\"coupon_amount\":\"10\"}'"
      ]
    }
  }
}
```

### Cleanup Utility

`packages/utilities/cleanup/manifest.json`:
```json
{
  "package": "cleanup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Clean up test data",
  "test": {
    "phases": {
      "globalTeardown": [
        "wp user delete testuser --yes",
        "wp post delete $(wp post list --post_type=shop_order --format=ids) --force",
        "wp post delete $(wp post list --post_type=product --format=ids) --force",
        "wp post delete $(wp post list --post_type=shop_coupon --format=ids) --force",
        "wp option delete woocommerce_task_list_hidden",
        "wp plugin deactivate wordpress-importer"
      ]
    }
  }
}
```

## Performance Test Package

### Load Testing with K6

`packages/performance-tests/manifest.json`:
```json
{
  "package": "performance-tests",
  "namespace": "performance",
  "test_type": "e2e",
  "description": "Load and performance tests",
  "test": {
    "phases": {
      "setup": [
        "docker pull grafana/k6",
        "mkdir -p test-results/artifacts"
      ],
      "run": [
        "docker run --rm -v $(pwd):/app -w /app grafana/k6 run --out json=test-results/k6.json scripts/load-test.js",
        "node scripts/convert-k6-to-ctrf.js"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/performance-tests/scripts/load-test.js`:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up
    { duration: '5m', target: 10 },  // Stay at 10 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
  },
};

export default function() {
  const res = http.get(`${__ENV.QIT_SITE_URL}/shop`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'page loaded': (r) => r.body.includes('Products'),
  });
  sleep(1);
}
```

## Mobile Test Package

### Mobile Browser Tests

`packages/mobile-tests/manifest.json`:
```json
{
  "package": "mobile-browser-tests",
  "namespace": "mobile",
  "test_type": "e2e",
  "description": "Mobile responsive tests",
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install webkit"
      ],
      "run": [
        "npx playwright test --project=mobile"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/mobile-tests/playwright.config.js`:
```javascript
module.exports = {
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        baseURL: process.env.QIT_SITE_URL,
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        baseURL: process.env.QIT_SITE_URL,
      },
    },
  ],
};
```

## Visual Regression Package

### Screenshot Comparison Tests

`packages/visual-tests/manifest.json`:
```json
{
  "package": "visual-regression",
  "namespace": "visual",
  "test_type": "e2e",
  "description": "Visual regression tests",
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install"
      ],
      "run": [
        "npx playwright test visual.spec.js"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/visual-tests/tests/visual.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Visual Regression', () => {
  test('homepage appearance', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
  
  test('product page layout', async ({ page }) => {
    await page.goto('/product/simple-product');
    await expect(page).toHaveScreenshot('product-page.png', {
      mask: [page.locator('.price')], // Mask dynamic content
    });
  });
});
```

## Accessibility Test Package

### A11y Testing with Axe

`packages/a11y-tests/manifest.json`:
```json
{
  "package": "accessibility-tests",
  "namespace": "a11y",
  "test_type": "e2e",
  "description": "Accessibility compliance tests",
  "test": {
    "phases": {
      "setup": [
        "npm ci"
      ],
      "run": [
        "npx playwright test a11y.spec.js"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

`packages/a11y-tests/tests/a11y.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility', () => {
  test('checkout page accessibility', async ({ page }) => {
    await page.goto('/checkout');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```