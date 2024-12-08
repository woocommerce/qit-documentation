# Generating Custom E2E Tests

After setting up your environment and understanding the basics of custom E2E tests, the next step is to generate your initial test scaffolding. QIT provides a CLI command to create a starter structure, making it easy to begin writing tests tailored to your extension’s unique features and workflows.

## Basic Scaffolding

To create a simple test setup:
`qit scaffold:e2e ./e2e`

This command generates a basic E2E test directory with:
- A minimal example test file (example.spec.js)
- An optional `bootstrap` directory for setup and teardown scripts
- A straightforward, ready-to-run configuration

Running:
`qit run:e2e your-extension ./e2e`
executes this basic test against your environment (local or cloud), providing an initial proof of concept and confirming that everything is connected properly.

## Advanced Scaffolding

You can include additional setup and teardown files for more complex scenarios. For example:
`qit scaffold:e2e ./e2e --with-shared --with-teardown`

This will create:
- Shared setup and teardown files for compatibility tests across multiple plugins.
- Isolated setup and teardown scripts for each test suite.

These files help you configure the environment precisely before tests run and clean up afterward, streamlining complex test flows like multi-step onboarding sequences or compatibility checks between multiple extensions.

**Lifecycle and Compatibility Notes:**

When you include shared setup and teardown scripts, QIT’s lifecycle ensures that:

- **Shared Setup/Teardown**: Runs once before and after all plugins’ tests in a given run. After shared setup completes, QIT exports a baseline database snapshot. All plugins that `test` or `bootstrap` will start from this snapshot. By the time you reach the shared teardown, the environment is restored to a known consistent state, ensuring that the shared teardown scripts always run in a predictable environment.
- **Compatibility Tests**: In scenarios where multiple plugins are tested together (some with `test` actions, others `bootstrap` or `activate`), the shared setup and teardown scripts apply globally. Additional plugins and dependencies in `bootstrap` mode benefit from the shared setup steps (e.g., disabling wizards) without undergoing their own isolated setup or teardown phases. This allows for a stable, uniform baseline when testing compatibility among multiple extensions.

For example:
```bash
qit scaffold:e2e ./e2e --with-shared --with-teardown
```

This command creates shared setup/teardown files that can help orchestrate complex compatibility scenarios from the get-go, ensuring every plugin’s test or bootstrap phase starts and ends on even footing.

When setting up multiple plugins, remember that their `action` values (`test`, `bootstrap`, `activate`) affect how they participate in shared and isolated phases. For a detailed breakdown of these actions, see [Compatibility Testing with Custom E2E Tests](./compatibility-tests.md).

## Using Codegen for Test Generation

QIT integrates with Playwright’s codegen feature to expedite test creation:
`qit run:e2e your-extension --codegen`

This launches a browser session that records your interactions. As you navigate, click elements, and complete workflows, codegen generates a test script in real-time. When you’re done:
- Copy and paste the generated code into your test file.
- Replace hardcoded URLs with relative paths, ensuring your tests remain environment-agnostic.
- Refine the assertions to match your exact validation criteria.

## Adjusting URLs and Hardcoding

During codegen, absolute URLs are recorded. After pasting the code, remove or adjust these URLs:
From:
`await page.goto("http://localhost:32456/wp-admin");`
to:
`await page.goto("/wp-admin");`

By using relative paths, your tests become portable and can run in different environments (local, staging, or cloud) without changes.

## QIT Helpers

Don’t forget to leverage QIT’s built-in helpers to simplify test writing. For instance:
- `qit.loginAsAdmin(page);`
- `qit.wp("plugin list");`

See [QIT Helpers](./qit-helpers.md) for a detailed list of available functions.

## Next Steps

With your test structure in place and a handle on generating scenarios, you’re ready to:
- [Tag and Publish Tests](./tagging-tests.md): Organize, upload, and share tests with others or run tests published by different plugins.
- [Running Tests](./running-tests.md): Learn how to run these tests locally for rapid feedback or in the QIT cloud for compatibility verification.
- [Understanding the Lifecycle](./understanding-lifecycle.md): Dive deeper into the sequence of events and environment changes that occur before, during, and after test execution.
- [Themes and Complex Configurations](./themes.md): Explore how to enforce specific themes, run compatibility tests with multiple plugins, and tweak environment settings for advanced cases.

By taking advantage of codegen, shared setups, teardown files, and QIT helpers, you can build robust, maintainable E2E tests that provide meaningful insights into your extension’s behavior under various conditions.
