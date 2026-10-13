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

For plugins, the Activation test checks that activating your plugin does not break requests that have nothing to do with it. It runs by default on every `qit run:activation`, with no extra options, and a failure fails the test.

It catches a class of bugs that is easy to ship and hard to see: a callback on a WordPress hook declares a strict PHP type for a value that another plugin, or WordPress itself, can legitimately pass as something else. For example, a `rest_pre_serve_request` callback that declares `bool $served` throws a `TypeError` as soon as another callback returns `null`, and that fatal error can break unrelated REST requests across the site, along with the admin screens that rely on them.

Right before and right after activating your plugin, QIT sends the same set of requests:

- the front page, wp-admin and the REST API index;
- a few WordPress and WooCommerce REST endpoints;
- the WooCommerce settings screen; and
- an email sent through `wp_mail()`, which is never delivered.

In both rounds, it also simulates three return values that other plugins can legally produce, on QIT's own requests only:

- `rest_pre_serve_request` returning `null`;
- `pre_http_request` returning a `WP_Error`; and
- `rest_authentication_errors` returning a `WP_Error`.

If your plugin hooks into any of these, make sure its callbacks accept those values, for example by not declaring a strict native type for a parameter that can receive them.

### Results

The check appears as the **Verify global request resilience** step and ends with one of these codes:

- `QIT_ACTIVATION_SMOKE_PASSED`: every request that worked before activation still works after it.
- `QIT_ACTIVATION_SMOKE_REGRESSION`: after activation, at least one request hit a PHP fatal error, an HTTP 5xx response, a transport failure or an unexpected response. Ordinary 4xx responses are accepted on the front page, wp-admin and the regular REST requests; the mail, outbound HTTP and authentication probes expect one exact response. The message lists each failing request with its status and the reason, plus the PHP errors captured during it, with file and line. A request is marked `sut-attributed` when your plugin's files appear in the error or its stack trace. Unmarked failures still fail the check.
- `QIT_ACTIVATION_SMOKE_BASELINE_INVALID`: QIT could not get a trustworthy reading. Either the site was already unhealthy before your plugin was activated, or QIT's own request instrumentation stopped working, which can also happen after activation if your plugin breaks `admin-ajax.php` or the REST API. The test still fails. The message lists each affected request and whether it was in the `baseline` (before activation) or `post_activation` round. If every failure is in the `baseline` round, the problem started before your plugin was activated, and the result cannot tell whether your plugin breaks anything: run the test again, and if it keeps happening, email us at qit@woocommerce.com.

If QIT cannot confirm that it activated your plugin itself, for example because the plugin was already active, the step is skipped and does not affect the result.

The Activation flows run in order, so when this check fails, the steps after it are skipped and show as skipped in the report.

The test summary does not show this check. Open the **detailed test report** linked from the summary: the **Verify global request resilience** step holds the message above and the `global-surface-resilience.txt` and `global-surface-resilience.json` attachments, with every request made before and after activation and the PHP errors captured during them.

## Request footprint

The request footprint is not part of the Activation test: it is a measurement QIT takes alongside it, for plugins, and never changes the test result. In a default Activation run, it appears as the **Request footprint** section of the test report. It shows what your plugin does on three requests where it should do almost nothing: `/wp-admin/admin-ajax.php?action=rest-nonce`, `/wp-admin/profile.php` and the front page. It points to work that runs on every request when it only needs to run on a few, such as database queries on `admin_init` that also run on every AJAX request.

Each request is sent three times before and three times after activating your plugin. For each request, the report shows:

- the database queries your plugin ran, how many of them were writes, and its outbound HTTP calls through the WordPress HTTP API (QIT answers them with an error, so they never leave the test site);
- the change in the total number of queries compared with before activation; and
- up to ten call sites behind them, as hook and file and line. Only call sites seen on every repeat are listed, so the counts can include work that has no listed call site.

Counts include work WordPress does on your plugin's behalf, such as the queries `update_option()` runs for it. The test site is a clean store with no persistent object cache, so code that only runs once your plugin is configured is not measured, and some reads that a production cache would serve count as queries.

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
