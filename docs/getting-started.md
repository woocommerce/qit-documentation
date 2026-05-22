---
sidebar_position: 2
description: "Get started with QIT — let your AI coding agent handle installation, authentication, and testing, or run the CLI commands yourself. Same tool, you choose who drives."
---

# Getting Started

QIT is a CLI that runs automated quality tests on WooCommerce extensions. Your AI coding agent can drive it for you, or you can run the commands yourself.

## Let Your AI Agent Drive (Recommended)

Point your AI agent to QIT's documentation and ask it to handle the rest — installation, authentication, running tests, everything.

**Claude Code** — install the plugin for automatic discovery:

```
/plugin marketplace add woocommerce/qit-cli
/plugin install qit@woocommerce-qit
```

**Any other AI agent** — give it the documentation URL:

> Read https://qit.woo.com/docs/llms.txt — I want to test my WooCommerce extension with QIT.

Then just ask what you need:

- *"Install QIT and run a security scan on my-plugin"*
- *"Create E2E tests for this extension"*
- *"My QIT tests are failing, help me debug"*
- *"Set up qit.json for this project"*

Learn more about AI workflows in [AI-Assisted Development](./ai/getting-started.md).

---

## The CLI

Whether you or your agent is typing these commands, this is how QIT works.

### Installation

```bash
composer global require "woocommerce/qit-cli:*"
```

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

### Authentication

```bash
qit connect
```

This opens your browser for authentication. Complete the flow and return to your terminal.

```bash
qit extensions
```

You should see your WooCommerce Marketplace extensions listed.

<details>
<summary>No extensions showing?</summary>

You need a WooCommerce.com partner account with at least one extension in the marketplace, and you need to have completed the browser authentication fully.

If still having issues, contact qit@woocommerce.com with your partner account email.

</details>

### Running Tests

```bash
qit run:security your-extension-slug
```

Replace `your-extension-slug` with the slug shown in `qit extensions` output.

Test a local build instead of the marketplace version:

```bash
qit run:security your-extension-slug --zip=/path/to/your-plugin.zip
```

More test types:

```bash
qit run:phpcompatibility your-extension-slug
qit run:woo-e2e your-extension-slug
qit run:malware your-extension-slug
```

Every command has detailed help:

```bash
qit run:security --help
```

### Updating

```bash
composer global update woocommerce/qit-cli
```

## What's Next?

- **[AI-Assisted Development](./ai/getting-started.md)**: Deep dive into AI-powered test creation, debugging, and the structured methodology for writing test packages with agents.
- **[Managed Tests](./managed-tests/introduction.md)**: Learn what each test checks and how to interpret results.
- **[Test Packages](./test-packages/index.md)**: Write custom E2E tests for your plugin and test compatibility with other plugins. Requires Docker.
- **[Configuration](./configuration/index.md)**: Save your test settings in `qit.json` so you don't retype them.

---

Need help? [GitHub Issues](https://github.com/woocommerce/qit-cli/issues) or qit@woocommerce.com
