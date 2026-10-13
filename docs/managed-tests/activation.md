---
description: "Reference for the `run:activation` managed test. Details all operations performed (login, activate, visit pages, create product, place order, deactivate) and how to interpret results, including the hook resilience check and the request footprint. Covers configuration via qit.json including skipVisitPages (substring-based URL matching) and visitPages for custom admin pages. Includes auto-generated CLI usage with all available flags. Supports WordPress, WooCommerce, and PHP version selection."
---

# Activation tests

The Activation test type performs basic operations on a test site with your plugin activated. It simulates essential workflows that a merchant might perform, ensuring your plugin behaves correctly throughout the entire process, from activation to order placement and deactivation.

## Operations performed

- Log in as admin
- Activate any dependencies that your plugin has (e.g., WooCommerce)
- Activate your plugin
- Check that your plugin does not break common requests across the site (see [Hook resilience check](#hook-resilience-check))
- Visit and take screenshots of any pages added by your plugin to the wp-admin menu
- Enable Cash on Delivery payment method
- Enable Local Pickup shipping method
- Create a product
- Create an order
- Add a product to cart
- Place an order as a guest
- Deactivate your plugin

## Test outcomes

The status of the test is determined by the following:

- **Success:** All flows were completed, and no PHP notices, warnings, or errors were triggered.
- **Warning:** All flows were completed, but a non-fatal PHP error was triggered.
- **Failed:** One of the flows failed, a fatal PHP error was triggered, or the [hook resilience check](#hook-resilience-check) failed.

## Hook resilience check

For plugins, the Activation test checks that activating your plugin doesn't break requests unrelated to it. It runs by default, and a failure fails the test.

The typical cause is a hook callback with a strict PHP type that another plugin can legally violate. For example, a `rest_pre_serve_request` callback declaring `bool $served` throws a `TypeError` when another callback returns `null`, and that breaks REST requests across the site.

Before and after activating your plugin, QIT requests the front page, wp-admin, several REST endpoints and the WooCommerce settings screen, and sends an email through `wp_mail()` that is never delivered. It also makes `rest_pre_serve_request` return `null`, and `pre_http_request` and `rest_authentication_errors` return a `WP_Error`, so make sure your callbacks on those hooks accept these values.

The **Verify global request resilience** step reports one of these results:

- `QIT_ACTIVATION_SMOKE_PASSED`: every request still works after activation.
- `QIT_ACTIVATION_SMOKE_REGRESSION`: after activation, a request hit a PHP fatal error, an HTTP 5xx or another unexpected response. Failures marked `sut-attributed` have your plugin's files in the error or its stack trace.
- `QIT_ACTIVATION_SMOKE_BASELINE_INVALID`: QIT couldn't get a reliable reading. If every failure is in the `baseline` round, the site was unhealthy before your plugin was activated: run the test again, and email qit@woocommerce.com if it persists. Failures in the `post_activation` round can mean your plugin broke `admin-ajax.php` or the REST API.

When the check fails, the steps after it are skipped. The failing requests and PHP errors are in that step of the **detailed test report** linked from the test summary.

## Request footprint

The request footprint is not part of the Activation test: QIT measures it alongside the test, for plugins, and it never changes the result. It appears as the **Request footprint** section of the test report.

It shows what your plugin does on three requests where it should do almost nothing: `/wp-admin/admin-ajax.php?action=rest-nonce`, `/wp-admin/profile.php` and the front page. For each one you get the database queries, writes and outbound HTTP calls your plugin made, and the main hooks and lines behind them. Use it to find work that runs on every request but only needs to run on a few, such as queries on `admin_init` that also run on every AJAX request.

The site is a clean store with no object cache, so code that only runs once your plugin is configured isn't measured.

## Configurable options

You can tweak several parameters in the Activation Test, such as WordPress, WooCommerce, and PHP versions. To see all available options, run:
```qitbash
qit run:activation --help
```

This command displays a list of configurable parameters, enabling you to test under various conditions.

## Skipping visited pages

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

- **Automatic page discovery:** By default, the test suite visits all pages accessible from the WordPress admin sidebar menu that are added by your plugin.
- **Skipvisitpages array:** The `skipVisitPages` array specifies the URLs of pages you want to exclude from visits during the tests.
- **Substring matching:** The skipping mechanism is substring-based. If any part of a page's URL contains a string listed in `skipVisitPages`, that page will not be visited.

For example, if you include `wp-admin/admin.php?page=skip-visiting-this` in the array, any admin page URL containing that substring will be skipped.

## Visiting a specific page

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

## Running the activation test

Run the activation test with:
```qitbash
qit run:activation your-extension
```

Replace `your-extension` with the slug of your plugin.

## Using a tunnel

Some plugins might need an actual live site URL to work properly, such as payment gateways and SaaS. For those, you can use our [built-in tunnel feature](../environment/tunnel.md) to test these plugins.

## Canonical compatibility check in the WooCommerce Marketplace

The WooCommerce Marketplace will automatically run an activation test using the [`compatibility` extension set](../configuration/extension-sets.md) upon new submission or update. You will see the results in the list of tests under `Activation (canonical compatibility check)`.

## What to do if it fails

If your Activation test fails:

- Open the test report to review logs and identify the root cause.
- Identify the causes of failure. The test will log PHP notices, warnings, and errors that happens when activating your plugin.
- If the **Verify global request resilience** step failed, see [Hook resilience check](#hook-resilience-check) for what its result means and where to find the failing requests.
- Reproduce the issue locally and fix it in your code.
- If you believe the result is incorrect, please email us at qit@woocommerce.com for further assistance.

## CLI Usage

{/* QIT_COMMAND:run:activation */}
