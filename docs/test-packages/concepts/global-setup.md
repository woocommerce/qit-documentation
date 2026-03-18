---
sidebar_position: 1
title: "Global Setup"
---

### The globalSetup Phase: Purpose and Philosophy

The `globalSetup` phase is a mechanism for **knowledge encapsulation** that enables true cross-compatibility testing in the WordPress ecosystem. Each package contributes its own setup knowledge, eliminating coupling between unrelated packages and creating maintainable, composable test environments.

### The Problem Domain

#### Cross-Compatibility Testing Reality

In the WordPress ecosystem, testing real-world scenarios means testing combinations:
- WooCommerce + Stripe + Your Plugin
- WooCommerce + PayPal + Subscriptions + Your Plugin
- WordPress + Gutenberg + Yoast + Your Plugin

Each component has specific setup requirements:
- WooCommerce needs its onboarding wizard dismissed
- Stripe needs API keys configured and payment methods enabled
- Subscriptions needs trial periods configured
- Your plugin needs its default settings

#### The Coupling Problem

Without `globalSetup`, every test package would need to know:

```javascript
// ❌ Anti-pattern: Your test knowing everyone else's setup
test('checkout works with stripe', async () => {
  // Your test shouldn't know these details!
  await dismissWooCommerceOnboarding();  // How does WC do this?
  await configureStripeGateway();        // What are Stripe's requirements?
  await enableSubscriptions();           // What does Subscriptions need?
  await setupMyPlugin();                 // Only this is your concern
  
  // Now finally test...
});
```

This creates:
1. **Knowledge coupling** - Your tests break when Stripe changes internal setup
2. **Maintenance burden** - Every package must update when WooCommerce changes
3. **Expertise requirements** - Test authors need deep knowledge of all plugins
4. **Duplication** - Same setup code repeated across hundreds of packages

### The Solution: Knowledge Encapsulation

#### Each Package Owns Its Setup Knowledge

```json
// woocommerce/minimal package
{
  "package": "woocommerce/minimal",
  "test": {
    "phases": {
      "globalSetup": [
        "./scripts/dismiss-onboarding.sh",  // WooCommerce knows HOW
        "wp option update woocommerce_task_list_hidden yes"
      ]
    }
  }
}

// stripe/checkout package  
{
  "package": "stripe/checkout",
  "test": {
    "phases": {
      "globalSetup": [
        "./scripts/configure-stripe-gateway.sh",  // Stripe knows HOW
        "wp option update stripe_api_key $STRIPE_TEST_KEY"
      ]
    }
  }
}
```

#### Composition Without Coupling

```bash
# Each package contributes its knowledge
qit run:e2e your-plugin \
  --test-package=woocommerce/minimal:latest \  # WooCommerce configures itself
  --test-package=stripe/checkout:latest \      # Stripe configures itself
  --test-package=your-plugin/e2e:latest        # You configure yourself
```

The environment receives:
1. WooCommerce's setup (executed once)
2. Stripe's setup (executed once)
3. Your setup (executed once)
   = **Fully configured environment with zero coupling**

### Use Cases

#### 1. Cross-Compatibility Testing

```bash
# Test your shipping plugin with payment gateways
qit run:e2e my-shipping-plugin \
  --test-package=woocommerce/minimal:latest \
  --test-package=stripe/checkout:latest \
  --test-package=paypal/checkout:latest \
  --test-package=my-shipping/e2e:latest
```

Your tests never need to know how Stripe or PayPal configure themselves.

#### 2. Manual Environment Setup

```bash
# Developers get properly configured environments
qit env:up \
  --global-setup woocommerce/minimal:latest \
  --global-setup stripe/checkout:latest
```

A developer can spin up a properly configured WooCommerce + Stripe environment without reading any setup documentation.

#### 3. Utility Packages

```bash
# Performance testing environment
qit env:up \
  --global-setup woocommerce/minimal:latest \
  --global-setup commerce-utils/heavy-catalog:latest  # 10k products
  --global-setup commerce-utils/high-traffic:latest   # Simulated load
```

Utility packages contribute specialized environment states.

### Key Principles

#### 1. Single Responsibility
Each package is responsible for configuring **only its own plugin/extension**.

#### 2. Idempotency
`globalSetup` operations should be idempotent - running twice produces the same result.

#### 3. Environment Persistence
Changes made in `globalSetup` persist in the database snapshot, forming the baseline for all tests.

#### 4. Execution Once
Each unique `globalSetup` runs once, regardless of how many test packages from the same source are executed.

### What Belongs in globalSetup vs setup

| globalSetup | setup (package-specific) |
|------------|---------------------------|
| Dismiss onboarding wizards | Create test products |
| Configure payment gateways | Generate test orders |
| Set default plugin settings | Create test users |
| Install required plugins | Load test-specific data |
| Configure API credentials | Mock external services |
| **Persistent, shared baseline** | **Temporary, test-specific** |

### The Ecosystem Effect

This architecture enables a **composable testing ecosystem**:

1. **Plugin authors** maintain their own setup knowledge
2. **Test packages** remain decoupled and maintainable
3. **Environment setup** becomes combinatorial without complexity
4. **Changes** to one plugin's setup don't cascade
5. **New contributors** don't need deep knowledge of every plugin

### Example: Real-World Impact

Consider testing a tax calculation plugin:

```bash
# Without globalSetup pattern:
# ❌ Your test needs 500+ lines of setup code for 5 different plugins
# ❌ Breaks whenever any of those plugins change
# ❌ Requires expertise in WooCommerce, Stripe, AvaTax, etc.

# With globalSetup pattern:
# ✅ Each plugin handles its own setup
# ✅ Your test focuses on YOUR functionality
# ✅ Maintenance distributed to package owners
# ✅ Zero coupling between unrelated packages
```

### Conclusion

The `globalSetup` phase is not just a setup mechanism - it's a **knowledge encapsulation pattern** that makes cross-plugin testing sustainable at scale. By allowing each package to contribute its own setup knowledge, we create a system where complex multi-plugin environments can be composed without coupling, maintained without coordination, and used without expertise in every component.

This is why:
- The phase is called "global" - it creates THE environment
- It runs before the snapshot - it's the shared baseline
- Each package contributes - distributed knowledge
- It's separate from test setup - persistence vs temporary

---

*This pattern is the foundation that enables the WordPress testing ecosystem to scale without exponential complexity.*