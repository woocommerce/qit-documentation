# Woo E2E tests

The Woo E2E (end-to-end) test suite creates a temporary WordPress installation with WooCommerce and your extension installed, then uses a scripted browser to simulate essential store operations. This includes completing the WooCommerce onboarding wizard, creating a product, making a purchase as a customer, verifying order details as an admin, adjusting tax settings, and more.

After setting up the environment and your extension, QIT runs the [WooCommerce Core end-to-end tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw). These tests cover the [WooCommerce Core Critical Flows](https://developer.woocommerce.com/docs/woocommerce-core-critical-flows/) to verify that your extension does not break the default WooCommerce behaviors. Once the tests complete, you will see a success or failure result. For failures, a link to an Allure test report is provided, allowing you to dig into what went wrong.

## Example

Below is an example of the end-to-end test in action. It performs automated actions in a browser, such as creating a product, making a purchase, and verifying order details as an admin. The test runs against a store with your extension active.

<details>
<summary>Click to view GIF</summary>
<span>
![](_media/e2e.gif)
</span>
</details>

## Interpreting results

- **Success:** All critical store flows function as expected with your extension active.
- **Warning/Failed:** The test identified issues or detected errors that prevented the completion of essential WooCommerce flows.

In case of a failure, QIT provides a link to an Allure test report. Allure reports detail the test steps, include screenshots, and may offer stack traces for pinpointing the root cause of the problem.

## What to do if it fails

If your end-to-end test fails:
- Check the Allure test report for details on what failed and why.
- If you cannot reproduce the issue manually, try re-running the test to confirm if it was a fluke or a persistent problem.
- Persistent failures might indicate that your extension changes default WooCommerce behavior in unexpected ways (e.g., modifying HTML selectors or flows the tests assume are stable). If you believe this is the case, email qit@woocommerce.com for guidance. The QIT team can help determine if adjustments to the tests or your plugin are necessary.

## Understanding allure reports

When an end-to-end test fails, QIT generates an Allure test report. You can view it on the `All Tests` page in the QIT dashboard. Allure reports offer a comprehensive view of:
- Test steps and their outcomes
- HTML selectors and elements interacted with
- Screenshots and stack traces for failures

For more details, see the official Allure documentation under [Report Structure](https://docs.qameta.io/allure-report/#_report_structure).

### Viewing a report

After a failed test run:
1. Go to the `Quality Insights > All Tests` page in the QIT Dashboard.
2. Click `View Report` for the specific test run.
3. Explore the `Suites` section to see test results per browser (currently Chrome only), and the percentage of tests that passed, failed, or were skipped.

### Successful results

For successful tests, you can review details such as steps taken, HTML selectors used, and assertions made. This helps confirm that your extension’s main workflows remain unaffected by recent changes.

### Failed cases

For failed tests, Allure provides:
- A stack trace indicating where the test failed.
- A screenshot of the moment the failure occurred.
- Detailed steps and their outcomes, enabling targeted debugging.

:::tip
We've done our best to reduce test flakiness, but it can still happen. If you're unable to reproduce the issue manually, re-run the test to see if it passes on a subsequent attempt.
:::

<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Enqueue Woo E2E tests.

Usage:
  run:woo-e2e [options] [--] [<sut>]

Arguments:
  sut                                                                Extension slug or WooCommerce.com ID

Options:
      --config[=CONFIG]                                              Path to the qit.json configuration file
      --profile[=PROFILE]                                            Test profile to use [default: "default"]
      --wordpress_version[=WORDPRESS_VERSION]                        (Optional) The WordPress version to use in the test. Alias: --wp [possible values: 7.0-beta6, 6.6.5, 6.7.5, 6.8.5, 6.9.4, stable, rc] [default: "6.9.4"]
      --woocommerce_version[=WOOCOMMERCE_VERSION]                    (Optional) The WooCommerce version to use in the test. Alias: --woo [possible values: 10.4.3, 10.5.0-rc.3, stable, rc] [default: "10.4.3"]
      --php_version[=PHP_VERSION]                                    (Optional) The PHP version to use in the test. Defaults to "Requires PHP" header in plugin or 7.4 if not set. Alias: --php [possible values: 7.4, 8.0, 8.1, 8.2, 8.3, 8.4, ] [default: ""]
      --optional_features[=OPTIONAL_FEATURES]                        (Optional) A comma-separated list of WooCommerce features to enable in the testing environment. [possible values: hpos] (multiple values allowed)
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

*Auto-generated from `qit run:woo-e2e --help`.*
<!-- END GENERATED CLI REFERENCE -->
