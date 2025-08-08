# Manifest Reference

The `manifest.json` file defines a package's behavior, requirements, and integration points.

## Minimal Example

```json
{
  "package": "checkout-tests",
  "namespace": "acme",
  "test_type": "e2e",
  "test": {
    "phases": {
      "run": ["npm test"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/artifacts"
    }
  }
}
```

## Complete Structure

```json
{
  "package": "string",
  "namespace": "string", 
  "test_type": "string",
  "description": "string",
  "requires": {
    "secrets": ["array"],
    "php": "string",
    "wordpress": "string"
  },
  "test": {
    "phases": {
      "globalSetup": ["array"],
      "setup": ["array"],
      "run": ["array"],
      "teardown": ["array"],
      "globalTeardown": ["array"]
    },
    "results": {
      "ctrf-json": "string",
      "blob-dir": "string",
      "allure-dir": "string"
    }
  }
}
```

## Top-Level Fields

### package
**Required** | `string`

Unique identifier within the namespace.

```json
"package": "payment-gateway-tests"
```

### namespace
**Required** | `string`

Organization or vendor identifier.

```json
"namespace": "acme-corp"
```

### test_type
**Required** | `string`

Must be `"e2e"`.

```json
"test_type": "e2e"
```

### description
**Optional** | `string`

Human-readable description.

```json
"description": "Payment gateway integration tests"
```

## requires

Optional requirements and constraints.

### requires.secrets
**Optional** | `string[]`

Environment variables that must be present.

```json
"requires": {
  "secrets": ["STRIPE_KEY", "STRIPE_SECRET", "WEBHOOK_SIGNING_SECRET"]
}
```

These will be:
- Validated before execution
- Passed to all commands
- Redacted from output

### requires.php
**Optional** | `string`

PHP version constraint.

```json
"requires": {
  "php": ">=8.0"
}
```

### requires.wordpress
**Optional** | `string`

WordPress version constraint.

```json
"requires": {
  "wordpress": ">=6.4"
}
```

## test.phases

Commands to execute at different lifecycle points.

### globalSetup
**Optional** | `string[]`

Runs once before ALL packages.

```json
"globalSetup": [
  "wp plugin install woocommerce --activate",
  "wp option set woocommerce_onboarding_complete yes",
  "wp user create customer customer@test.com --role=customer"
]
```

### setup
**Optional** | `string[]`

Runs before THIS package's tests.

```json
"setup": [
  "npm ci",
  "npx playwright install chromium",
  "mkdir -p results"
]
```

### run
**Required for test packages** | `string[]`

Executes the tests.

```json
"run": [
  "npx playwright test --reporter=ctrf-json"
]
```

### teardown
**Optional** | `string[]`

Cleanup after THIS package.

```json
"teardown": [
  "rm -rf temp",
  "wp option delete test_setting"
]
```

### globalTeardown
**Optional** | `string[]`

Runs once after ALL packages.

```json
"globalTeardown": [
  "wp user delete customer --yes",
  "wp post delete $(wp post list --post_type=product --format=ids) --force"
]
```

## test.results

Where to find test output. **Required for test packages, forbidden for utility packages.**

### ctrf-json
**Required for test packages** | `string`

Path to CTRF JSON file.

```json
"ctrf-json": "./test-results/report.json"
```

### blob-dir
**Required for test packages** | `string`

Directory containing artifacts.

```json
"blob-dir": "./test-results/artifacts"
```

Structure:
```
artifacts/
├── screenshots/
│   └── failed-test.png
├── videos/
│   └── test-run.webm
└── logs/
    └── console.log
```

### allure-dir
**Optional** | `string`

Allure results directory.

```json
"allure-dir": "./allure-results"
```

## Validation Rules

### Test Package Rules
If a package has a `run` phase:
- It MUST have `test.results`
- It MUST have `ctrf-json` and `blob-dir`
- It MAY have `allure-dir`

### Utility Package Rules
If a package has NO `run` phase:
- It MUST NOT have `test.results`
- It MAY have any other phases

## Command Execution

### Command Format
Commands are strings executed in order:

```json
"setup": [
  "echo 'Starting setup'",
  "npm install",
  "echo 'Setup complete'"
]
```

### Environment Variables
Commands have access to:
- System environment variables
- Declared secrets
- QIT variables like `$QIT_SITE_URL`

```json
"run": [
  "BASE_URL=$QIT_SITE_URL npm test"
]
```

### Working Directory
Commands execute in the package directory.

### Exit Codes
Any non-zero exit code fails the phase.

## Examples

### Complete Test Package

```json
{
  "package": "woocommerce-checkout",
  "namespace": "acme",
  "test_type": "e2e",
  "description": "WooCommerce checkout flow tests",
  "requires": {
    "secrets": ["STRIPE_TEST_KEY", "STRIPE_TEST_SECRET"],
    "php": ">=8.0",
    "wordpress": ">=6.4"
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp option set woocommerce_stripe_settings '{\"enabled\":\"yes\",\"testmode\":\"yes\"}' --format=json"
      ],
      "setup": [
        "npm ci",
        "npx playwright install"
      ],
      "run": [
        "npx playwright test checkout.spec.js --reporter=ctrf-json"
      ],
      "teardown": [
        "rm -rf test-results/temp"
      ],
      "globalTeardown": [
        "wp option delete woocommerce_stripe_settings"
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

```json
{
  "package": "test-environment",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Test environment configuration",
  "test": {
    "phases": {
      "globalSetup": [
        "wp core update-db",
        "wp plugin install wordpress-importer --activate",
        "wp import ./data/sample-content.xml --authors=create",
        "wp wc tool run install_pages --user=1",
        "wp wc payment_gateway update cod --enabled=true --user=1",
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_profile_completed yes"
      ],
      "globalTeardown": [
        "wp site empty --yes",
        "wp plugin deactivate wordpress-importer"
      ]
    }
  }
}
```

### Minimal Test Package

```json
{
  "package": "smoke-test",
  "namespace": "quick",
  "test_type": "e2e",
  "test": {
    "phases": {
      "run": ["npm test"]
    },
    "results": {
      "ctrf-json": "./ctrf.json",
      "blob-dir": "./artifacts"
    }
  }
}
```

### Minimal Utility Package

```json
{
  "package": "disable-onboarding",
  "namespace": "utilities",
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes"
      ]
    }
  }
}
```