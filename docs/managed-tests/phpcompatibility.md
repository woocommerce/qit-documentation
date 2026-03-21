# PHPCompatibility tests

PHPCompatibility tests analyze your extension’s codebase against a range of PHP versions to ensure broad compatibility. By identifying deprecated features, incompatible functions, or syntax issues, these tests help future-proof your code and maintain a seamless experience for merchants running different PHP environments.

## What are PHPCompatibility tests?

These tests use the [PHPCompatibility](https://github.com/PHPCompatibility/PHPCompatibility) rulesets—collections of sniffs for PHP CodeSniffer designed to detect PHP version-related coding issues. Running these tests can help you:

- Identify code that may fail on older or newer PHP versions.
- Spot deprecated or removed functions that could lead to breakage.
- Adapt your codebase to evolving PHP standards, improving longevity and reliability.

## Running PHPCompatibility tests

You can trigger the PHPCompatibility tests through the QIT CLI or the WooCommerce Vendor Dashboard. QIT handles the environment setup and runs the tests against your codebase.

For example, from the CLI:

```qitbash
qit run:phpcompatibility your-extension
```

## Interpreting results

- **Success:**  
  No WordPress/PHP compatibility warnings or errors. Your code is compatible across the tested PHP versions.

- **Warning:**  
  Potentially problematic or deprecated patterns detected. While not immediately breaking, these may affect certain PHP versions. Addressing warnings ensures long-term compatibility.

- **Failure:**  
  Critical compatibility issues found. Your extension may not run on certain PHP versions until these problems are resolved.

After reviewing flagged issues, make the recommended changes and rerun the tests to confirm resolution.

## Limitations of PHPCompatibility tests

**Partial PHP 8+ support:**  
We use the `develop` branch of PHPCompatibility for partial support of PHP 8+ syntax. This enables checking against modern PHP versions but may occasionally lead to false positives for codebases using newer syntax. Developers should stay aware that not all PHP 8+ features are fully supported by these static checks.

**Static analysis only:**  
PHPCompatibility tests rely on static analysis and may not detect all runtime issues. Some compatibility problems only become evident when the code is actually executed under a given PHP version. For comprehensive validation:

- **Run tests on higher PHP versions:**  
  Test your extension’s activation, WooCommerce API interactions, and workflows under newer PHP versions, such as PHP 8.4, to catch issues that static analysis might miss.

- **Combine with E2E tests:**  
  Execute WooCommerce end-to-end tests and your test packages in environments running higher PHP versions to ensure real-world compatibility.

By combining static analysis (PHPCompatibility) with runtime tests, you can achieve a more reliable and future-proof extension that supports a broad range of PHP environments.

## Best practices

- **Test early and often:**  
  Incorporate PHPCompatibility checks and runtime tests into your development workflow to catch issues before release.

- **Stay current:**  
  Keep track of minimum PHP version requirements and remove deprecated or removed functions as PHP evolves.

- **Use complementary tests:**  
  Pair PHPCompatibility tests with [Activation test](./activation.md), [Woo API test](./woo-api.md), [Woo E2E test](./woo-e2e.md) and [Test Packages](./../test-packages/index.md) for a comprehensive assessment of your extension's readiness.
<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Enqueue PHPCompatibility tests.

Usage:
  run:phpcompatibility [options] [--] [<sut>]

Arguments:
  sut                                           Extension slug or WooCommerce.com ID

Options:
      --config[=CONFIG]                         Path to the qit.json configuration file
      --profile[=PROFILE]                       Test profile to use [default: "default"]
      --min_php_version[=MIN_PHP_VERSION]       (Optional) The minimum PHP version to test an extension's compatibility against. [possible values: auto, 7.2, 7.3, 7.4, 8.0, 8.1, 8.2, 8.3, 8.4] [default: "auto"]
      --max_php_version[=MAX_PHP_VERSION]       (Optional) The maximum PHP version to test an extension's compatibility against. [possible values: 7.2, 7.3, 7.4, 8.0, 8.1, 8.2, 8.3, 8.4] [default: "8.4"]
      --zip[=ZIP]                               (Optional) Local ZIP / dir / URL build to test
  -j, --json|--no-json                          (Optional) Output raw JSON response
      --async|--no-async                        (Optional) Enqueue test and return immediately without waiting
  -w, --wait|--no-wait                          (Deprecated) Wait for test completion - this is now the default behavior
      --print-report-url|--no-print-report-url  (Optional) Print the test report URL (contains sensitive data - use cautiously in public logs)
  -t, --timeout[=TIMEOUT]                       (Optional) Wait timeout in seconds
  -g, --group|--no-group                        (Optional) Register the run into a group
```

*Auto-generated from `qit run:phpcompatibility --help`.*
<!-- END GENERATED CLI REFERENCE -->
