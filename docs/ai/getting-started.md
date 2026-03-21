---
description: "Install the QIT plugin for Claude Code to get AI-powered test creation, debugging, and quality automation. For other AI assistants, use the QIT documentation index at llms.txt to provide context."
---

# AI-Assisted Development

QIT integrates with AI assistants to help you develop test packages, debug failures, and automate quality workflows.

## Claude Code Plugin (Recommended)

The QIT CLI ships as a **Claude Code plugin**. Once installed, Claude can handle any QIT task autonomously — it fetches live documentation, runs commands, creates test packages, and debugs failures without you needing to provide manual context.

### Install

In Claude Code, run:

```
/plugin marketplace add woocommerce/qit-cli
/plugin install qit@woocommerce-qit
```

That's it. Claude now has QIT expertise. Try asking:

- "Run a security scan on my plugin"
- "Create E2E tests for this extension"
- "My QIT tests are failing, help me debug"
- "Set up qit.json for this project"
- "What test packages are available for cross-compatibility testing?"

### How It Works

The plugin provides a skill that uses **progressive disclosure** from QIT's live documentation:

1. Claude fetches the [documentation index](https://qit.woo.com/docs/llms.txt) to find relevant pages
2. It reads the specific docs needed for your task
3. It acts on what it learned — running commands, writing code, interpreting results

This means Claude always has current information, even as QIT evolves.

### What Claude Can Do

With the QIT plugin, Claude can:

- **Run any QIT test** — managed tests, test packages, or both
- **Create test packages** — follows a [structured methodology](./test-packages/writing-with-agents.md) that includes user research, UI observation, and persona-based test design
- **Debug failures** — read CTRF reports, analyze artifacts, identify root causes
- **Configure projects** — generate `qit.json` with profiles, environments, and groups
- **Manage environments** — start, stop, and interact with Docker test environments
- **Publish packages** — validate and publish test packages to the QIT registry

---

## Other AI Assistants

If you're using GPT-4, GitHub Copilot, or another AI assistant, QIT provides two machine-readable documentation files you can feed to your AI:

- **[llms.txt](https://qit.woo.com/docs/llms.txt)** — Documentation index with descriptions. Feed this to your AI and ask it to fetch the pages relevant to your task.
- **[llms-full.txt](https://qit.woo.com/docs/llms-full.txt)** — Complete documentation in a single file. Use when your AI can accept large context.

These follow the [llmstxt.org](https://llmstxt.org) standard and contain the same documentation that the Claude Code plugin accesses.
