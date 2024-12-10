# The security architecture of custom E2E tests

:::info
The custom E2E tests feature is available as early access.
:::

Security is central to QIT’s approach for running custom E2E tests. When you execute tests—either locally or in QIT’s cloud environment—they run in tightly controlled, containerized environments engineered to isolate and protect your code, data, and infrastructure. Understanding this security architecture helps you trust that your tests run safely and predictably, without risking leaks, unauthorized access, or interference.

## Containerized, disposable environments

Each test run occurs in a Docker-based environment that includes:
- A dedicated WordPress and WooCommerce installation.
- Any required plugins, themes, and optional features.
- Strict isolation mechanisms to prevent code from escaping the container or affecting other tests.

Because these environments are disposable and short-lived, once a test run finishes, the environment—and any potential sensitive data introduced—disappears. This reduces the risk of data persistence and ensures consistent, repeatable test conditions.

## Non-root execution and least privilege

Tests run as a non-root user within the container, following least privilege principles. This approach ensures:
- Limited system access: Even if a test scenario or plugin code attempts unsafe operations, it cannot access host resources or high-level system functions.
- Minimal attack surface: By running as a non-root user, QIT narrows opportunities for malicious code to exploit elevated privileges.

## Controlled volume mounts

By default, only directories required for testing (e.g., the plugin’s code and related configuration) are mounted into the container. This practice safeguards your host system from being modified by the tests. If you specify additional volumes, they mount as read-only, preventing write operations to external directories.

## Secure updates and dependencies

QIT’s base images are carefully maintained, with updates regularly applied for:
- The WordPress, WooCommerce, and PHP stacks.
- Underlying operating system packages and security patches.
- Any default tooling required for the test environment.

By using up-to-date images and verifying dependencies, QIT reduces the risk of known vulnerabilities lingering in the test environment.

## Code execution boundaries

When you run custom E2E tests:
- Your code and tests do not have direct access to the QIT host or other test runs.
- Actions that interact with external services (e.g., payment gateways, APIs) can be secured with tunnels or mocked as needed.
- Each test run starts from a clean state, with no leftover data, credentials, or artifacts from previous tests.

## Communication and API access

All communication between QIT CLI, the QIT cloud environment, and any external services is done over secure channels. Authentication tokens and credentials are handled carefully, and the QIT Token you generate via `qit connect` is scoped only to QIT functionalities, limiting potential damage if compromised.

## Best practices for test security

- **Avoid hardcoding secrets:** Use environment variables or QIT configuration files to manage sensitive data. Never commit secrets directly into test code.
- **Isolate external dependencies:** If your plugin relies on external APIs, consider using QIT’s built-in tunnel feature or local mocks to prevent external exposure during tests.
- **Review third-party code:** If you install additional dependencies or run scripts within the environment, ensure they come from trusted sources.

## Next steps

- [QIT Helpers](./qit-helpers.md): Utilize built-in helpers to run commands and interact with WordPress securely.
- [Understanding the Lifecycle](./understanding-lifecycle.md): Learn how the lifecycle phases contribute to test isolation and data integrity.
- [Advanced Configuration](../advanced-usage/advanced-config-handlers.md): Explore configuration files and tunneling options to enhance security and control.