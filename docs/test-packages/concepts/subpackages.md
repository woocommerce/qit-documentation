# Subpackages: Publishing Multiple Test Variants

Subpackages allow you to publish multiple focused test packages from a single codebase, each targeting specific test scenarios while sharing the same underlying test suite.

## Core Concept

Subpackages are **slices of the same test suite release**, not independent packages. They share code, version together, and execute as variants of their parent package.

## When to Use Subpackages

Use subpackages when you want to:
- Share specific test scenarios (checkout, cart, API) from your comprehensive E2E suite
- Allow others to test compatibility with your critical flows
- Provide focused test sets without exposing your entire test suite
- Maintain a single codebase while publishing multiple test packages

## How Subpackages Work

### Manifest Structure

Define subpackages in your main `qit-test.json`:

```json
{
  "package": "woocommerce/e2e",
  "description": "Complete WooCommerce E2E test suite",
  "test": {
    "phases": {
      "globalSetup": ["./scripts/setup-woo.sh"],
      "run": ["npx playwright test"],
      "teardown": ["./scripts/cleanup.sh"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  },
  "subpackages": {
    "woocommerce/checkout": {
      "description": "Checkout flow tests only",
      "tags": ["critical", "checkout"],
      "test": {
        "phases": {
          "run": ["npx playwright test --project=checkout"]
        }
      }
    },
    "woocommerce/minimal": {
      "description": "Minimal smoke tests",
      "tags": ["smoke"],
      "test": {
        "phases": {
          "run": ["npx playwright test --grep @critical"]
        }
      }
    }
  }
}
```

### Publishing

When you publish, all packages are created with the same version:

```bash
# Publishes the parent and all subpackages
qit package:publish tests/e2e --version=2.0.0

# Creates:
# - woocommerce/e2e:2.0.0
# - woocommerce/checkout:2.0.0
# - woocommerce/minimal:2.0.0
```

### Consuming

Users reference subpackages like any other package:

```bash
# Run just checkout tests
qit run:e2e my-plugin --test-package=woocommerce/checkout:latest

# Run multiple subpackages
qit run:e2e my-plugin \
  --test-package=woocommerce/checkout:latest \
  --test-package=woocommerce/minimal:latest
```

## Key Constraints

### 1. Version Consistency

All subpackages from the same parent must use the same version:

```bash
# ❌ This will fail - version mismatch
--test-package=woocommerce/checkout:1.0.0 \
--test-package=woocommerce/minimal:2.0.0

# ✅ This works - same version
--test-package=woocommerce/checkout:2.0.0 \
--test-package=woocommerce/minimal:2.0.0
```

### 2. Inheritance Rules

Subpackages inherit from their parent and have specific override constraints:

**Can Override:**
- `description` - Package description
- `tags` - Package tags for discovery
- `test.phases.setup` - Package-specific setup
- `test.phases.run` - Test execution command
- `test.phases.teardown` - Package-specific cleanup

**Cannot Override:**
- `test.phases.globalSetup` - Shared environment setup
- `test.phases.globalTeardown` - Shared environment cleanup  
- `test.results` - Result paths (inherited from parent, but isolated at runtime)

### 3. Global Phase Execution

When multiple subpackages run together, global phases execute once:

```
Parent globalSetup (once)
├── DB Snapshot
├── Subpackage 1: setup → run → teardown
├── DB Restore
├── Subpackage 2: setup → run → teardown
└── Parent globalTeardown (once)
```

## Runtime Optimizations

### Single Download

When multiple subpackages from the same parent are requested, QIT downloads the artifact only once:

```bash
# These share the same artifact
--test-package=woocommerce/checkout:2.0.0 \
--test-package=woocommerce/cart:2.0.0 \
--test-package=woocommerce/minimal:2.0.0

# QIT downloads once, extracts once, runs three times
```

### Results Isolation

Each subpackage's results are isolated to prevent overwrites:

```
/tmp/qit-run-xyz/
├── woocommerce-checkout/
│   └── results/
│       └── ctrf.json    # Checkout test results
├── woocommerce-cart/
│   └── results/
│       └── ctrf.json    # Cart test results
```

## Best Practices

### 1. Use Playwright Projects

Align subpackages with Playwright projects for clean separation:

```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'checkout', testMatch: /checkout\/.*.spec.js/ },
    { name: 'cart', testMatch: /cart\/.*.spec.js/ },
    { name: 'api', testMatch: /api\/.*.spec.js/ }
  ]
};
```

### 2. Semantic Naming

Choose clear, descriptive names that indicate the test focus:

```
✅ Good:
- woocommerce/checkout
- woocommerce/cart
- woocommerce/api

❌ Avoid:
- woocommerce/tests1
- woocommerce/subset
- woocommerce/partial
```

### 3. Documentation

Document what each subpackage tests:

```json
{
  "subpackages": {
    "yourplugin/checkout": {
      "description": "Tests checkout flow with your plugin active",
      "tags": ["checkout", "critical", "payments"]
    }
  }
}
```

## Common Patterns

### Critical Path Testing

Expose critical user flows as subpackages:

```json
{
  "subpackages": {
    "myshop/purchase": {
      "description": "Complete purchase flow",
      "test": {
        "phases": {
          "run": ["npx playwright test --grep '@purchase'"]
        }
      }
    }
  }
}
```

### Integration Testing

Share integration points for other plugins:

```json
{
  "subpackages": {
    "myplugin/api": {
      "description": "API integration tests",
      "test": {
        "phases": {
          "run": ["npx playwright test --project=api"]
        }
      }
    }
  }
}
```

### Smoke Testing

Provide minimal smoke tests:

```json
{
  "subpackages": {
    "myplugin/smoke": {
      "description": "Basic functionality checks",
      "test": {
        "phases": {
          "run": ["npx playwright test --grep '@smoke'"]
        }
      }
    }
  }
}
```

### Feature Configuration Testing

Test different feature configurations:

```json
{
  "subpackages": {
    "myplugin/blocks": {
      "description": "Tests with WooCommerce Blocks enabled",
      "test": {
        "phases": {
          "setup": ["wp option set woocommerce_blocks_enabled yes"],
          "run": ["npx playwright test --project=blocks"]
        }
      }
    },
    "myplugin/classic": {
      "description": "Tests with Classic checkout",
      "test": {
        "phases": {
          "setup": ["wp option set woocommerce_blocks_enabled no"],
          "run": ["npx playwright test --project=classic"]
        }
      }
    }
  }
}
```

This pattern lets you test how your plugin behaves with different WordPress/WooCommerce configurations.

## Migration from Separate Packages

If you currently maintain separate test packages, you can consolidate them:

**Before:**
```
tests/checkout/qit-test.json  # Separate package
tests/cart/qit-test.json      # Separate package
tests/api/qit-test.json       # Separate package
```

**After:**
```json
// tests/e2e/qit-test.json
{
  "package": "myplugin/e2e",
  "subpackages": {
    "myplugin/checkout": { /* ... */ },
    "myplugin/cart": { /* ... */ },
    "myplugin/api": { /* ... */ }
  }
}
```

Benefits:
- Single codebase to maintain
- Shared dependencies and helpers
- Consistent versioning
- Reduced duplication

## Limitations

1. **No selective versioning** - All subpackages version together
2. **Shared global phases** - Cannot have different global setups
3. **Same artifact** - All subpackages ship the same code (filtered at runtime)

These limitations are intentional - they ensure subpackages remain coherent slices of the same test suite rather than becoming independent packages that drift apart.