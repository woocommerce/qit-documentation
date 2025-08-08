# Setting up your local test environment

The local test environment allows you to run and debug **Test Packages** directly on your machine. While all **managed tests** are executed in QIT’s cloud-based environments, the local environment is invaluable for iterative development and quick feedback when creating or refining your custom test scenarios.

## Prerequisites

- **Docker:** Ensure that Docker (or a compatible container runtime) is installed and running on your machine.


## When to use the local test environment

- **Test Packages:** If you are writing and maintaining your own end-to-end tests, the local environment is perfect for rapid iteration. It lets you validate new scenarios, fix issues, and experiment without waiting for cloud runs.
- **Not for managed tests:** Managed tests, such as activation, Woo E2E, or security tests, always run in QIT’s cloud environment. The local environment will not affect these tests.

## Getting started

1. Spin up a basic environment for Test Package development:
   ```qitbash
   qit env:up
   ```

   This will start a WordPress instance configured with WooCommerce and the specified versions of WordPress and PHP, ready for your Test Packages.

2. Access the site:
   QIT displays the URL (e.g., `http://localhost:12345`). Open this URL in a browser to interact with your test site.

3. Tear down when done:
   ```qitbash
   qit env:down
   ```

   This cleans up the containers, ensuring your next `qit env:up` command starts from a blank slate.

## Customizing the environment

You can customize the environment by specifying versions, plugins, and features. For instance:

```qitbash
qit env:up --php_version=8.0 --wordpress_version=rc --plugin=woocommerce
```

- [Environment & Configuration](../environment/introduction.md): Dive deeper into configuring your local test environment and advanced features.

## Key benefits for Test Package testing

- **Immediate feedback:** Quickly run and debug Test Packages without waiting for cloud execution.
- **Isolated setup:** Each run is clean and reproducible, eliminating confusion about test state or data leftovers.
- **Faster iteration:** Experiment with new test scenarios and code changes locally before committing to the repository.
