# Plugin check tests

Plugin Check tests run the [wordpress.org automated plugin check](https://wordpress.org/plugins/plugin-check) tool against your extension. This tool helps identify issues and guidelines violations aligned with the WordPress.org plugin directory standards. While this test is optional and not automatically triggered by QIT for WooCommerce Marketplace submissions, it can be valuable if you also distribute your extension on wordpress.org or simply want to align with broader WordPress best practices.

## What the plugin check tool evaluates

- **Core Guidelines Compliance:** Flags code patterns that violate WordPress.org plugin review guidelines.
- **Repository Readiness:** Ensures that the extension meets baseline directory requirements, such as proper file structures and absence of known problematic patterns.
- **General Code Hygiene:** May highlight deprecated functions, insecure code, or other areas of improvement, even if not strictly required by WooCommerce Marketplace standards.

## Interpreting results

- **Success:** The plugin passes the checks with no major issues detected.
- **Warnings/Failures:** The tool flags potential guideline violations or best-practice deviations that may prevent approval on wordpress.org or indicate general quality concerns.

If the test fails or reports warnings:
- Review each flagged issue and consider whether it affects your distribution channels (e.g., wordpress.org).
- Update code, remove non-compliant functions, or adjust file structures as recommended.
- Rerun the test to confirm that the flagged issues have been resolved.

## Scope and caveats

- **Not Mandatory for WooCommerce Marketplace:** Currently, QIT does not require you to pass these plugin check tests to publish on the WooCommerce Marketplace. They are offered as an additional safeguard and resource.
- **False Positives or Strict Rules:** If the tool flags something you believe is a false positive, review the relevant WordPress.org guidelines. You may choose to ignore or bypass these warnings if not applicable, or consider reaching out to the WordPress.org plugin review team for clarification.

## Best practices

- **Regular Reviews:** Running plugin check tests occasionally ensures you maintain compatibility with broader WordPress standards, improving extensibility and future-proofing your code.
- **Combine with Other Tests:** Plugin check results can complement managed tests, security scans, and E2E tests, providing a holistic view of your extension’s quality.

## Next steps

- [Managed Tests Introduction](./introduction.md): Explore other managed tests that focus on WooCommerce-specific criteria.
- [Security Tests](./security.md): Pairing plugin checks with security audits ensures code not only meets guidelines but is also safe.
- [Notifications and Results](../using-qit/notifications-results.md): Configure alerts and review logs to stay informed about any flagged issues.
