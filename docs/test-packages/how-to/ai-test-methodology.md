---
description: "Step-by-step methodology for AI assistants creating QIT test packages. Covers the full workflow: research the extension and its real users (web search for reviews, support threads, common complaints), obtain external service credentials, scaffold the package, observe the real UI with Playwright MCP before writing any selectors, design tests by persona and rank by real-user impact, write tests from observed reality, and develop iteratively using env:up + env:reset without rebuilding the environment."
---

# AI Methodology: Creating Test Packages

This is the methodology to follow when creating QIT E2E test packages for a WooCommerce extension. Follow these steps in order. Do not skip steps. Present findings to the user at key checkpoints before proceeding.

## Core Principles

1. **Observe before you write.** Never write a test selector without first seeing the real UI. Guessed selectors waste cycles.
2. **Test decisions, not existence.** Every test should exercise logic the plugin controls. If the test would pass with the plugin replaced by a no-op, it's worthless.
3. **Think in personas.** Who uses this extension? What can go wrong for them? Tests should map to real user pain.
4. **Fewer good tests beat many bad ones.** 5-7 tests that catch real regressions are better than 20 smoke checks.
5. **Design for cross-compatibility.** Extension-specific config goes in `setup.sh` (isolated), shared concerns go in `global-setup.sh`. Tests must be explicit about the state they need.

## Step 1: Research the Extension

Before touching any test tooling, understand what the extension does and how real users experience it.

### Read the source code

Explore the extension's codebase. You are looking for:

- **Core value proposition.** What does this extension do for the merchant and their customers?
- **WooCommerce integration.** What classes does it extend? What hooks/filters does it use? What WooCommerce features does it depend on?
- **External services.** Does it talk to APIs? What auth mechanism? Is there a sandbox/test mode?
- **Merchant settings.** What decisions can the merchant make that change what the customer sees?
- **Requirements.** Specific currency, country, PHP version, other plugins?

### Research real users

Search the web for real-world user experiences:

- `"{extension name}" reviews`
- `"{extension name}" support issues`
- `"{extension name}" bugs`
- `"{extension name}" not working`

Look at WooCommerce.com reviews, WordPress.org support forums, GitHub issues, and community posts. Identify the top 3-5 real-world pain points. These inform which tests actually matter — a test that catches a problem users frequently report is worth more than a test for a feature nobody complains about.

### Present findings

Present a brief summary to the user:
- What the extension does
- How it integrates with WooCommerce
- What external services it uses (if any)
- Top real-world user complaints
- Any requirements or constraints

Wait for user confirmation before proceeding.

## Step 2: Obtain External Service Access

If the extension talks to external APIs (payment gateways, shipping carriers, etc.):

1. Research the provider's developer/sandbox program (web search)
2. Check the extension source code for default or public test keys
3. Ask the user if they have credentials or want you to register for sandbox access
4. Once obtained, document in a `.env.example` file:
   - The environment variable name
   - Where to register
   - Any setup instructions

If no external services are needed, skip this step.

## Step 3: Scaffold and Configure

### Scaffold the package

```bash
qit package:scaffold <extension-repo>/tests/qit \
  --package=<extension-slug>/e2e:1.0.0 --with-schema
```

### Write bootstrap scripts

**`global-setup.sh`** — Only shared concerns that benefit ALL packages in a cross-compatibility run:
- Plugin activation
- WooCommerce onboarding/coming-soon dismissal
- Guest checkout enabled, force SSL disabled
- WooCommerce core pages installed
- API credentials set as WP options (if needed)

**`setup.sh`** — Extension-specific configuration (isolated, database restored between packages):
- Store settings the extension requires (country, currency, etc.)
- Extension-specific configuration (zones, methods, instance settings)
- Test data (products, users, coupons)
- Anything that would conflict with another package if set globally

This separation is critical for cross-compatibility testing. When multiple packages run together, the database is restored between each package. Global setup runs once; package setup runs for each package.

### Start the environment

```bash
qit env:up --plugin=<extension-repo> --test-package=<extension-repo>/tests/qit
```

## Step 4: Observe the Real UI

**Do not skip this step.** Navigate the running site using Playwright MCP browser tools.

For detailed instructions on using Playwright MCP for UI observation, see [How to Write Tests with AI Browser Observation](./ai-browser-testing.md).

### Explore the merchant experience (admin)

- How does the extension appear in wp-admin?
- What does its settings page look like? Exact field labels, dropdown options, checkbox texts?
- What happens when you change a setting and save?
- What feedback does the merchant get?

### Explore the customer experience (frontend)

- Where does the extension's output appear?
- What does the customer see when the extension is working correctly?
- What interactive elements exist?
- What happens with different inputs?

### Record what you observe

After exploring, you should know:
- The exact accessible names for elements you'll interact with (from `browser_snapshot`)
- Page behavior patterns (loading states, AJAX updates, collapsed sections)
- What "working correctly" looks like

## Step 5: Design Tests by Persona

Think about who uses this extension and what can go wrong for them.

### Identify personas

Common WooCommerce extension personas:
- **Merchant** — configures the extension in wp-admin
- **Customer** — experiences the extension on the storefront
- **Admin** — manages orders, refunds, reports affected by the extension

### For each persona, ask:

- What's the critical flow they depend on?
- What's a setting that changes their experience?
- What's an edge case that could silently break?

### Rank tests by real-user impact

If this test fails, would a real user be affected?

| Priority | Pattern | Example |
|----------|---------|---------|
| **Critical** | The extension's core feature works end-to-end | Rates appear, payment processes, widget renders |
| **Critical** | User interaction with the feature works | Selecting a rate updates total, submitting a form succeeds |
| **High** | A merchant setting changes the customer experience | Disabling an option hides it from the frontend |
| **High** | Boundaries and restrictions work | Feature only appears where it should, not where it shouldn't |
| **Medium** | Edge cases degrade gracefully | Missing data doesn't crash, unusual inputs are handled |
| **Remove** | The page/field/element exists | Implicitly proven by any higher test that interacts with it |
| **Remove** | A value we just configured is stored | Tests the bootstrap, not the plugin |

### Present the test list

Present the proposed tests to the user for approval before writing any test code. Aim for 5-7 high-value tests. Wait for confirmation.

## Step 6: Write Tests

Write tests using ONLY selectors you observed in Step 4.

### Key patterns

- **Login:** Use `page.goto('/wp-login.php')` + fill username/password + press Enter
- **Collapsed forms:** Block checkout may collapse previously-filled sections — check for "Edit" buttons before trying to fill fields
- **Dynamic content:** Wait for loading indicators to disappear, then wait for expected content. Never use fixed `waitForTimeout` — wait for specific elements or text
- **Settings tests that modify state:** Restore the original setting at the end
- **Test isolation:** Each test sets up its own state, never depends on previous tests
- **Explicit over implicit:** Don't assume defaults are correct. If a test needs a specific dropdown value, select it — even if the bootstrap "should have" set it. In cross-compatibility runs, another package may have changed it

## Step 7: Develop Iteratively

### The development loop

Start the environment ONCE — this is the expensive step:

```bash
qit env:up --plugin=<extension-repo> --test-package=<extension-repo>/tests/qit
source "$(qit env:source <env-id>)"
```

Run tests repeatedly — this is fast (seconds, not minutes):

```bash
npx playwright test --reporter=list
```

When a test fails, DO NOT rebuild the environment. Instead:

1. Navigate to the failing page via Playwright MCP to see the current state
2. Read `test-results/*/error-context.md` for the page snapshot at failure time
3. Fix the test code
4. Re-run just the failing test: `npx playwright test --grep "test name"`

Use `qit env:reset` to restore the database to its post-setup state between full runs. This is fast (~3 seconds) and avoids the cost of tearing down and rebuilding the environment.

**NEVER use `run:e2e` during development.** It tears down and rebuilds the entire Docker environment every time. Only use `run:e2e` once at the very end for final validation of the full orchestrated lifecycle.

### Debug escalation

1. **First:** Read error-context.md — shows page state at failure time
2. **Second:** Navigate to the page via Playwright MCP and interact live
3. **Third:** `qit env:exec <env-id> "command"` to inspect PHP logs, WP options, transients
4. **Fourth:** Check `/var/www/html/wp-content/debug.log` for PHP errors

### Audit

After all tests pass, review each test critically. Does it exercise the plugin's logic, or is it dead weight? Remove anything that doesn't earn its place.

## Step 8: Publish

1. Run `qit run:e2e <extension-slug> --test-package=<extension-repo>/tests/qit` for final validation
2. Publish: `qit package:publish <path>/tests/qit latest`
3. Ask the user if they want CI workflow changes — if yes, follow the repo's existing patterns

## Checklist

Track progress and present to the user:

```
[ ] Extension source explored — core feature, hooks, API, settings understood
[ ] Real user research done — reviews, support threads, top pain points identified
[ ] External service credentials obtained (if needed)
[ ] Environment scaffolded and running (env:up)
[ ] Admin UI explored with Playwright MCP
[ ] Customer-facing UI explored with Playwright MCP
[ ] Personas identified, test list ranked and approved by user
[ ] Tests written from observed selectors
[ ] All tests passing via npx playwright test (development loop)
[ ] Tests audited — weak tests removed
[ ] Final validation via qit run:e2e
[ ] Test package published to QIT registry
```
