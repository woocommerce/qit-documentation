# Running Custom E2E Tests

Once you have generated, tagged, and refined your custom E2E tests, the next step is running them. QIT offers flexibility in how and where you execute tests. You can run them locally for rapid iteration or let QIT handle the process in the cloud, ensuring a clean and isolated environment every time.

## Basic Command

The general command for running custom E2E tests is:
`qit run:e2e your-extension`

This runs the default test tag for the specified extension in QIT’s cloud environment. If you have uploaded tests and tagged them, you can specify tags:
`qit run:e2e your-extension my-tag`

Multiple tags can be combined:
`qit run:e2e your-extension default,rc`

If you created local test files rather than uploading them, you can reference the local directory:
`qit run:e2e your-extension ./e2e`

You can even pass a zipped version of your plugin to test an unpublished build:
`qit run:e2e your-extension --zip=./my-extension.zip`

This installs your unpublished extension into the test environment before running the tests.

## Running Locally vs. Cloud

- **Local Environment:**  
  Use `qit env:up` to spin up a disposable environment, then run:
  `qit run:e2e your-extension ./e2e`

  Running tests locally gives you immediate feedback, making it easier to debug and refine tests quickly. Once done, tear down the environment:
  `qit env:down`

- **Cloud Environment:**  
  Omit local paths or the zip argument to run tests in QIT’s cloud. This ensures a consistently fresh, isolated environment and is ideal for integration or compatibility checks before releasing updates.

## Visual UI Mode

For debugging complex scenarios, run:
`qit run:e2e your-extension --ui`

This launches a browser so you can watch the tests execute step-by-step. Visual mode helps identify subtle issues, like incorrect selectors or unexpected UI states.

## Specifying Versions and Features

Use arguments to test different WordPress, WooCommerce, and PHP versions or enable optional features:
`qit run:e2e your-extension --wordpress_version=rc --woocommerce_version=rc --php_version=8.0 --optional_features=hpos`

This flexibility allows you to verify compatibility with upcoming releases or specific WooCommerce features like High Performance Order Storage (HPOS).

## Combining Multiple Plugins and Tags

You can run tests from multiple plugins and tags simultaneously:
`qit run:e2e example-plugin default,rc --plugin another-plugin:test-scenarios`

This command runs a combination of tests from multiple sources, validating cross-plugin compatibility. Useful for ensuring that your extension plays well with other known integrations or related tools.

## Using a Configuration File

Create a qit.json or qit.yml file to define complex scenarios, like multiple plugins, advanced PHP versions, or custom environment variables. Once defined, a simple:
`qit run:e2e your-extension`
applies the configuration automatically, simplifying your commands and making them more repeatable.

## Local Test Files and Paths

If you have not uploaded your tests to QIT, you can run local tests directly:
`qit run:e2e your-extension ~/my-plugins/example-plugin/tests --source ~/my-plugins/example-plugin`

In this example, `your-extension` references the slug for the extension under test, while the tests and source arguments point to local paths or a zip file, enabling you to test changes without publishing them first.

## Debugging and Iteration

If a test fails, use the CLI output and any provided URLs for logs, screenshots, or reports. Refine your test scenario, adjust environment variables, or enable the UI mode to observe behavior in real-time. Re-run the test after making changes to confirm that issues are resolved.

## Next Steps

- [Understanding the Lifecycle](./understanding-lifecycle.md): Learn how shared setup, isolated setup, and teardown phases affect your tests.
- [Themes](./themes.md): Enforce a specific theme or test with multiple themes for front-end validation.
- [Architecture & Security](./security-architecture.md): Gain insights into how QIT ensures test isolation, security, and reliable reporting.
- [QIT Helpers](./qit-helpers.md): Explore built-in functions to simplify test writing, like logging in as admin or running WP-CLI commands.

By leveraging local and cloud environments, tags, configuration files, and optional features, you can run custom E2E tests in a manner that perfectly suits your development workflow. This flexibility ensures comprehensive coverage, early detection of issues, and a smoother path to delivering stable, high-quality extensions.
