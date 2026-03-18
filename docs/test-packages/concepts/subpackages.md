# Subpackages: Publishing Test Subsets

Subpackages allow you to publish focused test subsets from a single codebase, each selecting specific tests to run while sharing the same test infrastructure and environment setup.

## Core Philosophy

**Subpackages are a publishing convenience, not an architectural concept.**

They exist to solve a practical problem: you have a comprehensive test suite, but you want to share only specific, relevant tests with the ecosystem. Instead of maintaining separate test suites, you publish multiple packages from one codebase.

Think of subpackages like **playlists from an album**:
- The album (parent package) is your complete test suite
- Different playlists (subpackages) select different songs
- All playlists use the same audio setup and equipment
- But each playlist chooses which songs to play

## When to Use Subpackages

Use subpackages when you want to:
- Share specific test scenarios (checkout, cart, API) from your comprehensive E2E suite
- Allow others to test compatibility with your critical flows
- Provide focused test sets without exposing your entire test suite
- Maintain a single codebase while publishing multiple test packages

**Important:** Subpackages are pure subsets - they can only select which tests to run, not change how the environment is configured. If you need different setup/teardown, create separate test packages instead.

## How Subpackages Work

### Manifest Structure

Define subpackages in your main `qit-test.json`:

```json
{
  "package": "woocommerce/e2e",
  "package_type": "test",
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
qit package:publish tests/e2e 2.0.0

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

# Run multiple test subsets
qit run:e2e my-plugin \
  --test-package=woocommerce/checkout:latest \
  --test-package=woocommerce/api:latest
```

## Phase Inheritance Model

### Automatic Inheritance

Subpackages automatically inherit ALL phases from the parent except `run`, which they must override to select their test subset:

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
          // Automatically inherits all parent phases
          // Only override run to select test subset
          "run": ["npx playwright test checkout/"]
        }
      }
    },
    "woocommerce/api": {
      "test": {
        "phases": {
          // Automatically inherits all parent phases
          // Only override run to select test subset
          "run": ["npx playwright test api/"]
        }
      }
    }
  }
}
```

### Why This Model Works

Since subpackages are pure subsets of the parent:
- They all need the exact same environment setup
- They all need the same teardown procedures
- Only the test selection differs between them
- This ensures consistent test environments across all subsets

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
| globalSetup | Yes | No | Always inherited from parent |
| globalTeardown | Yes | No | Always inherited from parent |
| setup | Yes | No | Always inherited from parent |
| run | No | Required | Must override to select test subset |
| teardown | Yes | No | Always inherited from parent |

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


### Test Selection Patterns

Select different test subsets:

```json
{
  "subpackages": {
    "myplugin/blocks": {
      "description": "Block-related tests",
      "test": {
        "phases": {
          "run": ["npx playwright test --project=blocks"]
        }
      }
    },
    "myplugin/classic": {
      "description": "Classic interface tests",
      "test": {
        "phases": {
          "run": ["npx playwright test --project=classic"]
        }
      }
    }
  }
}
```

**Note:** If you need different environment configurations (like enabling/disabling features), create separate parent test packages instead of trying to use subpackages.

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

### 5. Keep Environment Consistent

All setup and teardown must be in the parent package. Subpackages exist only to select which tests to run from the parent's test suite.

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
  "package_type": "test",
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
  "package_type": "test",
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
          // Inherits all parent phases automatically
          "run": ["npx playwright test checkout/"]
        }
      }
    },
    "woocommerce-stripe/3ds": {
      "description": "3D Secure authentication tests",
      "test": {
        "phases": {
          // Inherits all parent phases automatically
          "run": ["npx playwright test 3ds/"]
        }
      }
    },
    "woocommerce-stripe/refunds": {
      "description": "Refund flow tests",
      "test": {
        "phases": {
          // Inherits all parent phases automatically
          "run": ["npx playwright test refunds/"]
        }
      }
    }
  }
}
```

## Conclusion

Subpackages are a **publishing optimization** that allows you to share different aspects of your test suite without maintaining multiple codebases. They're not a complex architectural concept - they're a simple tool for creating multiple packages from one source of truth.

The key insight: **one codebase, one environment setup, multiple test selections**.