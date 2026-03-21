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


## CLI Usage

{/* QIT_COMMAND:run:phpstan */}
