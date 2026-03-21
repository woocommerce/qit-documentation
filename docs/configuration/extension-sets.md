---
description: "Guide to extension sets — predefined collections of plugins and themes for common testing scenarios. Available sets include woocommerce-extensions, payment-gateways, and popular-plugins. Can be used in environments via the extension_set property, combined with additional plugins, or defined as custom sets. Used with managed tests via --extension_set CLI flag (supported by woo-e2e, woo-api, compatibility, performance)."
---

# Extension Sets

Extension sets are predefined collections of plugins and themes for common testing scenarios.

## Overview

Instead of listing plugins repeatedly:
```json
{
  "plugins": [
    "woocommerce-subscriptions",
    "woocommerce-memberships", 
    "woocommerce-bookings",
    "stripe",
    "paypal"
  ]
}
```

Use a predefined set:
```json
{
  "extension_set": "woocommerce-extensions"
}
```

## Available Sets

### WooCommerce Extensions

Common WooCommerce extensions:
```json
{
  "extension_set": "woocommerce-extensions"
}
```

Includes:
- WooCommerce Subscriptions
- WooCommerce Memberships
- WooCommerce Bookings
- Popular payment gateways

### Payment Gateways

All major payment providers:
```json
{
  "extension_set": "payment-gateways"
}
```

Includes:
- Stripe
- PayPal
- Square
- Authorize.net

### Popular Plugins

Most-used WordPress plugins:
```json
{
  "extension_set": "popular-plugins"
}
```

## Using Extension Sets

In environments:
```json
{
  "environments": {
    "full-stack": {
      "wp": "stable",
      "woo": "stable",
      "extension_set": "woocommerce-extensions"
    }
  }
}
```

With additional plugins:
```json
{
  "environments": {
    "payment-testing": {
      "extension_set": "payment-gateways",
      "plugins": ["my-custom-gateway"]
    }
  }
}
```

## Custom Extension Sets

Define your own sets:
```json
{
  "extension_sets": {
    "my-stack": [
      "woocommerce-subscriptions",
      "my-custom-plugin",
      "helper-plugin"
    ]
  }
}
```

## Best Practices

- Use sets for common combinations
- Override with specific plugins as needed
- Document what each set contains
- Keep sets focused on a purpose

## Related Topics

- [Environments](environments.md) - Using extension sets
- [qit.json Structure](qit-json.md) - Complete configuration