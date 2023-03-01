## Activation tests

The Activation test type activates your extension against a freshly created shop and captures any PHP errors or warnings that may occur on activation. This test sets up a WooCommerce store using the provided WordPress and WooCommerce versions. The following statuses will be returned from this test:

- Success: No PHP notices, warnings, or errors were triggered.
- Warning: A non-fatal PHP error was triggered.
- Failure: A fatal PHP error was triggered.