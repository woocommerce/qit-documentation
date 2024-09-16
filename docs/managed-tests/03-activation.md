# Activation tests

The Activation test type performs basic operations on a test site with your plugin activated.

### The operations are:

- Log-in as admin
- Activate any dependencies that your plugin has (e.g. WooCommerce)
- Activate your plugin
- Visit and take screenshots of any pages added by your plugin to the wp-admin menu
- Enable Cash on Delivery payment method
- Enable Local Pickup shipping method
- Create a product
- Create an order
- Add a product to cart
- Place an order as a guest
- Deactivate your plugin

### The status of the test is determined by the following:

- Success: All flows were completed, and no PHP notices, warnings, or errors were triggered.
- Warning: All flows were completed, but a non-fatal PHP error was triggered.
- Failed: One of the flows failed, or a fatal PHP error was triggered.

### Configurable Options:

You can tweak several parameters in the Activation Test, such as Woo, WP, and PHP versions, etc. You can see all options by running `qit run:activation --help` in the QIT CLI.

### How to run the test

You can run the activation test with the following command:

```qitbash
qit run:activation <your-plugin>
```

## What to do if it fails

If your activation test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log PHP notices, warnings, and errors that happens when activating your plugin
- Try to reproduce it locally and fix the issue
- If you think the result is incorrect, please email us at qit@woocommerce.com