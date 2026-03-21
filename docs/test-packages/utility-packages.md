---
description: "Complete guide to utility packages — test packages without a run phase, used for environment setup and configuration. Covers how to attach them to environments via the `utilities` array in qit.json, create them with `qit package:scaffold --package-type=utility`, publish to the registry, and discover available utilities with `qit package:list --type=utility`. Documents common patterns (disable onboarding wizards, configure payment gateways, seed test data, set plugin defaults), execution order within test runs (globalSetup runs for utilities too, but run phase is skipped), validation rules (must NOT have run phase or results), and debugging tips."
---

# Utility Packages

Utility Packages provide environment setup, configuration, and teardown functionality without running actual tests. They're perfect for preparing test environments, seeding data, and cleaning up after test runs.

Utility packages can be used locally or published to the QIT registry for sharing across teams and projects.

## Quick Start

### Use a Registry Utility

```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wp": "stable",
      "woo": "stable",
      "utilities": [
        "woocommerce/disable-onboarding:latest"
      ]
    }
  }
}
```

### Discover Available Utilities

```bash
# List all utilities in registry
qit package:list --type=utility

# Show utility details
qit package:show woocommerce/disable-onboarding:latest
```

### Create Your Own Utility

```bash
# Scaffold a utility package
qit package:scaffold utilities/my-utility \
  --package=my-plugin/my-utility:1.0.0 \
  --package-type=utility

# This creates:
# - qit-test.json (with setup phases, no run phase)
# - bootstrap/ scripts for setup/teardown
# - No Playwright or npm dependencies
```

### Publish Your Own Utility

```bash
# Publish to registry
cd utilities/my-utility
qit package:publish . 1.0.0
```

## What are Utility Packages?

A Utility Package is identified by the **absence of a `run` phase** in its manifest. It can have any other phases (globalSetup, setup, teardown, globalTeardown) but no test execution.

### Key Characteristics

- **No run phase**: Never executes tests
- **No results**: Cannot have `results` configuration
- **Environment preparation**: Perfect for setup tasks
- **Shared configuration**: Changes available to all packages
- **Works with env:up**: Can be used with `--global-setup` flag
- **Local or Registry**: Can be used from local filesystem or QIT registry

## Attaching Utilities to Environments

Utility packages attach to environments in your `qit.json` configuration using the `utilities` array. This ensures every test using that environment automatically gets the utility setup.

```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wp": "stable",
      "woo": "stable",
      "utilities": [
        "./utilities/disable-onboarding",           // Local utility
        "woocommerce/woopay-setup:latest",          // Registry utility (latest version)
        "woocommerce/sample-data:1.2.0"             // Registry utility (specific version)
      ]
    },
    "legacy": {
      "php": "7.4",
      "wp": "6.4",
      "woo": "8.0",
      "utilities": [
        "./utilities/disable-onboarding"
      ]
    }
  }
}
```

**Why attach to environments?**
- Utilities configure environments, not tests
- Every test using that environment automatically gets the utilities
- Clean separation of concerns: environment vs test logic

### Local vs Registry Utilities

**Local Utilities** - Stored in your project directory:
```json
{
  "utilities": ["./utilities/disable-onboarding"]
}
```
- Perfect for project-specific setup
- Easy to modify and test
- No publishing required

**Registry Utilities** - Published to QIT registry:
```json
{
  "utilities": [
    "woocommerce/disable-onboarding:latest",
    "woocommerce/woopay-setup:1.2.0",
    "vendor/utility-name:^1.0"
  ]
}
```
- Shared across teams and projects
- Version-controlled
- Supports semver versioning (latest, 1.2.0, ^1.0, etc.)
- Automatically downloaded and cached

## When to Use Utility Packages

### Environment Configuration
```json
{
  "package": "woocommerce/disable-onboarding",
  "package_type": "utility",
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
  "package_type": "utility",
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
  "package_type": "utility",
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
  "package_type": "utility",
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
qit env:up --global-setup --config=utilities.json
```

### Configuration Example

`utilities.json`:
```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wp": "stable",
      "woo": "stable",
      "utilities": [
        "./utilities/disable-onboarding",
        "woocommerce/sample-data:latest",
        "./utilities/configure-payment"
      ]
    }
  }
}
```

### What Happens

1. Environment starts (WordPress, WooCommerce, PHP)
2. Each utility package's `globalSetup` runs in order
3. Registry utilities are automatically downloaded and cached
4. Environment stays running for manual testing
5. **No test execution** (utility packages have no run phase)

### Perfect for Development

```bash
# Start environment with all setup done
qit env:up --global-setup --config=dev-setup.json

# Load environment variables
source "$(qit env:source <env-id>)"

# Now manually test or develop
cd my-test-package/
npx playwright test --ui
```

## Utility Packages in Test Runs

### Automatic Integration

When running tests with `qit run:e2e`, utilities from the selected environment are automatically included:

```json
{
  "environments": {
    "default": {
      "php": "8.2",
      "wp": "stable",
      "woo": "stable",
      "utilities": [
        "./utilities/disable-onboarding",
        "woocommerce/sample-data:latest"
      ]
    }
  },
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./tests/checkout",
          "./tests/payment"
        ]
      }
    }
  }
}
```

```bash
# This automatically includes utilities from "default" environment
qit run:e2e my-plugin --test-package=./tests/checkout

# Equivalent to running with:
# - ./utilities/disable-onboarding
# - woocommerce/sample-data:latest
# - ./tests/checkout
```

### Execution Order

1. **Secret validation** - All packages checked (utilities + tests)
2. **Global setup** - From ALL packages (utilities and tests)
3. **Database snapshot** - Baseline created after all globalSetup phases
4. **Package execution**:
   - Utility packages: **SKIPPED** (display shows "Skipping package-name (utility package)")
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
  "package_type": "utility",
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
  "package_type": "utility",
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
  "package_type": "utility",
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
  "package_type": "utility",
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

## Publishing Utilities to the Registry

Share your utility packages with other teams by publishing them to the QIT registry.

### Publishing a Utility Package

```bash
# Navigate to utility directory
cd utilities/disable-onboarding

# Publish to registry
qit package:publish . 1.0.0

# Output shows:
# Package type: utility
# (No test_type shown for utilities)
```

The package type is automatically detected from your manifest (absence of `run` phase = utility package).

### Manifest Requirements

Your utility package must have a valid `qit-test.json`:

```json
{
  "package": "your-namespace/utility-name",
  "package_type": "utility",
  "description": "Brief description of what this utility does",
  "tags": ["setup", "configuration", "woocommerce"],
  "requires": {
    "plugins": ["woocommerce"],
    "themes": ["storefront"],
    "secrets": ["API_KEY"]
  },
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set some_option value"
      ]
    }
  }
}
```

**Important:** Utility packages cannot have:
- `run` phase
- `results` configuration

## Discovering Registry Utilities

### List Available Utilities

```bash
# List all utilities
qit package:list --type=utility

# Search for specific utilities
qit package:list --type=utility --search=woocommerce

# List only test packages
qit package:list --type=test

# List all package types
qit package:list --type=all
```

### Show Utility Details

```bash
# View comprehensive package information
qit package:show woocommerce/disable-onboarding:latest

# Output shows:
# - Package type: 🔧 Utility Package
# - Description
# - Tags
# - Required plugins, themes, and secrets
# - Available phases
# - Usage hints

# JSON format
qit package:show woocommerce/my-utility:latest --json
```

The `package:show` command displays:
- **Basic Information**: Package ID, version, visibility
- **Description**: What the utility does
- **Tags**: Categorization for searching
- **Requirements**: Plugins, themes, secrets needed
- **Phases**: Which lifecycle phases are implemented
- **Usage Hints**: How to use the utility in your config

### Example Output

```
Package Details: woocommerce/disable-onboarding:latest
==========================================================

Basic Information
-----------------
 Package ID   woocommerce/disable-onboarding:latest
 Type         🔧 Utility Package
 Namespace    woocommerce
 Version      1.0.0
 Visibility   🌐 Public

Description
-----------
 Disables WooCommerce onboarding wizards and admin notices

Tags
----
 setup, woocommerce, configuration

Requirements
------------
  Plugins:
    • woocommerce

Phases
------
  ✓ globalSetup:
        wp option set woocommerce_task_list_hidden yes
        wp option set woocommerce_onboarding_profile_completed yes

💡 Use qit package:download woocommerce/disable-onboarding:latest to download
💡 Add to your qit.json under "utilities" to use in environments
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
cat > test-utility.json <<'EOF'
{
  "environments": {
    "default": {
      "php": "8.2",
      "wp": "stable",
      "woo": "stable",
      "utilities": ["./utilities/my-utility"]
    }
  }
}
EOF

# Run it
qit env:up --global-setup --config=test-utility.json
```

### Check Execution

Watch what commands actually run:

```bash
# Verbose output shows all utility operations
qit run:e2e woocommerce --config=utilities.json --verbose
```

### Verify Changes

After utility runs, check the environment:

```bash
# Get environment ID from env:up output
source "$(qit env:source <env-id>)"

# Check options
qit env:exec <env-id> "wp option get woocommerce_task_list_hidden"

# Check users
qit env:exec <env-id> "wp user list"

# Check plugins
qit env:exec <env-id> "wp plugin list --status=active"
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