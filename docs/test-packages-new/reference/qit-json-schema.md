# QIT Configuration Schema (qit.json)

The `qit.json` file is the central configuration for Test Packages, defining which packages to run, their order, and environment settings.

## File Location

QIT looks for configuration files in this order:
1. File specified with `--config` flag
2. `qit.json` in current directory
3. Default configuration (no config file)

## Basic Structure

```json
{
  "test_packages": [
    "./packages/setup",
    "./packages/checkout-tests",
    "./packages/payment-tests"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "latest"
  }
}
```

## Complete Schema

```json
{
  "$schema": "https://qit.woo.com/json-schema/qit-config",
  "test_packages": ["array of package paths"],
  "environment": {
    "php": "version string",
    "wordpress": "version string",
    "woocommerce": "version string",
    "plugins": {
      "plugin-slug": "version"
    },
    "themes": {
      "theme-slug": "version"
    }
  },
  "sut": {
    "slug": "extension-slug",
    "version": "version or path"
  }
}
```

## Configuration Options

### test_packages
**Type:** `string[]`

List of paths to test packages, relative to the config file.

```json
{
  "test_packages": [
    "./utilities/setup",
    "./tests/smoke",
    "./tests/regression",
    "./utilities/cleanup"
  ]
}
```

**Key points:**
- Paths are relative to the config file
- Execution order follows array order
- Mix test and utility packages
- At least one test package required for `run:e2e`

### environment
**Type:** `object`

Environment configuration for test execution.

```json
{
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "latest"
  }
}
```

**Version formats:**
- Specific: `"8.2"`, `"6.4"`, `"8.5.1"`
- Latest stable: `"latest"`
- Release candidate: `"rc"`
- Nightly: `"nightly"`
- Beta: `"beta"`

### environment.plugins
**Type:** `object`

Additional plugins to install, with versions.

```json
{
  "environment": {
    "plugins": {
      "woocommerce-subscriptions": "5.5.0",
      "woocommerce-bookings": "latest"
    }
  }
}
```

### environment.themes
**Type:** `object`

Additional themes to install, with versions.

```json
{
  "environment": {
    "themes": {
      "storefront": "4.5.0",
      "twentytwentyfour": "latest"
    }
  }
}
```

### sut (System Under Test)
**Type:** `object`

Specify the extension under test.

```json
{
  "sut": {
    "slug": "my-extension",
    "version": "1.2.3"
  }
}
```

For local development:
```json
{
  "sut": {
    "slug": "my-extension",
    "version": "./path/to/extension.zip"
  }
}
```

---

## Package Discovery

QIT discovers packages by:

1. Reading paths from `test_packages`
2. Looking for `manifest.json` in each path
3. Validating each manifest

Example structure:
```
my-tests/
├── qit.json
├── packages/
│   ├── setup/
│   │   └── manifest.json
│   ├── checkout/
│   │   └── manifest.json
│   └── payment/
│       └── manifest.json
```

---

## Environment Variables

Reference environment variables in configuration:

```json
{
  "environment": {
    "php": "${PHP_VERSION:-8.2}",
    "wordpress": "${WP_VERSION:-latest}"
  },
  "test_packages": [
    "${TEST_PACKAGE_DIR:-./packages}/checkout"
  ]
}
```

---

## Command Line Overrides

Configuration file options can be overridden via command line:

```bash
# Override PHP version
qit run:e2e woocommerce --config=qit.json --php=8.2

# Override WordPress version
qit run:e2e woocommerce --config=qit.json --wordpress=6.4

# Add additional plugins
qit run:e2e woocommerce --config=qit.json --plugin=helper:1.0.0

# Force verbose output
qit run:e2e woocommerce --config=qit.json --verbose
```

Priority order:
1. Command line flags
2. Environment variables
3. Configuration file
4. Defaults

---

## Validation

QIT validates configuration files before execution:

```bash
# Validate configuration
qit validate:e2e --config=qit.json
```

Common validation errors:
- Missing required fields
- Invalid version formats
- Non-existent package paths
- Invalid SUT configuration

---

## Best Practices

### 1. Keep Paths Relative

```json
{
  "test_packages": [
    "./packages/checkout",     // Good: relative path
    "/home/user/tests/payment" // Bad: absolute path
  ]
}
```

### 2. Document Your Configuration

```json
{
  "$schema": "https://qit.woo.com/json-schema/qit-config",
  "_comment": "E2E test configuration for WooCommerce Payments",
  "test_packages": [
    "./utilities/setup",        
    "./tests/onboarding",      
    "./tests/payment-methods", 
    "./tests/checkout"         
  ]
}
```

### 3. Version Lock for Reproducibility

```json
{
  "environment": {
    "php": "8.2.13",
    "wordpress": "6.4.2",
    "woocommerce": "8.5.1"
  }
}
```

### 4. Separate Development and CI Configs

```
configs/
├── qit.dev.json       # Development with latest versions
├── qit.ci.json        # CI with stable versions
└── qit.release.json   # Full test suite for releases
```

---

## Examples

### Minimal Configuration

```json
{
  "test_packages": ["./tests"]
}
```

### Development Configuration

```json
{
  "test_packages": [
    "./utilities/dev-setup",
    "./tests/current-feature"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "nightly"
  }
}
```

### Production Configuration

```json
{
  "$schema": "https://qit.woo.com/json-schema/qit-config",
  "test_packages": [
    "./utilities/setup",
    "./tests/smoke",
    "./tests/checkout",
    "./tests/payment",
    "./tests/shipping",
    "./tests/tax",
    "./utilities/cleanup"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "6.4.2",
    "woocommerce": "8.5.1",
    "plugins": {
      "woocommerce-subscriptions": "5.5.0",
      "woocommerce-bookings": "1.15.0"
    }
  },
  "sut": {
    "slug": "woocommerce-payments",
    "version": "6.9.2"
  }
}
```

### Multi-Extension Testing

```json
{
  "test_packages": [
    "./tests/integration",
    "./tests/compatibility"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "latest",
    "plugins": {
      "payment-gateway": "./builds/payment-gateway.zip",
      "shipping-method": "./builds/shipping-method.zip"
    }
  },
  "sut": {
    "slug": "my-extension",
    "version": "./builds/my-extension.zip"
  }
}
```

### Utility-Only Configuration

```json
{
  "test_packages": [
    "./utilities/disable-onboarding",
    "./utilities/create-products",
    "./utilities/configure-taxes"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "latest"
  }
}
```

---

## Migration from Legacy Format

If migrating from older QIT configurations:

### Old Format
```json
{
  "tests": [
    {"path": "./tests/checkout"},
    {"path": "./tests/payment"}
  ],
  "php_version": "8.0"
}
```

### New Format
```json
{
  "test_packages": [
    "./tests/checkout",
    "./tests/payment"
  ],
  "environment": {
    "php": "8.0"
  }
}
```

---

## See also

- **[CLI Commands](./cli-commands.md)** — Using the --config flag
- **[Manifest Schema](./manifest-schema.md)** — Package manifest structure
- **[Environment Variables](./environment-variables.md)** — Available QIT variables
- **[Quickstart](../start-here/quickstart-scaffold-run-verify.md)** — Getting started with QIT

---

**Last updated:** 2025-08-09