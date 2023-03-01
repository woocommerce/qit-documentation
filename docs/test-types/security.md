### Security tests (beta)

This test runs an experimental security scanner against a given extension. It uses a set of PHPCS WordPress Security rules. The following statuses will be returned from this test:

- Success: No PHPCS security issues errors or warnings.
- Warning: Only PHPCS security issues warnings.
- Failure: One or more PHPCS security issues errors.

## What to do if it fails

If your security test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log any security issues that our scanner identifies
- Fix the issue and re-run the test
- If you think the result is incorrect, please email us at qit@woocommerce.com