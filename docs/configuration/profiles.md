# Test Profiles

Test profiles are named configurations that combine test packages, environments, and settings into reusable scenarios.

## Understanding Profiles

A profile answers: "What tests should run and how?"

Instead of:
```bash
qit run:e2e my-plugin \
  --test-package=./tests \
  --test-package=stripe/gateway-tests \
  --wp=6.4 --woo=8.5 --php=8.0
```

You define once:
```json
{
  "test_types": {
    "e2e": {
      "payment-testing": {
        "environment": "production",
        "test_packages": [
          "./tests",
          "stripe/gateway-tests"
        ]
      }
    }
  }
}
```

And run simply:
```bash
qit run:e2e --profile=payment-testing
```

## Profile Structure

Profiles are organized by test type:

```json
{
  "test_types": {
    "e2e": {
      // E2E test profiles
    },
    "phpstan": {
      // PHPStan profiles
    },
    "security": {
      // Security scan profiles
    }
  }
}
```

## Profile Properties

### Basic Profile

```json
{
  "smoke": {
    "environment": "staging",
    "test_packages": ["./tests/critical"]
  }
}
```

### Complete Profile

> **Note**: Properties with `[PLANNED]` are future features not yet implemented.

```json
{
  "comprehensive": {
    "environment": "production",
    "test_packages": [
      "./tests",
      "woocommerce/checkout-tests:8.5",
      "stripe/gateway-tests:3.0"
    ],
    "php": "8.2",  // Override environment's PHP (format: X.Y or X.Y.Z)

    // [PLANNED] Test timeout in seconds
    "timeout": 1800,

    // [PLANNED] Retry configuration for flaky tests
    "retry": {
      "times": 2,
      "delay": 10
    }
  }
}
```

## Common Profile Patterns

### Smoke Tests

Quick validation of critical paths:

```json
{
  "smoke": {
    "environment": "production",
    "test_packages": ["./tests/critical"]
    // [PLANNED]
    "timeout": 300  // 5 minutes max
  }
}
```

### Compatibility Testing

Test with multiple plugins:

```json
{
  "compatibility": {
    "environment": "production",
    "test_packages": [
      "./tests",
      "stripe/gateway-tests",
      "paypal/checkout-tests",
      "subscriptions/renewal-tests"
    ]
  }
}
```

### Version Matrix

Test across versions:

> **Note**: Matrix testing is a planned feature not yet implemented.

```json
{
  "matrix-test": {
    "test_packages": ["./tests"]

    // [PLANNED] Matrix testing across multiple environments
    "matrix": {
      "environments": ["minimum", "recommended", "latest"]
    }
  }
}
```

## Profile Inheritance

Profiles can extend others:

```json
{
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
```

## Using Profiles

### Run a Profile

```bash
qit run:e2e --profile=smoke
```

### Override Profile Settings

```bash
# Use profile but change PHP version
qit run:e2e --profile=smoke --php=8.3

# Add extra test package
qit run:e2e --profile=smoke --test-package=./extra-tests
```

### List Available Profiles

```bash
qit config:list-profiles

Available profiles for 'e2e':
  - smoke: Quick critical path validation
  - full: Complete test suite
  - compatibility: Multi-plugin testing
```

## Profile Examples

### Development Profile

For local development:

```json
{
  "dev": {
    "environment": "local",
    "test_packages": ["./tests"]

    // [PLANNED] Debug mode and headful browser
    "debug": true,
    "headed": true
  }
}
```

### CI Profiles

For different CI stages:

```json
{
  "ci-quick": {
    "environment": "staging",
    "test_packages": ["./tests/smoke"]
    // [PLANNED] 
    "timeout": 600  //10 minute timeout
  },
  "ci-full": {
    "environment": "production",
    "test_packages": [
      "./tests",
      "woocommerce/checkout-tests"
    ]
    // [PLANNED]
    "timeout": 3600  // 1 hour timeout
  }
}
```

### Release Profile

Pre-release validation:

```json
{
  "release": {
    "environment": "production",
    "test_packages": [
      "./tests",
      "woocommerce/checkout-tests",
      "stripe/gateway-tests",
      "paypal/checkout-tests"
    ]

    // [PLANNED] Retry flaky tests once
    "retry": {
      "times": 1
    }
  }
}
```

## Advanced Features

### Skipping Tests

Use the `tweaks.skip` property to skip specific tests by name or regex pattern:

```json
{
  "e2e": {
    "stable": {
      "environment": "production",
      "test_packages": ["./tests"],
      "tweaks": {
        "skip": [
          "test-flaky-feature",           // Skip by exact name
          "admin-.*-slow",                // Skip by regex pattern
          "test-requires-external-api"
        ]
      }
    }
  }
}
```

**Use cases:**
- Skip flaky tests in CI
- Exclude tests requiring external dependencies
- Temporarily disable broken tests
- Filter tests during development

**Pattern matching:**
- Exact match: `"test-checkout"`
- Regex: `"test-.*-slow"` matches any test with "slow" in the name
- Multiple patterns: Array of strings

---

## Best Practices

### Naming Conventions

Use descriptive, action-oriented names.

**Naming Rules:**
- Only alphanumeric characters, hyphens (`-`), and underscores (`_`)
- No spaces or special characters
- See [Validation Rules](validation-rules.md#naming-constraints) for details

```json
{
  // Good
  "test-checkout-with-subscriptions": {},  // ✅ Valid
  "validate_payment_gateways": {},          // ✅ Valid
  "smoke-test-v2": {},                      // ✅ Valid

  // Avoid
  "test1": {},                              // Valid but not descriptive
  "test checkout": {},                      // ❌ Invalid (space)
  "my.profile": {}                          // ❌ Invalid (period)
}
```

### Document Purpose

Add comments explaining profiles:

```json
{
  "payment-compatibility": {
    "_comment": "Tests all supported payment gateways",
    "test_packages": [
      "stripe/gateway-tests",
      "paypal/checkout-tests"
    ]
  }
}
```

### Keep Profiles Focused

Each profile should have a clear purpose:

- ✅ One profile for smoke tests
- ✅ Another for payment testing
- ❌ One profile that does everything

## Related Topics

- [Environments](environments.md) - Configure WordPress/PHP combinations
- [Groups](groups.md) - Batch multiple profiles
- [qit.json Structure](qit-json.md) - Complete configuration guide