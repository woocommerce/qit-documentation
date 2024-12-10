# Woo E2E tests

The Woo E2E (end-to-end) test suite creates a temporary WordPress installation with WooCommerce and your extension installed, then uses a scripted browser to simulate essential store operations. This includes completing the WooCommerce onboarding wizard, creating a product, making a purchase as a customer, verifying order details as an admin, adjusting tax settings, and more.

After setting up the environment and your extension, QIT runs the [WooCommerce Core end-to-end tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw). These tests cover the [WooCommerce Core Critical Flows](https://github.com/woocommerce/woocommerce/wiki/Critical-Flows) to verify that your extension does not break the default WooCommerce behaviors. Once the tests complete, you will see a success or failure result. For failures, a link to an Allure test report is provided, allowing you to dig into what went wrong.

:::info
Currently, QIT can only run the WooCommerce Core E2E test suite. Future support for running your own E2E tests is planned.
:::

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

## Next steps

- [Activation Tests](./activation.md): Verify that your plugin activates without errors before testing complex flows.
- [Woo API Tests](./woo-api.md): Complement E2E tests with API-level checks for robust coverage.
- [Notifications and Results](../using-qit/notifications-results.md): Learn how to configure alerts and review logs for better issue tracking.
