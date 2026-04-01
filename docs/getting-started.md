---
sidebar_position: 2
description: "Step-by-step setup guide: install QIT CLI via Composer, authenticate with WooCommerce.com using `qit connect`, and run your first test with `qit run:security`. Includes troubleshooting for PATH issues and authentication problems. Links to managed tests, test packages, and configuration as next steps."
---

# Getting Started

## Installation

Install QIT CLI globally with Composer:

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

## Updating the QIT CLI

Update to the latest version:

```bash
composer global update woocommerce/qit-cli
```

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

You need a WooCommerce.com partner account with at least one extension in the marketplace, and you need to have completed the browser authentication fully.

If still having issues, contact qit@woocommerce.com with your partner account email.

</details>

## Run Your First Test

Run a security scan. It works in the cloud with no local setup:

```bash
qit run:security your-extension-slug
```

Replace `your-extension-slug` with the slug shown in `qit extensions` output.

You'll see results in your terminal. To test a local development build instead of the marketplace version:

```bash
qit run:security your-extension-slug --zip=/path/to/your-plugin.zip
```

## Try More Tests

```bash
qit run:phpcompatibility your-extension-slug
qit run:woo-e2e your-extension-slug
qit run:malware your-extension-slug
```

Every command has detailed help showing all available options:

```bash
qit run:security --help
```

## What's Next?

- **[Managed Tests](./managed-tests/introduction.md)**: Learn what each test checks and how to interpret results.
- **[Test Packages](./test-packages/index.md)**: Write custom E2E tests for your plugin and test compatibility with other plugins. Requires Docker.
- **[Configuration](./configuration/index.md)**: Save your test settings in `qit.json` so you don't retype them.
- **[AI-Assisted Development](/ai/getting-started/)**: Use QIT with Claude Code for AI-powered test development and debugging.

---

Need help? [GitHub Issues](https://github.com/woocommerce/qit-cli/issues) or qit@woocommerce.com
