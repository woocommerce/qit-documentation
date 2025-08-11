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
    "envs": {
      "WP_DEBUG": "true",
      "SCRIPT_DEBUG": "true"
    }
  }
}
```

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