# Validation tests

Validation tests ensure that your extension's metadata and WooCommerce feature declarations meet baseline requirements. By checking headers, WooCommerce compatibility flags, and theme templates where applicable, these tests help maintain clear, consistent, and accurate information for merchants.

## What validation tests check

- **Plugin headers:** Ensures that important headers such as `Requires PHP`, `Requires at least`, `Tested up to`, `WC requires at least`, and `WC tested up to` are present and valid. Missing or incorrect headers can lead to confusion or compatibility issues.
- **WooCommerce feature support:** Verifies any declared incompatibilities with WooCommerce features like High Performance Order Storage (HPOS) or Cart and Checkout blocks. Explicit incompatibilities are flagged, encouraging you to support these features where possible.
- **Theme templates (for themes):** Checks if your theme has outdated WooCommerce templates. If found, this results in a warning, guiding you to update templates for the latest WooCommerce standards.

## Possible outcomes

- **Success:** All required metadata is present and correct, and no invalid headers or incompatible feature declarations were found.
- **Warning:** Some headers may be missing or incorrect, or you declared incompatibility with features that you should ideally support.
- **Failed (for themes):** Outdated templates or critical metadata issues prevent passing the validation.

## Interpreting results

If you receive warnings or failures:
- Review the recommended headers and ensure they are correctly specified in your plugin or theme files.
- Update WooCommerce templates if your theme is flagged as outdated.
- Consider revising your feature declarations to support new WooCommerce capabilities rather than stating incompatibility.

## Best practices

- **Accurate metadata:** Keep your plugin or theme headers current with each new release, reflecting supported WordPress and WooCommerce versions.
- **Embrace new features:** Instead of declaring incompatibility, aim to support modern WooCommerce features like HPOS and Cart/Checkout blocks for broader merchant satisfaction.
- **Continuous improvement:** Regular validation tests help maintain good metadata hygiene, improving merchant trust and compatibility clarity.

## Next steps

- [Managed Tests Introduction](./introduction.md): Understand how validation tests fit within the broader suite of managed tests.
- [WooCommerce.com Marketplace](../core-concepts/marketplace-overview.md): Review how Marketplace requirements intersect with validation checks.
- [Notifications and Results](../using-qit/notifications-results.md): Set up alerts and view logs for continuous feedback.
