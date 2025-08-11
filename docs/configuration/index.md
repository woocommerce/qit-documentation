# Test Configuration and Automation

Once you've mastered running QIT commands, you'll want to make complex test scenarios repeatable and shareable. The `qit.json` configuration file enables this by capturing CLI commands as reusable profiles.

## When You Need Configuration

You start noticing patterns:
- Running the same multi-package tests repeatedly
- Team members need identical test setups
- CI pipelines require complex test matrices
- Testing against multiple environment combinations

## The Configuration Solution

Instead of:
```bash
qit run:e2e my-plugin \
  --test-package=./tests \
  --test-package=woocommerce/checkout-tests:8.5 \
  --test-package=stripe/gateway-tests:3.0 \
  --wp=6.4 --woo=8.5 --php=8.0
```

You can define once and reuse:
```bash
qit run:e2e --profile=payment-compatibility
```

## Configuration Concepts

### System Under Test (SUT)
The plugin or theme you're testing.

### Environments
Named WordPress/PHP/WooCommerce combinations:
- `staging`: Your staging server setup
- `production`: Production configuration
- `bleeding-edge`: Latest development versions

### Test Profiles
Named test scenarios combining packages and environments:
- `smoke`: Quick validation tests
- `full`: Comprehensive test suite
- `compatibility`: Multi-plugin testing

### Groups
Batch execution of multiple profiles:
- `pre-release`: All tests before release
- `nightly`: Overnight comprehensive testing

## Quick Example

Create `qit.json` in your project root:

```json
{
  "$schema": "https://qit.woo.com/json-schema/qit",
  "sut": {
    "type": "plugin",
    "slug": "my-plugin",
    "source": {
      "type": "local",
      "path": "./dist"
    }
  },
  "environments": {
    "production": {
      "wp": "stable",
      "woo": "stable",
      "php": "8.0"
    }
  },
  "test_types": {
    "e2e": {
      "compatibility": {
        "environment": "production",
        "test_packages": [
          "./tests",
          "woocommerce/checkout-tests",
          "stripe/gateway-tests"
        ]
      }
    }
  }
}
```

Now run:
```bash
qit run:e2e --profile=compatibility
```

## Benefits

### For Individual Developers
- Stop typing long commands
- Consistent test environments
- Document test scenarios

### For Teams
- Share test configurations
- Standardize testing practices
- Onboard developers faster

### For CI/CD
- Version-controlled test definitions
- Matrix testing made simple
- Reproducible test pipelines

## Getting Started

1. **[Understanding qit.json](qit-json.md)** - File structure and options
2. **[Test Profiles](profiles.md)** - Creating reusable test scenarios  
3. **[Environments](environments.md)** - Managing WordPress/PHP combinations
4. **[Groups](groups.md)** - Batch test execution
5. **[Extension Sets](extension-sets.md)** - Predefined plugin combinations

## CLI vs Configuration

Everything in `qit.json` maps to CLI parameters:

| Configuration | CLI Equivalent |
|--------------|----------------|
| `"environment": "production"` | `--wp=stable --woo=stable --php=8.0` |
| `"test_packages": ["./tests"]` | `--test-package=./tests` |
| Profile: `compatibility` | All the above combined |

Configuration is **optional convenience**, not a requirement.

## Best Practices

### Start Simple
Begin with CLI commands. Add configuration when you find yourself repeating commands.

### Progressive Enhancement
1. Start with one profile
2. Add environments as needed
3. Create groups when managing multiple profiles

### Keep It Maintainable
- Document profile purposes
- Use descriptive names
- Regular cleanup of unused profiles

## Next Steps

Ready to stop typing long commands?

- **[Create your first qit.json](qit-json.md)** - Step-by-step guide
- **[CI/CD integration](../test-packages/ci.md)** - Automation workflows