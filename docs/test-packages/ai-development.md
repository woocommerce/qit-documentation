---
description: "Guide to using AI assistants for QIT test development. Install the QIT plugin for Claude Code to get AI-powered test creation, debugging, and quality automation. Also covers prompt templates for GPT-4, Copilot, and other AI assistants."
---

# AI-Assisted Test Development

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
- **Create test packages** — scaffold, write Playwright tests, configure manifests
- **Debug failures** — read CTRF reports, analyze artifacts, identify root causes
- **Configure projects** — generate `qit.json` with profiles, environments, and groups
- **Manage environments** — start, stop, and interact with Docker test environments
- **Publish packages** — validate and publish test packages to the QIT registry

---

## Other AI Assistants

If you're using GPT-4, GitHub Copilot, or another AI assistant, you can provide QIT context manually using the prompt templates below.

### Initial Context

When starting a new conversation, provide this context:

```markdown
I'm developing Test Packages for QIT (Quality Insights Toolkit). Here's what you need to know:

## Test Package Structure
- Test Packages are directories with a qit-test.json manifest file
- They can be test packages (with run phase) or utility packages (without run phase)
- Test packages must produce CTRF (Common Test Results Format) JSON output
- Results must include ctrf-json and blob-dir paths

## Manifest Schema
{
  "package": "namespace/name",
  "package_type": "test",
  "test": {
    "phases": {
      "globalSetup": ["commands"],
      "setup": ["commands"],
      "run": ["commands"],
      "teardown": ["commands"],
      "globalTeardown": ["commands"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/artifacts"
    }
  }
}

## Execution Context
- Commands run in the package directory
- Environment variables available: QIT_SITE_URL, QIT_ADMIN_USERNAME, QIT_ADMIN_PASSWORD
- npm/npx commands run on the host; everything else runs in the Docker container
- Database snapshot is taken after globalSetup; each package gets a clean restore
```

For complete documentation, see [https://qit.woo.com/docs/llms.txt](https://qit.woo.com/docs/llms.txt) — this is an AI-readable index of all QIT documentation pages.

### GitHub Copilot

Add this to your workspace `.github/copilot-instructions.md`:

```markdown
## QIT Test Package Development

When writing Test Packages:
1. Always include qit-test.json with correct schema
2. Test packages need a "run" phase and "results" configuration
3. Utility packages have no "run" phase
4. Use CTRF format for test output
5. Commands run in the package directory
6. Use $QIT_SITE_URL for the site URL
7. Database is isolated between packages
```

### GPT-4 / ChatGPT

Start with:

```
I'm developing Test Packages for QIT. Key constraints:
- Must output CTRF JSON format
- qit-test.json manifest required in each package
- Test packages have a run phase, utility packages don't
- Database snapshot/restore between packages
- Secrets validated before execution
- Results collected from specified paths

Full documentation: https://qit.woo.com/docs/llms-full.txt
```

## Prompt Templates

### Creating a Test Package

```
Create a QIT Test Package for [FEATURE] with these requirements:

Package Type: [test/utility]
Framework: Playwright
Test Scenarios:
1. [Scenario 1]
2. [Scenario 2]

Required Secrets: [LIST_SECRETS]

Generate:
1. qit-test.json with all phases
2. Playwright test files with CTRF output
3. package.json with dependencies
4. playwright.config.js
```

### Debugging a Failure

```
My QIT Test Package is failing. Here's the context:

Error: [paste error]
Test Code: [paste relevant test]
Manifest: [paste qit-test.json]

The test is supposed to [DESCRIBE_INTENT].
Please identify the issue and provide a fix.
```

### Converting Existing Tests

```
Convert these existing Playwright tests to a QIT Test Package:

[paste existing tests]

Requirements:
1. Maintain all test logic
2. Add proper qit-test.json manifest
3. Configure CTRF output
4. Add setup/teardown phases
5. Handle secrets via process.env
```

## Common AI Mistakes to Correct

### 1. Wrong Result Paths

**AI might generate:**
```json
"results": {
  "ctrf-json": "results.json"
}
```

**Correct to:**
```json
"results": {
  "ctrf-json": "./results/ctrf.json",
  "blob-dir": "./results/artifacts"
}
```

### 2. Missing Directory Creation

**AI might forget to create result directories:**
```json
"setup": [
  "npm install"
]
```

**Add:**
```json
"setup": [
  "npm install",
  "mkdir -p results/artifacts"
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

**AI might mix execution contexts:**
```json
"setup": [
  "wp plugin install helper",  // Runs in Docker container
  "npm install"                // Runs on host
]
```

This actually works — QIT auto-detects that `npm`/`npx` commands run on the host and everything else runs in Docker. But if you need to force a context, use the object form:

```json
"setup": [
  { "command": "wp plugin install helper", "runs_on": "docker" },
  { "command": "npm install", "runs_on": "host" }
]
```

## Best Practices

1. **Start with working examples** — Give AI a working test package to modify rather than generating from scratch
2. **Iterate in small steps** — Don't try to generate an entire test suite at once
3. **Verify each phase** — Test globalSetup, setup, run, and teardown independently
4. **Use manual testing first** — Verify tests work with `qit env:up` + `npx playwright test` before running `qit run:e2e`
5. **Validate AI output** — Check manifest schema, file paths, and command execution contexts
6. **Provide complete error context** — Always include full error messages, not summaries
