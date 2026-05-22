---
description: "Deep dive into AI-powered QIT workflows: what Claude can do with the QIT plugin, how progressive disclosure works, and the structured methodology for creating test packages with AI agents."
---

# AI-Assisted Development

:::info Prerequisites
This page assumes your AI agent already has QIT context. If not, see [Getting Started](../getting-started.md) to install the Claude Code plugin or point your agent to llms.txt.
:::

Once set up, your AI agent can handle any QIT task autonomously. This page covers what's possible and how to get the most out of it.

## What Your AI Agent Can Do

With QIT documentation context, your AI agent can:

- **Run any QIT test**: managed tests, test packages, or both
- **Create test packages**: follows a [structured methodology](./test-packages/writing-with-agents.md) that includes user research, UI observation, and persona-based test design
- **Debug failures**: read CTRF reports, analyze artifacts, identify root causes
- **Configure projects**: generate `qit.json` with profiles, environments, and groups
- **Manage environments**: start, stop, and interact with Docker test environments
- **Publish packages**: validate and publish test packages to the QIT registry

## How It Works

### Claude Code (Recommended)

The QIT plugin uses **progressive disclosure** from live documentation:

1. The agent fetches the [documentation index](https://qit.woo.com/docs/llms.txt) to find relevant pages
2. It reads the specific docs needed for your task
3. It acts on what it learned: running commands, writing code, interpreting results

This happens automatically. You don't need to paste docs or explain QIT concepts.

### Other AI Agents

Provide your agent with the documentation URL once:

> Read https://qit.woo.com/docs/llms.txt — I want to test my WooCommerce extension with QIT.

Your agent reads the index, fetches the pages it needs, and has the same capabilities from there. The llms.txt index follows the [llmstxt.org](https://llmstxt.org) standard and stays current as QIT evolves.
