---
description: "Guide to using AI assistants (Claude, GPT-4, Copilot) for developing test packages. Covers how to provide QIT context to AI (manifest format, lifecycle phases, CTRF requirements), recommended prompts for scaffolding tests, debugging failures, and generating CTRF-compatible output. Includes the `qit ai:context` command for generating context automatically, tips for Claude Code integration with the QIT MCP server, and patterns for iterative test development with AI assistance."
---

# AI-Assisted Test Development

This guide explains how to leverage AI assistants (like Claude, GPT-4, or GitHub Copilot) to develop Test Packages efficiently.

## Recommended AI Model

For QIT Test Package development, we recommend using **Claude with the Opus model** through Claude Code or the Claude API. Claude Opus excels at:
- Understanding complex codebases
- Writing comprehensive tests
- Following specific patterns and conventions
- Debugging test failures
- Generating CTRF-compatible output

## Providing Context to AI

### Initial Context Setup

When starting a new conversation with an AI assistant, provide this context:

```markdown
I'm developing Test Packages for QIT (Quality Insights Toolkit). Here's what you need to know:

## Test Package Structure
- Test Packages are directories with a qit-test.json file
- They can be test packages (with run phase) or utility packages (without run phase)
- Test packages must produce CTRF (Common Test Results Format) output
- Results must include ctrf-json and blob-dir paths

## Manifest Schema
{
  "package": "namespace/name",
  "package_type": "test",
  "test_type": "e2e",
  "requires": {
    "secrets": ["array"],
    "php": "string",
    "wordpress": "string"
  },
  "test": {
    "phases": {
      "globalSetup": ["commands"],
      "setup": ["commands"],
      "run": ["commands"],
      "teardown": ["commands"],
      "globalTeardown": ["commands"]
    },
    "results": {
      "ctrf-json": "path",
      "blob-dir": "path",
      "allure-dir": "optional-path"
    }
  }
}

## Execution Context
- Commands run in package directory
- Environment variables available: QIT_SITE_URL, QIT_WP_ADMIN, QIT_DB_NAME, etc.
- WP-CLI commands run in container
- NPM/Node commands run on host (marked with [host])
- Database snapshot taken after globalSetup
- Each package gets fresh database state

## Current Environment
- Site URL: [provide from $QIT_SITE_URL]
- PHP Version: [your version]
- WordPress Version: [your version]
- WooCommerce Version: [your version]
```

### Getting QIT Context Commands

QIT provides built-in commands to generate AI-friendly context:

#### Understanding Test Packages
```bash
php qit-cli.php ai:context understanding-test-packages
```

This generates comprehensive documentation about:
- Test Package architecture
- Lifecycle phases
- Database isolation
- Secret management
- Result collection

Copy this output and provide it to your AI assistant.

#### Failed Test Context
```bash
php qit-cli.php ai:context failed-e2e
```

When tests fail, this command generates:
- Error messages and stack traces
- Test configuration
- Environment details
- Recent test output
- Relevant code snippets

## AI Development Workflow

### Step 1: Initial Test Creation

**Prompt to AI:**
```
Create a Playwright Test Package for testing WooCommerce checkout flow. The package should:
1. Test guest checkout with a simple product
2. Test member checkout with a coupon
3. Generate CTRF output
4. Capture screenshots on failure

Package name: checkout-tests
Namespace: mycompany
```

**AI will generate:**
- Complete qit-test.json
- package.json with dependencies
- playwright.config.js
- Test files
- Helper utilities

### Step 2: Test Execution and Debugging

Run the generated tests:
```bash
php qit-cli.php run:e2e woocommerce --config=test.json
```

If tests fail:
```bash
# Get failure context
php qit-cli.php ai:context failed-e2e > failure-context.txt

# Provide to AI
"The tests failed with this context: [paste failure-context.txt]
Please analyze the failures and provide fixes."
```

### Step 3: Iterative Improvement

**Prompt pattern for improvements:**
```
The test passes but I need to add:
1. Better error handling for network timeouts
2. Retry logic for flaky elements
3. More descriptive test names for CTRF
4. Custom wait conditions for WooCommerce AJAX

Current test: [paste test code]
Current manifest: [paste manifest]
```

## AI Prompt Templates

### Creating Test Packages

```
Create a QIT Test Package for [FEATURE] with these requirements:

Package Type: [test/utility]
Framework: Playwright
Test Scenarios:
1. [Scenario 1]
2. [Scenario 2]

Required Secrets: [LIST_SECRETS]
Dependencies: [LIST_DEPENDENCIES]

Generate:
1. qit-test.json with all phases
2. Test files with proper CTRF output
3. Configuration files
4. package.json/composer.json
```

### Debugging Failures

```
My QIT Test Package is failing. Here's the context:

Error: [paste error]
Test Code: [paste relevant test]
Manifest: [paste qit-test.json]
Environment: [paste from qit env:source output]

The test is supposed to [DESCRIBE_INTENT].
Please identify the issue and provide a fix.
```

### Adding Utility Packages

```
Create a QIT Utility Package that sets up the test environment by:

1. [Setup task 1]
2. [Setup task 2]
3. [Setup task 3]

This should run in globalSetup phase.
Use WP-CLI commands where possible.
Include proper error handling.
```

### Converting Existing Tests

```
Convert these existing Playwright tests to QIT Test Packages:

[paste existing tests]

Requirements:
1. Maintain all test logic
2. Add proper qit-test.json
3. Configure CTRF output
4. Add setup/teardown phases
5. Handle secrets properly
```

## Specific AI Instructions

### For Claude Opus via Claude Code

Start your session with:
```
I'm using Claude Code with QIT for Test Package development.

Project structure:
/home/user/my-tests/
├── packages/
│   ├── checkout-tests/
│   ├── payment-tests/
│   └── utilities/
└── qit-config.json

I have QIT environment running at: http://localhost:32820
Environment ID: qitenv35a3979857a7a672

Help me develop Test Packages following QIT best practices.
```

### For GitHub Copilot

Add this to your workspace `.github/copilot-instructions.md`:
```markdown
## QIT Test Package Development

When writing Test Packages:
1. Always include qit-test.json with correct schema
2. Test packages need "run" phase and "results" configuration
3. Utility packages have no "run" phase
4. Use CTRF format for test output
5. Commands run in package directory
6. Use $QIT_SITE_URL for site URL
7. Database is isolated between packages
```

### For GPT-4/ChatGPT

Begin with:
```
I'm developing Test Packages for QIT. Key constraints:
- Must output CTRF JSON format
- Manifest.json required in each package
- Test packages have run phase, utility packages don't
- Database snapshot/restore between packages
- Secrets validated before execution
- Results collected from specified paths

Help me write tests that follow these patterns.
```

## Common AI Mistakes to Correct

### 1. Wrong Result Paths

**AI might generate:**
```json
"results": {
  "ctrf-json": "results.json"  // Wrong
}
```

**Correct to:**
```json
"results": {
  "ctrf-json": "./results/ctrf.json",  // Include directory
  "blob-dir": "./results/artifacts"     // Always need blob-dir
}
```

### 2. Missing Directory Creation

**AI might forget:**
```json
"setup": [
  "npm install"
]
```

**Add:**
```json
"setup": [
  "npm install",
  "mkdir -p results/artifacts"  // Create result directories
]
```

### 3. Incorrect Secret Access

**AI might use:**
```javascript
const key = STRIPE_KEY;  // Wrong
```

**Correct to:**
```javascript
const key = process.env.STRIPE_KEY;  // Use process.env
```

### 4. Wrong Command Context

**AI might mix contexts:**
```json
"setup": [
  "wp plugin install helper",  // This runs in container
  "npm install"                // This runs on host
]
```

**Clarify:**
```json
"globalSetup": [
  "wp plugin install helper"  // Container commands in globalSetup
],
"setup": [
  "npm install"  // Host commands in setup
]
```

## Debugging with AI

### Providing Effective Context

When asking AI to debug, include:

1. **Complete error message**
   ```
   Error: Test timeout of 30000ms exceeded
   at checkout.spec.js:45:10
   ```

2. **Relevant code snippet**
   ```javascript
   // Line 45 where error occurs
   await page.click('#place_order');
   ```

3. **Environment state**
   ```
   Site URL: http://localhost:32820
   Selector exists: No
   Page URL when failed: /checkout
   ```

4. **What you've tried**
   ```
   - Increased timeout to 60s
   - Added wait for selector
   - Checked element exists manually
   ```

### AI Debugging Workflow

1. **Run test with verbose output**
   ```bash
   php qit-cli.php run:e2e woocommerce --verbose
   ```

2. **Capture failure context**
   ```bash
   php qit-cli.php ai:context failed-e2e > debug.txt
   ```

3. **Ask AI for analysis**
   ```
   Analyze this test failure and suggest fixes:
   [paste debug.txt]
   
   The test should [describe expected behavior].
   ```

4. **Apply fix and test**
   ```bash
   # Apply AI's suggestion
   vim tests/checkout.spec.js
   
   # Test again
   npx playwright test checkout.spec.js
   ```

5. **Iterate if needed**
   ```
   The fix partially worked but now fails at [new error].
   Here's the updated context: [paste new error]
   ```

## Advanced AI Patterns

### Multi-Package Test Generation

```
Generate a complete test suite with these packages:

1. utilities/setup - Disable onboarding, create test data
2. tests/checkout - Test checkout flows
3. tests/payment - Test payment gateways
4. tests/shipping - Test shipping methods
5. utilities/cleanup - Remove test data

Each should have proper dependencies and work together.
```

### Performance Test Creation

```
Create a QIT Test Package for performance testing using K6:

Requirements:
- Load test the checkout flow
- 50 concurrent users for 5 minutes
- Generate CTRF from K6 results
- Capture response time metrics
- Fail if p95 > 2 seconds
```

### Visual Regression Tests

```
Create visual regression Test Package using Playwright:

Requirements:
- Capture screenshots of key pages
- Compare against baselines
- Generate CTRF with comparison results
- Handle dynamic content (prices, dates)
- Update baselines on command
```

## AI Context Files

### Create `.ai:context/qit-guide.md`

Store this in your project for quick AI context:

```markdown
# QIT Test Package Development Guide

## Quick Start
- Test packages: Have run phase, produce CTRF
- Utility packages: No run phase, setup/teardown only
- Database: Isolated between packages via snapshots
- Secrets: Declared in manifest, validated upfront

## Commands Available
- php qit-cli.php run:e2e [extension] --config=test.json
- php qit-cli.php env:up [extension]
- php qit-cli.php ai:context failed-e2e
- source "$(qit env:source [env-id])"

## Current Setup
- Environment: [your-env-id]
- Site URL: [your-url]
- Test Framework: Playwright
- CTRF Reporter: ctrf-playwright-reporter

## Common Issues
1. Results not found: Ensure CTRF path matches
2. Secrets missing: Export before running
3. Tests timeout: Check selectors and waits
```

### Create `.ai:context/examples.md`

Include working examples:

```markdown
# Working Test Package Examples

## Minimal Test Package
[Include working manifest and test]

## Utility Package
[Include working utility manifest]

## Complex Test with Secrets
[Include example with secrets]
```

## Best Practices for AI Development

1. **Start with working examples** - Give AI a working example to modify
2. **Iterate in small steps** - Don't try to generate everything at once
3. **Verify each phase** - Test setup, run, teardown independently
4. **Use manual testing first** - Verify tests work before orchestration
5. **Provide clear requirements** - Be specific about what you need
6. **Include error context** - Always provide full error messages
7. **Validate AI output** - Check manifest schema, paths, and commands
8. **Test incrementally** - Run tests after each AI-suggested change

## Getting Help

When AI can't solve an issue:

1. **Check documentation**
   ```bash
   # Generate full docs context
   php qit-cli.php ai:context understanding-test-packages
   ```

2. **Examine working examples**
   ```bash
   # Look at fixture tests
   ls src/tests/integration/fixtures/test-packages/
   ```

3. **Enable debug mode**
   ```bash
   DEBUG=* php qit-cli.php run:e2e woocommerce --verbose
   ```

4. **Provide complete context to AI**
   - Include all error messages
   - Show directory structure
   - Provide manifest and test files
   - Describe expected vs actual behavior