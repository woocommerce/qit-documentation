# Manifest Schema

The `manifest.json` file is the heart of every Custom Test package. It defines the package configuration, execution phases, requirements, and result specifications.

## Schema Overview

```json
{
  "package": "string (required)",
  "namespace": "string (required)",
  "test_type": "string (required)",
  "description": "string (optional)",
  "requires": {
    "secrets": ["array of strings"],
    "php": "version constraint",
    "wordpress": "version constraint"
  },
  "test": {
    "phases": {
      "globalSetup": ["array of commands"],
      "setup": ["array of commands"],
      "run": ["array of commands"],
      "teardown": ["array of commands"],
      "globalTeardown": ["array of commands"]
    },
    "results": {
      "ctrf-json": "path to CTRF file",
      "blob-dir": "path to artifacts directory",
      "allure-dir": "path to Allure results"
    }
  }
}
```

## Required Fields

### package
**Type:** `string`  
**Required:** Yes  
**Description:** Unique identifier for the package within its namespace

```json
"package": "checkout-tests"
```

### namespace
**Type:** `string`  
**Required:** Yes  
**Description:** Organization or vendor namespace

```json
"namespace": "my-company"
```

### test_type
**Type:** `string`  
**Required:** Yes  
**Valid values:** `"e2e"`  
**Description:** Type of tests in this package

```json
"test_type": "e2e"
```

## Optional Fields

### description
**Type:** `string`  
**Required:** No  
**Description:** Human-readable description of the package

```json
"description": "E2E tests for WooCommerce checkout flow"
```

### requires
**Type:** `object`  
**Required:** No  
**Description:** Package requirements and dependencies

#### requires.secrets
**Type:** `array of strings`  
**Description:** Environment variables that must be present

```json
"requires": {
  "secrets": ["STRIPE_API_KEY", "PAYPAL_CLIENT_SECRET"]
}
```

#### requires.php
**Type:** `string`  
**Description:** PHP version constraint

```json
"requires": {
  "php": ">=8.0"
}
```

#### requires.wordpress
**Type:** `string`  
**Description:** WordPress version constraint

```json
"requires": {
  "wordpress": ">=6.0"
}
```

## Test Configuration

### test.phases
**Type:** `object`  
**Required:** Yes  
**Description:** Execution phases for the package

#### Phase Types

##### globalSetup
**Runs:** Once before all packages  
**Purpose:** Environment-wide setup  
**Common uses:** Install plugins, configure WordPress, create test users

```json
"globalSetup": [
  "wp plugin install woocommerce --activate",
  "wp option set woocommerce_task_list_hidden yes"
]
```

##### setup
**Runs:** Before this package's tests  
**Purpose:** Package-specific preparation  
**Common uses:** Install dependencies, prepare test data

```json
"setup": [
  "npm install",
  "cp .env.example .env"
]
```

##### run
**Runs:** The actual test execution  
**Purpose:** Execute tests  
**Required for:** Test packages only  
**Cannot be in:** Utility packages

```json
"run": [
  "npx playwright test"
]
```

##### teardown
**Runs:** After this package's tests  
**Purpose:** Package-specific cleanup  
**Common uses:** Remove temporary files, reset state

```json
"teardown": [
  "rm -rf temp",
  "wp option delete test_option"
]
```

##### globalTeardown
**Runs:** Once after all packages  
**Purpose:** Environment-wide cleanup  
**Common uses:** Remove test data, deactivate plugins

```json
"globalTeardown": [
  "wp user delete test --yes",
  "wp plugin deactivate woocommerce"
]
```

### test.results
**Type:** `object`  
**Required:** Yes (for test packages)  
**Forbidden:** In utility packages  
**Description:** Where to find test results

#### ctrf-json
**Type:** `string`  
**Required:** Yes (for test packages)  
**Description:** Path to CTRF JSON results file

```json
"ctrf-json": "./test-results/ctrf.json"
```

#### blob-dir
**Type:** `string`  
**Required:** Yes (for test packages)  
**Description:** Path to directory containing artifacts (screenshots, videos, logs)

```json
"blob-dir": "./test-results/artifacts"
```

#### allure-dir
**Type:** `string`  
**Required:** No  
**Description:** Path to Allure results directory

```json
"allure-dir": "./allure-results"
```

## Validation Rules

### Conditional Validation

The manifest uses conditional validation based on package type:

```json
{
  "if": {
    "test.phases contains 'run'"
  },
  "then": {
    "test.results is required"
  }
}
```

This means:
- If a package has a `run` phase → it's a test package → it MUST have `results`
- If a package has no `run` phase → it's a utility package → it MUST NOT have `results`

### Invalid Configurations

❌ **Test package without results:**
```json
{
  "package": "invalid-test",
  "namespace": "example",
  "test_type": "e2e",
  "test": {
    "phases": {
      "run": ["npm test"]
    }
    // Missing results!
  }
}
```

❌ **Utility package with results:**
```json
{
  "package": "invalid-utility",
  "namespace": "example",
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": ["wp plugin install"]
    },
    "results": {  // Should not be here!
      "ctrf-json": "./results.json"
    }
  }
}
```

## Complete Examples

### Test Package with All Features

```json
{
  "package": "comprehensive-tests",
  "namespace": "acme-corp",
  "test_type": "e2e",
  "description": "Complete E2E test suite with all features",
  "requires": {
    "secrets": ["API_KEY", "API_SECRET", "TEST_USER_TOKEN"],
    "php": ">=8.0",
    "wordpress": ">=6.2"
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install helper-plugin --activate",
        "wp option set test_mode enabled"
      ],
      "setup": [
        "npm ci",
        "npx playwright install chromium",
        "./scripts/prepare-test-data.sh"
      ],
      "run": [
        "npx playwright test --reporter=ctrf-json",
        "npm run generate-report"
      ],
      "teardown": [
        "rm -rf ./temp",
        "./scripts/cleanup-test-data.sh"
      ],
      "globalTeardown": [
        "wp plugin deactivate helper-plugin",
        "wp option delete test_mode"
      ]
    },
    "results": {
      "ctrf-json": "./test-results/report.json",
      "blob-dir": "./test-results/artifacts",
      "allure-dir": "./test-results/allure"
    }
  }
}
```

### Minimal Test Package

```json
{
  "package": "basic-test",
  "namespace": "my-tests",
  "test_type": "e2e",
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

### Utility Package for Environment Setup

```json
{
  "package": "environment-setup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Configure WordPress and WooCommerce for testing",
  "test": {
    "phases": {
      "globalSetup": [
        "wp core update",
        "wp plugin install woocommerce --activate --version=8.0.0",
        "wp theme install storefront --activate",
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_profile_completed yes",
        "wp user create customer customer@test.com --role=customer",
        "wp wc product create --name='Test Product' --regular_price=10 --sku=TEST001"
      ],
      "globalTeardown": [
        "wp user delete customer --yes",
        "wp post delete $(wp post list --post_type=product --format=ids) --force"
      ]
    }
  }
}
```

### Utility Package with Secrets

```json
{
  "package": "payment-gateway-setup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Configure payment gateways for testing",
  "requires": {
    "secrets": ["STRIPE_TEST_KEY", "STRIPE_TEST_SECRET"]
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-stripe --activate",
        "wp option set woocommerce_stripe_settings '{\"enabled\":\"yes\",\"testmode\":\"yes\",\"test_publishable_key\":\"$STRIPE_TEST_KEY\",\"test_secret_key\":\"$STRIPE_TEST_SECRET\"}' --format=json"
      ],
      "globalTeardown": [
        "wp option delete woocommerce_stripe_settings"
      ]
    }
  }
}
```

## Command Execution

### Command Format

Commands are strings that will be executed in order:

```json
"setup": [
  "echo 'Starting setup'",
  "npm install",
  "mkdir -p results",
  "echo 'Setup complete'"
]
```

### Environment Variables

Commands have access to:
- System environment variables
- Secrets declared in `requires.secrets`
- QIT-provided variables (e.g., `QIT_SITE_URL`)

```json
"run": [
  "API_ENDPOINT=$QIT_SITE_URL npm test"
]
```

### Working Directory

Commands execute in the package directory by default:

```json
"setup": [
  "pwd",  // Will show the package directory
  "ls -la"  // Will list package contents
]
```

## Troubleshooting

### Common Errors

#### "Schema validation failed"
Check that:
- Test packages have both `run` phase and `results`
- Utility packages have neither `run` phase nor `results`
- Required fields are present

#### "Missing required field"
Ensure these fields exist:
- `package`
- `namespace`
- `test_type`

#### "Invalid test_type"
Currently only `"e2e"` is supported

#### "Results path not found"
Ensure your test framework outputs to the specified paths:
- CTRF JSON to the exact file path
- Artifacts to the specified directory