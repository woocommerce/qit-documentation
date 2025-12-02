# How to Create Test Packages

This guide walks through creating Test Packages for different scenarios.

## Basic Package Creation

### Using the Scaffold

The scaffold command creates the complete package structure for you:

#### Test Package (E2E tests)
```bash
# Scaffold a test package with Playwright setup
qit package:scaffold tests/e2e \
  --package=my-plugin/e2e:1.0.0 \
  --package-type=test
```

This creates:
- `qit-test.json` with `run` phase and `results`
- `package.json` with Playwright dependencies
- `playwright.config.js` configuration
- `tests/` directory with example test
- Bootstrap scripts for setup/teardown

#### Utility Package (setup/configuration only)
```bash
# Scaffold a utility package (no tests, just setup)
qit package:scaffold utilities/setup \
  --package=my-plugin/setup:1.0.0 \
  --package-type=utility
```

This creates:
- `qit-test.json` with setup phases only (no `run` phase)
- Bootstrap scripts for global and isolated setup/teardown
- No Playwright or npm dependencies

#### Scaffold Options

```bash
# Create manifest only (skip npm install)
qit package:scaffold tests/e2e \
  --package=my-plugin/e2e:1.0.0 \
  --package-type=test \
  --only-manifest

# Include JSON schema for IDE validation
qit package:scaffold tests/e2e \
  --package=my-plugin/e2e:1.0.0 \
  --with-schema
```

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
      "globalSetup": ["wp plugin activate my-plugin"],
      "setup": ["wp option set my_plugin_configured yes"]
    }
  }
}
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