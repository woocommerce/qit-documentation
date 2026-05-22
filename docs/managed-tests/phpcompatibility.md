---
description: "Reference for the `run:phpcompatibility` managed test. Uses PHPCompatibility PHPCS rulesets to statically analyze your code for PHP version compatibility issues: deprecated functions, removed features, syntax incompatibilities. Supports --min_php_version and --max_php_version to test a specific range (e.g., 7.4 to 8.4). Covers how to interpret results, suppress false positives, and best practices for maintaining PHP version support. Includes auto-generated CLI usage."
---

# Code Compatibility test

The Code Compatibility test analyzes your extension’s codebase against a range of PHP versions and database environments to ensure broad compatibility. By identifying deprecated features, incompatible functions, syntax issues, and database reserved word collisions, these checks help future-proof your code and maintain a seamless experience for merchants running different environments.

## What does the Code Compatibility test check?

These checks use the [PHPCompatibility](https://github.com/PHPCompatibility/PHPCompatibility) rulesets—collections of sniffs for PHP CodeSniffer designed to detect PHP version-related coding issues—as well as database reserved word scanning to catch SQL identifiers that conflict with reserved words in MariaDB/MySQL versions. Running these checks can help you:

- Identify code that may fail on older or newer PHP versions.
- Spot deprecated or removed functions that could lead to breakage.
- Adapt your codebase to evolving PHP standards, improving longevity and reliability.

## Running the Code Compatibility test

You can trigger the Code Compatibility test through the QIT CLI or the WooCommerce Vendor Dashboard. QIT handles the environment setup and runs the checks against your codebase.

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

## Limitations

**Partial PHP 8+ support:**
We use the `develop` branch of PHPCompatibility for partial support of PHP 8+ syntax. This enables checking against modern PHP versions but may occasionally lead to false positives for codebases using newer syntax. Developers should stay aware that not all PHP 8+ features are fully supported by these static checks.

**Static analysis only:**
The Code Compatibility test relies on static analysis and may not detect all runtime issues. Some compatibility problems only become evident when the code is actually executed under a given PHP version. For comprehensive validation:

- **Run tests on higher PHP versions:**  
  Test your extension’s activation, WooCommerce API interactions, and workflows under newer PHP versions, such as PHP 8.4, to catch issues that static analysis might miss.

- **Combine with E2E tests:**  
  Execute WooCommerce end-to-end tests and your test packages in environments running higher PHP versions to ensure real-world compatibility.

By combining static analysis with runtime tests, you can achieve a more reliable and future-proof extension that supports a broad range of PHP and database environments.

## Best practices

- **Test early and often:**
  Incorporate Code Compatibility checks and runtime tests into your development workflow to catch issues before release.

- **Stay current:**  
  Keep track of minimum PHP version requirements and remove deprecated or removed functions as PHP evolves.

- **Use complementary tests:**
  Pair the Code Compatibility test with [Activation test](./activation.md), [Woo API test](./woo-api.md), [Woo E2E test](./woo-e2e.md) and [Test Packages](./../test-packages/index.md) for a comprehensive assessment of your extension's readiness.

## CLI Usage

{/* QIT_COMMAND:run:phpcompatibility */}
