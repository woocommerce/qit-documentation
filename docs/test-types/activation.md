# Activation tests

The Activation test type activates your extension against a freshly created shop and captures any PHP errors or warnings that may occur on activation. This test sets up a WooCommerce store using the provided WordPress and WooCommerce versions. The following statuses will be returned from this test:

- Success: No PHP notices, warnings, or errors were triggered.
- Warning: A non-fatal PHP error was triggered.
- Failure: A fatal PHP error was triggered.

## What to do if it fails

If your activation test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log PHP notices, warnings, and errors that happens when activating your plugin
- Try to reproduce it locally and fix the issue
- If you think the result is incorrect, please email us at qit@woocommerce.com