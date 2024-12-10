# PHPCompatibility tests

:::info
The PHPCompatibility tests are available as part of QIT’s managed test suite.
:::

Ensuring that your extension runs smoothly on all supported PHP versions is crucial for maintaining compatibility and trust. PHPCompatibility tests analyze your codebase to identify potential issues, deprecated features, or incompatible functions that may not work under certain PHP versions.

## What are PHPCompatibility tests?

PHPCompatibility tests use the [PHPCompatibility](https://github.com/PHPCompatibility/PHPCompatibility) rulesets, a collection of sniffs for PHP CodeSniffer designed to detect PHP version-related coding issues. By running these tests, you can:

- Identify and fix code that only works on older or newer PHP versions.
- Spot deprecated functions or parameters that could break your extension on certain PHP releases.
- Future-proof your code by ensuring it aligns with evolving PHP standards and best practices.

## Running PHPCompatibility tests

You can trigger the PHPCompatibility tests through the QIT CLI or via the WooCommerce Vendor Dashboard. QIT automatically provisions the environment and runs the tests against your extension’s codebase, reporting any compatibility issues.

For example, from the CLI:

```qitbash
qit run:phpcompatibility your-extension
```

## Interpreting results

- **Success:** No compatibility issues found. Your code is likely stable across multiple PHP versions.
- **Warning/Failed:** One or more compatibility issues detected. Review the reported lines and fix them as recommended, then rerun the tests to confirm the changes.

## Best practices

- **Test early and often:** Run PHPCompatibility tests during development, not just before release, to catch issues as soon as they appear.
- **Stay current:** Keep track of minimum PHP version requirements and ensure that your code doesn’t rely on deprecated features.
- **Combine with other tests:** PHPCompatibility tests complement Security, PHPStan, and other managed tests, providing a holistic view of your extension’s quality and longevity.

## Next steps

- [Managed Tests Introduction](./introduction.md): Understand how PHPCompatibility tests fit into the broader suite of managed tests.
- [PHPStan Tests](./phpstan.md): Further improve code quality and maintainability by tackling static analysis warnings.
- [Security Tests](./security.md): Verify that your extension meets baseline security standards and coding best practices.
- [Notifications and Results](../using-qit/notifications-results.md): Learn how to set up alerts and review logs for ongoing compatibility assurance.
