# Test Profiles

Test Profiles allow you to define multiple test configurations within a single `qit.json` file, enabling different test scenarios without maintaining multiple configuration files.

## What are Test Profiles?

Test Profiles are named configurations that specify:
- Which test packages to run
- Environment settings (PHP, WordPress, WooCommerce versions)
- Execution options (timeouts, parallelization, verbosity)
- Extension configurations

## Basic Usage

### Defining Profiles

In `qit.json`:

```json
{
  "profiles": {
    "smoke": {
      "test_packages": [
        "./tests/critical-path"
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
        "wordpress": "6.4",
        "woocommerce": "8.5"
      }
    }
  }
}
```

### Running Profiles

```bash
# Run smoke profile
qit run:e2e woocommerce --profile=smoke

# Run full profile
qit run:e2e woocommerce --profile=full

# Profile with config file
qit run:e2e woocommerce --config=qit.json --profile=regression
```

## Profile Structure

### Complete Profile Schema

```json
{
  "profile_name": {
    "description": "Profile description",
    "test_packages": ["array of packages"],
    "environment": {
      "php": "version",
      "wordpress": "version",
      "woocommerce": "version",
      "features": ["features"]
    },
    "options": {
      "fail_fast": "boolean",
      "verbose": "boolean",
      "timeout": "number",
      "parallel": "boolean"
    },
    "extensions": {
      "sut": "path",
      "additional": ["paths"]
    },
    "requires": {
      "secrets": ["required secrets"]
    }
  }
}
```

## Common Profile Patterns

### Development Profiles

```json
{
  "profiles": {
    "dev": {
      "description": "Local development testing",
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
        "fail_fast": false,
        "skip_cleanup": true
      }
    },
    "dev-quick": {
      "description": "Quick smoke test during development",
      "test_packages": [
        "./tests/smoke"
      ],
      "options": {
        "verbose": true,
        "timeout": 300000
      }
    }
  }
}
```

### CI/CD Profiles

```json
{
  "profiles": {
    "pr": {
      "description": "Pull request validation",
      "test_packages": [
        "./tests/smoke",
        "./tests/critical"
      ],
      "options": {
        "fail_fast": true,
        "verbose": false
      }
    },
    "nightly": {
      "description": "Nightly regression tests",
      "test_packages": [
        "./utilities/setup",
        "./tests/**/*",
        "./utilities/cleanup"
      ],
      "environment": {
        "woocommerce": "nightly"
      }
    },
    "release": {
      "description": "Pre-release validation",
      "test_packages": [
        "./tests/smoke",
        "./tests/regression",
        "./tests/performance",
        "./tests/security"
      ],
      "options": {
        "fail_fast": false,
        "parallel": true
      }
    }
  }
}
```

### Compatibility Profiles

```json
{
  "profiles": {
    "min-requirements": {
      "description": "Test with minimum supported versions",
      "test_packages": ["./tests/compatibility"],
      "environment": {
        "php": "7.4",
        "wordpress": "6.0",
        "woocommerce": "7.0"
      }
    },
    "latest-stable": {
      "description": "Test with latest stable versions",
      "test_packages": ["./tests/all"],
      "environment": {
        "php": "8.2",
        "wordpress": "latest",
        "woocommerce": "latest"
      }
    },
    "bleeding-edge": {
      "description": "Test with development versions",
      "test_packages": ["./tests/all"],
      "environment": {
        "php": "8.3",
        "wordpress": "nightly",
        "woocommerce": "nightly"
      }
    }
  }
}
```

## Default Profile

### Setting a Default

```json
{
  "default_profile": "smoke",
  "profiles": {
    "smoke": {
      "test_packages": ["./tests/smoke"]
    },
    "full": {
      "test_packages": ["./tests/**/*"]
    }
  }
}
```

### Running Default Profile

```bash
# Uses default_profile if set
qit run:e2e woocommerce --config=qit.json

# Override default
qit run:e2e woocommerce --config=qit.json --profile=full
```

## Profile Inheritance

### Base Profiles

```json
{
  "base_environment": {
    "php": "8.2",
    "wordpress": "latest"
  },
  "base_options": {
    "timeout": 600000
  },
  "profiles": {
    "quick": {
      "inherits": "base",
      "test_packages": ["./tests/smoke"]
    },
    "full": {
      "inherits": "base",
      "test_packages": ["./tests/**/*"],
      "environment": {
        "woocommerce": "8.5"
      }
    }
  }
}
```

### Profile Extension

```json
{
  "profiles": {
    "base-e2e": {
      "test_packages": [
        "./utilities/setup",
        "./tests/checkout"
      ],
      "environment": {
        "php": "8.2"
      }
    },
    "e2e-with-payments": {
      "extends": "base-e2e",
      "test_packages": [
        "./tests/stripe",
        "./tests/paypal"
      ]
    }
  }
}
```

## Environment-Specific Profiles

### By Environment Variable

```json
{
  "profiles": {
    "ci": {
      "enabled_when": "${CI}",
      "test_packages": ["./tests/ci"],
      "options": {
        "verbose": false
      }
    },
    "local": {
      "enabled_when": "!${CI}",
      "test_packages": ["./tests/all"],
      "options": {
        "verbose": true
      }
    }
  }
}
```

### By Git Branch

```json
{
  "profiles": {
    "main": {
      "branch": "main",
      "test_packages": ["./tests/smoke", "./tests/regression"]
    },
    "develop": {
      "branch": "develop",
      "test_packages": ["./tests/all"]
    },
    "feature": {
      "branch": "feature/*",
      "test_packages": ["./tests/smoke"]
    }
  }
}
```

## Matrix Profiles

### Version Matrix

```json
{
  "profiles": {
    "compatibility-matrix": {
      "matrix": {
        "php": ["7.4", "8.0", "8.2"],
        "wordpress": ["6.3", "6.4", "latest"]
      },
      "test_packages": ["./tests/compatibility"]
    }
  }
}
```

### Feature Matrix

```json
{
  "profiles": {
    "feature-matrix": {
      "matrix": {
        "features": [
          ["hpos"],
          ["cart-checkout-blocks"],
          ["hpos", "cart-checkout-blocks"]
        ]
      },
      "test_packages": ["./tests/features"]
    }
  }
}
```

## Profile Groups

### Organizing Related Profiles

```json
{
  "profile_groups": {
    "development": ["dev", "dev-quick", "dev-debug"],
    "ci": ["pr", "nightly", "release"],
    "compatibility": ["php74", "php80", "php82"]
  },
  "profiles": {
    "dev": { /* ... */ },
    "dev-quick": { /* ... */ },
    "pr": { /* ... */ },
    "php74": { /* ... */ }
  }
}
```

### Running Profile Groups

```bash
# Run all profiles in a group
qit run:e2e woocommerce --profile-group=development

# Run specific group profiles
qit run:e2e woocommerce --profiles=pr,nightly
```

## Conditional Profiles

### Time-Based

```json
{
  "profiles": {
    "business-hours": {
      "schedule": "0 9-17 * * MON-FRI",
      "test_packages": ["./tests/quick"]
    },
    "after-hours": {
      "schedule": "0 18-8 * * *",
      "test_packages": ["./tests/full"]
    }
  }
}
```

### Resource-Based

```json
{
  "profiles": {
    "low-resource": {
      "condition": "memory < 4GB",
      "test_packages": ["./tests/basic"],
      "options": {
        "parallel": false
      }
    },
    "high-resource": {
      "condition": "memory >= 4GB",
      "test_packages": ["./tests/all"],
      "options": {
        "parallel": true
      }
    }
  }
}
```

## Profile Selection Strategy

### Priority Order

1. Explicit `--profile` flag
2. Environment variable `QIT_PROFILE`
3. Git branch matching
4. Default profile
5. First defined profile

### Auto-Selection

```json
{
  "profile_selection": {
    "strategy": "auto",
    "rules": [
      {
        "condition": "${CI} == 'true'",
        "profile": "ci"
      },
      {
        "condition": "${GITHUB_EVENT_NAME} == 'pull_request'",
        "profile": "pr"
      },
      {
        "condition": "branch == 'main'",
        "profile": "release"
      }
    ],
    "fallback": "smoke"
  }
}
```

## Best Practices

### 1. Descriptive Names

```json
{
  "profiles": {
    "checkout-smoke": { /* ... */ },      // Clear purpose
    "php82-compat": { /* ... */ },       // Version specific
    "pre-release-full": { /* ... */ }    // Stage specific
  }
}
```

### 2. Document Profiles

```json
{
  "profiles": {
    "regression": {
      "description": "Full regression suite for release validation",
      "notes": "Takes ~45 minutes, requires 8GB RAM",
      "test_packages": ["./tests/**/*"]
    }
  }
}
```

### 3. Logical Grouping

```json
{
  "profiles": {
    // Speed-based
    "quick": { "test_packages": ["./tests/smoke"] },
    "standard": { "test_packages": ["./tests/smoke", "./tests/critical"] },
    "comprehensive": { "test_packages": ["./tests/**/*"] },
    
    // Environment-based
    "dev": { /* ... */ },
    "staging": { /* ... */ },
    "production": { /* ... */ }
  }
}
```

### 4. Fail-Fast for Quick Feedback

```json
{
  "profiles": {
    "pr": {
      "test_packages": ["./tests/smoke"],
      "options": {
        "fail_fast": true  // Stop on first failure in PRs
      }
    },
    "nightly": {
      "test_packages": ["./tests/**/*"],
      "options": {
        "fail_fast": false  // Run all tests in nightly
      }
    }
  }
}
```

### 5. Version Pinning for Reproducibility

```json
{
  "profiles": {
    "release-8.5": {
      "description": "Exact configuration for 8.5 release",
      "environment": {
        "php": "8.2.13",
        "wordpress": "6.4.2",
        "woocommerce": "8.5.0"
      },
      "test_packages": ["./tests/release-8.5"]
    }
  }
}
```

## Examples

### Multi-Stage Testing

```json
{
  "profiles": {
    "stage-1-smoke": {
      "description": "Quick validation",
      "test_packages": ["./tests/smoke"],
      "options": { "fail_fast": true }
    },
    "stage-2-critical": {
      "description": "Critical path testing",
      "test_packages": [
        "./tests/checkout",
        "./tests/payment"
      ]
    },
    "stage-3-full": {
      "description": "Complete test suite",
      "test_packages": ["./tests/**/*"]
    }
  }
}
```

### Cross-Browser Testing

```json
{
  "profiles": {
    "chrome": {
      "test_packages": ["./tests/e2e"],
      "environment": {
        "BROWSER": "chromium"
      }
    },
    "firefox": {
      "test_packages": ["./tests/e2e"],
      "environment": {
        "BROWSER": "firefox"
      }
    },
    "safari": {
      "test_packages": ["./tests/e2e"],
      "environment": {
        "BROWSER": "webkit"
      }
    }
  }
}
```

### Performance Testing

```json
{
  "profiles": {
    "performance-baseline": {
      "test_packages": ["./tests/performance"],
      "environment": {
        "php": "8.2",
        "wordpress": "6.4"
      },
      "options": {
        "timeout": 3600000,
        "performance_mode": true
      }
    },
    "performance-stress": {
      "test_packages": ["./tests/performance/stress"],
      "options": {
        "concurrent_users": 100,
        "duration": 600000
      }
    }
  }
}
```