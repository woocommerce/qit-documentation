# Running tests via the woocommerce.com dashboard

If you prefer a user interface (UI) over the command line, the WooCommerce Vendor Dashboard offers a convenient way to run managed tests and review their results. This approach is especially useful if you want to trigger tests for specific releases or configurations without leaving your browser.

## Prerequisites

- **Woocommerce.com partner developer account:** Ensure you are logged in with the vendor account associated with your extension.
- **Extension listed on the WooCommerce marketplace:** The dashboard features are only available for extensions listed on WooCommerce.com.

## Accessing the vendor dashboard

1. Log in to your WooCommerce.com account.
2. Navigate to the `Vendor Dashboard` section.
3. Look for the `Quality Insights` menu item to access the testing tools.

## Running a test

1. Go to the `Run a Test` page under the QIT menu.
2. Select the extension you want to test.
3. Choose the test type you wish to run, such as `Activation`, `Woo E2E`, or `Security`.
4. Pick the versions of WordPress and WooCommerce you'd like to test against.
5. Click `Confirm and run test` to queue the test run.

The dashboard will display a status such as `Pending`, `Running`, or `Complete`. Once finished, you can view detailed results.

## Viewing results and reports

After a test completes, navigate to the `All Tests` page in the QIT menu. You will see:

- **Test type:** The kind of test run (e.g., Activation, Woo E2E).
- **Status:** Whether the test passed, failed, or produced warnings.
- **Version information:** The WordPress, WooCommerce, and PHP versions used.
- **Actions:** Links to detailed logs, screenshots, or reports if available.

By clicking the `View Report` option, you can access more in-depth information, including step-by-step test actions, error logs, and screenshots.

## Triggering tests for new releases

When you publish a new version of your extension on the WooCommerce Marketplace, QIT will automatically trigger managed tests. However, you can also run tests on-demand from the dashboard before publishing, ensuring any issues are caught early.

## Notifications and alerts

If you have enabled email notifications, you will receive an email when a test completes if it results in warnings or failures. For more information on setting up notifications, see [Notifications and Results](./notifications-results.md).
