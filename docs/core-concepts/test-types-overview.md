# Understanding Test Types in QIT

QIT supports multiple kinds of tests designed to ensure the quality, compatibility, and security of WooCommerce extensions. These tests fall into two main categories: **Managed Tests** and **Custom E2E Tests**.

Why does this matter?  
By familiarizing yourself with these test types, you can leverage QIT to catch issues early, maintain compatibility with evolving WordPress and WooCommerce versions, and deliver a reliable experience to merchants and their customers.

## Managed Tests

Definition:  
Managed tests are a suite of pre-built, standardized test scenarios maintained by the QIT team. They require no additional setup from you—just run them against your extension, and QIT will handle the rest.

Key Characteristics:
- **Maintained by QIT:** The QIT team updates these tests regularly to align with WooCommerce core changes, security best practices, and the latest versions of PHP, WordPress, and WooCommerce.
- **Broad Coverage:** Managed tests cover a wide range of essential checks—like plugin activation, core WooCommerce flows, API endpoints, security audits, and PHP compatibility—helping ensure baseline quality.
- **Automatic and On-demand:** They can run automatically on new releases in the WooCommerce Marketplace, ensuring consistency and reliability before merchants see your update. Additionally, you can trigger them manually at any time.

Examples of Managed Tests:
- **Activation Test:** Checks that your plugin activates without errors.
- **Woo E2E Test:** Runs essential WooCommerce store flows to ensure your plugin doesn’t break core functionality.
- **Woo API Test:** Validates WooCommerce REST API endpoints under your plugin’s influence.
- **Security Test:** Identifies potential security issues using scanning tools and coding standards.
- **PHPStan and PHPCompatibility Tests:** Ensures your code meets certain coding standards and runs on supported PHP versions.
- **Validation and Plugin Check Tests:** Validate your plugin’s metadata and compliance with certain guidelines.
- **Malware Scan Test:** Checks for suspicious or malicious code within your plugin.

By relying on these managed tests, you inherit the cumulative knowledge and standards enforced by the QIT team, ensuring a strong baseline of reliability and compatibility.

## Custom E2E Tests

Definition:  
Custom E2E (End-to-End) tests are scenarios you design, write, and maintain yourself. They let you test unique plugin-specific features and user journeys that managed tests don’t cover.

Key Characteristics:
- **Developer-Owned:** You decide what gets tested, which user flows to mimic, and what criteria define success or failure.
- **Playwright-based:** Built on the Playwright framework, these tests can interact with your site’s UI, ensuring complex scenarios still work as intended.
- **Version and Compatibility Control:** Since you control the tests, you can quickly adapt them when your plugin adds new features, integrates with third-party services, or updates its UI.

Examples of Custom Tests:
- **Plugin-specific Store Workflow:** If your plugin adds a specialized checkout option, create a test that simulates a customer completing a purchase with that method.
- **Integration Scenarios:** Test compatibility with other popular plugins by installing both in the QIT environment and verifying key functions still work together.
- **Edge Case Handling:** Ensure custom discount rules, unusual tax configurations, or localized content remain stable.

Custom E2E tests help you tailor QIT’s capabilities to your plugin’s distinct functionality, catching issues that managed tests might overlook.

## Complementary Roles

Managed Tests provide a broad, standardized safety net—critical core flows, general security checks, and baseline compliance. This ensures that every extension meets essential quality criteria.

Custom E2E Tests add depth and flexibility. They address the unique aspects of your extension, detect subtle regressions in specialized features, and confirm compatibility with other plugins or themes.

By combining both types of tests, you get a thorough quality assurance process:

- **Before Release:** Managed tests confirm baseline standards are met.
- **During Development:** Custom tests verify new features and custom behaviors.
- **Ongoing Maintenance:** Regularly running both test suites helps ensure continuous stability and compatibility as WordPress, WooCommerce, and your extension evolve.

## Next Steps

- **Learn How QIT Works:** If you haven’t yet, see 'core-concepts/how-qit-works' to understand how these test types fit into the overall QIT architecture.
- **Managed Tests in Detail:** Dive deeper into each managed test type in 'managed-tests/introduction'.
- **Getting Started with Custom E2E Tests:** Explore how to scaffold, write, and run your own tests in 'custom-tests/introduction'.
