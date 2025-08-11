# How to Create Test Packages

This guide walks through creating Test Packages for different scenarios.

## Basic Package Creation

### Using the Scaffold

```bash
qit package:scaffold my-tests --namespace=my-plugin
```

### Manual Creation

Create the essential files:

1. **qit-test.json** - Package manifest
2. **playwright.config.js** - Playwright configuration  
3. **tests/** - Your test files

## Package Types

### Standard Test Package

Tests that produce results:

```json
{
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
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": ["wp plugin activate my-plugin"]
    }
  }
}
```

## Best Practices

- Keep tests focused on one feature
- Use descriptive test names
- Include clear documentation
- Specify requirements explicitly