# Extension sets

Extension sets provide a way to run certain managed test types with a predefined set of other extensions included in the environment. This allows for standardized compatibility testing, as well as testing in environments closer to a production WooCommerce store.

## Compatible test types

Extension sets can be utilized with [Woo E2E](woo-e2e), [Woo API](woo-api), and [Activation](activation) tests currently.

## Available extension sets

`compatibility` is the only extension set available in production right now. It's designed to contain a selection of typical WooCommerce extensions, including many official extensions:
- [Gift Cards](https://woocommerce.com/products/gift-cards/)
- [WooCommerce Product Add-Ons](https://woocommerce.com/products/product-add-ons/)
- [WooCommerce Min/Max Quantities](https://woocommerce.com/products/min-max-quantities/)
- [WooCommerce Product Bundles](https://woocommerce.com/products/product-bundles/)
- [WooCommerce Product Recommendations](https://woocommerce.com/products/product-recommendations/)
- [WooCommerce Payments](https://woocommerce.com/products/woocommerce-payments/)
- [AutomateWoo](https://woocommerce.com/products/automatewoo/)
- [WooCommerce Shipping](https://woocommerce.com/products/shipping/)
- [WooCommerce Subscriptions](https://woocommerce.com/products/woocommerce-subscriptions/)
- [WooCommerce Composite Products](https://woocommerce.com/products/composite-products/)
- [WooCommerce Tax](https://woocommerce.com/products/tax/)
- [WooCommerce Google Analytics Integration](https://wordpress.org/plugins/woocommerce-google-analytics-integration/)
- [MailPoet](https://wordpress.org/plugins/mailpoet/)
- [Jetpack](https://wordpress.org/plugins/jetpack/)

## Running tests with an extension set

All test types that support extension sets support an `--extension_set` argument to the QIT CLI to specify a set to include.

## The WooCommerce Marketplace and extension sets

Currently the WooCommerce Marketplace will automatically run an Activation test using the `compatibility` extension set upon new submission or update. You will see the results in the list of tests under `Activation (canonical compatibility check)`. Currently this test is informational only, and will not block a submission or an update.
