# wordpress.org Plugin Check tests

wordpress.org Plugin Check tests run the [wordpress.org automated plugin check](https://wordpress.org/plugins/plugin-check) tool against your extension. This test focuses on guidelines and patterns important for submitting plugins to the WordPress.org directory, and general WordPress best practices. **All new submissions and updates to the WooCommerce Marketplace must pass these tests.**


## What is evaluated

The tool currently runs checks from the `general` and `plugin_repo` categories, which check WordPress best practices and identify violations of the [WordPress.org Plugin Review Guidelines](https://make.wordpress.org/plugins/handbook/performing-reviews/review-checklist/). These may include:

- **Core guideline compliance:** Detects code that violates mandatory directory rules.
- **Repository readiness:** Flags improper file structures, disallowed functions, or patterns that could prevent listing on wordpress.org.
- **General code health:** May highlight deprecated functions, insecure code usage, or general best-practice concerns.

## Interpreting results

- **Success:** No major issues detected.
- **Warnings/Failures:** Potential guideline violations or best-practice deviations are highlighted. Any failures will block your submission or update until they are resolved.

## Next steps if it fails

1. **Review the flagged issues:** Open the test report and note the specific areas of concern.
2. **Address the problems:** Update your code, remove non-compliant functions, or adjust file structures as needed.
3. **Rerun the test:** Confirm that the issues have been resolved.
4. **Consider reporting issues:** If you believe the check is producing a false positive or that the tool itself has a bug, [open an issue with Plugin Check](https://github.com/WordPress/plugin-check/issues). If you suspect a QIT-specific issue, email us at qit@woocommerce.com.

## Best practices

- **Future-proofing your code:** Running these tests periodically helps ensure that your plugin remains compatible and well-structured for multiple distribution channels.
- **Combine with other tests:** Plugin Check complements managed tests, security scans, and E2E tests, offering a broader quality overview of your extension.
