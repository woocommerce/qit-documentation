# Setting Up Your Local Test Environment

The local test environment allows you to run and debug **custom E2E tests** directly on your machine. While all **managed tests** are executed in QIT’s cloud-based environments, the local environment is invaluable for iterative development and quick feedback when creating or refining your custom test scenarios.

## Prerequisites

- **Docker:** Ensure that Docker (or a compatible container runtime) is installed and running on your machine.


## When to Use the Local Test Environment

- **Custom E2E Tests:** If you are writing and maintaining your own end-to-end tests, the local environment is perfect for rapid iteration. It lets you validate new scenarios, fix issues, and experiment without waiting for cloud runs.
- **Not for Managed Tests:** Managed tests, such as activation, Woo E2E, or security tests, always run in QIT’s cloud environment. The local environment will not affect these tests.

## Getting Started

1. Spin up a basic environment for custom E2E development:
   `qit env:up`

   This will start a WordPress instance configured with WooCommerce and the specified versions of WordPress and PHP, ready for your custom tests.

2. Access the site:
   QIT displays the URL (e.g., `http://localhost:12345`). Open this URL in a browser to interact with your test site.

3. Tear down when done:
   `qit env:down`

   This cleans up the containers, ensuring your next `qit env:up` command starts from a blank slate.

## Customizing the Environment

You can customize the environment by specifying versions, plugins, and features. For instance:

`qit env:up --php_version=8.0 --wordpress_version=rc --plugin=woocommerce`

- [Environment & Configuration](../environment/introduction.md): Dive deeper into configuring your local test environment and advanced features.

## Key Benefits for Custom E2E Testing

- **Immediate Feedback:** Quickly run and debug custom tests without waiting for cloud execution.
- **Isolated Setup:** Each run is clean and reproducible, eliminating confusion about test state or data leftovers.
- **Faster Iteration:** Experiment with new test scenarios and code changes locally before committing to the repository.

## Next Steps

- [Creating Custom E2E Tests](../custom-tests/introduction.md): Learn how to scaffold and write your own tests to run in this environment.
- [Running Tests Locally](../using-qit/running-tests-cli.md): Integrate custom tests into your workflow for continuous development and refinement.
- [Advanced Configuration](../advanced-usage/advanced-config-handlers.md): Explore tunnels, custom handlers, and other advanced features.
