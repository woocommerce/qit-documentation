---
description: "How-to guide for creating test packages and utility packages. Covers `qit package:scaffold` with --package-type=test (creates Playwright setup, qit-test.json with run phase and results) and --package-type=utility (creates setup phases only, no run or results). Shows scaffold options (--only-manifest, --with-schema), manual creation, and the manifest structure for both package types. Utility packages must NOT have a run phase, test_type, or results configuration."
---

# How to Create Test Packages

This guide walks through creating Test Packages for different scenarios.

## Basic Package Creation

### Using the Scaffold

The scaffold command creates the complete package structure for you:

#### Test Package (E2E tests)
```bash
# Scaffold a test package with Playwright setup
qit package:scaffold tests/e2e --package=my-plugin/e2e
```

This creates:
- `qit-test.json` with `run` phase and `results`
- `package.json` with Playwright dependencies
- `playwright.config.js` with CTRF, Allure, and blob reporters
- `tests/example.spec.js` starter test
- `bootstrap/` shell scripts for setup/teardown

#### Utility Package (setup/configuration only)
```bash
# Scaffold a utility package (no tests, just setup)
qit package:scaffold utilities/setup \
  --package=my-plugin/setup --package-type=utility
```

This creates:
- `qit-test.json` with setup phases only (no `run` phase)
- `bootstrap/` shell scripts for setup/teardown
- No Playwright or npm dependencies

#### Scaffold Options

```bash
# Create manifest only (skip npm install)
qit package:scaffold tests/e2e \
  --package=my-plugin/e2e --only-manifest

# Include JSON schema for IDE validation
qit package:scaffold tests/e2e \
  --package=my-plugin/e2e --with-schema
```

If you omit `--package`, the scaffold command will prompt interactively.

### Manual Creation

Create the essential files:

1. **qit-test.json** - Package manifest
2. **playwright.config.js** - Playwright configuration (test packages only)
3. **tests/** - Your test files (test packages only)

## Package Types

### Standard Test Package

Tests that produce results:

```json
{
  "package": "my-plugin/e2e",
  "package_type": "test",
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

### Utility Package

Setup without tests:

```json
{
  "package": "my-plugin/setup",
  "package_type": "utility",
  "test": {
    "phases": {
      "globalSetup": ["./bootstrap/global-setup.sh"],
      "setup": ["./bootstrap/setup.sh"]
    }
  }
}
```

Commands ending in `.sh` run inside the Docker container (where WordPress lives). Other commands run on the host. Put WP-CLI commands inside shell scripts:

```bash
# bootstrap/global-setup.sh
#!/bin/bash
set -euo pipefail
wp plugin activate my-plugin
wp option set my_plugin_configured yes
```

In Playwright tests, use `qit.wp()` from [`@woocommerce/qit-runtime`](../concepts/runtime.md) to run WP-CLI commands without writing shell scripts:

```javascript
await qit.wp('option set my_plugin_configured yes');
```

**Note:** Utility packages do NOT include:
- `test_type` field
- `run` phase
- `results` configuration

## Best Practices

- Keep tests focused on one feature
- Use descriptive test names
- Include clear documentation
- Specify requirements explicitly