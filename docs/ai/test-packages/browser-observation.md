---
description: "How to use Playwright MCP browser tools with Claude Code to observe real UI before writing QIT test packages. Covers the observe-first workflow: start a QIT environment, navigate the running site, capture exact selectors from browser snapshots, then write tests from observed reality instead of guesswork."
---

# How to Write Tests with AI Browser Observation

When using Claude Code to write QIT test packages, the **Playwright MCP** tools let Claude observe the real running site before writing any test code. This eliminates guessed selectors, incorrect assumptions about UI layout, and tests that fail because the page doesn't work the way the AI assumed.

## Why This Matters

Without browser observation, AI assistants guess at selectors and page structure based on source code. This leads to:
- Wrong selectors (`#place_order` when the real button is `[name="checkout"]`)
- Missing wait conditions (AJAX-loaded content that isn't there on page load)
- Incorrect flow assumptions (collapsed checkout sections that need expanding first)

With Playwright MCP, Claude sees exactly what a user sees and writes tests against the real page.

## Prerequisites

- [Claude Code](https://code.claude.com) with the QIT plugin installed
- Playwright MCP available in Claude Code (included by default)
- Docker (for running QIT environments)

## The Observe-First Workflow

### 1. Start a QIT environment

```bash
qit env:up --plugin=your-extension
```

This gives you a running WordPress + WooCommerce site with your extension installed.

### 2. Ask Claude to explore the UI

Once the environment is running, ask Claude to navigate the site:

> "Navigate to the admin settings page for my extension and show me what's there."

Claude will use Playwright MCP tools to:
- `browser_navigate` to the site URL
- `browser_snapshot` to capture the page structure (accessible names, roles, form fields)
- Report back what it sees

### 3. Explore the customer-facing experience

> "Now go to the frontend. Add a product to the cart and go to checkout. Show me what shipping options appear."

Claude navigates the storefront, interacts with forms, and captures the exact state of the page at each step.

### 4. Write tests from observed selectors

After exploring, Claude knows:
- The exact accessible names for buttons, fields, and links
- How the page behaves (loading states, AJAX updates, collapsed sections)
- What "working correctly" looks like

It writes Playwright tests using selectors it actually saw, not selectors it guessed.

### 5. Debug failures interactively

When a test fails, instead of guessing what went wrong:

> "Navigate to the checkout page and show me what's there right now. My test expected a shipping rate but failed."

Claude can see the current page state and compare it to what the test expected.

## What Claude Observes

The `browser_snapshot` tool returns an **accessibility tree**, a structured representation of the page that includes:

- Element roles (button, link, textbox, heading)
- Accessible names (the text a screen reader would announce)
- Form field values and states (checked, disabled, expanded)
- Page structure and hierarchy

This is more reliable than CSS selectors because accessible names are stable across themes and minor UI changes.

## Example Interaction

```
You: I need E2E tests for my shipping extension. Start an environment and explore what it does.

Claude: [starts env:up, navigates to admin settings]
I can see your extension adds a "Shipping Zones" tab with these fields:
- "Enable/Disable" checkbox (currently checked)
- "Method Title" text field (value: "Flat Rate Shipping")
- "Cost" number field (value: "10.00")
- "Tax Status" dropdown (options: Taxable, None)

Let me check the frontend...
[navigates to checkout]
At checkout with a product in cart, I see:
- Shipping method "Flat Rate Shipping" at $10.00 is selected
- No other shipping options available

Based on what I observe, here are the high-value tests:
1. Verify shipping rate appears at checkout with correct amount
2. Verify changing the cost in admin reflects at checkout
3. Verify disabling the method hides it from checkout
...
```

## Tips

- **Always explore before writing.** If Claude suggests writing tests without first navigating the site, ask it to observe the real UI first.
- **Check both admin and frontend.** Most extensions have configuration in wp-admin and output on the storefront. Tests should cover both sides.
- **Re-observe after environment changes.** If you reset the database or change settings, have Claude take a fresh snapshot.
- **Use snapshots for debugging.** When a test fails, ask Claude to navigate to the failing page and snapshot it. The accessibility tree often reveals why a selector didn't match.
