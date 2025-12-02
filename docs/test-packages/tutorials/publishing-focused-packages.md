# Publishing Focused Test Packages

Learn how to share specific test scenarios from your E2E suite using subpackages.

## The Problem

You have a comprehensive E2E suite with dozens of tests, but you want to:
- Share only specific, relevant tests with the community
- Let others test compatibility with your critical flows
- Keep your internal tests private while sharing key scenarios

## The Solution: Subpackages

QIT's subpackages feature lets you publish multiple focused test packages from a single codebase.

## Quick Example

### Step 1: Define Subpackages in Your Manifest

Update your `tests/e2e/qit-test.json`:

```json
{
  "package": "your-extension/e2e",
  "description": "Complete E2E test suite",
  "test": {
    "phases": {
      "globalSetup": ["./scripts/setup.sh"],
      "run": ["npx playwright test"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json"
    }
  },
  "subpackages": {
    "your-extension/checkout": {
      "description": "Checkout flow tests for compatibility testing",
      "tags": ["checkout", "critical"],
      "test": {
        "phases": {
          "run": ["npx playwright test --project=checkout"]
        }
      }
    },
    "your-extension/cart": {
      "description": "Cart operations tests",
      "tags": ["cart"],
      "test": {
        "phases": {
          "run": ["npx playwright test --project=cart"]
        }
      }
    }
  }
}
```

### Step 2: Configure Playwright Projects

Align your Playwright projects with your subpackages:

```javascript
// playwright.config.js
export default {
  testDir: './tests',
  
  projects: [
    {
      name: 'checkout',
      testMatch: /checkout\/.*.spec.js/,
    },
    {
      name: 'cart',
      testMatch: /cart\/.*.spec.js/,
    },
    {
      name: 'all',
      testMatch: /.*.spec.js/,
    }
  ],
  
  // ... rest of config
};
```

### Step 3: Publish All Packages

```bash
# This publishes the parent and all subpackages with the same version
qit package:publish tests/e2e latest

# Creates:
# - your-extension/e2e:latest (full suite)
# - your-extension/checkout:latest (checkout tests only)
# - your-extension/cart:latest (cart tests only)
```

## How Others Use Your Packages

Other developers can now test against specific parts of your suite:

```bash
# Test checkout compatibility
qit run:e2e their-plugin --test-package=your-extension/checkout:latest

# Test multiple areas (subpackages must use the same version)
qit run:e2e their-plugin \
  --test-package=your-extension/checkout:2.0.0 \
  --test-package=your-extension/cart:2.0.0  # ✅ Same version required
```

## Real-World Example

Here's how WooCommerce Stripe might structure their packages:

```json
{
  "package": "woocommerce-stripe/e2e",
  "description": "WooCommerce Stripe Gateway E2E tests",
  "test": {
    "phases": {
      "globalSetup": ["./setup-stripe.sh"],
      "run": ["npx playwright test"]
    }
  },
  "subpackages": {
    "woocommerce-stripe/checkout": {
      "description": "Stripe checkout flow tests",
      "tags": ["payments", "checkout"],
      "test": {
        "phases": {
          "run": ["npx playwright test --project=checkout"]
        }
      }
    },
    "woocommerce-stripe/3ds": {
      "description": "3D Secure authentication tests",
      "tags": ["payments", "security"],
      "test": {
        "phases": {
          "run": ["npx playwright test --project=3ds"]
        }
      }
    },
    "woocommerce-stripe/webhooks": {
      "description": "Webhook handling tests",
      "tags": ["api", "webhooks"],
      "test": {
        "phases": {
          "run": ["npx playwright test --project=webhooks"]
        }
      }
    }
  }
}
```

Other plugins can then test compatibility:

```bash
qit run:e2e my-checkout-plugin \
  --test-package=woocommerce-stripe/checkout:latest \
  --test-package=woocommerce-stripe/3ds:latest
```

## What to Share vs Keep Private

### Good Candidates for Subpackages

- **Critical user flows**: Checkout, cart, account management
- **Integration points**: Payment processing, shipping calculations
- **API endpoints**: REST/GraphQL endpoints others might use
- **Data structures**: Order formats, customer data structures

### Keep Private

- Internal admin workflows
- Business logic tests
- Performance benchmarks
- Security test scenarios
- Experimental features

## Key Benefits

1. **Single codebase**: Maintain one test suite, publish multiple packages
2. **Version consistency**: All subpackages version together, ensuring compatibility
3. **Selective sharing**: Share what's useful, keep the rest private
4. **Easy consumption**: Others use subpackages like any other test package

## Important Notes

- Subpackages always version together with their parent
- They share the same global setup/teardown
- Each subpackage runs in isolation with database restore between them
- QIT optimizes by downloading the shared artifact only once

## Learn More

For advanced subpackage concepts and constraints, see [Subpackages Concepts](../concepts/subpackages.md).

---

**Summary:** Subpackages let you publish focused test sets from your main E2E suite, making it easy to share critical test scenarios while keeping your full test suite to yourself.