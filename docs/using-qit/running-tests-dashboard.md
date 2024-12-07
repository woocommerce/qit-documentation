# Running Tests via the WooCommerce.com Dashboard

If you prefer a user interface (UI) over the command line, the WooCommerce Vendor Dashboard offers a convenient way to run managed tests and review their results. This approach is especially useful if you want to trigger tests for specific releases or configurations without leaving your browser.

## Prerequisites

- **WooCommerce.com Partner Developer Account:** Ensure you are logged in with the vendor account associated with your extension.
- **Extension Listed on the WooCommerce Marketplace:** The dashboard features are only available for extensions listed on WooCommerce.com.

## Accessing the Vendor Dashboard

1. Log in to your WooCommerce.com account.
2. Navigate to the `Vendor Dashboard` section.
3. Look for the `Quality Insights` or `QIT` menu item to access the testing tools.

## Running a Test

1. Go to the `Run a Test` page under the QIT menu.
2. Select the extension you want to test.
3. Choose the test type you wish to run, such as `Activation`, `Woo E2E`, or `Security`.
4. Pick the versions of WordPress and WooCommerce you'd like to test against.
5. Click `Confirm and run test` to queue the test run.

The dashboard will display a status such as `Pending`, `Running`, or `Complete`. Once finished, you can view detailed results.

## Viewing Results and Reports

After a test completes, navigate to the `All Tests` page in the QIT menu. You will see:

- **Test Type:** The kind of test run (e.g., Activation, Woo E2E).
- **Status:** Whether the test passed, failed, or produced warnings.
- **Version Information:** The WordPress, WooCommerce, and PHP versions used.
- **Actions:** Links to detailed logs, screenshots, or reports if available.

By clicking the `View Report` option, you can access more in-depth information, including step-by-step test actions, error logs, and screenshots.

## Triggering Tests for New Releases

When you publish a new version of your extension on the WooCommerce Marketplace, QIT may automatically trigger managed tests. However, you can also run tests on-demand from the dashboard before publishing, ensuring any issues are caught early.

## Notifications and Alerts

If you have enabled email notifications, you will receive an email when a test completes if it results in warnings or failures. For more information on setting up notifications, see [Notifications and Results](#).

## Why Use the Dashboard?

- **Non-Technical Access:** Team members not comfortable with the CLI can still manage tests and review results.
- **On-Demand Testing:** Quickly rerun tests after making changes without setting up a local environment.
- **Unified Interface:** All test management and result review happen in one place, integrated with the WooCommerce Marketplace workflow.

## Next Steps

- [Running Tests via the CLI](#): If you need scripting or integration with CI pipelines, consider using the CLI.
- [Managed Tests](#): Learn about each managed test type available.
- [Custom E2E Tests](#): Explore creating custom tests that you can run locally for deeper coverage.
