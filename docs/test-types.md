# Test types

The following tests types are currently available:

## End-to-end tests

The end-to-end (e2e) test creates a temporary WordPress installation with WooCommerce and the extension under test installed, and uses a browser that is scripted to perform certain automated tasks, such as completing the WooCommerce onboarding wizard, creating a product, making a purchase as a customer, verifying the order details as an admin, tweaking tax settings, etc.

The end-to-end test type runs the [WooCommerce Core end-to-end tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw) against a store with your extension activated. These tests cover the [WooCommerce Core Critical Flows](https://github.com/woocommerce/woocommerce/wiki/Critical-Flows) to verify that a given extension does not break the default WooCommerce behaviors. Once the tests complete, the dashboard will show a Success or Failure test result. In the case of a failed test, a link to an [Allure test report](understanding-allure-results.md) will be provided that allows you to dig into the details and see what failed and why.

!> Currently, QIT can only run the WooCommerce Core E2E test suite. Future support for running your own E2E tests is planned.

## PHPStan tests

The PHPStan test type runs level 0 PHPStan checks against your extension. More details on what the rule levels cover can be found in the official PHPStan documentation: [Rule Levels](https://phpstan.org/user-guide/rule-levels).

## Activation tests

The Activation test type activates your extension against a freshly created shop and captures any PHP errors or warnings that may occur on activation. This test sets up a WooCommerce store using the provided WordPress and WooCommerce versions. The following statuses will be returned from this test:

- Success: No PHP notices, warnings, or errors were triggered.
- Warning: A non-fatal PHP error was triggered.
- Failure: A fatal PHP error was triggered.

## Security tests (beta)

This test runs an experimental security scanner against a given extension. It uses a set of PHPCS WordPress Security rules. The following statuses will be returned from this test:

- Success: No PHPCS security issues errors or warnings.
- Warning: Only PHPCS security issues warnings.
- Failure: One or more PHPCS security issues errors.

## Future tests

The following test types are on our roadmap to include in QIT:

- Performance Tests
- PHP Minimum Version Tests
- WooCommerce API Tests
