# QIT Configuration (qit-config.json)

The `qit-config.json` file is the central configuration for Test Packages, defining which packages to run, their order, environment settings, and test profiles.

## File Location

QIT looks for configuration files in this order:
1. File specified with `--config` flag
2. `qit-config.json` in current directory
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
  "$schema": "https://qit.io/schema/qit-config.json",
  "test_packages": ["array of package paths"],
  "environments": {
    "environment_name": {
      "php": "version string",
      "wordpress": "version string",
      "woocommerce": "version string",
      "plugins": ["array of plugins"],
      "themes": ["array of themes"]
    }
  },
  "test_types": {
    "e2e": {
      "profile_name": {
        "test_packages": ["array"],
        "extends": "base_profile"
      }
    }
  },
  "sut": {
    "from": "local|wporg|url",
    "path": "path for local",
    "url": "url for remote"
  }
}
```

## Configuration Options

### test_packages

Test packages can be defined at the root level or within test profiles:

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

Or within profiles:

```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./tests/smoke"
        ]
      }
    }
  }
}
```

**Key points:**
- Paths are relative to the config file
- Execution order matters
- Mix test and utility packages
- At least one test package required for `run:e2e`

### environments

Define named environment configurations:

```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wordpress": "latest",
      "woocommerce": "latest"
    },
    "php74": {
      "php": "7.4",
      "wordpress": "6.0",
      "woocommerce": "7.0"
    },
    "bleeding-edge": {
      "php": "8.3",
      "wordpress": "nightly",
      "woocommerce": "nightly"
    }
  }
}
```

Use with `--environment` flag:
```bash
qit run:e2e woocommerce --environment=php74
```

**Version formats:**
- Specific: `"8.2"`, `"6.4"`, `"8.5.1"`
- Latest stable: `"latest"`
- Release candidate: `"rc"`
- Nightly: `"nightly"`
- Beta: `"beta"`

### Test Profile Options

Options can be set within test profiles:

```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": ["./tests/smoke"],
        "environment": "default",
        "extends": "base"
      }
    }
  }
}
```

Note: Execution options like `fail_fast`, `verbose`, etc. are controlled via CLI flags, not the config file.

### sut (System Under Test)

Specify the extension under test:

```json
{
  "sut": {
    "from": "local",
    "path": "./my-extension"
  }
}
```

Or from WordPress.org:

```json
{
  "sut": {
    "from": "wporg",
    "slug": "woocommerce",
    "version": "latest"
  }
}
```

Or from URL:

```json
{
  "sut": {
    "from": "url",
    "url": "https://example.com/plugin.zip"
  }
}
```

## Test Profiles

Define multiple test configurations under test types:

```json
{
  "test_types": {
    "e2e": {
      "smoke": {
        "test_packages": [
          "./tests/smoke"
        ]
      },
      "full": {
        "test_packages": [
          "./utilities/setup",
          "./tests/smoke",
          "./tests/checkout",
          "./tests/payment",
          "./tests/shipping",
          "./utilities/cleanup"
        ]
      },
      "compatibility": {
        "test_packages": [
          "./tests/basic"
        ],
        "extends": "smoke"
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

The `default` profile is used when no `--profile` is specified:

```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": ["./tests/smoke"]
      },
      "full": {
        "test_packages": ["./tests/smoke", "./tests/checkout"]
      }
    }
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
  "test_types": {
    "e2e": {
      "development": {
        "test_packages": [
          "./utilities/dev-setup",
          "./tests/basic"
        ]
      },
      "ci": {
        "test_packages": [
          "./tests/smoke",
          "./tests/critical"
        ]
      }
    }
  }
}
```

### By PHP Version

```json
{
  "environments": {
    "php74": { "php": "7.4" },
    "php80": { "php": "8.0" },
    "php82": { "php": "8.2" }
  },
  "test_types": {
    "e2e": {
      "php74-compat": {
        "test_packages": ["./tests/php74-compatible"],
        "environment": "php74"
      },
      "php80-full": {
        "test_packages": ["./tests/all"],
        "environment": "php80"
      },
      "php82-features": {
        "test_packages": ["./tests/all", "./tests/php82-features"],
        "environment": "php82"
      }
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
qit run:e2e woocommerce --config=qit-config.json --php=8.2

# Override WordPress version
qit run:e2e woocommerce --config=qit-config.json --wordpress=6.4

# Use different profile
qit run:e2e woocommerce --config=qit-config.json --profile=full

# Force verbose output
qit run:e2e woocommerce --config=qit-config.json --verbose
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
qit validate-config qit-config.json
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
  "$schema": "https://qit.io/schema/qit-config.json",
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

### New Format (qit-config.json)

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
qit migrate-config qit.yml --output=qit-config.json
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
  }
}
```

### Production Configuration

```json
{
  "profiles": {
    "smoke": {
      "test_packages": ["./tests/smoke"]
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