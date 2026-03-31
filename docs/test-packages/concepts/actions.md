---
description: "Actions are named extension points where test packages register reusable capabilities — like WordPress do_action(). A payment gateway registers makePurchase, a product plugin iterates over all makePurchase actions to test checkout with every gateway. Adding a gateway = zero code changes. Covers the full flow: provider declares actions in qit-test.json, consumer calls qit.actions() to discover and iterate."
---

# Actions

Actions are named extension points where test packages register reusable capabilities for other packages to discover and call at runtime. If you've used WordPress hooks, you already know the pattern.

## The WordPress Analogy

In WordPress, `do_action('woocommerce_payment_complete')` fires every callback hooked into that name. Actions in QIT work the same way:

- **A provider** registers an action: "I can do `makePurchase`"
- **A consumer** discovers all actions: "Give me every `makePurchase`"
- **Adding a new provider** requires zero code changes in the consumer

## How It Works

### 1. Provider Registers an Action

The Stripe team creates a utility package that knows how to complete a purchase through Stripe:

```typescript
// stripe/payments/flows/pay.ts
export default async function(page, opts) {
  await page.fill('#stripe-card-number', '4242424242424242');
  await page.fill('#stripe-card-expiry', '12/30');
  await page.fill('#stripe-card-cvc', '123');
  await page.click('#place_order');
  await page.waitForURL('**/order-received/**');
}
```

They declare it in their manifest:

```json
{
  "package": "stripe/payments",
  "package_type": "utility",
  "requires": { "plugins": ["woocommerce-gateway-stripe"] },
  "actions": {
    "makePurchase": "./flows/pay.ts"
  },
  "test": {
    "phases": {
      "globalSetup": ["./bootstrap/setup-stripe.sh"]
    }
  }
}
```

**Each action maps a name to a file.** The file's `export default` is the action implementation. No metadata in the manifest — the JSDoc and TypeScript types in the source file are the contract.

### 2. Consumer Discovers Actions at Runtime

Dale's product plugin tests iterate over every available `makePurchase` action:

```typescript
import qit from '@woocommerce/qit-runtime';

const woo = qit.package('woocommerce/core-utils');

for (const makePurchase of qit.actions('makePurchase')) {
  test.describe(`Checkout via ${makePurchase.provider}`, () => {
    test('customer can purchase widget', async ({ page }) => {
      await woo.loginAs(page, 'customer');
      await page.goto('/product/fancy-widget');
      await page.click('text=Add to cart');
      await makePurchase(page, { amount: 29.99 });
      await expect(page.locator('.order-received')).toBeVisible();
    });
  });
}
```

Each action function has a `.provider` property (`'stripe/payments'`) for display in test names and CTRF results.

### 3. Adding a Gateway = Zero Code Changes

```bash
# Today — test with Stripe
qit run:e2e my-product-plugin \
  --test-package woocommerce/core-utils \
  --test-package stripe/payments \
  --test-package dale/product-tests

# Tomorrow — add PayPal, no code changes in dale/product-tests
qit run:e2e my-product-plugin \
  --test-package woocommerce/core-utils \
  --test-package stripe/payments \
  --test-package paypal/payments \
  --test-package dale/product-tests
```

The second run produces twice the test cases. Dale's code didn't change.

## Manifest Schema

The `actions` field maps action names to relative file paths:

```json
"actions": {
  "makePurchase": "./flows/pay.ts",
  "refundOrder": "./flows/refund.ts"
}
```

**Rules:**
- Action names must be camelCase identifiers: `^[a-zA-Z][a-zA-Z0-9_]*$`
- Paths must be relative (start with `./`)
- Each file must have an `export default` — that's the action implementation
- Both `.js` and `.ts` files work (Playwright registers its TypeScript transpiler)

## When No Provider Exists

If no loaded package provides an action, `qit.actions()` returns an empty array. The `for...of` loop produces zero iterations — zero test cases, not a failure. This is by design: adding capabilities is additive, removing them is a no-op.

```typescript
// If no payment gateway package is loaded:
qit.actions('makePurchase') // => []
// The for loop runs 0 times, 0 test cases generated
// CTRF shows the test file ran but produced no tests — visible, not an error
```

## Actions vs `qit.package()`

Both let packages share code. The difference is the relationship:

| | `qit.actions()` | `qit.package()` |
|---|---|---|
| **Relationship** | Anonymous — consumer doesn't know providers | Direct — consumer names the package |
| **Cardinality** | Multiple implementations, iterate | One package, use directly |
| **Manifest** | `actions` field required | No manifest field — barrel exports |
| **Use case** | "Test against every payment gateway" | "Use WooCommerce's login helper" |
| **WordPress analogy** | `do_action()` / `apply_filters()` | Direct function call |

**Rule of thumb:** If you'd write a `for` loop, it's `qit.actions()`. If you'd write a variable assignment, it's `qit.package()`.

## Ecosystem Patterns

The pattern extends across the WooCommerce ecosystem:

| Action | Provider | Consumer |
|--------|----------|----------|
| `makePurchase` | Payment gateways (Stripe, PayPal, Braintree) | Product plugins testing checkout |
| `calculateShipping` | Shipping plugins (FedEx, UPS, DHL) | Product plugins testing shipping rates |
| `calculateTax` | Tax plugins (Avalara, TaxJar) | Any plugin testing tax calculation |
| `verifyEmailSent` | Email plugins (Mailchimp, SendGrid) | Plugins testing order notifications |
