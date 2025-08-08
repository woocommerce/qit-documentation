# Understanding test types in QIT

QIT supports multiple kinds of tests designed to ensure the quality, compatibility, and security of WooCommerce extensions. These tests fall into two main categories: **Managed Tests** and **Test Packages**.

By utilizing these test types, you can leverage QIT to catch issues early, maintain compatibility with evolving WordPress and WooCommerce versions, and deliver a reliable experience to merchants and their customers.

## Managed tests

Managed tests are a suite of pre-built, standardized test scenarios maintained by the QIT team. They require no additional setup from you—just run them against your extension, and QIT will handle the rest.

Key Characteristics:
- **Maintained by QIT:** The QIT team updates these tests regularly to align with WooCommerce core changes, security best practices, and the latest versions of PHP, WordPress, and WooCommerce.
- **Broad coverage:** Managed tests cover a wide range of essential checks—like plugin activation, core WooCommerce flows, API endpoints, security audits, and PHP compatibility—helping ensure baseline quality.
- **Automatic and on-demand:** They can run automatically on new releases in the WooCommerce Marketplace, ensuring consistency and reliability before merchants see your update. Additionally, you can trigger them manually at any time.

Examples of Managed Tests:
- **Activation test:** Checks that your plugin activates without errors.
- **Woo E2E test:** Runs essential WooCommerce store flows to ensure your plugin doesn’t break core functionality.
- **Woo API test:** Validates WooCommerce REST API endpoints under your plugin’s influence.
- **Security test:** Identifies potential security issues using scanning tools and coding standards.
- **PHPStan and PHPCompatibility tests:** Ensures your code meets certain coding standards and runs on supported PHP versions.
- **Validation and plugin check tests:** Validate your plugin’s metadata and compliance with certain guidelines.
- **Malware scan test:** Checks for suspicious or malicious code within your plugin.

By relying on these managed tests, you inherit the cumulative knowledge and standards enforced by the QIT team, ensuring a strong baseline of reliability and compatibility.

## Test Packages

Test Packages are developer-owned test scenarios that you design, write, and maintain yourself. They provide a package-based approach to testing unique plugin-specific features and user journeys that managed tests don't cover.

Key Characteristics:
- **Package-based architecture:** Each test is a self-contained package with a manifest defining its behavior, requirements, and lifecycle phases.
- **Two package types:** Test packages execute actual tests and produce results, while utility packages provide environment setup without running tests.
- **Framework-agnostic:** While commonly using Playwright, Test Packages support any testing framework that can output CTRF (Common Test Results Format).
- **Lifecycle management:** Explicit phases (globalSetup, setup, run, teardown, globalTeardown) provide clear execution flow and automatic database isolation between packages.
- **Built-in secret management:** Declare required secrets in manifests for automatic validation and redaction.

Examples of Test Packages:
- **Plugin-specific workflows:** Create test packages that validate your specialized checkout options, payment methods, or shipping calculators.
- **Integration testing:** Use utility packages to set up complex multi-plugin environments, then test packages to verify compatibility.
- **Performance and security:** Dedicated packages for load testing, visual regression, or security scanning.
- **Cross-version compatibility:** Test profiles to run the same packages against different PHP, WordPress, and WooCommerce versions.

Test Packages help you tailor QIT's capabilities to your plugin's distinct functionality with better organization, isolation, and maintainability than traditional test suites.

## Complementary roles

Managed Tests provide a broad, standardized safety net—critical core flows, general security checks, and baseline compliance. This ensures that every extension meets essential quality criteria.

Test Packages add depth and flexibility. They address the unique aspects of your extension, detect subtle regressions in specialized features, and confirm compatibility with other plugins or themes. The package-based architecture with utility packages also enables sophisticated test environment setup and teardown scenarios.

By combining both types of tests, you get a thorough quality assurance process:

- **Before release:** Managed tests confirm baseline standards are met.
- **During development:** Custom tests verify new features and custom behaviors.
- **Ongoing maintenance:** Regularly running both test suites helps ensure continuous stability and compatibility as WordPress, WooCommerce, and your extension evolve.

## Working with Additional Extensions

When testing your main extension (SUT), you may also want to include other plugins—e.g., dependencies, compatibility targets, or popular add-ons. The process differs slightly between Managed Tests and Custom Tests:

- **Managed Tests**
    - QIT automatically downloads your extension from WooCommerce.com if you own it.
    - Additional paid extensions must also be owned by your account, or they won’t be fetched.
    - Some WooCommerce.com extensions that are also listed for free on WordPress.org may be downloaded automatically, even if you don’t own them.
    - **Local ZIP sources** are allowed **only for the SUT** (if you maintain it).
    - No custom test tags or additional custom code can be included.

- **Custom Tests**
    - You can add any extension to your test environment via Marketplace (if owned), WordPress.org (if free), or a **local ZIP** (if you don’t own it, or it’s hosted elsewhere).
    - You can also create and upload custom test tags and specialized test flows.
    - This flexibility is ideal for compatibility checks with plugins you don’t maintain or custom dev builds.