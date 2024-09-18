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

### Skipping Visited Pages

If you want the Activation test to skip specific pages added by your plugin, you can add a `qit.json` file to your plugin's root directory (the same directory as your plugin entrypoint) with the following content:

```json
{
  "activation": {
    "skipVisitPages": [
      "wp-admin/admin.php?page=skip-visiting-this"
    ]
  }
}
```
  - **Automatic Page Discovery:** By default, the test suite will visit all pages accessible from the WordPress admin sidebar menu that are added by your plugin.
  - **skipVisitPages Array:** The `skipVisitPages` array in the `qit.json` file specifies the URLs of pages you want to exclude from being visited during the tests.
  - **Substring Matching:** The skipping mechanism works based on substring matching. This means that if any part of a page's URL contains a string listed in the skipVisitPages array, that page will be skipped during the tests.
    
    For example, if you include "wp-admin/admin.php?page=skip-visiting-this" in the `skipVisitPages` array, any admin page URL containing that substring will not be visited during the E2E tests.

### Visiting a specific page

Similarly, you can define specific pages to be visited, that might not be visible from the sidebar menu. It only accepts relative URLs.

```json
{
  "activation": {
    "visitPages": [
      "wp-admin/admin.php?page=visit-this"
    ]
  }
}
```

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