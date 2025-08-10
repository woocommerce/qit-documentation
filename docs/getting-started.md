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
<summary>⚠️ Something not working?</summary>

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
<summary>⚠️ No extensions showing?</summary>

**Check that you have:**
- A WooCommerce.com partner account
- At least one extension in the marketplace
- Completed the browser authentication fully

**Try:**
```bash
# Clear existing credentials
qit partner:remove

# Authenticate again
qit connect
```

Still having issues? Contact qit@woocommerce.com with your partner account email.

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

:::tip Teaching Yourself to Fish
The `--help` flag is your best friend. Every QIT command has detailed help showing exact option names and available values. Always check because option names vary between commands (e.g., some use `--php`, others use `--php_version`).
:::

## Run Your First Test

Start with a security test - it runs in the cloud and gives you immediate feedback:

```bash
qit run:security your-extension-slug
```

:::tip Finding Your Extension Slug
Use the extension slug or ID shown in `qit extensions` output. This is the correct identifier for QIT commands.
:::

You'll see the test progress and results in your terminal. **Success** means no security vulnerabilities were found.

<details>
<summary>🔍 What just happened?</summary>

QIT automatically:
1. Downloaded your extension package
2. Performed static security analysis
3. Scanned for known vulnerabilities
4. Checked for insecure code patterns
5. Generated a security report

This is a static analysis test - no WordPress environment needed. Results in about 2 minutes.

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

Remember: Use `--help` to discover all options for each test:

```bash
# Discover PHPCompatibility's version range options
qit run:phpcompatibility --help

# Find all parameters for E2E tests (versions, features, etc.)
qit run:woo-e2e --help
```

All tests support the `--zip` parameter for testing development builds:

```bash
qit run:phpcompatibility your-extension-slug --zip=/path/to/your-plugin.zip
```

<details>
<summary>📋 All Available Managed Tests</summary>

| Test | Command | Purpose | Duration |
|------|---------|---------|----------|
| **Activation** | `run:activation` | Clean install/activate (E2E) | ~30s |
| **Security** | `run:security` | Vulnerability scanning (static) | ~2min |
| **PHPCompatibility** | `run:phpcompatibility` | PHP version support (static) | ~1min |
| **Woo E2E** | `run:woo-e2e` | Core WooCommerce flows | ~10min |
| **Woo API** | `run:woo-api` | REST API validation | ~3min |
| **PHPStan** | `run:phpstan` | Static analysis | ~1min |
| **Malware** | `run:malware` | Malicious code detection (static) | ~2min |
| **Validation** | `run:validation` | Marketplace requirements | ~30s |
| **Plugin Check** | `run:plugin-check` | WordPress.org standards | ~1min |
| **Performance** | `run:performance` | K6 performance benchmarks | ~5min |
| **Compatibility** | `run:compatibility` | Extension compatibility | ~5min |

Note: Static tests (security, malware, phpcompatibility) don't need WordPress environments.

</details>

## Customize Test Environments

<details>
<summary>🔧 Test Against Specific Versions</summary>

Different tests support different version options. Check with `--help` to see what's available:

```bash
# Tests that support version selection (woo-e2e, woo-api, etc.)
qit run:woo-e2e your-extension-slug \
  --wordpress_version=6.4 \
  --woocommerce_version=8.5 \
  --php_version=8.0

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

## Understanding Results

Tests return three statuses:

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ **Success** | All checks passed | Good to go |
| ⚠️ **Warning** | Non-critical issues | Review recommended |
| ❌ **Failed** | Critical issues | Must fix |

<details>
<summary>📊 Viewing Detailed Results</summary>

**In Terminal:**
- Basic results show immediately
- URLs to full reports are provided
- Use `--verbose` for more output

**In Browser:**
- Click report URLs for detailed logs
- Screenshots and traces available for E2E tests
- Allure reports for comprehensive test details

**In Vendor Dashboard:**
- Navigate to **Quality Insights** section
- View test history
- Download artifacts

</details>

## Next Steps

### → Use Managed Tests
Learn what each test validates and when to run them.

[Explore Managed Tests](managed-tests/)

### → Create Test Packages
Build custom tests for your plugin's specific features and test compatibility with other plugins. *(Requires Docker for local development)*

[Start with Test Packages](test-packages/)

### → Automate Testing
Add QIT to your CI/CD pipeline for automatic quality checks on every commit.

---

<details>
<summary>🚀 Quick Command Reference</summary>

```bash
# DISCOVERY COMMANDS (most important!)
qit                          # See ALL available commands
qit run:security --help      # See ALL options for any command

# Update QIT to latest version
composer global update woocommerce/qit-cli

# List your extensions
qit extensions

# Test marketplace version
qit run:security your-extension-slug

# Test development build
qit run:security your-extension-slug --zip=/path/to/plugin.zip

# Run with more output
qit run:security your-extension-slug --verbose

# Run and wait for completion (for CI)
qit run:security your-extension-slug --wait

# Test with specific versions (for tests that support it)
qit run:woo-e2e your-extension-slug --wordpress_version=6.4 --php_version=8.0

# Test PHP compatibility range
qit run:phpcompatibility your-extension-slug --min_php_version=7.4 --max_php_version=8.2
```

</details>

:::info Need Help?
- **Documentation**: [qit.woo.com](https://qit.woo.com)
- **Issues**: [GitHub](https://github.com/woocommerce/qit-cli/issues)
- **Contact**: qit@woocommerce.com
  :::