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
    - `Woo` — As noted in the [WooCommerce plugin creation documentation](https://woocommerce.com/document/create-a-plugin/#section-14), this will be automatically added during deployment. Including it manually may cause issues and will be warned against.

- **WooCommerce feature compatibility:**  
  The test checks if your extension declares incompatibility with key WooCommerce features:
    - **High Performance Order Storage (HPOS):**  
      Extensions are expected to [support HPOS](https://developer.woocommerce.com/docs/hpos-extension-recipe-book/#2-supporting-high-performance-order-storage-in-your-extension), as it’s now the default for new stores.
    - **Cart and Checkout blocks:**  
      Extensions that modify cart or checkout experiences should [support the cart and checkout blocks](https://developer.woocommerce.com/2023/11/06/faq-extending-cart-and-checkout-blocks/).

  Declaring explicit incompatibility with these features will result in a warning.

- **Outdated theme templates (for themes):**  
  If your theme uses outdated WooCommerce templates, the test will flag them. While currently these appear as warnings rather than failures, they should be addressed to ensure compatibility with the latest WooCommerce standards. Refer to the [WooCommerce developer documentation](https://developer.woocommerce.com/docs/how-to-fix-outdated-woocommerce-templates/) for guidance.

## Possible outcomes

- **Success:**  
  A readme.txt file is present, all required metadata is present and correct, and no invalid headers or incompatible feature declarations were found.

- **Warning:**  
  A readme.txt file may be missing or misnamed, some headers may be missing or incorrect, or you declared incompatibility with WooCommerce features that you should ideally support. If you’re a theme developer, outdated templates are flagged as warnings and should be updated.

## Interpreting results

If you receive warnings:

- **Check your readme.txt file:**  
  Ensure a correctly named readme.txt file is provided in the root directory of your extension.

- **Review headers and declarations:**  
  Ensure all required headers are accurate and that you’re not declaring incompatibility with features you could support.

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
