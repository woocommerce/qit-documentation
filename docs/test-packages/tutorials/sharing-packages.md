# Publishing Your First Package

Learn how to share your Test Package with the WordPress ecosystem through the QIT Package Registry.

## Prerequisites

- A working Test Package (from the [quickstart](quickstart.md))
- QIT CLI authenticated
- Package tested locally

## Before Publishing

### 1. Verify Your Package Works

```bash
# Run locally (replace with your extension slug)
qit run:e2e your-extension-slug --test-package=.

# Test with different WordPress versions
qit run:e2e your-extension-slug --test-package=. --wp=6.4
qit run:e2e your-extension-slug --test-package=. --wp=rc
```

### 2. Add Package Metadata

Enhance your `qit-test.json` with helpful information:

```json
{
  "package": "your-extension-slug/checkout-tests",
  "description": "Tests checkout flow with custom fields",
  "tags": ["checkout", "e-commerce", "payments"],
  "requires": {
    "plugins": {
      "woocommerce": ">=8.0.0"
    },
    "wordpress": ">=6.0"
  }
}
```

### 3. Document Your Package

Create a `README.md`:

```markdown
# My Plugin Checkout Tests

Tests the checkout flow with custom billing fields.

## What It Tests
- Adding products to cart
- Custom billing field validation
- Order completion flow

## Requirements
- WooCommerce 8.0+
- WordPress 6.0+

## Usage
```bash
qit run:e2e your-extension-slug --test-package=your-extension-slug/checkout-tests
```
```

## Publishing to the Registry

### Step 1: Validate Your Package

```bash
qit package:validate .
```

This checks:
- ✓ Valid manifest structure
- ✓ Required fields present
- ✓ Namespace availability
- ✓ Version constraints valid

### Step 2: Publish

```bash
qit package:publish . --version=1.0.0
```

Output:
```
Publishing your-extension-slug/checkout-tests:1.0.0...
✓ Package validated
✓ Tests verified
✓ Uploaded to registry

Published successfully!
Others can now use: your-extension-slug/checkout-tests:1.0.0
```

### Step 3: Verify Publication

```bash
# Search for your package
qit package:search my-plugin

# Get package info
qit package:info your-extension-slug/checkout-tests
```

## Version Management

### Semantic Versioning

Follow semantic versioning for your packages:

- **1.0.0** → Initial release
- **1.0.1** → Bug fixes
- **1.1.0** → New features (backward compatible)
- **2.0.0** → Breaking changes

### Publishing Updates

```bash
# Publish patch version
qit package:publish . --version=1.0.1

# Publish minor version
qit package:publish . --version=1.1.0

# Publish with tags
qit package:publish . --version=2.0.0 --tag=latest --tag=stable
```

## How Others Use Your Package

Once published, anyone can use your package:

```bash
# Use specific version
qit run:e2e woocommerce-bookings \
  --test-package=woocommerce-subscriptions/checkout-tests:1.0.0

# Use latest
qit run:e2e woocommerce-bookings \
  --test-package=woocommerce-subscriptions/checkout-tests:latest

# Combine with other packages
qit run:e2e woocommerce-bookings \
  --test-package=woocommerce-subscriptions/checkout-tests \
  --test-package=woocommerce-stripe/gateway-tests
```

## Best Practices

### 1. Clear Naming

Use descriptive names that indicate what's tested:
- ✅ `checkout-tests`
- ✅ `multi-currency-tests`
- ❌ `tests`
- ❌ `my-tests`

### 2. Version Compatibility

Specify requirements clearly:
```json
"requires": {
  "plugins": {
    "woocommerce": ">=8.0.0 <9.0.0"
  }
}
```

### 3. Meaningful Tags

Use tags to help discovery:
```json
"tags": ["payments", "stripe", "subscriptions", "checkout"]
```

### 4. Keep Tests Focused

Each package should test one aspect well:
- ✅ One package for checkout
- ✅ Another for refunds
- ❌ One package testing everything

## Updating Published Packages

### Non-Breaking Updates

For bug fixes and improvements:

```bash
# Make changes
vim tests/checkout.spec.js

# Test locally
qit run:e2e your-plugin --test-package=.

# Publish patch
qit package:publish . --version=1.0.1
```

### Breaking Changes

When changing test structure:

1. Publish new major version
2. Maintain old version for compatibility
3. Document migration path

```bash
# Publish v2 while v1 remains available
qit package:publish . --version=2.0.0

# Users can choose version
--test-package=woocommerce-subscriptions/checkout-tests:1.0.0  # Old
--test-package=woocommerce-subscriptions/checkout-tests:2.0.0  # New
```

## Troubleshooting

### Package Already Exists

```
Error: Package woocommerce-subscriptions/checkout-tests already exists
```

Solution: Use a different package name or publish a new version.

### Namespace Not Owned

```
Error: You don't own namespace 'my-plugin'
```

Solution: Use your vendor namespace or request ownership.

### Tests Fail During Validation

```
Error: Package tests failed validation
```

Solution: Ensure tests pass locally before publishing.

---

**Congratulations!** Your Test Package is now part of the WordPress testing ecosystem. Others can use your tests to verify compatibility.