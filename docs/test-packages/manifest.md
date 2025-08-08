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
  "test_type": "e2e",
  "description": "string",
  "tags": ["array"],
  "test_dir": "string",
  "requires": {
    "secrets": ["array"],
    "php": "string",
    "wordpress": "string",
    "plugins": {"name": "version"},
    "themes": {"name": "version"},
    "external_services": ["array"]
  },
  "test": {
    "phases": {
      "globalSetup": ["array or objects"],
      "setup": ["array or objects"],
      "run": ["array or objects"],
      "teardown": ["array or objects"],
      "globalTeardown": ["array or objects"]
    },
    "results": {
      "ctrf-json": "string",
      "blob-dir": "string",
      "json": "string",
      "allure-dir": "string"
    }
  },
  "mu_plugins": ["array"],
  "envs": {"key": "value"},
  "timeout": "number",
  "retry": {
    "times": "number",
    "delay": "number"
  }
}
```

## Required Fields

These four fields are always required:

### package
**Required** | `string`

Unique identifier within the namespace. Must match pattern `^[a-zA-Z0-9_.-]+$`.

```json
"package": "payment-gateway-tests"
```

### namespace
**Required** | `string`

Organization or vendor identifier. Must match pattern `^[a-zA-Z0-9_.-]+$`.

```json
"namespace": "acme-corp"
```

### test_type
**Required** | `string`

Must be `"e2e"`. Currently only E2E tests are supported.

```json
"test_type": "e2e"
```

### test
**Required** | `object`

Contains phases and results configuration. Must have at least a `phases` object.

## Optional Top-Level Fields

### description
**Optional** | `string`

Human-readable description (max 500 characters).

```json
"description": "Payment gateway integration tests"
```

### tags
**Optional** | `string[]`

Tags for categorizing and searching test packages. Each tag must match pattern `^[a-zA-Z0-9_.-]+$`.

```json
"tags": ["payment", "stripe", "integration"]
```

### test_dir  
**Optional** | `string`

Directory containing test files. Defaults to `"./"`. Must start with `./`.

```json
"test_dir": "./tests"
```

### mu_plugins
**Optional** | `string[]`

Must-use plugins to install. Paths to mu-plugin files.

```json
"mu_plugins": ["./mu-plugins/test-helper.php"]
```

### envs
**Optional** | `object`

Environment variables to set during test execution. Values can be string, boolean, or number.

```json
"envs": {
  "TEST_MODE": "integration",
  "DEBUG": true,
  "MAX_RETRIES": 3
}
```

### timeout
**Optional** | `integer`

Test timeout in seconds. Range: 1-3600.

```json
"timeout": 600
```

### retry
**Optional** | `object`

Retry configuration for flaky tests.

```json
"retry": {
  "times": 3,
  "delay": 5
}
```

- `times`: Number of retry attempts (0-5)
- `delay`: Delay between retries in seconds (0-60)

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

### requires.plugins
**Optional** | `object`

Required plugins with semantic version constraints.

```json
"requires": {
  "plugins": {
    "woocommerce": ">=8.0.0",
    "woocommerce-subscriptions": "^5.0.0"
  }
}
```

### requires.themes
**Optional** | `object`

Required themes with semantic version constraints.

```json
"requires": {
  "themes": {
    "storefront": ">=4.0.0"
  }
}
```

### requires.external_services
**Optional** | `string[]`

External services needed (for documentation purposes).

```json
"requires": {
  "external_services": ["stripe-api", "webhook-endpoint"]
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

### json
**Optional** | `string`

Path to original JSON test results (before CTRF conversion).

```json
"json": "./test-results/raw.json"
```

### allure-dir
**Optional** | `string`

Allure results directory for advanced reporting.

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
Commands can be either strings or objects with additional configuration:

#### String Format (Simple)
```json
"setup": [
  "echo 'Starting setup'",
  "npm install",
  "echo 'Setup complete'"
]
```

#### Object Format (Advanced)
```json
"setup": [
  {
    "command": "npm install",
    "runs_on": "host",
    "timeout": 300,
    "continue_on_error": false,
    "env": {
      "NODE_ENV": "test"
    }
  }
]
```

Object properties:
- `command` (required): The command to execute
- `runs_on`: "host" or "docker" (default: smart detection)
- `timeout`: Command timeout in seconds (1-3600)
- `continue_on_error`: Continue even if command fails (default: false)
- `env`: Additional environment variables for this command

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