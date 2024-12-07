# Useful Commands

Whether you are running tests locally or in QIT's cloud, certain CLI commands streamline test execution and reporting. These commands help you list extensions, view test runs and their results, and validate local zip files before testing.

## Listing Extensions

If you need to confirm which extensions you have access to, use:
```bash
qit extensions
```

This command shows a table of extensions including their ID and slug. For example:
```
+----------------+--------------+
| ID             | Slug         |
+----------------+--------------+
| 123            | my-extension |
+----------------+--------------+
```

This quick reference helps you ensure you have the correct slug when running tests.

## Listing Test Runs

To see a history of tests you've run and their outcomes:
```bash
qit list-tests
```

This displays a table with run IDs, test types, the WordPress and WooCommerce versions, status, and links to reports. For instance:
```
+--------+------------+-------+------------+---------+-----------+----------------------+
| Run Id | Test       | WP    | WC         | Status  | Report    | Name/Version         |
+--------+------------+-------+------------+---------+-----------+----------------------+
| 344745 | security   | 6.1.1 | 7.2.2      | warning |           | My Extension (Zip)   |
| 344759 | woo-e2e    | 6.1.1 | 7.2.0-rc.2 | failed  | Available | My Extension (1.0.0) |
+--------+------------+-------+------------+---------+-----------+----------------------+
```

This helps you quickly find runs that failed or produced warnings and review their details.

## Viewing a Single Test Run

To get detailed information about a specific test run, use:
```bash
qit get <run ID>
```

Replace `<run ID>` with the numeric ID from `qit list-tests`. For example:
```bash
qit get 344745
```

Displays info such as:
```
Run Id              344745
Test Type           security
Wordpress Version   6.1.1
Woocommerce Version 7.2.2
Status              warning
Is Development      Yes
Woo Extension       My Extension
```

If a report is available, it will also show a 'Result Url' linking to more detailed logs and screenshots.

## Opening a Test Report

For tests that have a detailed report available, you can open it in your browser:
```bash
qit open <run ID>
```

This launches the test's report page, making it easier to review results, download logs, and examine screenshots.

## Validating ZIP Files

Before running tests on a local zip, ensure it meets QIT's criteria:
```bash
qit woo:validate-zip <path-to-zip-file>
```

This checks for invalid files (like `Thumbs.db`, `.DS_Store`) and ensures the zip is structured correctly. If it passes validation, you can confidently run tests against it:
```bash
qit run:e2e my-extension --zip=my-extension.zip
```

## Tips

- Combine commands for efficient workflows. For example, after running `qit run:woo-e2e my-extension`, use `qit list-tests` to find the run ID, then `qit get <run ID>` for details.
- Use `qit extensions` before running tests if you're unsure of the correct extension slug.
- Validate zips before testing to avoid issues related to malformed packages.

## Next Steps

- [Running Tests](#): Learn more about executing tests via CLI or dashboard.
- [Notifications and Results](#): Set up alerts and view logs for continuous feedback.
- [Configuration Files](#): Integrate useful commands with custom environment configurations for a smooth testing pipeline.

By mastering these useful commands, you streamline your test execution process, ensuring you can quickly find, review, and troubleshoot test results without sifting through complex outputs.