---
description: "The QIT Runtime (@woocommerce/qit-runtime) — a lightweight npm package that gives test packages access to environment info, WP-CLI execution, cross-package actions, and direct package imports. Two access patterns: qit.actions() for anonymous capability discovery (like WordPress do_action), and qit.package() for importing another package's exports directly. Always available in test execution context."
---

# QIT Runtime

The QIT Runtime (`@woocommerce/qit-runtime`) is a lightweight npm package that gives test packages a standard way to interact with QIT and each other at runtime.

## Installation

```bash
npm install @woocommerce/qit-runtime
```

New packages scaffolded with `qit package:scaffold` include it automatically. QIT CLI also installs the latest version before each test run, so it's always up to date.

## Quick Example

```typescript
import qit from '@woocommerce/qit-runtime';

// Import tools from another package
const woo = qit.package('woocommerce/core-utils');

// Discover actions registered by other packages
for (const makePurchase of qit.actions('makePurchase')) {
  test(`Checkout via ${makePurchase.provider}`, async ({ page }) => {
    await woo.loginAs(page, 'customer');
    await woo.addToCart(page, { productId: 123 });
    await makePurchase(page, { amount: 29.99 });
  });
}
```

## Two Access Patterns

The runtime provides two ways for test packages to use code from other packages:

### `qit.actions(name)` — Anonymous Capability Discovery

Like WordPress `do_action()`. Multiple packages register implementations for the same action name. Consumers iterate over all of them without knowing who provided them.

```typescript
// Stripe registered "makePurchase", PayPal registered "makePurchase"
// Dale's test iterates over both — zero code changes when adding PayPal
for (const makePurchase of qit.actions('makePurchase')) {
  test(`Pay via ${makePurchase.provider}`, async ({ page }) => {
    await makePurchase(page, { amount: 29.99 });
  });
}
```

**When to use:** "Test my plugin against every ___" — payment gateway, shipping method, tax calculator. You loop. Adding another provider is zero code changes.

See [Actions](./actions.md) for the full guide.

### `qit.package(name)` — Known Dependency Access

Like importing a library. You know the package, you use its tools directly.

```typescript
const woo = qit.package('woocommerce/core-utils');

await woo.loginAs(page, 'customer');
await woo.addToCart(page, { productId: 123 });
const checkout = new woo.CheckoutPage(page);
```

**When to use:** "Use ___'s tools in my test" — login helpers, page objects, product creation. You call directly. You know the dependency.

The package's exports are auto-discovered from its JavaScript entry point (`index.js` or `index.ts`). No manifest field needed.

## Complete API Reference

### `qit.env` — Environment Info

Typed wrappers over `QIT_*` environment variables. Throws with a clear error message if the variable isn't set.

```typescript
qit.env.isQit          // true when running in QIT (always available, never throws)
qit.env.siteUrl        // QIT_SITE_URL
qit.env.adminUrl       // QIT_WP_ADMIN
qit.env.baseUrl        // QIT_BASE_URL
qit.env.id             // QIT_ENV_ID

qit.env.db.host        // QIT_DB_HOST
qit.env.db.name        // QIT_DB_NAME
qit.env.db.user        // QIT_DB_USER
qit.env.db.password    // QIT_DB_PASSWORD

qit.env.wp.username    // QIT_WP_USERNAME
qit.env.wp.password    // QIT_WP_PASSWORD

qit.env.containers.php // QIT_PHP_CONTAINER
qit.env.containers.db  // QIT_DB_CONTAINER

qit.env.sut.slug       // QIT_SUT_SLUG
qit.env.sut.type       // QIT_SUT_TYPE
qit.env.sut.entrypoint // QIT_SUT_ENTRYPOINT

qit.env.versions.wp    // QIT_WP_VERSION
qit.env.versions.woo   // QIT_WOO_VERSION
qit.env.versions.php   // QIT_PHP_VERSION

qit.env.plugins.active       // QIT_ACTIVE_PLUGINS (as string[])
qit.env.plugins.additional   // QIT_ADDITIONAL_PLUGINS (as string[])
qit.env.themes.additional    // QIT_ADDITIONAL_THEMES (as string[])
qit.env.testPackages         // QIT_TEST_PACKAGES (as string[])
```

### `qit.wp(command)` / `qit.exec(command)` — Docker Execution

Execute commands inside the PHP container. Requires a running QIT Docker environment.

```typescript
// WP-CLI (automatically adds --allow-root)
const plugins = await qit.wp('plugin list --format=json');

// Arbitrary command
const phpVersion = await qit.exec('php --version');
```

### `qit.actions(name)` — Action Discovery

Returns an array of all registered implementations for the named action. Each function has a `.provider` property identifying which package registered it.

```typescript
const fns = qit.actions('makePurchase');
// => [fn1, fn2, ...] or [] if none registered
// fn1.provider => 'stripe/payments'
```

### `qit.hasAction(name)` — Check Action Availability

```typescript
if (qit.hasAction('makePurchase')) {
  // At least one package provides this action
}
```

### `qit.package(name)` — Load Package Exports

```typescript
const woo = qit.package('woocommerce/core-utils');
// Returns whatever the package's index.js/index.ts exports
```

### `qit.waitFor(condition, timeout?, interval?)` — Async Polling

```typescript
await qit.waitFor(() => someCondition(), 30000, 1000);
```

## Availability Tiers

The runtime works in any context — the import never fails. What varies is what's available:

| Tier | When | Examples |
|------|------|---------|
| **Always available** | Any context | `env.isQit`, `actions()`, `hasAction()`, `package()`, `waitFor()`, `version` |
| **Needs env vars** | `QIT_*` vars set (by QIT CLI or manually) | `env.siteUrl`, `env.db.*` — throws descriptive error if missing |
| **Needs Docker** | QIT containers running | `wp()`, `exec()` — throws "QIT_PHP_CONTAINER not set" |

This means tests can use `qit.actions()` even outside QIT — it just returns `[]`, producing zero test cases instead of an error.

```typescript
// Safe to run anywhere — zero actions = zero iterations = no tests = no failure
for (const makePurchase of qit.actions('makePurchase')) {
  test(`via ${makePurchase.provider}`, async ({ page }) => { ... });
}

// Guard Docker-dependent code
test('verify plugin state', async () => {
  test.skip(!qit.env.isQit, 'Requires QIT environment');
  await qit.wp('plugin list');
});
```
