# Running custom E2E tests

Once you have generated, tagged, and refined your custom E2E tests, the next step is running them. Typically, you will run these tests **locally** for rapid iteration and debugging. In some cases, the WooCommerce.com (WCCOM) marketplace may initiate these tests in a cloud environment as part of their quality control checks when a new plugin update or extension is added to the marketplace. However, from a developer’s perspective, you’ll primarily run tests locally.

## Basic command

The general command for running custom E2E tests locally is:
`qit run:e2e your-extension`

This runs the default test tag for the specified extension. If you have uploaded tests and tagged them, you can specify tags:
`qit run:e2e your-extension my-tag`

Multiple tags can be combined:
`qit run:e2e your-extension default,rc`

If you created local test files rather than uploading them, you can reference the local directory:
`qit run:e2e your-extension ./e2e`

You can even pass a zipped version of your plugin to test an unpublished build:
`qit run:e2e your-extension --zip=./my-extension.zip`

This installs your unpublished extension into the test environment before running the tests.

## Running locally

When you run `qit run:e2e`, QIT automatically handles the `env:up` and `env:down` steps for you. This means a disposable environment is created before the tests start and torn down afterward—no extra commands are needed. This approach ensures a clean slate for each run and reduces manual setup overhead.

## Marketplace (cloud) environment

When the WCCOM marketplace triggers these tests—such as after submitting a new plugin or update—QIT runs them in a cloud environment. This ensures a consistently fresh, isolated environment without any local setup. However, this process is automatic and initiated by WCCOM, not the developer. For your day-to-day development, you’ll rely on local testing.

## Visual UI mode

For debugging complex scenarios locally, run:
`qit run:e2e your-extension --ui`

This launches a browser so you can watch the tests execute step-by-step. Visual mode helps identify subtle issues, like incorrect selectors or unexpected UI states.

## Specifying versions and features

Use arguments to test different WordPress, WooCommerce, and PHP versions or enable optional features:
`qit run:e2e your-extension --wordpress_version=rc --woocommerce_version=rc --php_version=8.0 --optional_features=hpos`

This flexibility allows you to verify compatibility with upcoming releases or specific WooCommerce features like High Performance Order Storage (HPOS).

## Combining multiple plugins and tags

You can run tests from multiple plugins and tags simultaneously:
`qit run:e2e example-plugin default,rc --plugin another-plugin:test-scenarios`

This command runs a combination of tests from multiple sources, validating cross-plugin compatibility. Useful for ensuring that your extension plays well with other known integrations or related tools.

**Compatibility and Lifecycle Integration:**

When running compatibility tests involving multiple plugins and dependencies:
- **SUT and Additional Plugins**: The SUT is always tested (`action: test`), while additional plugins may be set to `test`, `bootstrap`, or `activate`.
- **Shared Setup/Teardown**: Shared scripts run once for all plugins, ensuring a global baseline. After shared setup finishes, QIT exports a DB snapshot. Each plugin that undergoes isolated testing (`test` action) will restore this snapshot before its isolated setup and after its isolated teardown, ensuring consistent conditions. Plugins in `bootstrap` or `activate` mode do not receive isolated phases; however, they still benefit from the shared setup conditions and remain active in the environment throughout the test run.
- **Predictable Teardown**: By the time shared teardown scripts run, QIT restores the environment to the baseline snapshot, ensuring a consistent and predictable state for cleanup operations.For instance:Here, `woocommerce-amazon-s3-storage` and `woocommerce-progressive-discounts` receive isolated phases and tests, while `woocommerce-extra-plugin` is simply activated and benefits from the shared lifecycle steps without isolated runs. This approach allows you to test real-world compatibility scenarios where certain plugins provide baseline functionality (bootstrap/activate) while others are fully tested.

Each plugin’s `action` (whether `test`, `bootstrap`, or `activate`) determines its participation in shared and isolated phases. For a refresher on these distinctions, see [Compatibility Testing with Custom E2E Tests](./compatibility-tests.md).

## Understanding the SUT, additional plugins, and dependencies

When running tests, QIT distinguishes between three key concepts in your test environment configuration:

1. **SUT (System Under Test)**:  
   The main extension you’re validating. By default, the SUT is set to `action: test`, ensuring that QIT runs tests specifically for this extension. If you’ve defined a `qit.yml` or passed arguments like `woo_extension` or `--source`, QIT identifies the SUT and tests it accordingly.

2. **Additional Plugins**:  
   These are plugins you explicitly add to the environment using `--plugin` arguments (e.g., `--plugin woocommerce-extra-plugin:activate`). By default, if you don’t specify an action, additional plugins are set to `action: bootstrap`. This means they are installed and activated but not tested individually. If you need to test them, append `:test` to the plugin’s argument (e.g., `--plugin my-plugin:test`).

3. **Dependencies**:  
   Dependencies are critical requirements needed to activate the SUT or other plugins. These often come from the product metadata on WooCommerce.com (WCCOM) or, in the future, the “Requires Plugins” header in WordPress core. Dependencies can have their own dependencies, forming a chain of requirements that must be met before the SUT can run.

   By default, dependencies are handled with `--dependencies=bootstrap`. This ensures that all required dependencies are installed and activated before the tests begin, providing a stable baseline. If you need a different action for dependencies (e.g., testing them as well), adjust the `--dependencies` parameter accordingly.

**Where to Configure These Settings**

- **SUT**: Usually defined by specifying a `woo_extension` argument, using a local `qit.yml`, or providing a `--source` parameter. QIT infers which extension is the primary one to test.
- **Additional Plugins**: Declared via CLI arguments (e.g., `--plugin some-other-plugin`) or in `qit.yml`. Adjust their actions by appending `:test`, `:bootstrap`, or `:activate`.
- **Dependencies**: Controlled via `--dependencies` parameter and by including them in `qit.yml` or ensuring they’re known to QIT through WCCOM metadata. QIT then installs and bootstraps these plugins so the SUT can run successfully.

**Example:**

```bash
qit run:e2e woocommerce-amazon-s3-storage \
--dependencies=bootstrap \
--plugin woocommerce-extra-plugin:test \
--plugin my-analytics-plugin
```

- The SUT (`woocommerce-amazon-s3-storage`) is tested by default.
- `woocommerce-extra-plugin` is explicitly set to `test`.
- `my-analytics-plugin` defaults to `bootstrap`.
- Dependencies required by the SUT or these plugins are also bootstrapped according to `--dependencies=bootstrap`.

## Using a configuration file

Create a qit.json or qit.yml file to define complex scenarios, like multiple plugins, advanced PHP versions, or custom environment variables. Once defined, a simple:
`qit run:e2e your-extension`
applies the configuration automatically, simplifying your commands and making them more repeatable.

## Local test files and paths

If you have not uploaded your tests to QIT, you can run local tests directly:
`qit run:e2e your-extension ~/my-plugins/example-plugin/tests --source ~/my-plugins/example-plugin`

In this example, `your-extension` references the slug for the extension under test, while the tests and source arguments point to local paths or a zip file, enabling you to test changes without publishing them first.

## Debugging and iteration

If a test fails, use the CLI output and any provided URLs for logs, screenshots, or reports. Refine your test scenario, adjust environment variables, or enable the UI mode to observe behavior in real-time. Re-run the test after making changes to confirm that issues are resolved.

## Next steps

- [Understanding the Lifecycle](./understanding-lifecycle.md): Learn how shared setup, isolated setup, and teardown phases affect your tests.
- [Themes](./themes.md): Enforce a specific theme or test with multiple themes for front-end validation.
- [Architecture & Security](./security-architecture.md): Gain insights into how QIT ensures test isolation, security, and reliable reporting.
- [QIT Helpers](./qit-helpers.md): Explore built-in functions to simplify test writing, like logging in as admin or running WP-CLI commands.