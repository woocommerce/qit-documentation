## PHPStan Test Type

PHPStan is a static analysis tool that helps you catch coding errors early by identifying type mismatches, undefined methods, incorrect function calls, and other potential bugs. QIT enhances PHPStan specifically for WordPress and WooCommerce with [Stubz](https://github.com/Luc45/stubz), a custom stub generator, and multi-plugin support. This integration lets you focus on meaningful issues rather than sorting through false positives or irrelevant warnings.

## Overview

QIT runs PHPStan on your extension to detect issues such as undefined classes, incorrect function calls, type inconsistencies, and logical errors. By default, PHPStan runs at level 0, providing broad fundamental checks. However, due to WordPress and WooCommerce's dynamic use of hooks and runtime declarations, QIT leverages Stubz to create static definitions, allowing PHPStan to accurately analyze your code.

## How It Works: Stubz and Multi-Plugin Analysis

Stubz is a WordPress-aware stub generator that creates static definitions for classes, functions, and constants normally defined at runtime through hooks and callbacks. This greatly reduces false positives related to missing symbols. Additionally, QIT supports multi-plugin PHPStan analysis by examining declared dependencies alongside your extension, allowing it to detect compatibility issues introduced by other plugins.

## Usage

To run a PHPStan test with QIT, use the CLI command:

```
qit run:phpstan your-plugin
```

This executes PHPStan at level 0. For stricter analysis, specify a higher level:

```
qit run:phpstan your-plugin --phpstan_level 5
```

If your plugin relies on soft dependencies, include them explicitly:

```
qit run:phpstan your-plugin --additional_plugins some-other-plugin
```

## Dependencies: Hard vs. Soft

- **Hard dependencies**: Required plugins for your extension to function. If declared on WooCommerce.com, QIT includes these automatically during static analysis.
- **Soft dependencies**: Optional plugins that enhance your extension’s functionality but aren't strictly required. QIT doesn't automatically include these; you must manually specify them using the `--additional_plugins` flag for accurate analysis.

## What PHPStan Checks

PHPStan analyzes your code for:

- Undefined classes, methods, or functions
- Type safety, ensuring correct parameter and return types
- Logical errors such as unreachable code or incorrect method signatures

Addressing these issues early significantly reduces the likelihood of runtime errors and simplifies maintenance.

## Interpreting Results

- **No warnings**: Indicates no immediate issues detected at the selected PHPStan level.
- **Warnings or failures**: Examine file paths and line numbers carefully. Real issues may require code refactoring or adding missing type hints. Warnings related to common WordPress patterns can be safely suppressed via `phpstan.neon` or inline annotations.

## Reducing False Positives

Despite Stubz's effectiveness, occasional false positives may occur. To mitigate these:

- Define critical classes and functions in files always loaded, avoiding conditional or delayed declarations.
- Explicitly include all necessary dependencies, even optional ones.
- Configure exceptions for persistent false positives in your `phpstan.neon` file.

## Improving Code Quality

Addressing PHPStan warnings enhances both reliability and readability. Consider raising your analysis level to detect deeper issues. Maintain a `phpstan.neon` configuration file to customize PHPStan's checks. AI-based code assistants can also suggest quick fixes, though manual review remains essential for best practices.

## Future Possibilities

Future QIT improvements could include:

- A symbol map cataloging all declared classes and functions across plugins to automatically add soft dependencies your plugin might have.
- An action/filter map, which allows you to see what plugins are extending your actions/filters, and what other plugins extends the same hooks as you, which can be a common cause of compatibility issues.
- Automatic suggestions or inclusion of plugins based on symbol analysis to further streamline the testing process.
