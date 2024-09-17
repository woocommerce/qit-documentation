# Validation tests

Our validation test is designed to inform you of any issues with plugin and theme metadata. Right now it is purely informative, but in the future it may block submissions or updates.

## Types of issues flagged
The presence or absence of certain headers will be checked; both the main plugin or theme file as well as the `readme.txt` will be checked, with priority given to the main file.

The following headers should be present, and will result in a warning if not:

- `Requires PHP` - so that users know if your extension requires a specific version of PHP.
- `Requires at least` - so that users know if your extension requires a specific version of WordPress.
- `Tested up to` - so users can be sure that your extension works correctly with recent WordPress versions.
- `WC requires at least` - so that users know if your extension requires a specific version of WooCommerce.
- `WC tested up to` - so users can be sure that your extension works correctly with recent WooCommerce versions.

The following headers should not be present when submitted, and will result in a warning if they are:

- `Woo` - as discussed [here](https://woocommerce.com/document/create-a-plugin/#section-14), this header will be added automatically during the deployment process; in order to avoid issues with incorrect headers or when distributing the same plugin outside the Marketplace, we recommend not including it manually.

## What to do if it fails

If your validation test is failing, please review the following steps:
- Open the test report.
- Identify the causes of the failure (typically a missing or misspelled header) and remedy it.
- If you believe you've run across a bug in the test, please email us at qit@woocommerce.com so we can review and make the necessary adjustments.
