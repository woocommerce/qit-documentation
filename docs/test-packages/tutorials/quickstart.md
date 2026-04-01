---
description: "Step-by-step tutorial to create your first test package. Covers scaffolding with `qit package:scaffold`, understanding the qit-test.json manifest (package ID, phases, results), writing a Playwright checkout test, running locally with `qit run:e2e --test-package`, debugging with `qit env:up` + `qit env:source`, and combining multiple packages in one run. Prerequisites: QIT CLI, Docker, Node.js. Includes quick reference table of key commands."
---

# Your First Test Package

This tutorial walks you through creating, running, and understanding your first Test Package. By the end, you'll have a working test that can be combined with other packages.

## Prerequisites

- QIT CLI installed and authenticated
- Docker and Docker Compose
- Node.js and npm
- Basic familiarity with JavaScript

## Step 1: Scaffold Your Package

Create your E2E test package:

```bash
# From your plugin root directory
# Replace 'your-extension-slug' with the slug of the extension you maintain
qit package:scaffold tests/e2e --package=your-extension-slug/e2e
```

The command will validate that you maintain the namespace (your extension slug) and create the package structure:

```
your-plugin/
├── tests/
│   └── e2e/
│       ├── qit-test.json          # Test package manifest
│       ├── package.json            # Node dependencies (Playwright, reporters)
│       ├── playwright.config.js    # Pre-configured with CTRF + Allure reporters
│       ├── bootstrap/
│       │   ├── global-setup.sh     # Runs in Docker: one-time environment config
│       │   ├── setup.sh            # Runs in Docker: per-package setup
│       │   └── global-teardown.sh  # Runs in Docker: cleanup
│       └── tests/
│           └── example.spec.js     # Starter test (verifies site loads)
└── ...
```

## Step 2: Examine the Manifest

Open `tests/e2e/qit-test.json`. The scaffolded manifest looks like this:

```json
{
  "package": "your-extension-slug/e2e",
  "package_type": "test",
  "requires": {
    "network": false
  },
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": ["./bootstrap/global-setup.sh"],
      "setup": ["./bootstrap/setup.sh"],
      "run": ["npx playwright test"],
      "teardown": [],
      "globalTeardown": ["./bootstrap/global-teardown.sh"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "allure-dir": "./results/allure",
      "blob-dir": "./results/blob"
    }
  }
}
```

Key points:
- **package**: Your unique identifier (namespace/name format). The namespace must be an extension slug you maintain.
- **package_type**: `"test"` for packages that run tests, `"utility"` for setup-only packages. Can also be inferred from the presence of a `run` phase.
- **requires.network**: Set to `true` if your tests need external network access (e.g., payment gateway APIs). Default is `false` (offline mode).
- **phases**: Shell commands executed at each lifecycle stage. Commands ending in `.sh` run inside the Docker container (where WordPress lives). Other commands run on the host.
- **results**: Where Playwright writes output. The `ctrf-json` path is required for test result reporting.

## Step 3: Write Your Test

The scaffolded `tests/example.spec.js` verifies the site loads. Replace it with a test for your plugin's functionality:

```javascript
import { test, expect } from '@playwright/test';

test('my plugin admin page loads', async ({ page }) => {
  // Log in as admin (WP credentials: admin/password)
  await page.goto('/wp-login.php');
  await page.fill('#user_login', 'admin');
  await page.fill('#user_pass', 'password');
  await page.click('#wp-submit');

  // Navigate to your plugin's admin page
  await page.goto('/wp-admin/admin.php?page=my-plugin-settings');

  // Verify the page loads without errors
  await expect(page.locator('h1')).toContainText('My Plugin');
});
```

:::tip QIT Runtime
The [`@woocommerce/qit-runtime`](../concepts/runtime.md) package (included in scaffolded packages) provides typed access to environment info, WP-CLI execution, and cross-package capabilities:

```javascript
import qit from '@woocommerce/qit-runtime';

// qit.env.siteUrl, qit.env.wp.username, qit.env.wp.password
// qit.wp('plugin list --format=json')
// qit.actions('makePurchase') - discover capabilities from other packages
```
:::

## Step 4: Test Locally

Run your test package against your extension:

```bash
# From your plugin root directory
qit run:e2e your-extension-slug --test-package=./tests/e2e

# Or if you're in the test package directory:
cd tests/e2e
qit run:e2e your-extension-slug --test-package=.
```

:::tip
For manual debugging while developing your tests, you can start an environment first:
```bash
# Start the environment
qit env:up

# Note the environment ID from the output (e.g., qitenv123abc...)
# Then source the environment variables in your terminal:
source "$(qit env:source qitenv123abc...)"

# Now you can:
# 1. Browse the site manually at the URL shown
# 2. Run your Playwright tests directly:
npx playwright test
```
:::

The command will:
1. Download and prepare your test package
2. Start a Docker environment with WordPress and WooCommerce
3. Install your extension
4. Run the test phases (setup → run → teardown)
5. Collect and display results

If your test passes, you'll see a summary showing the test results and options to view detailed reports.

## Step 5: Combine with Other Packages

The real power comes from combining packages:

```bash
# Run your test WITH another extension's tests
qit run:e2e your-extension-slug \
  --test-package=./tests/e2e \
  --test-package=other-extension/e2e

# Or test multiple extensions together  
qit run:e2e your-extension-slug \
  --plugin=woocommerce-stripe \
  --test-package=./tests/e2e \
  --test-package=woocommerce-stripe/e2e
```

Each package runs in isolation (clean database state) but in the same environment.

## What You've Learned

✅ Test Packages are just Playwright tests with a manifest  
✅ The manifest defines how your package runs  
✅ Packages can be combined without conflicts  
✅ Each package gets a clean state via database snapshots

## Quick Reference

| Command | Purpose |
|---------|---------|
| `qit package:scaffold` | Create new package |
| `qit run:e2e --test-package=./path/to/package` | Run local package |
| `qit package:publish` | Share your package |
| `qit package:list` | List available packages |

---

**You now have:** A working Test Package that can be shared and combined with others