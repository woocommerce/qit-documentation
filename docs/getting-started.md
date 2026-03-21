---
sidebar_position: 2
---

# Getting Started

## Installation

Install QIT CLI globally with Composer using this exact command:

```bash
composer global require "woocommerce/qit-cli:*"
```

Verify the installation:

```bash
qit --version
```

<details>
<summary>Something not working?</summary>

**"composer: command not found"**  
You need Composer to install QIT. [Install Composer](https://getcomposer.org/download/) first.

**PHP version errors**  
QIT requires PHP 7.2.5 or higher. Check your version with `php --version`.

**"qit: command not found"**  
The `qit` command isn't in your PATH. Find where Composer installed it:

```bash
composer global config bin-dir --absolute
```

Add this directory to your PATH permanently. The exact steps depend on your system and shell - if you're unsure, ask your favorite AI assistant:

> "How do I add `[the directory shown above]` to my PATH permanently on [your OS and shell]?"

After updating your PATH, open a new terminal window or reload your shell configuration.

</details>

## Authentication

Connect QIT to your WooCommerce.com account:

```bash
qit connect
```

This opens your browser for authentication. Complete the flow and return to your terminal.

Verify authentication:

```bash
qit extensions
```

You should see your WooCommerce Marketplace extensions listed.

<details>
<summary>No extensions showing?</summary>

**Check that you have:**
- A WooCommerce.com partner account
- At least one extension in the marketplace
- Completed the browser authentication fully

If still having issues, contact qit@woocommerce.com with your partner account email.

</details>

## Explore QIT Commands

Before running tests, learn how to discover QIT's capabilities yourself:

```bash
# See ALL available commands
qit
```

This shows every command QIT offers - managed tests, environment management, package creation, and more. Take a moment to explore what's possible.

To get detailed help for any command:

```bash
# See ALL options for a specific command
qit run:security --help
```

This reveals every parameter, default values, and usage examples. For instance:

```bash
qit run:phpcompatibility --help
```

Shows hidden gems like `--min_php_version` and `--max_php_version` that let you test specific PHP version ranges.

:::tip Command Discovery
The `--help` flag is essential for mastering QIT. Every command has detailed help showing exact option names, available values, and usage examples.
:::

## Run Your First Test

Start with a security test - it runs in the cloud and gives you immediate feedback:

```bash
qit run:security your-extension-slug
```

:::tip Finding Your Extension Slug
Use the extension slug or ID shown in `qit extensions` output.
:::

You'll see the test progress and results in your terminal. **Success** means no security vulnerabilities were found.

<details>
<summary>What just happened?</summary>

QIT automatically ran multiple security scanning tools on your extension:

1. **PHPCS Security Audit** - Checked for insecure coding patterns
2. **Semgrep Analysis** - Scanned for known vulnerability patterns
3. **Dependency Vulnerability Check** - Analyzed dependencies against CVE/CVSS databases
4. **WPScan Database Check** - Verified against known WordPress vulnerabilities
5. **Gitleaks Scan** - Detected any hardcoded secrets or API keys
6. **Generated Security Report** - Consolidated findings from all tools

This comprehensive static analysis happens in about 2 minutes without needing a WordPress environment.

</details>

### Testing Development Builds

To test a development version instead of the marketplace version, use the `--zip` parameter:

```bash
qit run:security your-extension-slug --zip=/path/to/your-plugin.zip
```

This is useful for:
- Testing changes before releasing to the marketplace
- Validating fixes for issues found in previous tests
- CI/CD pipelines that build and test automatically

The ZIP file must be a valid installable WordPress plugin package.

## Explore More Tests

Now try other managed tests:

```bash
# PHP compatibility check (with version range)
qit run:phpcompatibility your-extension-slug --min_php_version=7.4 --max_php_version=8.3

# WooCommerce checkout flows  
qit run:woo-e2e your-extension-slug

# Malware detection
qit run:malware your-extension-slug
```

All tests support the `--zip` parameter for testing development builds:

```bash
qit run:phpcompatibility your-extension-slug --zip=/path/to/your-plugin.zip
```

<details>
<summary>📋 All Available Tests</summary>

| Test | Command | Purpose | Duration | Type |
|------|---------|---------|----------|------|
| **Security** | `run:security` | Vulnerability scanning | ~2min | Static |
| **PHPCompatibility** | `run:phpcompatibility` | PHP version support | ~1min | Static |
| **PHPStan** | `run:phpstan` | Static code analysis | ~1min | Static |
| **Malware** | `run:malware` | Malicious code detection | ~2min | Static |
| **Validation** | `run:validation` | Marketplace requirements | ~30s | Static |
| **Plugin Check** | `run:plugin-check` | WordPress.org standards | ~1min | Static |
| **Activation** | `run:activation` | Clean install/activate | ~30s | E2E |
| **E2E** | `run:e2e` | Test Packages (custom tests) | Varies | E2E |
| **Woo E2E** | `run:woo-e2e` | Core WooCommerce flows | ~10min | E2E |
| **Woo API** | `run:woo-api` or `run:api` | REST API validation | ~3min | API |
| **Compatibility** | `run:compatibility` | Extension compatibility | ~5min | E2E |
| **Performance** | `run:performance` | K6 performance benchmarks | ~5min | Performance |

**Static tests** run faster as they don't need WordPress environments.  
**Test Packages** (`run:e2e`) are custom E2E tests you create and share.

</details>

## Customize Test Environments

<details>
<summary>Test Against Specific Versions</summary>

Different tests support different version options. Check with `--help` to see what's available:

```bash
# Tests that support version selection (woo-e2e, woo-api, etc.)
qit run:woo-e2e your-extension-slug \
  --wp=6.4 \
  --woo=8.5 \
  --php=8.0

# PHPCompatibility has special version range options
qit run:phpcompatibility your-extension-slug \
  --min_php_version=7.4 \
  --max_php_version=8.2

# Static tests like security don't have version options
qit run:security your-extension-slug  # No version params
```

**Version Options (where supported):**
- `stable` - Current stable release (default)
- `rc` - Release candidate
- `nightly` - Development version
- Specific versions - e.g., `6.4`, `8.5.0`, `8.0`

**Pro tip:** Always check `qit run:[test] --help` to see which options are actually available for that test type.

</details>

<details>
<summary>Run Multiple Tests at Once</summary>

Define a [group](configuration/groups.md) in `qit.json` to batch multiple test types into a single command:

```json
{
  "groups": {
    "ci-quick": {
      "e2e": ["default"],
      "security": ["default"],
      "activation": ["default"]
    }
  }
}
```

Then run them all:
```bash
qit run:group ci-quick
```

</details>

## Next Steps

### → Use Managed Tests
Learn what each test validates and when to run them.

[Explore Managed Tests](managed-tests/introduction)

### → Create Test Packages
Build custom tests for your plugin's specific features and test compatibility with other plugins. *(Requires Docker for local development)*

[Start with Test Packages](test-packages/)

### → Automate Testing
Add QIT to your CI/CD pipeline for automatic quality checks on every commit.

---

:::info Need Help?
- **Documentation**: [qit.woo.com](https://qit.woo.com)
- **Issues**: [GitHub](https://github.com/woocommerce/qit-cli/issues)
- **Contact**: qit@woocommerce.com
  :::