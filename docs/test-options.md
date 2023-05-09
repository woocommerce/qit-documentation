# Test Options

The table below shows what options are available for each test type. For example, for Activation tests you can supply a WordPress version but for the security tests it isn't supported.

|                      | Activation | E2E | API | Security | PHPStan |
| -------------------- | ---------- | --- | --- | -------- | ------- |
| WordPress Versions   | ✅         | ✅  | ✅  | ❌       | ❌      |
| WooCommerce Versions | ✅         | ✅  | ✅  | ❌       | ❌      |
| WooCommerce Features | ✅         | ✅  | ✅  | ❌       | ❌      |
| Object Cache         | ✅         | ✅  | ✅  | ❌       | ❌      |

## WordPress and WooCommerce versions

You can specify the last 5 stable releases along with the most recent beta/release candidate to be used in the test environment.

## WooCommerce features

QIT currently supports the following option WooCommerce features:

- [High Performance Order Storage (HPOS)](https://developer.woocommerce.com/roadmap/high-performance-order-storage/)
- Cart and Checkout Blocks

For more information on using optional features in your tests, check out [Testing WooCommerce Optional Features]().

## Object cache

The WordPress Object Cache is used to save on trips to the database. The Object Cache stores all of the cache data to memory and makes the cache contents available by using a key, which is used to name and later retrieve the cache contents. For more details, see the associated [WordPress documentation](https://developer.wordpress.org/reference/classes/wp_object_cache/).
