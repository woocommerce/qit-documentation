---
description: "Complete reference for the qit.json configuration file. Covers all top-level sections: SUT (local, URL, wccom, wporg sources with optional build commands), environments (version pins, plugins, themes, volumes, php_extensions, envs, utilities), test_types with profiles (inline values or environment references, profile inheritance via extends), and groups (batch execution). Includes a real-world complete example for a payment gateway plugin, CLI override examples, configuration sharing via extends, naming/validation rules, and plugin installation formats (slug, URL, local path, detailed object)."
---

# The qit.json Configuration File

The `qit.json` file captures complex QIT commands as reusable, shareable configurations.

## Basic Structure

```json
{
  "$schema": "https://raw.githubusercontent.com/woocommerce/qit-cli/trunk/src/src/PreCommand/Schemas/qit-schema.json",
  "sut": {
    // What you're testing
  },
  "environments": {
    // Named environment configurations
  },
  "test_types": {
    // Test profiles organized by type
  },
  "groups": {
    // Batch execution definitions
  }
}
```

## System Under Test (SUT)

Define the plugin or theme being tested:

### Local Development

```json
"sut": {
  "type": "plugin",
  "slug": "my-plugin",
  "source": {
    "type": "local",
    "path": "./build",
    "build": "npm run build"  // Optional build command
  }
}
```

### From URL

```json
"sut": {
  "type": "plugin",
  "slug": "my-plugin", 
  "source": {
    "type": "url",
    "url": "https://example.com/my-plugin.zip"
  }
}
```

### From Marketplace

```json
"sut": {
  "type": "plugin",
  "slug": "my-plugin",
  "source": {
    "type": "wccom",
    "version": "stable"
  }
}
```

## Environments

Define reusable WordPress/PHP/WooCommerce combinations:

```json
"environments": {
  "staging": {
    "wp": "6.4",
    "woo": "8.5", 
    "php": "8.0",
    "plugins": [
      "woocommerce-subscriptions",
      {
        "slug": "stripe",
        "from": "wporg",
        "version": "3.0.0"
      }
    ]
  },
  "production": {
    "wp": "stable",
    "woo": "stable",
    "php": "8.2"
  },
  "bleeding-edge": {
    "wp": "nightly",
    "woo": "rc",
    "php": "8.3",
    "object_cache": true
  }
}
```

### Environment Options

| Option | Description | Example |
|--------|------------|---------|
| `wp` | WordPress version | `"6.4"`, `"stable"`, `"rc"` |
| `woo` | WooCommerce version | `"8.5"`, `"stable"`, `"nightly"` |
| `php` | PHP version (format: X.Y or X.Y.Z) | `"7.4"`, `"8.0"`, `"8.3.1"` |
| `plugins` | Additional plugins | See below |
| `themes` | Additional themes | Similar to plugins |
| `object_cache` | Enable Redis | `true`, `false` |
| `php_extensions` | PHP extensions | `["imagick", "redis"]` |
| `volumes` | Docker volume mappings | `["/local/path:/container/path"]` |
| `envs` | Environment variables | `{"WP_DEBUG": "true"}` |
| `utilities` | Utility packages for environment setup | `["./utilities/name", "vendor/name:version"]` |

### PHPStan Analysis Level

When configuring PHPStan test profiles, the `phpstan_level` must be an integer between 0 (lowest) and 9 (highest strictness):

```json
{
  "phpstan": {
    "basic": {
      "phpstan_level": 5     // Valid: 0-9
    },
    "strict": {
      "phpstan_level": 9
    }
  }
}
```

See [Validation Rules](validation-rules.md#phpstan-analysis-level) for details.

---

### Installing Plugins

Plugins can be specified in multiple ways depending on their source:

#### Simple Format (WordPress.org)

```json
"plugins": [
  "woocommerce-subscriptions",
  "contact-form-7"
]
```

#### Detailed Format with Source Options

```json
"plugins": [
  // Specific version from WordPress.org
  {
    "slug": "stripe",
    "from": "wporg",
    "version": "3.0.0"
  },

  // From WooCommerce.com (requires authentication)
  {
    "slug": "woocommerce-bookings",
    "from": "wccom",
    "version": "stable"
  },

  // From URL
  {
    "slug": "my-private-plugin",
    "from": "url",
    "url": "https://example.com/plugin.zip"
  },

  // From local directory
  {
    "slug": "my-dev-plugin",
    "from": "local",
    "path": "../my-plugin"
  },

  // From local zip file
  {
    "slug": "pre-release-plugin",
    "from": "local",
    "path": "../builds/plugin-v2.0.0.zip"
  }
]
```

#### Local Path Options

Local paths can be:
- **Relative**: Resolved relative to the qit.json file location
- **Absolute**: Used as-is
- **Directory**: Must contain the plugin's main PHP file
- **Zip file**: Will be extracted automatically

```json
"plugins": [
  // Relative path to directory
  {
    "slug": "my-plugin",
    "from": "local",
    "path": "./build/my-plugin"
  },

  // Relative path to zip
  {
    "slug": "my-plugin",
    "from": "local",
    "path": "../releases/my-plugin.zip"
  },

  // Absolute path
  {
    "slug": "my-plugin",
    "from": "local",
    "path": "/Users/developer/projects/my-plugin"
  }
]
```

### Understanding Plugin Sources: CLI vs Configuration vs SUT

There are three main ways to provide plugins to QIT, each serving different purposes:

#### 1. CLI Parameters (`--plugin`)

Use CLI parameters for quick overrides or one-off additions:

```bash
# Simple slug (infers from WordPress.org)
qit env:up --plugin=woocommerce

# Local path (directory or zip)
qit env:up --plugin=./my-plugin.zip
qit env:up --plugin=/absolute/path/to/plugin

# Explicit slug with path (recommended for local plugins)
qit env:up --plugin=my-plugin@./builds/my-plugin.zip

# Multiple plugins
qit env:up --plugin=woocommerce --plugin=./custom-plugin.zip
```

**When to use CLI parameters:**
- Quick testing with different plugin combinations
- Overriding configuration file settings
- One-time test runs
- CI/CD pipelines with dynamic plugin versions

**How path resolution works:**
- Relative paths (e.g., `./plugin`, `../builds/plugin.zip`) are resolved from current working directory
- Absolute paths are used as-is
- If no explicit slug is provided, QIT infers it from the path basename (with warnings)

#### 2. Configuration File (qit.json)

Use configuration files for consistent, repeatable test environments:

```json
{
  "environments": {
    "default": {
      "plugins": [
        "woocommerce",
        {
          "slug": "my-plugin",
          "from": "local",
          "path": "../my-plugin"
        }
      ]
    }
  }
}
```

**When to use configuration files:**
- Shared team configurations
- Consistent test environments across runs
- Multiple environment definitions (staging, production, etc.)
- Complex plugin setups with specific versions

**How path resolution works:**
- Relative paths are resolved relative to the qit.json file location
- Absolute paths are used as-is
- Slug must be explicitly specified in detailed format

#### 3. System Under Test (SUT)

Use SUT configuration for the plugin you're actively testing:

```json
{
  "sut": {
    "type": "plugin",
    "slug": "my-plugin",
    "source": {
      "type": "local",
      "path": "./build",
      "build": "npm run build"
    }
  }
}
```

**When to use SUT:**
- The primary plugin/theme being tested
- Automatically includes build steps
- Higher priority than other plugins
- Replaces the need for `--zip` CLI parameter

**Key differences:**
- SUT is installed first and has highest priority
- SUT can include build commands
- Only one SUT per configuration
- SUT is typically version-controlled with your project

#### Comparison Table

| Aspect | CLI `--plugin` | Configuration File | SUT |
|--------|---------------|-------------------|-----|
| **Use Case** | Quick overrides | Consistent environments | Primary test target |
| **Path Resolution** | From current directory | From qit.json location | From qit.json location |
| **Priority** | Overrides config | Base configuration | Highest priority |
| **Build Support** | No | No | Yes (optional) |
| **Multiple Allowed** | Yes | Yes | No (one SUT only) |
| **Best For** | CI/CD, quick tests | Team sharing | Your plugin under test |

#### Examples: Choosing the Right Approach

**Scenario 1: Testing your plugin with WooCommerce**
```json
{
  "sut": {
    "type": "plugin",
    "slug": "my-payment-gateway",
    "source": {
      "type": "local",
      "path": "./build"
    }
  },
  "environments": {
    "default": {
      "plugins": ["woocommerce"]
    }
  }
}
```

**Scenario 2: Quick test with a pre-release plugin**
```bash
qit env:up --plugin=./downloads/pre-release-plugin.zip
```

**Scenario 3: Team-wide compatibility testing**
```json
{
  "environments": {
    "default": {
      "plugins": [
        "woocommerce",
        "woocommerce-subscriptions",
        {
          "slug": "internal-plugin",
          "from": "local",
          "path": "../internal-plugins/payment-gateway"
        }
      ]
    }
  }
}
```

## Test Types and Profiles

Organize test configurations by type. Profiles can include version settings directly or reference a named environment:

```json
"test_types": {
  "e2e": {
    "smoke": {
      "wp": "stable",
      "woo": "stable",
      "php": "8.2",
      "test_packages": ["./tests/smoke"]
    },
    "full": {
      "environment": "production",
      "test_packages": [
        "./tests",
        "woocommerce/checkout-tests:8.5"
      ]
    },
    "compatibility": {
      "environment": "production",
      "test_packages": [
        "./tests",
        "stripe/gateway-tests:3.0",
        "paypal/checkout-tests:latest"
      ]
    }
  },
  "phpstan": {
    "strict": {
      "phpstan_level": 9
    }
  }
}
```

The "smoke" profile uses inline values (simple, self-contained). The "full" and "compatibility" profiles reference the "production" environment (avoids duplicating the same versions).

### Precedence

When the same setting is defined in multiple places:

| Source | Priority |
|---|---|
| CLI flags (`--php=8.3`) | Highest |
| Profile inline values (`"php": "8.2"`) | High |
| Referenced environment | Medium |
| Framework defaults | Lowest |
```

### Profile Inheritance

Profiles can extend others:

```json
"test_types": {
  "e2e": {
    "base": {
      "environment": "production",
      "test_packages": ["./tests/core"]
    },
    "extended": {
      "extends": "base",
      "test_packages": [
        "./tests/core",
        "./tests/advanced"
      ]
    }
  }
}
```

## Groups

Batch multiple test profiles:

```json
"groups": {
  "pre-release": {
    "e2e": ["smoke", "full"],
    "phpstan": ["strict"]
  },
  "nightly": {
    "e2e": ["smoke", "full", "compatibility"],
    "security": ["scan"],
    "phpstan": ["strict"]
  },
  "quick": {
    "e2e": ["smoke"]
  }
}
```

Run a group:
```bash
qit run:group pre-release
```

## Complete Example

Here's a real-world `qit.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/woocommerce/qit-cli/trunk/src/src/PreCommand/Schemas/qit-schema.json",
  
  "sut": {
    "type": "plugin",
    "slug": "my-payment-gateway",
    "source": {
      "type": "local",
      "path": "./dist",
      "build": "npm run build"
    }
  },
  
  "environments": {
    "minimum": {
      "wp": "6.0",
      "woo": "8.0",
      "php": "7.4"
    },
    "recommended": {
      "wp": "6.4",
      "woo": "8.5",
      "php": "8.0",
      "plugins": ["woocommerce-subscriptions"]
    },
    "latest": {
      "wp": "rc",
      "woo": "rc",
      "php": "8.3"
    }
  },
  
  "test_types": {
    "e2e": {
      "smoke": {
        "environment": "recommended",
        "test_packages": ["./tests/critical"]
      },
      "payments": {
        "environment": "recommended",
        "test_packages": [
          "./tests/payments",
          "stripe/gateway-tests:3.0",
          "paypal/checkout-tests:2.0"
        ]
      },
      "subscriptions": {
        "environment": "recommended",
        "test_packages": [
          "./tests/subscriptions",
          "woocommerce-subscriptions/renewal-tests:5.5"
        ]
      },
      "compat-minimum": {
        "environment": "minimum",
        "test_packages": ["./tests/smoke"]
      },
      "compat-latest": {
        "environment": "latest",
        "test_packages": ["./tests/smoke"]
      }
    },
    "security": {
      "scan": {}
    }
  },
  
  "groups": {
    "ci-quick": {
      "e2e": ["smoke"],
      "security": ["scan"]
    },
    "ci-full": {
      "e2e": ["smoke", "payments", "subscriptions"],
      "security": ["scan"]
    },
    "release": {
      "e2e": ["compatibility-matrix"],
      "security": ["scan"]
    }
  }
}
```

## Using the Configuration

### Run Specific Profile

```bash
# Run the 'payments' profile
qit run:e2e --profile=payments

# Override environment
qit run:e2e --profile=payments --environment=latest
```

### Run Groups

```bash
# Run all tests in 'ci-quick' group
qit run:group ci-quick

# Run release tests
qit run:group release
```

### Override Configuration

CLI parameters override configuration:

```bash
# Use profile but override PHP version
qit run:e2e --profile=smoke --php=8.2

# Add extra test package
qit run:e2e --profile=smoke --test-package=./extra-tests
```

## Sharing Configurations

### Team Repository

Commit `qit.json` to your repository:
```bash
git add qit.json
git commit -m "Add QIT test configuration"
```

Team members can now:
```bash
git pull
qit run:e2e --profile=payments  # Same tests for everyone
```

### Configuration Templates

Share templates for common scenarios:

```json
// payment-gateway-template.json
{
  "$schema": "https://raw.githubusercontent.com/woocommerce/qit-cli/trunk/src/src/PreCommand/Schemas/qit-schema.json",
  "extends": "https://example.com/base-config.json",
  // ... customizations
}
```

## Validation and Naming Rules

### Naming Constraints

All names (environments, profiles, groups, slugs) must follow these rules:
- **Only** alphanumeric characters, hyphens (`-`), and underscores (`_`)
- No spaces or special characters allowed
- Pattern: `^[a-zA-Z0-9_-]+$`

```json
// ✅ Valid names
{
  "environments": {
    "staging-env": {},
    "test_server_2": {},
    "prod123": {}
  }
}

// ❌ Invalid names
{
  "environments": {
    "staging env": {},      // Space not allowed
    "test.server": {},      // Period not allowed
    "prod@home": {}         // @ not allowed
  }
}
```

See [Validation Rules](validation-rules.md) for complete validation reference.

---

## Best Practices

### 1. Use Descriptive Names

```json
// Good
"profiles": {
  "checkout-with-subscriptions": { },
  "multi-currency-payments": { }
}

// Bad
"profiles": {
  "test1": { },
  "new": { }
}
```

### 2. Document Purposes

```json
{
  "_comment": "Configuration for payment gateway testing",
  "test_types": {
    "e2e": {
      "payments": {
        "_comment": "Tests all payment flows with major gateways",
        // ...
      }
    }
  }
}
```

### 3. Keep Environments Minimal

Define only what differs from defaults:

```json
// Good - only essentials
"staging": {
  "wp": "6.4",
  "woo": "8.5"
}

// Avoid - too specific
"staging": {
  "wp": "6.4.1",
  "woo": "8.5.2",
  "php": "8.0.28",
  "timezone": "UTC",
  "locale": "en_US"
}
```

## Related Topics

- [Test Profiles](profiles.md) - Deep dive into profile configuration
- [Environments](environments.md) - Environment configuration details