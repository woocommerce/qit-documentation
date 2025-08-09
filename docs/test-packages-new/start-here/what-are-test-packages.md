# What are Test Packages?

Test Packages are a minimal standard for E2E tests that makes WordPress ecosystem compatibility testing possible - enabling plugins and themes to share tests and verify they work together.

## The Hidden Crisis in WordPress

Every WordPress site is unique. A typical WooCommerce store might run:
- WooCommerce + Stripe payment gateway
- Advanced Custom Fields for content
- Yoast SEO for search optimization  
- Elementor for page building
- Your custom plugin

**Each plugin tests itself in isolation.** But users don't run plugins in isolation. They run them together.

When Stripe updates their gateway, they can't test with every shipping method plugin. When you release your plugin, you can't test with every payment gateway. The ecosystem has no way to verify plugins actually work together.

**Until now.**

## The Test Package Standard

Test Packages create a simple convention that lets any WordPress extension:
1. **Package their E2E tests** in a standard format
2. **Share them** with other developers
3. **Combine them** to test real-world scenarios
4. **Run them** across any environment matrix

```mermaid
graph LR
    A[Your Plugin Tests] --> D[Test Package Standard]
    B[WooCommerce Tests] --> D
    C[Stripe Tests] --> D
    D --> E[Combined Test Suite]
    E --> F[Full Compatibility Matrix]
    
    style D fill:#fff3e0
    style F fill:#c8e6c9
```

## Why This Changes Everything

### Before Test Packages
- **Stripe** tests their gateway alone
- **Your plugin** tests checkout modifications alone
- **Nobody** tests them together
- **Customers** discover conflicts in production

### With Test Packages
```bash
# Stripe publishes their test package
qit package:publish stripe/gateway-tests:1.2.0

# You test YOUR plugin WITH Stripe's tests
qit run:e2e my-plugin \
  --test-package=stripe/gateway-tests:1.2.0 \
  --test-package=./my-tests

# Result: You know they work together BEFORE release
```

## Getting Started is Simple

The minimum Test Package requires just:

### 1. Standard Playwright tests
```javascript
test('checkout works', async ({ page }) => {
  // Uses QIT's environment URL
  await page.goto('/checkout');
  await page.fill('#billing_email', 'test@example.com');
  await page.click('#place_order');
  await expect(page).toHaveURL(/order-received/);
});
```

### 2. A manifest describing them
```json
{
  "namespace": "my-awesome-plugin",
  "package": "checkout-tests",
  "test_type": "e2e",
  "test": {
    "phases": {
      "run": ["npx playwright test"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

### 3. That's enough to start

With just these two files, you're ready. The complete Test Package standard offers much more - lifecycle phases for setup/teardown, state management between packages, environment targeting, secret handling, result aggregation - but none of that is required to begin.

Start minimal. Once your package works, it instantly gains superpowers: it can be combined with other packages, run across version matrices, and orchestrated with guaranteed isolation - all without touching your test code.

**Curious what else your package can do?** See [Package Capabilities](../concepts/package-capabilities).  
**Want to understand the full system?** See [Architecture & Lifecycle](../concepts/architecture-and-lifecycle).

## Real-World Example: Payment Gateway Testing

Imagine you're building a payment gateway. You need to ensure it works with:
- Different WooCommerce versions
- Various shipping methods
- Other payment gateways (multi-gateway checkouts)
- Subscription plugins
- Currency switchers

### Without Test Packages
You'd need to:
- Manually install each plugin combination
- Write tests for features you don't own
- Maintain tests for third-party plugins
- Hope nothing breaks

### With Test Packages
```bash
# Use the community's shared test packages
qit run:e2e my-gateway \
  --test-package=woocommerce/checkout-tests:latest \
  --test-package=woocommerce-subscriptions/recurring-tests:5.5.0 \
  --test-package=fedex/shipping-tests:stable \
  --test-package=./my-gateway-tests

# Test across versions
--wordpress=6.5 --woocommerce=8.6  # Current
--wordpress=6.4 --woocommerce=8.5  # Previous
--wordpress=latest --woocommerce=latest  # Upcoming
```

You're now testing with **actual tests from actual plugin vendors**, not your assumptions about how their plugins work.

## Who Benefits?

**Plugin & Theme Developers** - Ship features faster without fear. Refactor confidently. Test against real scenarios from other plugins instead of guessing how they work.

**WooCommerce Core** - Share official test suites so extensions can verify compatibility with upcoming releases before they ship.

**Agencies** - Combine plugin tests into comprehensive suites for client projects. Deploy updates knowing they won't break production.

**Hosting Providers** - Reduce support tickets, lower churn, happier customers. Recommend plugin combinations with confidence.

**The WordPress Ecosystem** - Fewer broken sites, predictable compatibility, shared quality standards. Everyone moves faster when compatibility is guaranteed.

## Getting Started

### Use Existing Test Packages
```bash
# Find packages in the registry
qit package:search woocommerce

# Run them with your plugin
qit run:e2e my-plugin --test-package=woocommerce/core-tests:latest
```

### Create Your Own
```bash
# Scaffold a package
qit package:scaffold ./tests --namespace=my-plugin

# Write standard Playwright tests
npx playwright test

# Share with the community
qit package:publish ./tests
```


## The Technical Foundation

Test Packages work because they provide:

- **Standard format**: Everyone uses the same structure
- **Orchestration**: Managed execution across environments
- **Isolation**: Each package gets a clean state
- **Aggregation**: Unified results across all packages

Want the deep technical details? See [Architecture & Lifecycle](../concepts/architecture-and-lifecycle).

## Join the Compatibility Revolution

Test Packages aren't just another testing tool. They're a **community standard** that makes comprehensive WordPress compatibility testing possible for the first time.

When everyone can share and combine tests, everyone's plugins work better together.

### Quick Start
- **[Quickstart Guide](./quickstart-scaffold-run-verify)** - Create your first package
- **[Package Registry](./package-registry-and-versioning)** - Find and share packages
- **[Multi-Package Testing](./tutorial-first-multipackage-run)** - Combine test suites

### Learn More
- **[Orchestration Concepts](../concepts/orchestration-and-execution-order)** - How isolation works
- **[Environment Models](../concepts/environment-models)** - Testing strategies
- **[Package Capabilities](../concepts/package-capabilities)** - What packages can do

---

**Test Packages: The missing standard for WordPress compatibility testing.**

Stop testing in isolation. Start testing in reality.

**Last updated:** 2025-08-09