---
description: "Reference for the `run:woo-api` managed test. Runs WooCommerce Core REST API tests (products, customers, orders CRUD operations) with your extension active to verify it doesn't break or alter expected API responses. Covers how to interpret results, best practices for API compatibility, and how to run the test. Supports WordPress, WooCommerce, PHP version selection, HPOS/new_product_editor feature toggles, and extension sets. Includes auto-generated CLI usage."
---

# Woo API tests

Woo API tests verify that your extension interacts cleanly with the [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction). By creating and manipulating products, orders, and customers through API requests, these tests ensure that your extension doesn’t introduce errors or alter expected responses, helping maintain a stable and reliable store experience.

## How it works

The Woo API tests:
- Set up a fresh WordPress and WooCommerce environment.
- Install and activate your extension.
- Execute the [WooCommerce Core API test suite](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw/tests/api-tests) against the configured environment.
- Perform actions like creating products, customers, and orders via the REST API, then validate that the responses match expected outcomes.

By running these tests, you confirm that your extension does not break or degrade the WooCommerce API, preserving compatibility with third-party integrations, mobile apps, and headless storefronts.

## What the tests check

The tests cover essential WooCommerce REST API endpoints, including:
- Creating, updating, and deleting products.
- Managing customers and their details.
- Placing, retrieving, and updating orders.

If your extension interacts with these endpoints (for example, by adding custom product fields or modifying order data), Woo API tests help catch issues before merchants or customers encounter them.

## Interpreting results

- **Success:** All API operations returned expected responses, and no errors or warnings were triggered.
- **Warning/Failed:** Some requests did not meet expectations or produced errors, indicating potential compatibility or logic issues.

For failed tests, QIT provides logs and, when applicable, links to detailed reports. Use these insights to understand what went wrong and how to address the issue.

## Best practices

- **Maintain backwards compatibility:** Keep your extension updated as WooCommerce evolves, ensuring your API integrations remain valid and stable.
- **Test complex scenarios:** If you rely on custom data fields or extensive use of filters and hooks, run tests after any significant change to confirm the API still responds correctly.
- **Combine with other tests:** Running Woo API tests alongside Woo E2E and Security tests provides a comprehensive picture of your extension’s quality and stability.

## Running woo API tests

To run the Woo API tests:

```qitbash
qit run:woo-api your-extension
```

Replace `your-extension` with your plugin’s slug. The tests will run in QIT’s cloud environment, and the CLI or Vendor Dashboard will display the results.

<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Enqueue Woo API tests.

Usage:
  run:woo-api [options] [--] [<sut>]

Arguments:
  sut                                                                Extension slug or WooCommerce.com ID

Options:
      --config[=CONFIG]                                              Path to the qit.json configuration file
      --profile[=PROFILE]                                            Test profile to use [default: "default"]
      --wordpress_version[=WORDPRESS_VERSION]                        (Optional) The WordPress version to use in the test. Alias: --wp [possible values: 7.0-beta6, 6.6.5, 6.7.5, 6.8.5, 6.9.4, stable, rc] [default: "6.9.4"]
      --woocommerce_version[=WOOCOMMERCE_VERSION]                    (Optional) The WooCommerce version to use in the test. Alias: --woo [possible values: 10.4.3, 10.5.0-rc.3, stable, rc] [default: "10.4.3"]
      --php_version[=PHP_VERSION]                                    (Optional) The PHP version to use in the test. Defaults to "Requires PHP" header in plugin or 7.4 if not set. Alias: --php [possible values: 7.4, 8.0, 8.1, 8.2, 8.3, 8.4, ] [default: ""]
      --optional_features[=OPTIONAL_FEATURES]                        (Optional) A comma-separated list of WooCommerce features to enable in the testing environment. [possible values: hpos, new_product_editor] (multiple values allowed)
      --extension_set[=EXTENSION_SET]                                (Optional) The predefined set of extensions to include in the test. [possible values: compatibility, minimal]
      --additional_plugins[=ADDITIONAL_PLUGINS]                      (Optional) A comma-separated list of additional plugins to activate in the environment. Accepts: WordPress.org plugin slugs, Woo.com Product Slugs or Woo.com Product IDs. (multiple values allowed)
      --additional_woo_plugins[=ADDITIONAL_WOO_PLUGINS]              (Optional) [Deprecated] A comma-separated list of Additional WooCommerce Extension IDs. (multiple values allowed)
      --additional_wordpress_plugins[=ADDITIONAL_WORDPRESS_PLUGINS]  (Optional) [Deprecated] A comma-separated list of Additional WordPress plugin slugs. (multiple values allowed)
      --zip[=ZIP]                                                    (Optional) Local ZIP / dir / URL build to test
  -j, --json|--no-json                                               (Optional) Output raw JSON response
      --async|--no-async                                             (Optional) Enqueue test and return immediately without waiting
  -w, --wait|--no-wait                                               (Deprecated) Wait for test completion - this is now the default behavior
      --print-report-url|--no-print-report-url                       (Optional) Print the test report URL (contains sensitive data - use cautiously in public logs)
  -t, --timeout[=TIMEOUT]                                            (Optional) Wait timeout in seconds
  -g, --group|--no-group                                             (Optional) Register the run into a group
```

*Auto-generated from `qit run:woo-api --help`.*
<!-- END GENERATED CLI REFERENCE -->
