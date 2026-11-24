---
description: "Reference for the `run:phpstan` managed test. Runs PHPStan static analysis at a configurable level (0-9 via --phpstan_level, default 2) to catch type errors, undefined variables, and questionable patterns. Covers expected false positives from WordPress/WooCommerce dynamic features, how to interpret results, and when to ignore warnings. Explains how calls into other WooCommerce extensions are checked against woocommerce/php-stubs, and why that can add new errors. Supports WordPress and WooCommerce version selection and additional plugins. Includes auto-generated CLI usage."
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

## Calls into other WooCommerce extensions

QIT's PHPStan test includes [woocommerce/php-stubs](https://github.com/woocommerce/php-stubs), which describe the classes and functions of many WooCommerce extensions. When your extension calls into one of them, for example `WC_Subscription` from WooCommerce Subscriptions, and that extension isn't part of the test, PHPStan checks the call against the stubs instead of reporting the class or function as not found.

For most extensions this removes `class.notFound` and `function.notFound` errors. Some will see new errors, because PHPStan can now check calls it used to skip, such as reading a property that is protected or doesn't exist on `WC_Subscription`. **A PHPStan run that passed before QIT added the stubs may fail now.**

- Extensions you add to the test with `--additional_plugins` are analysed from their real code, not from stubs.
- If your own PHPStan config (`phpstan.neon`, `phpstan.neon.dist` or `phpstan.dist.neon`) already includes php-stubs for an extension, for example pinned to the oldest version you support, QIT keeps your choice for that extension.
- QIT uses a recent release of the stubs and updates it about once a month, so calls are checked against a recent version of each extension, not the oldest version you support. If a call is guarded by a version check for an older release, PHPStan may still flag it; add an ignore for that line.
- If you think an error comes from a wrong or incomplete stub, please report it to [woocommerce/php-stubs](https://github.com/woocommerce/php-stubs/issues).

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


## CLI Usage

{/* QIT_COMMAND:run:phpstan */}
