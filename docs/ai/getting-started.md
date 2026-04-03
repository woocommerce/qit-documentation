---
description: "Deep dive into AI-powered QIT workflows: what Claude can do with the QIT plugin, how progressive disclosure works, and the structured methodology for creating test packages with AI agents."
---

# AI-Assisted Development

Once you've [installed the QIT plugin](../getting-started.md), Claude can handle any QIT task autonomously. This page covers what's possible and how to get the most out of it.

## What Claude Can Do

With the QIT plugin, Claude can:

- **Run any QIT test**: managed tests, test packages, or both
- **Create test packages**: follows a [structured methodology](./test-packages/writing-with-agents.md) that includes user research, UI observation, and persona-based test design
- **Debug failures**: read CTRF reports, analyze artifacts, identify root causes
- **Configure projects**: generate `qit.json` with profiles, environments, and groups
- **Manage environments**: start, stop, and interact with Docker test environments
- **Publish packages**: validate and publish test packages to the QIT registry

## How It Works

The plugin uses **progressive disclosure** from QIT's live documentation:

1. Claude fetches the [documentation index](https://qit.woo.com/docs/llms.txt) to find relevant pages
2. It reads the specific docs needed for your task
3. It acts on what it learned: running commands, writing code, interpreting results

This means Claude always has current information, even as QIT evolves. You don't need to paste docs or explain QIT concepts — the agent discovers what it needs on-demand.
