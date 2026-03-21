---
description: "Guide to test profiles in qit.json. Profiles save test settings (versions, test packages, options) under test_types so you don't retype CLI flags. Covers inline version values (php, wp, woo — short or long form), environment references, profile inheritance via extends, the precedence chain (CLI > profile > environment > defaults), common patterns (smoke, compatibility, remote test profiles), tweaks.skip for skipping tests by name or regex, and when to use inline values vs named environments."
---

# Test Profiles

Test profiles are named configurations that save your test settings in `qit.json` so you don't have to type them every time.

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
        "wp": "6.4",
        "woo": "8.5",
        "php": "8.0",
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
    "e2e": {},
    "activation": {},
    "security": {},
    "phpstan": {}
  }
}
```

Each key under a test type is a named profile.

## Profile Properties

### Simple Profile

Put your test settings directly in the profile:

```json
{
  "smoke": {
    "wp": "6.4",
    "woo": "8.5",
    "php": "8.0",
    "test_packages": ["./tests/critical"]
  }
}
```

### Profile with Environment Reference

When you reuse the same versions across multiple profiles, extract them to a named [environment](environments.md) and reference it:

```json
{
  "smoke": {
    "environment": "production",
    "test_packages": ["./tests/critical"]
  }
}
```

### Complete Profile

```json
{
  "comprehensive": {
    "environment": "production",
    "wp": "rc",
    "test_packages": [
      "./tests",
      "woocommerce/checkout-tests:8.5",
      "stripe/gateway-tests:3.0"
    ]
  }
}
```

This profile uses the "production" environment as a base but overrides `wp` to test against the release candidate.

## Version Keys

Profiles accept these version keys (short or long form):

| Short form | Long form | Description |
|---|---|---|
| `wp` | `wordpress_version` | WordPress version |
| `woo` | `woocommerce_version` | WooCommerce version |
| `php` | `php_version` | PHP version |

Both forms work identically. Short form is recommended for readability.

## Precedence

When the same setting is defined in multiple places, the most specific source wins:

| Source | Priority | Example |
|---|---|---|
| CLI flags | Highest | `--php=8.3` |
| Profile inline values | High | `"php": "8.2"` in profile |
| Referenced environment | Medium | `"environment": "production"` |
| Framework defaults | Lowest | PHP 8.2, WP stable |

```bash
# Profile has php: "8.0", referenced environment has php: "7.4"
# CLI flag wins over both:
qit run:e2e --profile=smoke --php=8.3  # Uses PHP 8.3
```

## Common Profile Patterns

### Smoke Tests

Quick validation of critical paths:

```json
{
  "smoke": {
    "wp": "stable",
    "woo": "stable",
    "php": "8.2",
    "test_packages": ["./tests/critical"]
  }
}
```

### Compatibility Testing

Test with multiple plugins:

```json
{
  "compatibility": {
    "wp": "stable",
    "woo": "stable",
    "php": "8.2",
    "test_packages": [
      "./tests",
      "stripe/gateway-tests",
      "paypal/checkout-tests",
      "subscriptions/renewal-tests"
    ]
  }
}
```

### Remote Test Profiles

For managed tests like security and PHPStan, profiles contain test-specific settings (no environment needed):

```json
{
  "security": {
    "default": {}
  },
  "phpstan": {
    "default": {
      "phpstan_level": 6
    }
  }
}
```

## Profile Inheritance

Profiles can extend others:

```json
{
  "base": {
    "wp": "stable",
    "woo": "stable",
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

## When to Use Inline Values vs Environments

**Use inline values** when:
- You have a single profile or a few profiles with different versions
- You want a self-contained profile with no dependencies
- You're getting started and want simplicity

**Use named [environments](environments.md)** when:
- Multiple profiles share the same version combination
- You test against a version matrix (minimum, recommended, latest)
- Your team needs standardized environment definitions

Both approaches can coexist in the same `qit.json`. See [Environments](environments.md) for details on named environments.

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
          "test-flaky-feature",
          "admin-.*-slow",
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

**Good:**
```json
{
  "test-checkout-with-subscriptions": {},
  "validate-payment-gateways": {},
  "smoke-test-critical-paths": {}
}
```

**Avoid:**
```json
{
  "test1": {},
  "new": {}
}
```

### Keep Profiles Focused

Each profile should have a clear purpose:

- One profile for smoke tests
- Another for payment testing
- Another for compatibility testing

## Related Topics

- [Environments](environments.md) - Reusable version combinations (optional)
- [Groups](groups.md) - Batch multiple profiles
- [qit.json Structure](qit-json.md) - Complete configuration guide
