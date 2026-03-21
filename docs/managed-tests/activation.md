---
description: "Reference for the `run:activation` managed test. Details all operations performed (login, activate, visit pages, create product, place order, deactivate) and how to interpret results. Covers configuration via qit.json including skipVisitPages (substring-based URL matching) and visitPages for custom admin pages. Includes auto-generated CLI usage with all available flags. Supports WordPress, WooCommerce, and PHP version selection."
---

# Activation tests

The Activation test type performs basic operations on a test site with your plugin activated. It simulates essential workflows that a merchant might perform, ensuring your plugin behaves correctly throughout the entire process, from activation to order placement and deactivation.

## Operations performed

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

## Test outcomes

The status of the test is determined by the following:

- **Success:** All flows were completed, and no PHP notices, warnings, or errors were triggered.
- **Warning:** All flows were completed, but a non-fatal PHP error was triggered.
- **Failed:** One of the flows failed, or a fatal PHP error was triggered.

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

The WooCommerce Marketplace will automatically run an activation test using the [`compatibility` extension set](../configuration/extension-sets) upon new submission or update. You will see the results in the list of tests under `Activation (canonical compatibility check)`. Currently this test is informational only, and will not block a submission or an update.

## What to do if it fails

If your Activation test fails:

- Open the test report to review logs and identify the root cause.
- Identify the causes of failure. The test will log PHP notices, warnings, and errors that happens when activating your plugin.
- Reproduce the issue locally and fix it in your code.
- If you believe the result is incorrect, please email us at qit@woocommerce.com for further assistance.

<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Run activation tests

Usage:
  run:activation [options] [--] [<sut> [<passthrough>...]]

Arguments:
  sut                                              Extension identifier: plugin/theme slug or WooCommerce.com ID
  passthrough                                      Arguments after --

Options:
      --config[=CONFIG]                            Path to the qit.json configuration file
      --profile[=PROFILE]                          Test profile to use [default: "default"]
  -e, --environment[=ENVIRONMENT]                  Pick an environment block from qit.json (e.g. --environment=legacy) [default: "default"]
      --zip[=ZIP]                                  Custom source for the plugin/theme (local ZIP, local directory, or URL to a .zip file)
      --source[=SOURCE]                            [Deprecated] Use --zip instead
      --async|--no-async                           Enqueue test and return immediately without waiting
  -w, --wait|--no-wait                             (Deprecated) Wait for test completion - this is now the default behavior
      --passthrough_target[=PASSTHROUGH_TARGET]    Test packages that should receive passthrough arguments (multiple allowed) (multiple values allowed)
      --test-package[=TEST-PACKAGE]                Test packages to include (multiple values allowed) (multiple values allowed)
      --php_version[=PHP_VERSION]                  PHP version (e.g., 8.2, 8.3). Alias: --php [default: "8.2"]
      --wordpress_version[=WORDPRESS_VERSION]      WordPress version (stable, rc, 6.6). Alias: --wp [default: "stable"]
      --woocommerce_version[=WOOCOMMERCE_VERSION]  WooCommerce version. Alias: --woo
  -p, --plugin[=PLUGIN]                            Additional plugins (multiple values allowed)
  -t, --theme[=THEME]                              Additional themes (multiple values allowed)
      --volume[=VOLUME]                            Volumes (host:container) (multiple values allowed)
  -x, --php_extension[=PHP_EXTENSION]              PHP extensions (multiple values allowed)
  -o, --object_cache                               Enable Redis object cache
      --tunnel[=TUNNEL]                            Enable tunnelling (cloudflare, ngrok) [default: "no_tunnel"]
      --offline                                    Override: Force offline mode - will error if any test requires network
      --online                                     Override: Force online mode - enable network regardless of test requirements
      --env[=ENV]                                  Set env var  --env KEY=VAL (multiple values allowed)
      --env_file[=ENV_FILE]                        Load vars from file  --env_file ./prod.env (multiple values allowed)
  -j, --json                                       Machine‑readable JSON output
  -s, --skip_activating_plugins                    Skip activating plugins
      --notify                                     Notify on failures
  -g, --group|--no-group                           Register into a group
      --print-report-url                           Print the test report URL (contains sensitive data - use cautiously in public logs)
      --ui                                         Run tests in Playwright UI mode
  -st, --skip_activating_themes                    Skip activating themes
```

*Auto-generated from `qit run:activation --help`.*
<!-- END GENERATED CLI REFERENCE -->
