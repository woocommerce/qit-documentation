# Introduction to custom E2E tests

:::info
The custom E2E tests feature is available as early access.
:::

While managed tests provide a strong baseline for quality, compatibility, and security, your extension may include unique features or workflows that require specialized validation. Custom E2E (end-to-end) tests fill this gap. They enable you to write tailored test scenarios that simulate real-world usage patterns, integrate with other plugins and themes, and run complex workflows that managed tests might not cover.

In this section, you'll learn how to generate, structure, and run custom E2E tests, as well as how to share them with other developers and incorporate them into your continuous integration (CI) pipeline.

## Why custom E2E tests?

- **Unique User Flows:** Verify custom checkout fields, specialized product types, or complex discount logic that generic tests won’t catch.
- **Compatibility Tests:** Ensure your extension remains compatible when used alongside other plugins or themes.
  For more complex multi-plugin testing scenarios, including how to manage actions like `test`, `bootstrap`, and
  `activate` across multiple plugins, see [Compatibility Testing with Custom E2E Tests](./compatibility-tests).
- **Early Feedback:** Run tests locally for instant validation during development, reducing the time spent debugging issues in production.
- **Scalability and Collaboration:** Publish and tag your tests, allowing others to run them and ensuring consistency across development teams.

## Getting started

See [Installation & Setup](../installation-setup/cli-installation.md) and [Authenticating](../installation-setup/authenticating.md) if you haven’t.
2. **List Available Extensions:** Run `qit extensions` to confirm which extensions you can test.
3. **Generate a Test Scaffold:** `qit scaffold:e2e my-test` creates a starter template, including a basic test file and optional bootstrap scripts.
4. **Run an Initial Test:** `qit run:e2e your-extension-slug my-test` executes the generated test against a local or cloud environment.
5. **Refine and Expand:** Learn how to add more tests, use codegen tools, and adjust environments as you progress.

## What’s next?

This introduction is the first step. Custom E2E testing involves several moving parts, and the following pages will guide you through each phase:

- [Generating Tests](./generating-tests.md): Learn how to scaffold tests, use Playwright codegen, and set up shared bootstrap files.
- [Tagging Tests](./tagging-tests.md): Organize, publish, and share your tests with other developers or use tests published by others.
- [Running Tests](./running-tests.md): Understand how to run custom tests locally and in QIT’s cloud environment, including selecting versions and enabling optional features.
- [Understanding the Lifecycle](./understanding-lifecycle.md): Dive deeper into the sequence of events and environment changes that occur before, during, and after test execution.
- [Themes](./themes.md): Ensure that your tests are compatible with different themes, or enforce a specific theme for front-end verification.
- [Architecture & Security](./security-architecture.md): Explore how QIT’s custom E2E architecture ensures isolation, security, and easy integration with various stacks.
- [QIT Helpers](./qit-helpers.md): Utilize QIT’s built-in helpers to simplify test writing, handle authentication, or manage WP-CLI commands within tests.

## Additional capabilities

- **Complex Environment Configurations:** Use a config file (qit.json or qit.yml) to set up multiple plugins, advanced PHP versions, feature flags, and environment variables.
- **Visual Test Execution:** Run `qit run:e2e your-extension --ui` to observe the tests in a browser, improving debugging and communication with your team.
- **Publishing and Sharing:** Once you’ve perfected your tests, publish them so that other developers (or future you) can run these scenarios easily.
- **CI Integration:** Integrate custom E2E tests into your CI pipelines for continuous feedback, ensuring your extension’s quality at every commit.
- **Compatibility Tests:** Leveraging shared setup and teardown scripts, orchestrate complex compatibility scenarios across multiple plugins, ensuring consistent test environments and results.
