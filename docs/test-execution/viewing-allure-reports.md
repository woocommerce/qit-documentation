# Viewing allure reports

Allure reports provide a rich, visual interface to understand the results of your end-to-end tests, including steps, screenshots, stack traces, and overall test statuses. When a test fails, QIT often generates an Allure report that you can review directly from the QIT CLI or the WooCommerce Vendor Dashboard.

## When allure reports are generated

Allure reports are automatically created for certain managed tests, such as Woo E2E tests, when failures occur. They give detailed insights into what went wrong:
- Which steps passed and failed
- HTML selectors interacted with
- Screenshots at the moment of failure
- Stack traces and error messages

For custom E2E tests, QIT may also produce Allure reports if configured to do so, helping you debug and fix issues quickly.

## Accessing reports via CLI

If you know the test run ID, you can open the Allure report with:
```bash
qit open <run ID>
```

For example:
```bash
qit open 344759
```

This launches the Allure report in your default browser, presenting a dashboard of test results.

## Accessing reports via vendor dashboard

1. Log in to the WooCommerce Vendor Dashboard.
2. Navigate to "Quality Insights > All Tests".
3. Locate the failed or completed test run you want to review.
4. Click "View Report" (if available) to open the Allure report in a modal window or a new tab.

This approach provides a UI-driven method, perfect for team members who prefer not to use the CLI.

## Understanding allure reports

Once you open the report, you may see:

- **Overview Page**: Summarizes passed, failed, or skipped tests.
- **Suites Section**: Organizes tests by browser or scenario. Drilling down shows each test's steps.
- **Categories**: Groups failures by error type. For example, "Product defects" or "Test defects".
- **Timeline**: Some reports include a timeline view of tests run in parallel.
- **Graphs**: Charts and graphs showing distribution of test results.

By exploring these sections, you gain a complete picture of your test runs, identifying patterns and common failure points.

## Digging into the details

For successful tests, you can review the steps, HTML selectors used, and assertions made. This helps confirm that the test worked as intended, which is useful for onboarding or verifying complex workflows.

For failed cases:
- Screenshots show exactly how the UI appeared at the moment of failure.
- Stack traces highlight the error encountered.
- Steps indicate which actions led to the failure, helping you reproduce the issue locally.

If you find flakiness or difficulties reproducing the issue, try re-running the test to confirm if it was a one-time glitch or a persistent bug.

## Tips for using allure reports

- **Take Notes**: Make note of recurring issues. If the same failure mode appears across multiple runs, investigate deeper.
- **Cross-Reference with Logs**: Combine Allure details with logs or CLI output. This holistic approach accelerates debugging.
- **Share URLs**: If the report URL is shareable, send it to teammates for collaborative troubleshooting.

## Next steps

- [Useful Commands](./useful-commands.md): Learn about commands to list tests and get their run IDs.
- [Notifications and Results](../using-qit/notifications-results.md): Configure email alerts or other notifications to know when to view reports.
- [Managed Tests and Custom E2E Tests](../core-concepts/test-types-overview.md): Explore how to generate and interpret Allure reports for both default and custom scenarios.