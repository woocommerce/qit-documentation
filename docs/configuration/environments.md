# Environment Configuration

Environments define reusable WordPress, WooCommerce, and PHP version combinations.

## Overview

Instead of specifying versions repeatedly:
```bash
# Repetitive
qit run:e2e --wp=6.4 --woo=8.5 --php=8.0
qit run:security --wp=6.4 --woo=8.5 --php=8.0
```

Define once and reuse:
```json
{
  "environments": {
    "production": {
      "wp": "6.4",
      "woo": "8.5",
      "php": "8.0"
    }
  }
}
```

## Environment Properties

### Basic Environment

```json
{
  "staging": {
    "wp": "6.4",
    "woo": "8.5",
    "php": "8.0"
  }
}
```

### Complete Environment

```json
{
  "production": {
    "wp": "stable",
    "woo": "stable",
    "php": "8.2",
    "plugins": [
      "woocommerce-subscriptions",
      {
        "slug": "stripe",
        "from": "wporg",
        "version": "3.0.0"
      }
    ],
    "themes": ["storefront"],
    "object_cache": true,
    "php_extensions": ["imagick", "redis"],
    "volumes": [
      "/local/path:/wp-content/plugins/my-plugin"
    ],
    "envs": {
      "WP_DEBUG": "true",
      "SCRIPT_DEBUG": "true"
    },
    "utilities": [
      "./utilities/disable-onboarding",
      "woocommerce/sample-data:latest"
    ]
  }
}
```

## Environment Inheritance

Environments can extend other environments to reduce duplication:

```json
{
  "environments": {
    "base": {
      "wp": "stable",
      "woo": "stable",
      "php": "8.0",
      "plugins": ["woocommerce"]
    },
    "base-with-cache": {
      "extends": "base",
      "object_cache": true
    },
    "staging": {
      "extends": "base",
      "wp": "rc",
      "plugins": [
        "woocommerce",
        "jetpack"
      ]
    }
  }
}
```

**How it works:**
- Child inherits all properties from parent
- Child properties override parent properties
- Arrays (plugins, themes, volumes, php_extensions) are merged and deduplicated
- Can chain inheritance: `c extends b extends a`

**Naming Rules:**
- Only alphanumeric, hyphens (`-`), underscores (`_`)
- See [Validation Rules](validation-rules.md#naming-constraints)

---

## Common Environment Patterns

### Minimum Requirements

```json
{
  "minimum": {
    "wp": "6.0",
    "woo": "8.0", 
    "php": "7.4"
  }
}
```

### Recommended Setup

```json
{
  "recommended": {
    "wp": "stable",
    "woo": "stable",
    "php": "8.0"
  }
}
```

### Bleeding Edge

```json
{
  "bleeding-edge": {
    "wp": "nightly",
    "woo": "rc",
    "php": "8.3"
  }
}
```

## Advanced Environment Options

### Volume Mappings

Map local directories into the WordPress environment for development:

```json
{
  "development": {
    "wp": "stable",
    "volumes": [
      "./build/my-plugin:/var/www/html/wp-content/plugins/my-plugin",
      "./themes/my-theme:/var/www/html/wp-content/themes/my-theme"
    ]
  }
}
```

Volume format: `local-path:container-path`

### Utility Packages

The `utilities` property specifies **utility packages** that provide environment setup and configuration without running tests.

**What are utility packages:**
- Packages WITHOUT a `run` phase (no test execution)
- Can be local (`./utilities/name`) or from registry (`vendor/name:version`)
- Run their `globalSetup` phase to configure the environment
- Changes persist to database snapshot (the baseline for all tests)

**Example:**
```json
{
  "testing": {
    "wp": "stable",
    "woo": "stable",
    "utilities": [
      "./utilities/disable-onboarding",          // Local utility
      "woocommerce/sample-data:latest",          // Registry utility (latest version)
      "vendor/payment-setup:1.2.0"               // Registry utility (specific version)
    ]
  }
}
```

**Common use cases:**
- Dismiss onboarding wizards (WooCommerce, etc.)
- Configure payment gateways with API keys
- Set plugin defaults and preferences
- Import sample/test data (products, orders, customers)
- Configure integrations with external services

**Local vs Registry Utilities:**
- **Local utilities**: `./utilities/name` - Stored in your project
- **Registry utilities**: `vendor/name:version` - Published to QIT registry, automatically downloaded and cached

**Why attach to environments:**
- Every test using that environment automatically gets the utility setup
- Clean separation: environment configuration vs test logic
- Utilities are reusable across projects

See [Utility Packages](../test-packages/utility-packages.md) for detailed documentation on creating, publishing, and using utility packages.

### Environment Variables

Pass custom environment variables to WordPress:

```json
{
  "debug": {
    "wp": "stable",
    "envs": {
      "WP_DEBUG": "true",           // ⚠️ Must be string, not boolean
      "WP_DEBUG_LOG": "true",       // ⚠️ Use "true", not true
      "SCRIPT_DEBUG": "true",       // ⚠️ Quote all values
      "MY_CUSTOM_VAR": "123"        // ⚠️ Numbers must be quoted too
    }
  }
}
```

**Important:** All environment variable values MUST be strings. Use `"true"` not `true`, `"123"` not `123`.

See [Validation Rules](validation-rules.md#environment-variables) for details.

## Using Environments

With profiles:
```json
{
  "test_types": {
    "e2e": {
      "smoke": {
        "environment": "production"
      }
    }
  }
}
```

Or directly via CLI:
```bash
qit run:e2e --environment=production
```

## Related Topics

- [Test Profiles](profiles.md) - Using environments in profiles
- [qit.json Structure](qit-json.md) - Complete configuration