# Introduction to Managed Tests

Managed tests are a collection of standardized test suites maintained by the QIT team. They are designed to ensure your extension meets baseline criteria for stability, compatibility, and security. By running these tests, you gain quick, reliable feedback on potential issues, all without having to write or maintain your own scenarios.

## Key Characteristics of Managed Tests

- **Maintained by QIT:** QIT handles updates and improvements to these tests, reflecting the latest best practices, WordPress and WooCommerce changes, and evolving security standards.
- **Zero Setup Needed:** Simply run the managed tests against your extension, and QIT will provision the environment, perform the checks, and return results.
- **Broad Coverage:** Managed tests verify critical functionalities such as plugin activation, WooCommerce checkout flows, REST API endpoints, security audits, PHP compatibility, and more.

## When to Use Managed Tests

- **Before a Release:** Run managed tests on new versions of your extension to catch issues early and maintain quality.
- **Continuous Verification:** Integrate managed tests into your CI/CD pipeline (e.g., with GitHub Workflows) to ensure each commit or pull request maintains the extension's compatibility and security standards.
- **Compliance and Confidence:** Managed tests provide a baseline assurance of quality for both developers and merchants, reducing the risk of unexpected issues after deployment.

## Types of Managed Tests

Different managed tests address specific aspects of extension quality. Some examples include:

- **Activation Test:** Ensures that your plugin activates without errors.
- **Woo E2E Test:** Simulates key WooCommerce customer journeys, verifying that your extension does not break core store flows.
- **Woo API Test:** Validates API endpoints and their responses under various conditions.
- **Security Test:** Checks for known security risks, vulnerabilities, and coding standards violations.
- **PHPStan and PHPCompatibility Tests:** Analyzes code quality and compatibility with supported PHP versions.
- **Validation, Plugin Check, and Malware Tests:** Confirm that your extension's metadata, codebase, and file structure adhere to guidelines and remain free of malicious code.

## Interpreting Results

Managed tests often return three possible outcomes:
- **Success:** No issues detected.
- **Warning:** Non-fatal errors, deprecations, or notices that should be addressed.
- **Failed:** Critical issues prevent the extension from running properly or meeting standards.

For detailed logs, reports, and insights, refer to the [Notifications and Results](#) page.

## Next Steps

- [Test Types Overview](#): Understand how managed tests fit alongside custom E2E tests.
- [Using QIT via the CLI](#): Learn how to run managed tests from your terminal.
- [WooCommerce.com Dashboard](#): Trigger and review managed test runs through a friendly UI.  
