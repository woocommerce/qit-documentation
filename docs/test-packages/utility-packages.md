# Utility Packages

Utility Packages provide environment setup, configuration, and teardown functionality without running actual tests. They're perfect for preparing test environments, seeding data, and cleaning up after test runs.

## What are Utility Packages?

A Utility Package is identified by the **absence of a `run` phase** in its manifest. It can have any other phases (globalSetup, setup, teardown, globalTeardown) but no test execution.

### Key Characteristics

- **No run phase**: Never executes tests
- **No results**: Cannot have `results` configuration
- **Environment preparation**: Perfect for setup tasks
- **Shared configuration**: Changes available to all packages
- **Works with env:up**: Can be used with `--global-setup` flag

## When to Use Utility Packages

### Environment Configuration
```json
{
  "package": "woocommerce/disable-onboarding",
  "description": "Disable WooCommerce onboarding wizards",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes",
        "wp option set woocommerce_onboarding_profile_completed yes",
        "wp option set woocommerce_task_list_complete yes"
      ]
    }
  }
}
```

### Test Data Seeding
```json
{
  "package": "woocommerce/seed-test-data",
  "description": "Create test products and users",
  "test": {
    "phases": {
      "globalSetup": [
        "wp user create customer customer@test.com --role=customer --user_pass=test123",
        "wp user create vendor vendor@test.com --role=shop_manager --user_pass=test123",
        "wp wc product create --name='Simple Product' --regular_price=9.99 --user=1",
        "wp wc product create --name='Variable Product' --type=variable --user=1",
        "wp post create --post_type=shop_coupon --post_title=TESTCOUPON --post_status=publish"
      ]
    }
  }
}
```

### Plugin Installation
```json
{
  "package": "woocommerce-bookings/install-helpers",
  "description": "Install helper plugins for testing",
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install wordpress-importer --activate",
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp plugin install query-monitor --activate"
      ],
      "globalTeardown": [
        "wp plugin deactivate wordpress-importer query-monitor",
        "wp plugin delete wordpress-importer query-monitor"
      ]
    }
  }
}
```

### Database Import
```json
{
  "package": "woocommerce/import-sample-data",
  "description": "Import sample WooCommerce data",
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install wordpress-importer --activate",
        "curl -O https://raw.githubusercontent.com/woocommerce/woocommerce/trunk/sample-data/sample_products.xml",
        "wp import sample_products.xml --authors=create",
        "rm sample_products.xml"
      ]
    }
  }
}
```

## Using Utility Packages with env:up

### The --global-setup Flag

The `env:up` command with `--global-setup` is perfect for utility packages:

```bash
php qit-cli.php env:up woocommerce --global-setup --config=utilities.json
```

### Configuration Example

`utilities.json`:
```json
{
  "test_packages": [
    "./utilities/disable-onboarding",
    "./utilities/seed-test-data",
    "./utilities/configure-payment",
    "./utilities/import-sample-data"
  ]
}
```

### What Happens

1. Environment starts (WordPress, WooCommerce, PHP)
2. Each utility package's `globalSetup` runs in order
3. Environment stays running for manual testing
4. **No test execution** (utility packages have no run phase)
5. **No database snapshots** (env:up doesn't snapshot)

### Perfect for Development

```bash
# Start environment with all setup done
php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json

# Load environment variables
source "$(qit env:source qitenv...)"

# Now manually test or develop
cd my-test-package/
npx playwright test --ui
```

## Utility Packages in Test Runs

### Mixed with Test Packages

`qit-config.json`:
```json
{
  "test_packages": [
    "./utilities/environment-setup",    // Utility
    "./tests/checkout",                 // Test
    "./tests/payment",                  // Test
    "./utilities/cleanup"               // Utility
  ]
}
```

### Execution Order

1. **Secret validation** - All packages checked
2. **Global setup** - From ALL packages (utilities and tests)
3. **Database snapshot** - Baseline created
4. **Package execution**:
   - Utility packages: Skip run and results phases
   - Test packages: Execute all phases including run

### Example Flow

```
┌─ GLOBAL SETUP ─────────────────────────────────
│ [utilities/environment-setup] Disabling wizards...
│ [tests/checkout] Creating test coupon...
│ [tests/payment] Installing Stripe plugin...
│ [utilities/cleanup] (no globalSetup)
└────────────────────────────────────────────────

┌─ PACKAGE [1/4]: utilities/environment-setup ───
│ ➤ Setup phase
│ ✓ Setup completed
│ ➤ Run phase - SKIPPED (utility package)
│ ➤ Results - SKIPPED (utility package)
│ ➤ Teardown phase
│ ✓ Teardown completed
└────────────────────────────────────────────────

┌─ PACKAGE [2/4]: tests/checkout ────────────────
│ ➤ Database restored
│ ➤ Setup phase
│ ➤ Run phase
│ ✓ Tests passed (10/10)
│ ➤ Results collected
│ ➤ Teardown phase
└────────────────────────────────────────────────
```

## Common Utility Package Patterns

### Pattern 1: Environment Reset

```json
{
  "package": "woocommerce/reset-environment",
  "description": "Reset to clean state",
  "test": {
    "phases": {
      "globalTeardown": [
        "wp site empty --yes",
        "wp plugin deactivate --all",
        "wp theme activate twentytwentythree",
        "wp user delete $(wp user list --field=ID --role=subscriber) --yes"
      ]
    }
  }
}
```

### Pattern 2: Payment Gateway Configuration

```json
{
  "package": "woocommerce-stripe/configure-test-mode",
  "description": "Configure Stripe for testing",
  "requires": {
    "secrets": ["STRIPE_TEST_KEY", "STRIPE_TEST_SECRET"]
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp option set woocommerce_stripe_settings '{\"enabled\":\"yes\",\"testmode\":\"yes\",\"test_publishable_key\":\"$STRIPE_TEST_KEY\",\"test_secret_key\":\"$STRIPE_TEST_SECRET\"}' --format=json"
      ]
    }
  }
}
```

### Pattern 3: Performance Optimization

```json
{
  "package": "woocommerce/optimize-for-tests",
  "description": "Optimize WordPress for test performance",
  "test": {
    "phases": {
      "globalSetup": [
        "wp config set WP_DEBUG false --raw",
        "wp config set SCRIPT_DEBUG false --raw",
        "wp plugin deactivate akismet hello",
        "wp option update blog_public 0",
        "wp rewrite structure '/%postname%/' --hard"
      ]
    }
  }
}
```

### Pattern 4: Multi-Store Setup

```json
{
  "package": "woocommerce-multilingual/multistore-setup",
  "description": "Configure multi-currency and multi-language",
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-multilingual --activate",
        "wp option set woocommerce_currency 'USD'",
        "wp option set woocommerce_currency_pos 'left'",
        "wp wc tool run install_pages --user=1"
      ]
    }
  }
}
```

## Best Practices

### 1. Single Responsibility

Each utility package should have one clear purpose:

Good:
- `disable-onboarding` - Only disables wizards
- `create-products` - Only creates products
- `configure-payment` - Only sets up payment

Bad:
- `setup-everything` - Does too much
- `misc-utils` - Unclear purpose

### 2. Idempotent Operations

Make commands safe to run multiple times:

```json
{
  "globalSetup": [
    "wp user list --field=ID --role=customer | grep -q 12345 || wp user create testuser test@test.com --role=customer",
    "wp option get woocommerce_task_list_hidden || wp option set woocommerce_task_list_hidden yes"
  ]
}
```

### 3. Clear Naming

Use descriptive names that indicate utility purpose:

```
utilities/
├── disable-onboarding/
├── seed-test-products/
├── configure-stripe-gateway/
└── cleanup-test-data/
```

### 4. Document Side Effects

Add descriptions explaining what changes:

```json
{
  "description": "Disables all WooCommerce onboarding wizards and admin notices. Sets: woocommerce_task_list_hidden, woocommerce_onboarding_profile_completed"
}
```

### 5. Provide Cleanup

If a utility sets up, provide corresponding teardown:

```json
{
  "phases": {
    "globalSetup": [
      "wp user create testuser test@test.com"
    ],
    "globalTeardown": [
      "wp user delete testuser --yes"
    ]
  }
}
```

## Validation Rules

### Cannot Have Run Phase

This is **invalid** for a utility package:
```json
{
  "test": {
    "phases": {
      "run": ["echo 'This makes it a test package'"]
    }
  }
}
```

### Cannot Have Results

This is **invalid** for a utility package:
```json
{
  "test": {
    "results": {
      "ctrf-json": "./results.json"
    }
  }
}
```

### Can Have Other Phases

This is **valid** for a utility package:
```json
{
  "test": {
    "phases": {
      "globalSetup": ["..."],
      "setup": ["..."],
      "teardown": ["..."],
      "globalTeardown": ["..."]
    }
  }
}
```

## Debugging Utility Packages

### Test Individually

```bash
# Create a config with just one utility
echo '{
  "test_packages": ["./utilities/my-utility"]
}' > test-utility.json

# Run it
php qit-cli.php env:up woocommerce --global-setup --config=test-utility.json
```

### Check Execution

Watch what commands actually run:

```bash
php qit-cli.php run:e2e woocommerce --config=utilities.json --verbose
```

### Verify Changes

After utility runs, check the environment:

```bash
# Check options
wp option get woocommerce_task_list_hidden

# Check users
wp user list

# Check plugins
wp plugin list --status=active
```

## Common Issues

### Utility Package Has Results

**Error:**
```
Validation error: Utility package cannot have results configuration
```

**Solution:**
Remove the `results` section from qit-test.json

### Command Fails in GlobalSetup

**Error:**
```
globalSetup failed: wp: command not found
```

**Solution:**
GlobalSetup runs in container context. Use WP-CLI commands directly:
```json
{
  "globalSetup": [
    "wp plugin install helper --activate"  // Correct
  ]
}
```

Not:
```json
{
  "globalSetup": [
    "[host] wp plugin install helper"  // Wrong - wp not on host
  ]
}
```

### Changes Don't Persist

**Issue:** Utility package changes disappear

**Cause:** With `run:e2e`, database restores between packages

**Solution:** Use `globalSetup` for changes that should persist to all packages:
```json
{
  "phases": {
    "globalSetup": ["..."],  // Persists to snapshot
    "setup": ["..."]         // Only for this package
  }
}
```