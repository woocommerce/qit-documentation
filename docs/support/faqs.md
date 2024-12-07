# FAQs

:::info
The following FAQs address common questions and concerns about using QIT. If you don’t find an answer here, consider checking the [Troubleshooting](#) guide, reaching out on GitHub issues, or contacting us via email.
:::

## General Questions

**Q: What is QIT and who is it for?**  
A: QIT (Quality Insights Toolkit) is a testing platform designed by WooCommerce to help developers run automated tests on their WordPress plugins and themes. It’s primarily for developers who publish or plan to publish extensions on the WooCommerce Marketplace, though a local environment is available for anyone interested in testing.

**Q: Do I need a WooCommerce.com Partner Developer account to use QIT?**  
A: Full QIT functionality, including managed tests and cloud runs, requires a WooCommerce.com Partner Developer account with at least one listed extension. However, the local test environment and custom E2E tests can be used in an early-access capacity without being a Marketplace partner.

## Installation and Setup

**Q: How do I install the QIT CLI?**  
A: Install the QIT CLI via Composer globally or per-project. Refer to the [CLI Installation](#) page for detailed instructions.

**Q: What are the prerequisites for running tests locally?**  
A: Ensure you have PHP, Composer, and Docker installed. For Windows, WSL 2 is required. Check the [Local Test Environment Introduction](#) for more details.

## Running Tests

**Q: Which types of tests are available?**  
A: QIT offers managed tests (like Activation, Woo E2E, Security, PHPStan, and others) and supports custom E2E tests you write yourself. See the [Test Types Overview](#) for a full list.

**Q: Can I choose different WordPress or WooCommerce versions to test against?**  
A: Yes, certain tests (e.g., Activation, Woo E2E, Woo API) allow specifying versions of WordPress, WooCommerce, and PHP. Check the [Test Options](#) for details on which tests support this.

**Q: My test needs a live URL for external services. How can I achieve that?**  
A: Use QIT’s built-in tunneling methods (like cloudflared) or set up a persistent or custom tunnel to expose your local environment online. See [Tunneling](#) for more information.

## Troubleshooting and Reporting Issues

**Q: What if a test fails unexpectedly?**  
A: Start by reviewing logs, using `qit list-tests` and `qit get <run ID>` to gather details. Check Allure reports if available. Consult the [Troubleshooting](#) guide for common solutions.

**Q: How do I handle flakiness in tests?**  
A: Consider simplifying selectors, adding retries, increasing timeouts, or ensuring stable conditions (like waiting for elements to load). If issues persist, open a GitHub issue or email `qit@woocommerce.com` with details.

**Q: I found a security issue. How do I report it?**  
A: Email `qit@woocommerce.com` with `Security Issue` in the subject line. Provide detailed steps to reproduce without publicly disclosing the vulnerability.

## Advanced Topics

**Q: How can I integrate QIT tests into my CI/CD pipeline?**  
A: Use scripting to run QIT commands automatically and rely on exit codes for CI status. See [Scripting](#) and [GitHub Workflows](#) for examples.

**Q: Can I fetch plugins or themes from private repos or other custom sources?**  
A: Yes, implement a custom handler to fetch and build your extensions before testing. Refer to [Installing from Other Sources](#) and [Advanced Config Handlers](#) for guidance.

## Getting Help

**Q: Where can I get further support?**  
A: Check the [Contact Us](#) page for options. You can email us, open GitHub issues, or reference community discussions. Keep logs, run IDs, and details handy to speed up assistance.

:::info
If you still have questions or need assistance not covered here, don’t hesitate to reach out. QIT is continually improving based on feedback and community input.
:::