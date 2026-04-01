---
description: "Complete reference for qit-test.json, the test package manifest file. Documents every field: package (namespace/name), package_type (test or utility), description, tags, test_type, requires (secrets, php, wordpress, plugins as slug arrays, themes as slug arrays, network, tunnel, external_services), test.phases (globalSetup, setup, run, teardown, globalTeardown), test.results (ctrf-json, blob-dir, json, allure-dir), mu_plugins, envs, and subpackages. Includes validation rules, command execution formats (string or object with runs_on, timeout, continue_on_error), auto-detection logic (npm/npx = host, everything else = Docker), and complete examples."
---

# Test Package Manifest Reference

The `qit-test.json` file defines a test package's behavior, requirements, and integration points.

> **IDE Validation**: To enable IDE validation and autocompletion, use `qit package:scaffold` with the `--with-schema` option, or manually add `"$schema": "https://raw.githubusercontent.com/woocommerce/qit-cli/trunk/src/src/PreCommand/Schemas/test-package-manifest-schema.json"` to your manifest.

## Minimal Example

```json
{
  "package": "your-extension-slug/checkout-tests",
  "package_type": "test",
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
  "package": "namespace/name",
  "package_type": "test or utility",
  "description": "string",
  "tags": ["array"],
  "test_dir": "string",
  "requires": {
    "secrets": ["array"],
    "php": "string",
    "wordpress": "string",
    "plugins": ["array of slugs"],
    "themes": ["array of slugs"],
    "external_services": ["array"],
    "network": false,
    "tunnel": false
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
  "actions": {
    "capabilityName": "./path/to/implementation.ts"
  },
  "mu_plugins": ["array"],
  "envs": {"key": "value"}
}
```

## Required Fields

These fields are always required:

### package
**Required** | `string`

Full package identifier in format `namespace/name`. Both namespace and name must match pattern `^[a-zA-Z0-9_.-]+$`.

```json
"package": "your-extension-slug/payment-tests"
```

### package_type
**Required** | `string`

Type of package: `"test"` or `"utility"`.

- **`"test"`** - Traditional test packages that execute tests and produce results. Must have a `run` phase and `results` configuration.
- **`"utility"`** - Configuration and setup packages without test execution. Must NOT have a `run` phase or `results` configuration.

```json
"package_type": "test"
```

**Best Practice**: Always explicitly set this field even though QIT can auto-detect package type. Explicit declaration makes your intent clear and prevents accidental misconfiguration.

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

### test_type
**Optional** | `string`

Type of test. Currently only `"e2e"` is supported. Defaults to `"e2e"` if not specified.

```json
"test_type": "e2e"
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

### actions
**Optional** | `object`

Named actions this package registers for other packages to discover at runtime via `qit.actions()`. Maps action names to relative file paths. Each file must have an `export default` (that's the action implementation).

Like WordPress `do_action()`, multiple packages can register the same action name, and consumers iterate over all of them.

```json
"actions": {
  "makePurchase": "./flows/pay.ts",
  "refundOrder": "./flows/refund.ts"
}
```

Action names must be camelCase identifiers (`^[a-zA-Z][a-zA-Z0-9_]*$`). Paths must start with `./`. See [Actions](./concepts/actions.md) for the full guide.

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
**Optional** | `string[]`

Required plugins (will be installed and activated). Array of plugin slugs.

```json
"requires": {
  "plugins": ["woocommerce", "woocommerce-subscriptions"]
}
```

### requires.themes
**Optional** | `string[]`

Required themes (will be installed). Array of theme slugs.

```json
"requires": {
  "themes": ["storefront"]
}
```

### requires.network
**Optional** | `boolean`

Whether this package requires external network access. Default: `false` (tests run offline).

```json
"requires": {
  "network": true
}
```

### requires.tunnel
**Optional** | `boolean`

Whether this package requires a tunnel for external access (e.g., payment gateway webhooks). Default: `false`.

```json
"requires": {
  "tunnel": true
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
    "continue_on_error": false
  }
]
```

Object properties:
- `command` (required): The command to execute
- `runs_on`: `"host"` or `"docker"` (default: auto-detection; npm/npx run on host, everything else runs in Docker)
- `timeout`: Command timeout in seconds (1-3600)
- `continue_on_error`: Continue even if command fails (default: `false`)

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
  "package": "your-extension-slug/checkout-tests",
  "package_type": "test",
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
  "package": "woocommerce/test-environment",
  "package_type": "utility",
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
  "package": "your-extension-slug/smoke-tests",
  "package_type": "test",
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
  "package": "woocommerce/disable-onboarding",
  "package_type": "utility",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes"
      ]
    }
  }
}
```