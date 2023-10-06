### PHPCompatibility Tests

The PHPCompatibility test is a tool that helps developers assess the compatibility of their extension with different PHP versions. It checks the codebase of a plugin against a set of coding standards and best practices to ensure that it can run on a wide range of PHP versions, ensuring better compatibility and security. The following status will be returned from this test:
- Success: No WordPress/PHP compatibility warning or errors.
- Warning: Issues or potential problems in your code that may affect compatibility with the target PHP version(s). Warnings are typically related to deprecated or risky code practices.
- Failure: Critical issues in your code that prevent it from being compatible with the target PHP version(s). Failures often result from the use of code that is incompatible with the specified PHP version(s).

## What to do if it fails
If your phpcompatibility test is failing, please take the following steps:

- Open the test report
- Identify the causes of failure. The test will log any security issues that our scanner identifies
- Fix the issue and re-run the test

### Handling False Positives

We have chosen to utilize the `develop` branch of the PHPCompatibility project rather than version `9`. The reason for this choice is that the develop branch offers partial support for PHP 8+ syntax, which is essential for maintaining compatibility with modern PHP versions. However, it's important to note that this partial support may occasionally lead to false positives in the test results against codebases using 8+ syntax. 

If you are confident that an error is a false positive, we recommend that you report the issue to the [PHPCompatibility repository](https://github.com/PHPCompatibility/PHPCompatibility) so it can be reviewed. Additionally, developers can temporarily suppress these errors using PHP CodeSniffer (PHPCS) ignore comments until further updates are available.
