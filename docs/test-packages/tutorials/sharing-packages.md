# Publishing Your First Package

Learn how to share your Test Package with the WordPress ecosystem through the QIT Package Registry.

## Prerequisites

- A working Test Package (from the quickstart)
- QIT CLI authenticated
- Package tested locally

## Before Publishing

### Verify Your Package Works

```bash
# From your plugin root directory
qit run:e2e your-extension-slug --test-package=./tests/e2e
```

### Add Package Metadata (Optional)

Enhance your `tests/e2e/qit-test.json` with helpful information:

```json
{
  "package": "your-extension-slug/e2e",
  "description": "E2E tests for Your Extension",
  "tags": ["e2e", "woocommerce"],
  "requires": {
    "plugins": {
      "woocommerce": ">=8.0.0"
    },
    "wordpress": ">=6.0"
  }
}
```

## Publishing to the Registry

### Publish Your Package

```bash
qit package:publish ./tests/e2e latest
```

Output:
```
Publishing your-extension-slug/e2e:latest...
✓ Package validated
✓ Tests verified
✓ Uploaded to registry

Published successfully!
Others can now use: your-extension-slug/e2e:latest
```

:::tip Version Management
By default, just use `:latest` for continuous updates. If you're publishing from GitHub Actions or other CI/CD, you can tag specific versions (e.g., `1.0.0`, `nightly`, `rc`) as part of your existing release process.
:::

### Verify Publication

```bash
# List available packages
qit package:list

# Download your published package to verify
qit package:download your-extension-slug/e2e:latest
```

## Publishing Updates

```bash
# Just publish again - it overwrites automatically
qit package:publish ./tests/e2e latest
```

Each publish overwrites the previous version. Users always get your most recent tests.

## How Others Use Your Package

Once published, anyone can use your package:

```bash
# Use your package (defaults to :latest)
qit run:e2e some-extension \
  --test-package=your-extension-slug/e2e

# Explicitly specify latest
qit run:e2e some-extension \
  --test-package=your-extension-slug/e2e:latest

# Combine with other packages
qit run:e2e some-extension \
  --test-package=your-extension-slug/e2e:latest \
  --test-package=another-extension/e2e:latest
```

---

**Congratulations!** Your Test Package is now part of the WordPress testing ecosystem. Others can use your tests to verify compatibility.