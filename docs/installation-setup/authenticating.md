# Authenticating with QIT

Before you can start running tests or interacting with QIT's cloud-based services, you need to authenticate the QIT CLI with your WooCommerce Marketplace account. This step ensures that only authorized developers can run tests against their listed extensions.

## Prerequisites

- A WooCommerce.com Partner Developer account.
- At least one extension listed on the WooCommerce Marketplace.
- The QIT CLI installed and available on your system. Refer to [Installing the QIT CLI](../installation-setup/cli-installation.md).

## Generating a QIT Token

1. Run:
   `qit connect`

   This command will guide you through the authentication flow. It will open a browser window or prompt you to visit a specific URL, where you must log in with your WooCommerce.com credentials.

2. Once logged in, the Marketplace will generate a QIT Token. Copy this token.

3. Return to your terminal and paste the QIT Token when prompted by the CLI.

When the process finishes, the CLI will confirm that you are now authenticated.

## Verifying Authentication

Run:
`qit extensions`

If authenticated, you`ll see a list of extensions you have access to. This confirms that QIT recognizes your account and grants you the ability to run tests against these extensions.

## Understanding the QIT Token

The QIT Token you obtain through `qit connect` functions similarly to an application password but is scoped only to QIT actions. If you already have a WordPress Application Password from WooCommerce.com, it will not work with QIT for security reasons. It is required to generate a QIT Token through the `qit connect` flow, as it ensures the correct permissions and scope.

## Next Steps

- [Running Tests](../using-qit/running-tests-cli.md): Once authenticated, start by running a basic managed test against one of your extensions.
- [Introduction to QIT](../intro.md): Review the fundamentals if you haven't already.
- [Notifications and Results](../using-qit/notifications-results.md): Learn how QIT communicates test results and how you can review logs and reports.
