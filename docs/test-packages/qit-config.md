# QIT Configuration (qit.json)

The `qit.json` file is the central configuration for Test Packages, defining which packages to run, their order, environment settings, and test profiles.

## File Location

QIT looks for configuration files in this order:
1. File specified with `--config` flag
2. `qit.json` in current directory
3. `qit-config.json` in current directory
4. Default configuration

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
  "$schema": "https://qit.io/schema/qit.json",
  "test_packages": ["array of package paths"],
  "environment": {
    "php": "version string",
    "wordpress": "version string",
    "woocommerce": "version string",
    "features": ["array of features"]
  },
  "profiles": {
    "profile_name": {
      "test_packages": ["array"],
      "environment": {}
    }
  },
  "options": {
    "fail_fast": "boolean",
    "verbose": "boolean",
    "parallel": "boolean",
    "timeout": "number"
  },
  "extensions": {
    "sut": "path or url",
    "additional": ["array of paths or urls"]
  }
}
```

## Configuration Options

### test_packages

An ordered array of package paths to execute:

```json
{
  "test_packages": [
    "./utilities/setup",           // Utility package (no tests)
    "./tests/smoke",              // Test package
    "./tests/regression",         // Test package
    "./utilities/cleanup"         // Utility package
  ]
}
```

**Key points:**
- Paths are relative to the config file
- Execution order matters
- Mix test and utility packages
- At least one test package required for `run:e2e`

### environment

Specify versions and features:

```json
{
  "environment": {
    "php": "8.2",              // Specific version
    "wordpress": "latest",      // Latest stable
    "woocommerce": "nightly",   // Nightly build
    "features": [
      "hpos",                  // High Performance Order Storage
      "cart-checkout-blocks"   // Blocks-based checkout
    ]
  }
}
```

**Version formats:**
- Specific: `"8.2"`, `"6.4"`, `"8.5.1"`
- Latest stable: `"latest"`
- Release candidate: `"rc"`
- Nightly: `"nightly"`
- Beta: `"beta"`

### options

Control execution behavior:

```json
{
  "options": {
    "fail_fast": true,        // Stop on first failure
    "verbose": false,         // Suppress output in CI
    "parallel": false,        // Run packages in parallel
    "timeout": 3600000,       // Global timeout in ms
    "retry": 2,              // Retry failed packages
    "skip_cleanup": false    // Keep environment after tests
  }
}
```

### extensions

Specify the extension under test and additional extensions:

```json
{
  "extensions": {
    "sut": "./my-extension.zip",
    "additional": [
      "./helper-plugin.zip",
      "https://example.com/plugin.zip"
    ]
  }
}
```

## Test Profiles

Define multiple test configurations in one file:

```json
{
  "profiles": {
    "smoke": {
      "test_packages": [
        "./tests/smoke"
      ],
      "environment": {
        "php": "8.2",
        "wordpress": "latest"
      }
    },
    "full": {
      "test_packages": [
        "./utilities/setup",
        "./tests/smoke",
        "./tests/checkout",
        "./tests/payment",
        "./tests/shipping",
        "./utilities/cleanup"
      ],
      "environment": {
        "php": "8.0",
        "wordpress": "6.4"
      }
    },
    "compatibility": {
      "test_packages": [
        "./tests/basic"
      ],
      "environment": {
        "php": "7.4",
        "wordpress": "6.0",
        "woocommerce": "7.0"
      }
    }
  }
}
```

### Using Profiles

Run a specific profile:

```bash
# Run smoke tests
qit run:e2e woocommerce --profile=smoke

# Run full test suite
qit run:e2e woocommerce --profile=full

# Test compatibility
qit run:e2e woocommerce --profile=compatibility
```

### Default Profile

Set a default profile:

```json
{
  "default_profile": "smoke",
  "profiles": {
    "smoke": { /* ... */ },
    "full": { /* ... */ }
  }
}
```

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

## Conditional Configuration

### By Environment

```json
{
  "test_packages": [
    "./tests/basic"
  ],
  "profiles": {
    "development": {
      "test_packages": [
        "./utilities/dev-setup",
        "./tests/basic"
      ],
      "options": {
        "verbose": true,
        "fail_fast": false
      }
    },
    "ci": {
      "test_packages": [
        "./tests/smoke",
        "./tests/critical"
      ],
      "options": {
        "verbose": false,
        "fail_fast": true
      }
    }
  }
}
```

### By PHP Version

```json
{
  "profiles": {
    "php74": {
      "environment": { "php": "7.4" },
      "test_packages": ["./tests/php74-compatible"]
    },
    "php80": {
      "environment": { "php": "8.0" },
      "test_packages": ["./tests/all"]
    },
    "php82": {
      "environment": { "php": "8.2" },
      "test_packages": ["./tests/all", "./tests/php82-features"]
    }
  }
}
```

## Package Discovery

### Glob Patterns

Use glob patterns to discover packages:

```json
{
  "test_packages": [
    "./packages/utilities/*",
    "./packages/tests/**/*",
    "!./packages/tests/experimental/*"
  ]
}
```

### Dynamic Loading

Load packages from directory structure:

```json
{
  "test_packages": [
    {
      "pattern": "./packages/*/",
      "filter": "has:manifest.json",
      "order": "alphabetical"
    }
  ]
}
```

## Advanced Configurations

### Multi-Extension Testing

```json
{
  "extensions": {
    "sut": "./my-extension.zip",
    "additional": [
      "./payment-gateway.zip",
      "./shipping-method.zip"
    ]
  },
  "test_packages": [
    "./tests/integration",
    "./tests/compatibility"
  ]
}
```

### Matrix Testing

```json
{
  "matrix": {
    "php": ["7.4", "8.0", "8.2"],
    "wordpress": ["6.3", "6.4", "latest"],
    "woocommerce": ["8.4", "8.5", "latest"]
  },
  "test_packages": ["./tests/compatibility"]
}
```

### Parallel Execution Groups

```json
{
  "execution_groups": [
    {
      "name": "Critical Path",
      "parallel": false,
      "packages": [
        "./utilities/setup",
        "./tests/checkout"
      ]
    },
    {
      "name": "Extended Tests",
      "parallel": true,
      "packages": [
        "./tests/payment",
        "./tests/shipping",
        "./tests/tax"
      ]
    }
  ]
}
```

## Command Line Overrides

Configuration file options can be overridden via command line:

```bash
# Override PHP version
qit run:e2e woocommerce --config=qit.json --php=8.2

# Override WordPress version
qit run:e2e woocommerce --config=qit.json --wordpress=6.4

# Use different profile
qit run:e2e woocommerce --config=qit.json --profile=full

# Force verbose output
qit run:e2e woocommerce --config=qit.json --verbose
```

Priority order:
1. Command line flags
2. Environment variables
3. Configuration file
4. Defaults

## Validation

QIT validates configuration files before execution:

```bash
# Validate configuration
qit validate-config qit.json
```

Common validation errors:
- Missing required fields
- Invalid version formats
- Non-existent package paths
- Circular dependencies
- Invalid profile references

## Best Practices

### 1. Use Profiles for Different Scenarios

```json
{
  "profiles": {
    "quick": {
      "test_packages": ["./tests/smoke"]
    },
    "pr": {
      "test_packages": ["./tests/smoke", "./tests/critical"]
    },
    "release": {
      "test_packages": ["./utilities/setup", "./tests/**/*", "./utilities/cleanup"]
    }
  }
}
```

### 2. Keep Paths Relative

```json
{
  "test_packages": [
    "./packages/checkout",     // Good: relative path
    "/home/user/tests/payment" // Bad: absolute path
  ]
}
```

### 3. Document Your Configuration

```json
{
  "$schema": "https://qit.io/schema/qit.json",
  "description": "E2E test configuration for WooCommerce Payments",
  "test_packages": [
    "./utilities/setup",        // Sets up test environment
    "./tests/onboarding",      // Tests merchant onboarding
    "./tests/payment-methods", // Tests payment method CRUD
    "./tests/checkout"         // Tests checkout with payments
  ]
}
```

### 4. Version Lock for Reproducibility

```json
{
  "environment": {
    "php": "8.2.13",
    "wordpress": "6.4.2",
    "woocommerce": "8.5.1"
  }
}
```

### 5. Separate Development and CI Configs

```
configs/
├── qit.dev.json       # Development with verbose output
├── qit.ci.json        # CI with fail-fast
└── qit.release.json   # Full test suite for releases
```

## Migration from Legacy Format

### Old Format (qit.yml)

```yaml
tests:
  - path: ./tests/checkout
  - path: ./tests/payment
environment:
  php: 8.0
```

### New Format (qit.json)

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

### Migration Tool

```bash
# Convert old format to new
qit migrate-config qit.yml --output=qit.json
```

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
  },
  "options": {
    "verbose": true,
    "fail_fast": false
  }
}
```

### Production Configuration

```json
{
  "profiles": {
    "smoke": {
      "test_packages": ["./tests/smoke"],
      "options": { "fail_fast": true }
    },
    "regression": {
      "test_packages": [
        "./utilities/setup",
        "./tests/checkout",
        "./tests/payment",
        "./tests/shipping",
        "./tests/tax",
        "./utilities/cleanup"
      ]
    },
    "performance": {
      "test_packages": ["./tests/performance"],
      "options": { "timeout": 7200000 }
    }
  },
  "default_profile": "smoke"
}
```