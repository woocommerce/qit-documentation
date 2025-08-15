# Subpackages: Publishing Multiple Test Variants

Subpackages allow you to publish multiple focused test packages from a single codebase, each targeting specific test scenarios while sharing the same underlying test suite.

## Core Philosophy

**Subpackages are a publishing convenience, not an architectural concept.**

They exist to solve a practical problem: you have a comprehensive test suite, but you want to share only specific, relevant tests with the ecosystem. Instead of maintaining separate test suites, you publish multiple packages from one codebase.

Think of subpackages like **camera lenses**:
- The camera (parent package) is your complete test infrastructure
- Different lenses (subpackages) give different views
- You can quickly swap lenses (run different subpackages)
- But it's still the same camera (shared codebase)

## When to Use Subpackages

Use subpackages when you want to:
- Share specific test scenarios (checkout, cart, API) from your comprehensive E2E suite
- Allow others to test compatibility with your critical flows
- Provide focused test sets without exposing your entire test suite
- Create utility packages for environment setup
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
    },
    "woocommerce/setup-multisite": {
      "description": "Configure multisite environment",
      "tags": ["utility", "multisite"],
      "test": {
        "phases": {
          "globalSetup": [
            "./scripts/setup-woo.sh",
            "./scripts/enable-multisite.sh"
          ]
          // No run phase - this is a utility package
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
# - woocommerce/setup-multisite:2.0.0
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

# Use a utility subpackage for environment setup
qit env:up --global-setup woocommerce/setup-multisite:latest
```

## The globalSetup Model

### Inheritance and Override

Subpackages inherit the parent's `globalSetup` by default but **can override it** when needed:

```json
{
  "package": "woocommerce/e2e",
  "test": {
    "phases": {
      "globalSetup": [
        "./scripts/dismiss-onboarding.sh",
        "./scripts/configure-basics.sh"
      ]
    }
  },
  "subpackages": {
    "woocommerce/checkout": {
      "test": {
        "phases": {
          // Inherits parent's globalSetup
          "run": ["npx playwright test checkout/"]
        }
      }
    },
    "woocommerce/hpos": {
      "test": {
        "phases": {
          "globalSetup": [
            "./scripts/dismiss-onboarding.sh",
            "./scripts/configure-basics.sh",
            "./scripts/enable-hpos.sh"  // Additional setup
          ],
          "run": ["npx playwright test hpos/"]
        }
      }
    }
  }
}
```

### De-duplication

When multiple subpackages run together, QIT collects all `globalSetup` commands and de-duplicates them:

```
Parent globalSetup:
  - dismiss-onboarding.sh
  - configure-basics.sh

Subpackage 1 globalSetup:
  - dismiss-onboarding.sh    [duplicate]
  - configure-basics.sh      [duplicate]
  - enable-hpos.sh           [unique]

Subpackage 2 globalSetup:
  - dismiss-onboarding.sh    [duplicate]
  - setup-stripe.sh          [unique]

Result - Runs once in order:
  1. dismiss-onboarding.sh
  2. configure-basics.sh
  3. enable-hpos.sh
  4. setup-stripe.sh
```

This creates ONE shared environment with all necessary setup, then takes a single database snapshot that all packages use as their baseline.

### Why De-duplication Works

Since subpackages are variants of the same test suite:
- They need the same foundational setup
- Additional commands are complementary, not conflicting
- Order is preserved within each package's commands
- The result is a complete environment for all tests

## Key Characteristics

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

### 2. Shared Infrastructure

All subpackages share:
- Same Playwright configuration
- Same `package.json` dependencies
- Same helper functions and utilities
- Same directory structure

```
tests/e2e/
├── qit-test.json          # Defines parent and all subpackages
├── playwright.config.js   # Shared by all
├── package.json          # Shared by all
├── helpers/              # Shared utilities
└── tests/
    ├── checkout/*.spec.js
    ├── cart/*.spec.js
    └── api/*.spec.js
```

### 3. Inheritance Rules

| Phase | Inherited from Parent | Override Allowed | Notes |
|-------|----------------------|------------------|-------|
| globalSetup | Yes | Yes | Commands are de-duplicated |
| globalTeardown | Yes | Yes | Commands are de-duplicated |
| setup | No | N/A | Must be explicit per package |
| run | No | N/A | Must be explicit (or omit for utilities) |
| teardown | No | N/A | Must be explicit per package |

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

### Execution Flow

When multiple subpackages run together:

```
Collect all globalSetup commands
├── De-duplicate commands
├── Run unique commands once
├── DB Snapshot
├── Subpackage 1: restore → setup → run → teardown
├── Subpackage 2: restore → setup → run → teardown
├── Subpackage 3: restore → setup → run → teardown
└── Global teardown (de-duplicated)
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

### Utility Packages

Create environment modifiers without tests:

```json
{
  "subpackages": {
    "myplugin/setup-heavy": {
      "description": "Generate heavy test data",
      "test": {
        "phases": {
          "globalSetup": [
            "./scripts/dismiss-onboarding.sh",
            "wp post generate --count=1000",
            "wp user generate --count=100"
          ]
          // No run phase - utility package
        }
      }
    },
    "myplugin/setup-multisite": {
      "description": "Configure multisite network",
      "test": {
        "phases": {
          "globalSetup": [
            "./scripts/dismiss-onboarding.sh",
            "./scripts/enable-multisite.sh"
          ]
          // No run phase - utility package
        }
      }
    }
  }
}
```

Usage:
```bash
# Set up environment with heavy data
qit env:up --global-setup myplugin/setup-heavy:latest

# Or use in testing
qit run:e2e other-plugin \
  --test-package=myplugin/setup-heavy:latest \
  --test-package=other-plugin/performance:latest
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
- woocommerce/setup-heavy

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

### 4. Keep Subpackages Focused

Each subpackage should have a clear, single purpose. Don't create too many subpackages - it creates confusion.

### 5. Share Common Setup

Most `globalSetup` should be in the parent or duplicated across subpackages. Unique setup commands should be the exception, not the rule.

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

## What Subpackages Are NOT

1. **Not separate test suites** - They're views into one suite
2. **Not independent packages** - They share code and version together
3. **Not architectural boundaries** - They're publishing boundaries
4. **Not for different plugins** - They're variants of the same plugin's tests

## Example: Complete Real-World Structure

```json
{
  "package": "woocommerce-stripe/e2e",
  "test": {
    "phases": {
      "globalSetup": [
        "./scripts/dismiss-onboarding.sh",
        "./scripts/configure-stripe-basic.sh"
      ],
      "run": ["npx playwright test"]
    }
  },
  "subpackages": {
    "woocommerce-stripe/checkout": {
      "description": "Payment flow tests",
      "test": {
        "phases": {
          // Inherits parent's globalSetup (not declared)
          "run": ["npx playwright test checkout/"]
        }
      }
    },
    "woocommerce-stripe/3ds": {
      "description": "3D Secure authentication tests",
      "test": {
        "phases": {
          "globalSetup": [
            "./scripts/dismiss-onboarding.sh",      // Must re-declare
            "./scripts/configure-stripe-basic.sh",   // Must re-declare
            "./scripts/enable-3ds.sh"                // Additional
          ],
          "run": ["npx playwright test 3ds/"]
        }
      }
    },
    "woocommerce-stripe/setup": {
      "description": "Configure Stripe for other tests",
      "test": {
        "phases": {
          "globalSetup": [
            "./scripts/dismiss-onboarding.sh",       // Must re-declare
            "./scripts/configure-stripe-full.sh"     // Different config
          ]
          // No run phase - utility package
        }
      }
    }
  }
}
```

## Conclusion

Subpackages are a **publishing optimization** that allows you to share different aspects of your test suite without maintaining multiple codebases. They're not a complex architectural concept - they're a simple tool for creating multiple packages from one source of truth.

The key insight: **one codebase, multiple publishes, shared infrastructure**.