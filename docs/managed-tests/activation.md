# Activation Tests

The Activation test type performs basic operations on a test site with your plugin activated. It simulates essential workflows that a merchant might perform, ensuring your plugin behaves correctly throughout the entire process, from activation to order placement and deactivation.

## Operations Performed

- Log in as admin
- Activate any dependencies that your plugin has (e.g., WooCommerce)
- Activate your plugin
- Visit and take screenshots of any pages added by your plugin to the wp-admin menu
- Enable Cash on Delivery payment method
- Enable Local Pickup shipping method
- Create a product
- Create an order
- Add a product to cart
- Place an order as a guest
- Deactivate your plugin

## Test Outcomes

The status of the test is determined by the following:

- **Success:** All flows were completed, and no PHP notices, warnings, or errors were triggered.
- **Warning:** All flows were completed, but a non-fatal PHP error was triggered.
- **Failed:** One of the flows failed, or a fatal PHP error was triggered.

## Configurable Options

You can tweak several parameters in the Activation Test, such as WordPress, WooCommerce, and PHP versions. To see all available options, run:
`qit run:activation --help`

This command displays a list of configurable parameters, enabling you to test under various conditions.

## Skipping Visited Pages

If you want the Activation test to skip specific pages added by your plugin, add a `qit.json` file to your plugin's root directory (the same directory as your plugin entrypoint) with the following content:

```json
{
  "activation": {
    "skipVisitPages": [
      "wp-admin/admin.php?page=skip-visiting-this"
    ]
  }
}
```

- **Automatic Page Discovery:** By default, the test suite visits all pages accessible from the WordPress admin sidebar menu that are added by your plugin.
- **skipVisitPages Array:** The `skipVisitPages` array specifies the URLs of pages you want to exclude from visits during the tests.
- **Substring Matching:** The skipping mechanism is substring-based. If any part of a page's URL contains a string listed in `skipVisitPages`, that page will not be visited.

For example, if you include `wp-admin/admin.php?page=skip-visiting-this` in the array, any admin page URL containing that substring will be skipped.

## Visiting a Specific Page

You can also define specific pages to be visited that might not be visible from the sidebar menu. This uses a slightly different syntax, as it takes a page title and a URL. It only accepts relative URLs.

```json
{
  "activation": {
    "visitPages": {
      "Visit This": "wp-admin/admin.php?page=do-visit-this"
    }
  }
}
```

## Running the Activation Test

Run the activation test with:
```qitbash
qit run:activation your-extension
```

Replace `your-extension` with the slug of your plugin.

## Using a Tunnel

... you can use our [built-in tunnel feature](../environment/tunnel.md) to expose the test site to the internet ...

## What to Do if It Fails

If your Activation test fails:

- Open the test report to review logs and identify the root cause.
- Check for PHP notices, warnings, or errors triggered during activation and subsequent flows.
- Reproduce the issue locally and fix it in your code.
- If you believe the result is incorrect, please email us at qit@woocommerce.com for further assistance.
