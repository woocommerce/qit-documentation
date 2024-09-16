# Introduction

:::info
The custom E2E tests feature is available as early-access.
:::

The custom E2E tests allows you to generate, write, and run end-to-end tests for WordPress Plugins and Themes.

It aims to remove most barriers to writing and running E2E tests, by providing a simple CLI tool that generates test scaffolding, and a managed test environment that you can run your tests in.

It also provides a platform where you can share your tests with other developers, and run tests from other plugins and themes.

## What is the benefit of writing custom E2E tests?

- WooCommerce.com might use your tests as a ranking factor for your extension.
- You can ensure that your plugin or theme works as expected in different environments.
- You can catch bugs before they reach your users.
- You can test the compatibility of your plugin with other plugins.

## Getting Started

1. Download the QIT CLI tool. See [Installation](cli/01-installation.md).
2. Follow the CLI instructions to connect _(You must have at least one extension listed in WooCommerce.com)_
3. Check what extensions you have access to test, with `qit extensions`
4. Run `qit scaffold:e2e my-test` to generate a basic E2E test structure
5. Run your first test: `qit run:e2e slug-or-id-here my-test` (Replace "slug-or-id-here" with the slug of an extension you own)
6. See [Generating Tests](01-generating-tests.md) to generate your tests.

## What else can you do with the custom E2E tests?

- Choose different PHP, WordPress and WooCommerce versions.
- Install plugins and themes to check for compatibility.
- View your tests running with `--ui` flag.
- Generate tests with Playwright Codegen. See [Generating Tests](01-generating-tests.md).
- Run tests from other plugins/themes to do compatibility testing. See [Running Tests from Other Plugins](04-running-other-plugins-tests.md).
- Publish your tests to QIT, and run specific tests from a plugin/theme.
- Use a config file to run tests with a complex configuration.
- After each test, you will have a shareable URL with the test results, including screenshots, videos and traces of the failures.
- Run tests in your local environment, or in CI.