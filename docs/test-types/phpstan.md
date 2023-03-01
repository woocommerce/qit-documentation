### PHPStan tests

The PHPStan test type runs level 0 PHPStan checks against your extension. More details on what the rule levels cover can be found in the official PHPStan documentation: [Rule Levels](https://phpstan.org/user-guide/rule-levels).

## What to do if it fails

Due to the very nature of WordPress and WooCommerce of not being typed codebases, static code analysis such as PHPStan have a high failure rate when testing WordPress plugins in general.

This doesn't mean that there are issues with the quality of the code, it's only that the code is not friendly to static code analysis, such as code with extensive usage of getters and setters, which is very common when integrating with WooCommerce Core.

The PHPStan tests still provide a lot of value for the developers that want to pursue the highest levels of quality. By default, we run PHPStan tests with level 0.

If your PHPStan test is failing, please take the following steps:

- You can ignore this test, as we don't use it internally to measure an extensions quality
- But if you wish to address the feedback that the static code analsysis provide, open the test report
- Identify the causes of failure
- Fix the issue and re-run the test
- If you think the result is incorrect, please email us at qit@woocommerce.com