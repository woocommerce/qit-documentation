# Test Options

The table below shows what options are available for each test type. For example, for Activation tests you can supply a WordPress version but for the security tests it isn't supported.

|                              | Activation | E2E | API | Security | PHPStan |
| ---------------------------- | ---------- | --- | --- | -------- | ------- |
| WordPress Versions           | ✅         | ✅  | ✅  | ❌       | ❌      |
| WooCommerce Versions         | ✅         | ✅  | ✅  | ❌       | ❌      |
| WooCommerce Features         | ✅         | ✅  | ✅  | ❌       | ❌      |
| PHP Version                  | ✅         | ✅  | ✅  | ❌       | ❌      |
| Additional Extensions        | ✅         | ✅  | ✅  | ❌       | ❌      |
| Additional WordPress Plugins | ✅         | ✅  | ✅  | ❌       | ❌      |

## WordPress and WooCommerce versions

You can specify the last 5 stable releases along with the most recent beta/release candidate to be used in the test environment.

## WooCommerce features

QIT currently supports the following option WooCommerce features:

- [High Performance Order Storage (HPOS)](https://developer.woocommerce.com/roadmap/high-performance-order-storage/)
- Cart and Checkout Blocks

For more information on using optional features in your tests, check out [Testing WooCommerce Optional Features](cli/running-tests?id=using-optional-features).

## PHP versions

You can specify a PHP version from 7.4 to 8.2 to be used in the test environment.
