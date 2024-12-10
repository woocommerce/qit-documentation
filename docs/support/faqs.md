# FAQs

:::info
... consider checking the [Troubleshooting](../test-execution/troubleshooting.md) guide ...
:::

## General questions

**Q: What is QIT and who is it for?**  
A: QIT (Quality Insights Toolkit) is a testing platform designed by WooCommerce to help developers run automated tests on their WordPress plugins and themes. It’s primarily for developers who publish or plan to publish extensions on the WooCommerce Marketplace, though a local environment is available for anyone interested in testing.

**Q: Do I need a WooCommerce.com Partner Developer account to use QIT?**  
A: Full QIT functionality, including managed tests and cloud runs, requires a WooCommerce.com Partner Developer account with at least one listed extension. However, the local test environment and custom E2E tests can be used in an early-access capacity without being a Marketplace partner.

## Installation and setup

**Q: How do I install the QIT CLI?**  
... Refer to the [CLI Installation](../installation-setup/cli-installation.md) page ...

**Q: What are the prerequisites for running tests locally?**  
... Check the [Local Test Environment Introduction](../environment/introduction.md) for more details.

## Running tests

**Q: Which types of tests are available?**  
... See the [Test Types Overview](../core-concepts/test-types-overview.md) for a full list.

**Q: Can I choose different WordPress or WooCommerce versions to test against?**  
... Check the [Test Options](./test-options.md) for details on which tests support this.

**Q: My test needs a live URL for external services. How can I achieve that?**  
... See [Tunneling](../environment/tunnel.md) for more information.

## Troubleshooting and reporting issues

**Q: What if a test fails unexpectedly?**  
... consider checking the [Troubleshooting](../test-execution/troubleshooting.md) guide ...

**Q: How do I handle flakiness in tests?**  
A: Consider simplifying selectors, adding retries, increasing timeouts, or ensuring stable conditions (like waiting for elements to load). If issues persist, open a GitHub issue or email `qit@woocommerce.com` with details.

**Q: I found a security issue. How do I report it?**  
A: Email `qit@woocommerce.com` with `Security Issue` in the subject line. Provide detailed steps to reproduce without publicly disclosing the vulnerability.

## Advanced topics

**Q: How can I integrate QIT tests into my CI/CD pipeline?**  
... See [Scripting](../advanced-usage/scripting.md) and [GitHub Workflows](../using-qit/github-workflows.md) for examples.

**Q: Can I fetch plugins or themes from private repos or other custom sources?**  
... Refer to [Installing from Other Sources](../environment/installing-from-other-sources.md) and [Advanced Config Handlers](../advanced-usage/advanced-config-handlers.md) for guidance.

## Getting help

**Q: Where can I get further support?**  
... Check the [Contact Us](./contact-us.md) page for options.

:::info
If you still have questions or need assistance not covered here, don’t hesitate to reach out. QIT is continually improving based on feedback and community input.
:::
