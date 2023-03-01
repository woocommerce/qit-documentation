### Security tests (beta)

This test runs an experimental security scanner against a given extension. It uses a set of PHPCS WordPress Security rules. The following statuses will be returned from this test:

- Success: No PHPCS security issues errors or warnings.
- Warning: Only PHPCS security issues warnings.
- Failure: One or more PHPCS security issues errors.