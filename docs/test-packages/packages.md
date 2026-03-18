# Creating and Organizing Packages

## Package Structure

A Test Package is a directory containing:
- `qit-test.json` - Package configuration
- Test files or scripts
- Dependencies (package.json, composer.json, etc.)
- Configuration files
- Helper scripts

### Basic Structure

```
my-test-package/
├── qit-test.json       # Required: Package manifest
├── package.json        # Optional: NPM dependencies
├── tests/             # Test files
│   ├── checkout.spec.js
│   └── payment.spec.js
├── config/            # Configuration
│   └── playwright.config.js
└── scripts/           # Helper scripts
    └── setup.sh
```

## Creating a Test Package

### Step 1: Create Directory

```bash
mkdir -p packages/checkout-tests
cd packages/checkout-tests
```

### Step 2: Create Manifest

`qit-test.json`:
```json
{
  "package": "checkout-tests",
  "namespace": "mycompany",
  "test_type": "e2e",
  "description": "Checkout flow E2E tests",
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

### Step 3: Add Test Framework

`package.json`:
```json
{
  "name": "checkout-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "ctrf-json-reporter": "^1.0.0"
  }
}
```

### Step 4: Configure Test Framework

`playwright.config.js`:
```javascript
module.exports = {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: process.env.QIT_SITE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [
    ['ctrf-json', {
      outputFile: './test-results/ctrf.json'
    }]
  ],
  outputDir: './test-results/artifacts'
};
```

### Step 5: Write Tests

`tests/checkout.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');

test('guest checkout', async ({ page }) => {
  await page.goto('/shop');
  await page.click('text=Add to cart');
  await page.goto('/checkout');
  
  await page.fill('#billing_first_name', 'Test');
  await page.fill('#billing_last_name', 'User');
  await page.fill('#billing_email', 'test@example.com');
  
  await page.click('#place_order');
  await expect(page).toHaveURL(/order-received/);
});
```

## Creating a Utility Package

### Purpose
Utility packages provide setup/teardown without running tests.

### Example: Environment Setup

`qit-test.json`:
```json
{
  "package": "environment-setup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Configure test environment",
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_completed yes",
        "wp user create testcustomer customer@test.com --role=customer",
        "wp wc payment_gateway update cod --enabled=true --user=1"
      ],
      "globalTeardown": [
        "wp user delete testcustomer --yes",
        "wp plugin deactivate woocommerce-gateway-stripe"
      ]
    }
  }
}
```

## Package Organization Strategies

### Strategy 1: By Feature

```
packages/
├── checkout/
│   ├── guest-checkout/
│   ├── member-checkout/
│   └── express-checkout/
├── cart/
│   ├── add-to-cart/
│   └── cart-management/
└── account/
    ├── registration/
    └── login/
```

### Strategy 2: By Test Type

```
packages/
├── smoke/
│   └── critical-paths/
├── regression/
│   ├── checkout/
│   └── payment/
├── integration/
│   └── api-tests/
└── utilities/
    ├── setup/
    └── cleanup/
```

### Strategy 3: By Component

```
packages/
├── frontend/
│   ├── checkout-ui/
│   └── cart-ui/
├── backend/
│   ├── api/
│   └── webhooks/
└── utilities/
    └── data-seeding/
```

## Package Dependencies

### NPM Dependencies

`package.json`:
```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "axios": "^1.6.0",
    "faker": "^6.0.0"
  },
  "scripts": {
    "test": "playwright test",
    "test:debug": "playwright test --debug"
  }
}
```

Install in setup phase:
```json
{
  "setup": [
    "npm ci"
  ]
}
```

### Composer Dependencies

`composer.json`:
```json
{
  "require-dev": {
    "phpunit/phpunit": "^9.0",
    "guzzlehttp/guzzle": "^7.0"
  }
}
```

Install in setup phase:
```json
{
  "setup": [
    "composer install --no-interaction"
  ]
}
```

## Sharing Code Between Packages

### Shared Utilities

```
packages/
├── shared/
│   ├── helpers.js
│   └── test-data.json
├── checkout/
│   └── tests/
└── payment/
    └── tests/
```

Reference in tests:
```javascript
const helpers = require('../../shared/helpers');
const testData = require('../../shared/test-data.json');
```

### NPM Workspaces

Root `package.json`:
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

Package `package.json`:
```json
{
  "name": "@mycompany/checkout-tests",
  "dependencies": {
    "@mycompany/test-helpers": "workspace:*"
  }
}
```

## Configuration Patterns

### Environment-Specific Configuration

```
packages/checkout/
├── qit-test.json
├── config/
│   ├── dev.json
│   ├── staging.json
│   └── prod.json
```

Load in setup:
```json
{
  "setup": [
    "cp config/${TEST_ENV:-dev}.json config.json"
  ]
}
```

### Secret Management

Declare in manifest:
```json
{
  "requires": {
    "secrets": ["API_KEY", "API_SECRET"]
  }
}
```

Use in tests:
```javascript
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
```

## Best Practices

### 1. Keep Packages Focused
- Single responsibility
- Clear purpose
- Manageable size

### 2. Use Descriptive Names
```
✓ checkout-guest-flow
✓ payment-stripe-integration
✗ test1
✗ misc-tests
```

### 3. Document Package Purpose
```json
{
  "description": "Tests guest checkout with multiple payment methods"
}
```

### 4. Version Control Structure
```
.gitignore:
node_modules/
test-results/
*.log
.env
```

### 5. Consistent Result Paths
Always use same structure:
```json
{
  "results": {
    "ctrf-json": "./test-results/ctrf.json",
    "blob-dir": "./test-results/artifacts"
  }
}
```

### 6. Idempotent Setup
Make setup repeatable:
```json
{
  "setup": [
    "rm -rf node_modules",
    "npm ci"
  ]
}
```

### 7. Clean Teardown
Remove only what you created:
```json
{
  "teardown": [
    "rm -rf ./temp",
    "rm -f ./.env.test"
  ]
}
```

## Package Templates

### Playwright E2E Tests (Primary Framework)

```json
{
  "package": "playwright-e2e",
  "namespace": "templates",
  "test_type": "e2e",
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install chromium",
        "mkdir -p test-results"
      ],
      "run": [
        "npx playwright test"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

### Additional Playwright Configurations

```json
{
  "package": "playwright-multi-browser",
  "namespace": "templates",
  "test_type": "e2e",
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install"
      ],
      "run": [
        "npx playwright test --project=chromium",
        "npx playwright test --project=firefox",
        "npx playwright test --project=webkit"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts"
    }
  }
}
```

## Troubleshooting

### Package Not Found
- Check path in configuration
- Verify qit-test.json exists
- Use absolute or relative paths correctly

### Dependencies Not Installing
- Check network connectivity
- Verify package.json/composer.json
- Use `npm ci` instead of `npm install`

### Results Not Generated
- Confirm test framework outputs CTRF
- Check result paths match actual output
- Ensure directories exist

### Commands Failing
- Test commands locally first
- Check working directory
- Verify environment variables