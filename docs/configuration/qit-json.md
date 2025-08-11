# The qit.json Configuration File

The `qit.json` file captures complex QIT commands as reusable, shareable configurations.

## Basic Structure

```json
{
  "$schema": "https://qit.woo.com/json-schema/qit",
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
| `php` | PHP version | `"7.4"`, `"8.0"`, `"8.3"` |
| `plugins` | Additional plugins | See below |
| `themes` | Additional themes | Similar to plugins |
| `object_cache` | Enable Redis | `true`, `false` |
| `php_extensions` | PHP extensions | `["imagick", "redis"]` |

### Installing Plugins

```json
"plugins": [
  // Simple: from WordPress.org
  "woocommerce-subscriptions",
  
  // Detailed: specific source and version
  {
    "slug": "stripe",
    "from": "wporg",
    "version": "3.0.0"
  },
  {
    "slug": "my-private-plugin",
    "from": "url",
    "url": "https://example.com/plugin.zip"
  },
  {
    "slug": "local-plugin",
    "from": "local",
    "path": "../local-plugin"
  }
]
```

## Test Types and Profiles

Organize test configurations by type:

```json
"test_types": {
  "e2e": {
    "smoke": {
      "environment": "staging",
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
  "$schema": "https://qit.woo.com/json-schema/qit",
  
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
      "compatibility-matrix": {
        "test_packages": ["./tests/smoke"],
        "matrix": {
          "environments": ["minimum", "recommended", "latest"]
        }
      }
    },
    "security": {
      "scan": {
        "severity": "medium"
      }
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

## Validation

Validate your configuration:

```bash
qit config:validate

✓ Configuration valid
  - 3 environments defined
  - 4 test profiles defined
  - 3 groups defined
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
  "$schema": "https://qit.woo.com/json-schema/qit",
  "extends": "https://example.com/base-config.json",
  // ... customizations
}
```

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