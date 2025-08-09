# Manifest Schema Reference

The `manifest.json` file defines a package's behavior, requirements, and integration points.

## Minimal Example

```json
{
  "package": "checkout-tests",
  "namespace": "woocommerce",
  "test_type": "e2e",
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

## Complete Structure

```json
{
  "$schema": "https://qit.woo.com/json-schema/test-package",
  "package": "string",
  "namespace": "string", 
  "test_type": "e2e",
  "description": "string",
  "tags": ["array"],
  "requires": {
    "secrets": ["array"],
    "php": "string",
    "wordpress": "string",
    "plugins": {"name": "version"},
    "themes": {"name": "version"}
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
      "allure-dir": "string"
    }
  }
}
```

## Required Fields

### package
**Required** | `string`

Unique identifier within the namespace. Must match pattern `^[a-zA-Z0-9_.-]+$`.

```json
"package": "payment-gateway-tests"
```

### namespace
**Required** | `string`

Your extension slug. Must match pattern `^[a-zA-Z0-9_.-]+$`.

```json
"namespace": "woocommerce"
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

---

## Optional Fields

### $schema
**Optional** | `string`

JSON schema URL for IDE validation.

```json
"$schema": "https://qit.woo.com/json-schema/test-package"
```

### description
**Optional** | `string`

Human-readable description (max 500 characters).

```json
"description": "Payment gateway integration tests with Stripe"
```

### tags
**Optional** | `string[]`

Tags for categorizing and searching test packages.

```json
"tags": ["payment", "stripe", "integration"]
```

---

## requires Object

Optional requirements and constraints.

### requires.secrets
**Optional** | `string[]`

Environment variables that must be present. These are validated before execution and redacted from output.

```json
"requires": {
  "secrets": [
    "STRIPE_TEST_KEY",
    "STRIPE_TEST_SECRET",
    "WEBHOOK_SIGNING_SECRET"
  ]
}
```

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

---

## test.phases Object

Commands to execute at different lifecycle points. Commands can be strings or objects.

### String Format (Simple)
```json
"setup": [
  "npm ci",
  "npx playwright install chromium"
]
```

### Object Format (Advanced)
```json
"setup": [
  {
    "command": "npm ci",
    "runs_on": "host",
    "timeout": 300
  },
  {
    "command": "wp plugin install helper --activate",
    "runs_on": "docker"
  }
]
```

Object properties:
- `command` (required): The command to execute
- `runs_on`: `"host"` or `"docker"` (default: smart detection)
- `timeout`: Command timeout in seconds

### globalSetup
**Optional** | `array`

Runs **once** before ALL packages. DB changes are captured in snapshot.

```json
"globalSetup": [
  "wp plugin install woocommerce-gateway-stripe --activate",
  "wp option set woocommerce_task_list_hidden yes",
  "wp user create customer customer@test.com --role=customer"
]
```

### setup
**Optional** | `array`

Runs before THIS package's tests only. DB changes are isolated to this package.

```json
"setup": [
  "npm ci",
  "npx playwright install chromium",
  "mkdir -p results/blob"
]
```

### run
**Required for test packages** | `array`

Executes the tests. Receives pass-through arguments after `--`.

```json
"run": [
  "npx playwright test"
]
```

### teardown
**Optional** | `array`

Cleanup after THIS package.

```json
"teardown": [
  "tar -czf results/blob/traces.tar.gz results/traces"
]
```

### globalTeardown
**Optional** | `array`

Runs **once** after ALL packages.

```json
"globalTeardown": [
  "wp option delete test_mode"
]
```

---

## test.results Object

**Required for test packages, forbidden for utility packages.**

### ctrf-json
**Required for test packages** | `string`

Path to CTRF JSON file (relative to package directory).

```json
"ctrf-json": "./results/ctrf.json"
```

### blob-dir
**Required for test packages** | `string`

Directory containing artifacts (screenshots, videos, traces, HTML).

```json
"blob-dir": "./results/blob"
```

### allure-dir
**Optional** | `string`

Allure results directory for advanced reporting.

```json
"allure-dir": "./results/allure"
```

---

## Validation Rules

### Test Package Rules
If a package has a `run` phase:
- MUST have `test.results`
- MUST have `ctrf-json` and `blob-dir`
- MAY have `allure-dir`

### Utility Package Rules
If a package has NO `run` phase:
- MUST NOT have `test.results`
- MAY have any other phases

---

## Complete Examples

### Test Package with Playwright

```json
{
  "$schema": "https://qit.woo.com/json-schema/test-package",
  "package": "checkout-flow",
  "namespace": "woocommerce",
  "test_type": "e2e",
  "description": "WooCommerce checkout flow tests with Stripe",
  "requires": {
    "secrets": ["STRIPE_TEST_KEY", "STRIPE_TEST_SECRET"]
  },
  "test": {
    "phases": {
      "globalSetup": [
        { "command": "wp plugin install woocommerce-gateway-stripe --activate", "runs_on": "docker" },
        { "command": "wp option set woocommerce_stripe_settings '{\"enabled\":\"yes\",\"testmode\":\"yes\"}' --format=json", "runs_on": "docker" }
      ],
      "setup": [
        { "command": "npm ci", "runs_on": "host" },
        { "command": "npx playwright install chromium", "runs_on": "host" },
        { "command": "mkdir -p results/blob", "runs_on": "host" }
      ],
      "run": [
        { "command": "npx playwright test", "runs_on": "host" }
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

### Utility Package (Setup Only)

```json
{
  "$schema": "https://qit.woo.com/json-schema/test-package",
  "package": "disable-onboarding",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Disable WooCommerce onboarding and setup tasks",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_profile_completed yes"
      ]
    }
  }
}
```

### Minimal Test Package

```json
{
  "package": "smoke",
  "namespace": "my-extension",
  "test_type": "e2e",
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

---

## Environment Variables in Commands

Commands have access to:
- System environment variables
- Declared secrets (from `requires.secrets`)
- QIT variables:
  - `$QIT_SITE_URL`
  - `$QIT_WP_ADMIN`
  - `$QIT_DB_NAME`
  - `$QIT_DB_USER`
  - `$QIT_DB_PASS`
  - `$QIT_DB_HOST`

Example:
```json
"run": [
  "BASE_URL=$QIT_SITE_URL npx playwright test"
]
```

---

## See also

- **[Package Capabilities](../concepts/package-capabilities.md)** — Understanding phases
- **[Venues: Host vs Container](../concepts/venues-host-vs-container.md)** — Where commands run
- **[CLI Commands](./cli-commands.md)** — Command reference
- **[Scaffold Test Package](../how-to-guides/scaffold-test-package.md)** — Generate a manifest

---

**Last updated:** 2025-08-09