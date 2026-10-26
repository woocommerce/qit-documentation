---
description: "Reference for the `run:validation` managed test. Checks extension metadata and WooCommerce feature declarations: readme.txt presence, required plugin headers (Requires PHP, WC requires, WC tested up to), WooCommerce feature compatibility declarations (HPOS, Cart/Checkout blocks), child cart items declared with a parent item key (plugins), and theme template version currency. Supports --php_version to test against a specific PHP version. Includes auto-generated CLI usage."
---

# Validation tests

Validation tests ensure that your extension’s metadata and WooCommerce feature declarations meet baseline requirements. By verifying important headers, WooCommerce feature compatibility, and (for themes) ensuring that your theme templates are updated to the latest WooCommerce standards, these tests help maintain clear, consistent, and accurate information for merchants.

## What validation tests check

- **readme.txt file:**
  The test checks for the presence of a readme.txt file, which all plugins and themes are [required to provide](https://woocommerce.com/document/create-a-plugin/#section-8).

- **Plugin headers:**
  The test checks for the presence of important headers in your plugin or theme’s main file and `readme.txt`. The following headers should be present and accurate:
    - `Requires PHP`
    - `Requires at least`
    - `Tested up to`
    - `WC requires at least`
    - `WC tested up to`
    - `License`

  Missing or incorrect versions will trigger a warning. Additionally, certain headers should **not** be included:
    - `Woo`: As noted in the [WooCommerce plugin creation documentation](https://woocommerce.com/document/create-a-plugin/#section-14), this will be automatically added during deployment. Including it manually may cause issues and will be warned against.

- **WooCommerce feature compatibility:**
  The test checks if your extension declares incompatibility with key WooCommerce features:
    - **High Performance Order Storage (HPOS):**
      Extensions are required to [support HPOS](https://developer.woocommerce.com/docs/hpos-extension-recipe-book/#2-supporting-high-performance-order-storage-in-your-extension) if they interact with orders, as it’s now the default for new stores. Declaring explicit incompatibility with this **will result in an error**, thus failing the validation test.
    - **Cart and Checkout blocks:**
      Extensions that modify cart or checkout experiences should [support the cart and checkout blocks](https://developer.woocommerce.com/2023/11/06/faq-extending-cart-and-checkout-blocks/). Declaring explicit incompatibility with this will result in a warning.

- **Child cart items and their parent item key (for plugins):**
  Starting with WooCommerce 11.3, the Store API tells an item the shopper added apart from an item an extension adds on its behalf, such as a product inside a bundle, by its parent item key. Extensions that add such child items must declare the link with the `woocommerce_store_api_cart_item_parent_item_key` filter, as described in the [Store API docs on the parent item key](https://developer.woocommerce.com/docs/apis/store-api/extending-store-api/extend-store-api-parent-item/). Otherwise the Product Button counts the child items as products the shopper added: a bundle with three products inside shows "4 in cart" instead of "1 in cart".

  The test scans your plugin's PHP code for cart item data that stores another cart item's key, and checks whether the plugin uses the filter. If it finds such code without the filter, it **will result in a warning** that lists the locations, one file per line. It also warns when the scan can't finish within its limits and found nothing, since the plugin couldn't be checked. This check never fails the validation test, and themes aren't scanned.

  The scan matches a code pattern, so it can flag code that stores another item's key for an unrelated reason. If a listed line doesn't add a child item, add `// qit-ignore: parent-item-key` at the end of that line, and the next run skips it.

- **Outdated theme templates (for themes):**
  If your theme uses outdated WooCommerce templates, the test **will flag them as an error and fail**. They must be addressed to ensure compatibility with the latest WooCommerce version. Refer to the [WooCommerce developer documentation](https://developer.woocommerce.com/docs/how-to-fix-outdated-woocommerce-templates/) for guidance.

## Possible outcomes

- **Success:**
  A readme.txt file is present, all required metadata is present and correct, and no invalid headers or incompatible feature declarations were found. If you're a theme developer, all template files are up to date.

- **Warning:**
  Some headers may be missing or incorrect, or you declared incompatibility with WooCommerce features that you should ideally support. Plugins that seem to add child cart items without declaring their parent item key also get a warning.

- **Failure:**
  A readme.txt file may be missing or misnamed, or you declared incompatibility with WooCommerce features that you are required to support. If you’re a theme developer, outdated templates are flagged as errors and must be updated.

## Interpreting results

If you receive warnings or errors:

- **Check your readme.txt file:**
  Ensure a correctly named readme.txt file is provided in the root directory of your plugin or theme.

- **Review headers and declarations:**
  Ensure all required headers are accurate and that you’re not declaring incompatibility with features you could support.

- **Declare the parent item key for child cart items (for plugins):**
  For each location listed, declare the parent item key with the `woocommerce_store_api_cart_item_parent_item_key` filter. If a listed line doesn't add a child item, mark it with `// qit-ignore: parent-item-key`.

- **Address outdated templates (for themes):**
  Update your theme’s templates to meet the latest WooCommerce standards.

- **Remove or correct restricted headers:**
  Do not include `Woo` manually, and ensure all other headers are properly formatted and spelled.

## Best practices

- **Maintain accurate metadata:**
  Keep headers updated with each release, reflecting the correct PHP, WordPress, and WooCommerce version requirements.

- **Embrace modern WooCommerce features:**
  Instead of declaring incompatibility, aim to support HPOS and Cart/Checkout blocks. This avoids warnings and improves merchant satisfaction.

- **Stay current:**
  Run validation tests regularly and promptly update outdated templates, headers, or feature declarations.


## CLI Usage

{/* QIT_COMMAND:run:validation */}
