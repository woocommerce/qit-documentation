# Introduction

:::info
The custom E2E tests feature is available as early access.
:::

Custom E2E tests allow you to generate, write, and run end-to-end tests for WordPress plugins and themes. They aim to eliminate barriers to writing and running E2E tests by providing:

- A simple CLI tool that generates test scaffolding.
- A managed test environment for executing your tests.
- A platform to share your tests with other developers and to run tests from other plugins and themes.

## Getting Started

1. **Install the QIT CLI Tool:** See [Installation](cli/01-installation.md).
2. **Connect Your Account:** Follow the CLI instructions to connect _(you must have at least one extension listed on WooCommerce.com)._
3. **List Available Extensions:** Check which extensions you have access to test using `qit extensions`.
4. **Generate Test Scaffolding:** Run `qit scaffold:e2e my-test` to create a basic E2E test structure.
5. **Run Your First Test:** Execute `qit run:e2e your-extension-slug my-test` (replace "your-extension-slug" with the slug of an extension you own).
6. **Generate Custom Tests:** See [Generating Tests](01-generating-tests.md) to create your own tests.

### Additional Features of Custom E2E Tests

- **Environment Configuration**: Choose different PHP, WordPress, and WooCommerce versions.
- **Plugin and Theme Compatibility**: Install plugins and themes to check for compatibility issues.
- **Visual Test Execution**: Use the `--ui` flag to view your tests running in a browser.
- **Test Generation with Playwright Codegen**: Refer to [Generating Tests](01-generating-tests.md).
- **Cross-Plugin Testing**: Run tests from other plugins and themes for compatibility.
- **Test Publishing**: Publish your tests to QIT and run specific tests from a plugin or theme.
- **Complex Configurations**: Use a config file to run tests with complex setups.
- **Detailed Test Reports**: After each test, access a shareable URL with results, including screenshots, videos, and failure traces.
- **Flexible Execution Environments**: Run tests locally or integrate them into your CI pipeline.