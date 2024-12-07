# Notifications and Results

After running tests, QIT provides detailed information about their outcomes, including logs, warnings, errors, and even security or compatibility issues. You can access these results through the WooCommerce Vendor Dashboard or the CLI output. Additionally, you can configure email notifications for failed or warning-level tests, ensuring you never miss critical updates.

## Viewing Results in the Vendor Dashboard

1. Log in to your WooCommerce.com account and go to the `Vendor Dashboard`.
2. Navigate to the `All Tests` page in the QIT menu.
3. Identify the test run you want to inspect. Click `View Report` to access in-depth details, including logs and screenshots if available.

This unified interface allows you to review test outcomes alongside your extension listings, giving you immediate insight into quality issues before merchants encounter them.

## CLI-Based Results

When you run tests from the CLI, QIT displays a summary of the results in your terminal. It may include:
- Status: `Success`, `Warning`, or `Failed`
- Basic logs
- A link (URL) to more detailed reports if applicable

For example:
`qit run:activation your-extension`

If the test fails or generates warnings, you'll see prompts or URLs to additional logs or reports.

## Configuring Email Notifications

Email notifications help you stay informed about test outcomes without constantly monitoring the dashboard. You can configure notifications for specific test types or all tests, ensuring that key team members receive alerts when something goes wrong.

In the Vendor Dashboard:
1. Go to `Notification Settings` under the QIT menu.
2. Select which test types should trigger emails.
3. Add a comma-separated list of email addresses if you want to send notifications to multiple recipients.

## Example Configuration in CI

If you integrate QIT with GitHub Workflows or another CI system, you may want to adjust notifications accordingly. For instance, you could update your CI pipeline to send emails or Slack messages based on QIT test outcomes. This is highly customizable depending on your workflow.

Here is an example workflow snippet using `yaml` to demonstrate how you might handle notifications after test completion:

```yaml
name: QIT Tests with Notifications

on:
  push:
    branches: [main]

jobs:
  run-qit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install QIT CLI
        run: composer global require woocommerce/qit-cli

      - name: Authenticate QIT
        run: qit partner:add --user='${{ secrets.QIT_USER }}' --application_password='${{ secrets.QIT_APP_PASS }}'

      - name: Run Security Test
        run: qit run:security your-extension --wait

      - name: Notify on Failure
        if: failure()
        run: echo 'Test failed! Send notification email via your preferred method.'
```

In this example, if the test fails, the `Notify on Failure` step can trigger your custom notification mechanism (email service, Slack integration, etc.).

## Benefits of Notifications and Detailed Reporting

- **Proactive Issue Resolution:** Immediate alerts allow you to fix problems before merchants encounter them.
- **Efficiency:** Consolidated test logs and reports help you pinpoint issues quickly.
- **Confidence in Releases:** Knowing that test failures or warnings won't go unnoticed builds trust in your continuous integration and deployment practices.

## Next Steps

- [Running Tests via the CLI](#): Explore how to get instant feedback locally.
- [Using the Vendor Dashboard](#): Learn how to run tests and view results directly in a UI.
- [Custom E2E Tests](#): Consider writing custom tests that produce results tailored to your unique scenarios.  
