---
description: "The recommended MCP servers and tools for using QIT with AI coding agents. Covers Playwright MCP for browser observation, Xdebug MCP for PHP debugging, and how they work together in a typical test development workflow."
---

# Recommended Tools

These MCP servers give your AI agent direct access to the browser and PHP runtime, making it significantly more effective at writing tests, debugging failures, and investigating issues.

## Playwright MCP

[Playwright MCP](https://github.com/anthropics/playwright-mcp) lets your agent control a real browser: navigate pages, read the accessibility tree, take screenshots, fill forms, and click elements. Essential for writing test packages and debugging test failures.

Your agent uses it to:
- Explore your extension's admin and frontend UI before writing tests
- Observe exact accessible names and page structure for reliable selectors
- Debug failing tests by navigating to the failing page and inspecting what's actually there

See [Browser Observation](./test-packages/browser-observation.md) for the detailed workflow.

## Xdebug MCP

[Xdebug MCP](https://github.com/kpanuragh/xdebug-mcp) lets your agent do PHP step debugging conversationally: set breakpoints, step through code, inspect variables, and evaluate expressions. No IDE needed.

Your agent uses it to:
- Set breakpoints in plugin code and step through execution
- Inspect variable state at runtime to understand behavior
- Trace function calls to find where things go wrong

Pair it with QIT's built-in Xdebug support:

```qitbash
qit env:up --xdebug --plugin=your-extension
```

See [Xdebug Debugging](../environment/xdebug.md) for environment setup and configuration.

## How They Work Together

A typical AI-driven test development workflow uses all three tools:

1. **QIT CLI** starts the environment and runs tests
2. **Playwright MCP** observes the UI to discover selectors and verify behavior
3. **Xdebug MCP** debugs PHP when something unexpected happens server-side

For example, when a test fails because checkout doesn't complete:
- Your agent uses Playwright MCP to navigate to checkout and see the current UI state
- If the UI looks correct but the order still fails, it uses Xdebug MCP to set a breakpoint in the payment processing code and step through it
- Once it finds the issue, it fixes the code and uses QIT CLI to re-run the test

This is the workflow described in detail in [Writing Test Packages with AI](./test-packages/writing-with-agents.md).
