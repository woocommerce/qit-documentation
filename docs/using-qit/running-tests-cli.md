# Running tests via the CLI

The QIT CLI allows you to run both managed and custom tests directly from your terminal. By using simple commands, you can quickly validate your extension against the latest WordPress and WooCommerce versions, or test your custom scenarios in a local environment.

## Prerequisites


- **Extension slug:** Know the slug of your WooCommerce Marketplace extension. You'll need it when running tests.

## Running managed tests

Managed tests, such as activation, Woo E2E, and security tests, run in QIT's cloud environment. To execute a managed test, use the following command pattern:

`qit run:<test-type> <extension-slug>`

For example, to run the activation test:

`qit run:activation your-extension`

This sends the request to QIT's cloud infrastructure, sets up a clean environment, and runs the activation test. When the test completes, QIT CLI will display the results and provide links to detailed logs or reports if available.

**Other Managed Tests:**
- `qit run:woo-e2e your-extension`
- `qit run:woo-api your-extension`
- `qit run:security your-extension`
- `qit run:phpstan your-extension`

- [Managed Tests](../managed-tests/introduction.md): Learn about each managed test type available.

## Running custom E2E tests locally

To develop and debug your custom E2E tests efficiently, use the QIT local environment. First, spin up a local environment:

`qit env:up`

Once the environment is ready and your custom E2E tests are in place (either locally or uploaded to QIT), run them with:

`qit run:e2e your-extension --zip=your-extension.zip`

The `--zip` argument points to a local build of your extension. This installs the extension into the test environment and runs your custom tests against it. Since these tests run locally, you'll see immediate feedback in the terminal.

If you've uploaded your custom tests to QIT's cloud, you can omit the `--zip` argument and run them directly:

`qit run:e2e your-extension`

Note that while you can run custom tests locally for quick iteration, you can also execute them in the cloud environment for integration or compatibility checks.

## Specifying versions and features

Both managed and custom test commands support parameters for selecting WordPress, WooCommerce, and PHP versions, as well as enabling optional WooCommerce features like HPOS:

`qit run:woo-e2e your-extension --wordpress_version=rc --woocommerce_version=rc --php_version=8.0 --optional_features=hpos`

This level of customization ensures you can test under various configurations to maintain broad compatibility.

## Viewing results and logs

When tests complete, QIT CLI provides a summary of the results:
- **Success:** Everything passed without issues.
- **Warning:** The test completed, but with non-fatal errors or notices.
- **Failed:** A critical error or incompatibility was detected.

For more detailed insights:
- [Viewing Test Results](./notifications-results.md): Learn how to access logs, screenshots, and detailed reports.
If you have enabled email notifications, you will receive an email when a test completes if it results in warnings or failures. For more information on setting up notifications, see [Notifications and Results](./notifications-results.md).

## Next steps

- [Using QIT via the Dashboard](./running-tests-dashboard.md): If you prefer a UI, trigger tests and review results from the WooCommerce Vendor Dashboard.
- [Advanced CLI Commands](../advanced-usage/scripting.md): Explore scripting and GitHub workflows to integrate QIT tests into your CI/CD pipeline.
- [Environment & Configuration](../environment/introduction.md): Dive deeper into configuring your local test environment and advanced features.
