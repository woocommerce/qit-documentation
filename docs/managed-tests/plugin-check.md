# wordpress.org Plugin Check tests

The [wordpress.org automated plugin check](https://wordpress.org/plugins/plugin-check) tool against your extension. This optional test focuses on guidelines and patterns important for submitting plugins to the WordPress.org directory.

**Note:** Currently, these checks are not automatically triggered for WooCommerce Marketplace submissions. They are available for developers who also distribute on wordpress.org or wish to maintain broader WordPress best-practices.

## What is evaluated

The tool currently runs checks from the `plugin_repo` category, which helps identify violations of the [WordPress.org Plugin Review Guidelines](https://make.wordpress.org/plugins/handbook/performing-reviews/review-checklist/). These may include:

- **Core guideline compliance:** Detects code that violates mandatory directory rules.
- **Repository readiness:** Flags improper file structures, disallowed functions, or patterns that could prevent listing on wordpress.org.
- **General code health:** May highlight deprecated functions, insecure code usage, or general best-practice concerns.

## Interpreting results

- **Success:** No major issues detected.
- **Warnings/Failures:** Potential guideline violations or best-practice deviations are highlighted. While not necessarily blocking for WooCommerce Marketplace, they could impact your plugin’s acceptability on wordpress.org.

## Next steps if it fails

1. **Review the flagged issues:** Open the test report and note the specific areas of concern.
2. **Address the problems:** Update your code, remove non-compliant functions, or adjust file structures as needed.
3. **Rerun the test:** Confirm that the issues have been resolved.
4. **Consider reporting issues:** If you believe the check is producing a false positive or that the tool itself has a bug, [open an issue with Plugin Check](https://github.com/WordPress/plugin-check/issues). If you suspect a QIT-specific issue, email us at qit@woocommerce.com.

## Scope and best practices

- **Optional for WooCommerce Marketplace:** Passing Plugin Check is not currently required for publishing on the WooCommerce Marketplace.
- **Future-proofing your code:** Running these tests periodically helps ensure that your plugin remains compatible and well-structured for multiple distribution channels.
- **Combine with other tests:** Plugin Check complements managed tests, security scans, and E2E tests, offering a broader quality overview of your extension.
