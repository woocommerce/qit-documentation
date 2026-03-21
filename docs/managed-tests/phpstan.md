---
description: "Reference for the `run:phpstan` managed test. Runs PHPStan static analysis at a configurable level (0-9 via --phpstan_level, default 2) to catch type errors, undefined variables, and questionable patterns. Covers expected false positives from WordPress/WooCommerce dynamic features, how to interpret results, and when to ignore warnings. Supports WordPress and WooCommerce version selection and additional plugins. Includes auto-generated CLI usage."
---

# PHPStan tests

PHPStan is a static code analysis tool designed to catch errors, type issues, and questionable coding patterns. By running PHPStan tests against your extension, QIT provides feedback on code-level improvements that can increase maintainability and reduce the risk of hidden bugs. However, due to the dynamic nature of WordPress and WooCommerce codebases, you may encounter a relatively high number of false positives.

## What PHPStan checks

- **Level 0 analysis:** QIT runs [PHPStan at level 0](https://phpstan.org/user-guide/rule-levels) by default, focusing on basic checks like undefined variables or incorrect function calls.
- **Type safety and consistency:** PHPStan attempts to ensure that the code meets a baseline of type consistency and logic correctness.
- **Code quality signals:** While not strictly about security or performance, PHPStan flags patterns that, if addressed, can result in clearer, more robust code.

## Potential false positives

WordPress and WooCommerce rely heavily on dynamic features like hooks, filters, and global variables, which can confuse static analysis tools like PHPStan. As a result:
- Some warnings may not indicate a real issue.
- Consider reviewing flagged areas before making changes, and confirm if the warning is actionable or safe to ignore.

## Interpreting results

- **Success:** No PHPStan warnings or errors found.
- **Warning/Failure:** PHPStan detected potential issues in your code.

If you see warnings or failures:
- Check the line numbers and messages in the output.
- Determine if the flagged issue is relevant to your code.
- Address actual problems by adding missing types, refactoring complex logic, or initializing variables properly.
- If certain checks are not applicable, you can selectively ignore rules or add PHPStan-specific annotations.

## Improving code quality

Tackling PHPStan warnings often results in clearer code and fewer hidden issues. Over time, you may choose to run PHPStan at a higher level locally, catching more subtle issues before pushing updates. Although QIT currently runs it at level 0, raising local analysis levels can help you continuously improve your extension.

<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Enqueue PHPStan tests.

Usage:
  run:phpstan [options] [--] [<sut>]

Arguments:
  sut                                                                Extension slug or WooCommerce.com ID

Options:
      --config[=CONFIG]                                              Path to the qit.json configuration file
      --profile[=PROFILE]                                            Test profile to use [default: "default"]
      --wordpress_version[=WORDPRESS_VERSION]                        (Optional) The WordPress version to use in the test. Alias: --wp [possible values: 7.0-beta6, 6.6.5, 6.7.5, 6.8.5, 6.9.4, stable, rc] [default: "6.9.4"]
      --woocommerce_version[=WOOCOMMERCE_VERSION]                    (Optional) The WooCommerce version to use in the test. Alias: --woo [possible values: 10.6.0-rc.1, 10.5.2, 10.5.3, 10.6.0, 10.6.1, stable, rc] [default: "10.6.1"]
      --additional_plugins[=ADDITIONAL_PLUGINS]                      (Optional) A comma-separated list of additional plugins to activate in the environment. Accepts: WordPress.org plugin slugs, Woo.com Product Slugs or Woo.com Product IDs. (multiple values allowed)
      --additional_woo_plugins[=ADDITIONAL_WOO_PLUGINS]              (Optional) [Deprecated] A comma-separated list of Additional WooCommerce Extension IDs. (multiple values allowed)
      --additional_wordpress_plugins[=ADDITIONAL_WORDPRESS_PLUGINS]  (Optional) [Deprecated] A comma-separated list of Additional WordPress plugin slugs. (multiple values allowed)
      --phpstan_level=PHPSTAN_LEVEL                                  The PHPStan level to use for the test run. [possible values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] [default: 2]
      --zip[=ZIP]                                                    (Optional) Local ZIP / dir / URL build to test
  -j, --json|--no-json                                               (Optional) Output raw JSON response
      --async|--no-async                                             (Optional) Enqueue test and return immediately without waiting
  -w, --wait|--no-wait                                               (Deprecated) Wait for test completion - this is now the default behavior
      --print-report-url|--no-print-report-url                       (Optional) Print the test report URL (contains sensitive data - use cautiously in public logs)
  -t, --timeout[=TIMEOUT]                                            (Optional) Wait timeout in seconds
  -g, --group|--no-group                                             (Optional) Register the run into a group
```

*Auto-generated from `qit run:phpstan --help`.*
<!-- END GENERATED CLI REFERENCE -->
