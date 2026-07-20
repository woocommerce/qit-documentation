---
description: "Overview of managed tests: pre-built quality checks maintained by the QIT team that run remotely with zero setup. Lists all available test types, including the API fuzz beta, with brief descriptions. Explains when to use them, how to interpret results (success, warning, failed), and links to individual test type pages for details."
---

# Managed Tests

Managed tests are a collection of standardized test suites maintained by the QIT team. They are designed to ensure your extension meets baseline criteria for stability, compatibility, and security. By running these tests, you gain quick, reliable feedback on potential issues, all without having to write or maintain your own scenarios.

## Key characteristics of managed tests

- **Maintained by QIT:** QIT handles updates and improvements to these tests, reflecting the latest best practices, WordPress and WooCommerce changes, and evolving security standards.
- **Zero setup needed:** Simply run the managed tests against your extension, and QIT will provision the environment, perform the checks, and return results.
- **Broad coverage:** Managed tests verify critical functionalities such as plugin activation, WooCommerce checkout flows, REST API endpoints, security audits, PHP compatibility, and more.

## When to use managed tests

- **Before a release:** Run managed tests on new versions of your extension to catch issues early and maintain quality.
- **Continuous verification:** Integrate managed tests into your CI/CD pipeline (e.g., with GitHub Workflows) to ensure each commit or pull request maintains the extension's compatibility and security standards.
- **Compliance and confidence:** Managed tests provide a baseline assurance of quality for both developers and merchants, reducing the risk of unexpected issues after deployment.

## Types of managed tests

Different managed tests address specific aspects of extension quality. Some examples include:

- **Activation test:** Ensures that your plugin activates without errors.
- **Woo E2E test:** Simulates key WooCommerce customer journeys, verifying that your extension does not break core store flows.
- **Woo API test:** Validates API endpoints and their responses under various conditions.
- **API fuzz test (Beta):** Generates anonymous and administrator requests for plugin-owned WordPress REST API routes to find reproducible server errors.
- **Security test:** Checks for known security risks, vulnerabilities, and coding standards violations.
- **PHPStan and Code Compatibility tests:** Analyzes code quality and compatibility with supported PHP versions and database environments.
- **Validation, plugin check, and malware tests:** Confirm that your extension's metadata, codebase, and file structure adhere to guidelines and remain free of malicious code.

## Interpreting results

Managed tests often return three possible outcomes:
- **Success:** No issues detected.
- **Warning:** Non-fatal errors, deprecations, or notices that should be addressed.
- **Failed:** Critical issues prevent the extension from running properly or meeting standards.

If you have enabled email notifications, you will receive an email when a test completes if it results in warnings or failures.
