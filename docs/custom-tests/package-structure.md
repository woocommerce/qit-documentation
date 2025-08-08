# Package Structure

A Custom Test package is a directory containing a `manifest.json` file and associated test files. This document explains how to structure your packages for optimal organization and execution.

## Directory Structure

### Basic Test Package
```
my-test-package/
├── manifest.json           # Required: Package configuration
├── tests/                  # Test files
│   ├── checkout.spec.js
│   └── payment.spec.js
├── package.json           # Node.js dependencies
├── playwright.config.js   # Test framework config
└── results/              # Generated results (gitignored)
    ├── ctrf.json
    └── blob/
```

### Utility Package
```
environment-setup/
├── manifest.json          # Required: Package configuration
└── scripts/              # Setup scripts
    ├── configure-woo.sh
    └── seed-data.sql
```

## Package Types

### Test Packages

Test packages are designed to execute actual tests. They must have:

1. **A `run` phase** in the manifest
2. **Result specifications** for CTRF and blob artifacts
3. **Test files** (e.g., Playwright specs, PHPUnit tests)

Example manifest for a test package:
```json
{
  "package": "checkout-tests",
  "namespace": "my-company",
  "test_type": "e2e",
  "description": "E2E tests for checkout flow",
  "test": {
    "phases": {
      "setup": ["npm install"],
      "run": ["npx playwright test"],
      "teardown": ["rm -rf temp"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

### Utility Packages

Utility packages provide environment setup and teardown without running tests. They:

1. **Cannot have a `run` phase**
2. **Cannot have result specifications**
3. **Typically use `globalSetup` and `globalTeardown`**

Example manifest for a utility package:
```json
{
  "package": "woo-configuration",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Configure WooCommerce for testing",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_complete yes",
        "wp user create test test@example.com --role=customer"
      ],
      "globalTeardown": [
        "wp user delete test --yes"
      ]
    }
  }
}
```

## File Organization

### Recommended Structure

```
test-suite/
├── packages/
│   ├── utilities/
│   │   ├── environment-setup/
│   │   │   └── manifest.json
│   │   └── data-seeding/
│   │       └── manifest.json
│   └── tests/
│       ├── checkout-flow/
│       │   ├── manifest.json
│       │   └── tests/
│       ├── payment-gateway/
│       │   ├── manifest.json
│       │   └── tests/
│       └── order-management/
│           ├── manifest.json
│           └── tests/
└── config.json  # Configuration file listing all packages
```

### Configuration File

The configuration file lists all packages to run:

```json
{
  "test_packages": [
    "./packages/utilities/environment-setup",
    "./packages/utilities/data-seeding",
    "./packages/tests/checkout-flow",
    "./packages/tests/payment-gateway",
    "./packages/tests/order-management"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "8.0.0"
  }
}
```

## Phase Commands

### Command Types

Commands in phases can be:

1. **Shell commands**: Direct system commands
   ```json
   "setup": ["mkdir -p ./temp", "cp config.json ./temp/"]
   ```

2. **WP-CLI commands**: WordPress management
   ```json
   "globalSetup": ["wp plugin install woocommerce --activate"]
   ```

3. **NPM scripts**: Node.js package scripts
   ```json
   "run": ["npm test", "npm run report"]
   ```

4. **Custom scripts**: Your own scripts
   ```json
   "setup": ["./scripts/prepare-environment.sh"]
   ```

### Execution Context

Commands execute in different contexts:

- **`[host]` commands**: Run on the host machine
- **`[docker]` commands**: Run inside the WordPress container
- Default context depends on the command type

## Dependencies

### Node.js Packages

For JavaScript-based tests (Playwright, Jest, etc.):

```json
// package.json
{
  "name": "my-tests",
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "ctrf-json-reporter": "^1.0.0"
  },
  "scripts": {
    "test": "playwright test",
    "test:debug": "playwright test --debug"
  }
}
```

### PHP Dependencies

For PHP-based tests (PHPUnit, Codeception, etc.):

```json
// composer.json
{
  "name": "my-company/e2e-tests",
  "require-dev": {
    "phpunit/phpunit": "^9.5",
    "codeception/codeception": "^5.0"
  }
}
```

## Results

### CTRF (Common Test Report Format)

Test packages must generate CTRF JSON:

```json
{
  "results": {
    "tool": {
      "name": "playwright",
      "version": "1.40.0"
    },
    "summary": {
      "tests": 5,
      "passed": 4,
      "failed": 1,
      "skipped": 0
    },
    "tests": [
      {
        "name": "Checkout › Guest checkout",
        "status": "passed",
        "duration": 3456
      }
    ]
  }
}
```

### Blob Artifacts

Store screenshots, videos, and logs:

```
results/blob/
├── screenshots/
│   ├── checkout-failed.png
│   └── payment-error.png
├── videos/
│   └── test-run.webm
└── logs/
    └── console.log
```

## Best Practices

### 1. Single Responsibility
Each package should have one clear purpose:
- ✅ `checkout-tests` - Tests checkout flow
- ✅ `payment-tests` - Tests payment processing
- ❌ `all-tests` - Too broad

### 2. Namespace Organization
Use namespaces to group related packages:
- `woocommerce/checkout-tests`
- `woocommerce/payment-tests`
- `utilities/environment-setup`

### 3. Version Control
- Commit `manifest.json` and test files
- Gitignore results directories
- Gitignore node_modules and vendor

### 4. Dependency Management
- Use package.json or composer.json
- Pin versions for reproducibility
- Document special requirements

### 5. Result Paths
- Use consistent paths across packages
- Keep results in a dedicated directory
- Clean up temporary files in teardown

## Examples

### Complete Test Package

```
playwright-tests/
├── manifest.json
├── package.json
├── playwright.config.js
├── tests/
│   ├── e2e/
│   │   ├── checkout.spec.js
│   │   ├── cart.spec.js
│   │   └── account.spec.js
│   └── fixtures/
│       └── test-data.js
├── scripts/
│   └── generate-report.js
└── .gitignore
```

**manifest.json:**
```json
{
  "package": "playwright-e2e",
  "namespace": "my-shop",
  "test_type": "e2e",
  "description": "Playwright E2E test suite",
  "requires": {
    "secrets": ["STRIPE_TEST_KEY"]
  },
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install chromium"
      ],
      "run": [
        "npx playwright test",
        "node scripts/generate-report.js"
      ],
      "teardown": [
        "rm -rf test-results/temp"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts",
      "allure-dir": "./test-results/allure"
    }
  }
}
```

### Complete Utility Package

```
test-environment/
├── manifest.json
├── scripts/
│   ├── setup-woocommerce.sh
│   ├── create-products.php
│   └── configure-payment.sql
└── data/
    └── sample-products.csv
```

**manifest.json:**
```json
{
  "package": "test-environment",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Test environment configuration",
  "test": {
    "phases": {
      "globalSetup": [
        "./scripts/setup-woocommerce.sh",
        "php ./scripts/create-products.php",
        "wp db query < ./scripts/configure-payment.sql"
      ],
      "globalTeardown": [
        "wp post delete $(wp post list --post_type=product --format=ids) --force"
      ]
    }
  }
}
```