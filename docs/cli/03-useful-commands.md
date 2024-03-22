# Useful commands

To see the commands that the QIT CLI provides, you can simply run `./qit` to see the full list.

Some helpful commands to get started include:

- `qit extensions` - Lists the WooExtensions you have access to test. The list includes the ID of the extension and the slug:

```
+----------------+--------------+
| ID             | Slug         |
+----------------+--------------+
| 123            | my-extension |
+----------------+--------------+
```

- `qit list-tests` - Lists the test runs, including details around the results, the versions tested and the test type:

:::tip
`Zip` for the version denotes that the test was ran against a [development version](cli/02-running-tests.md#testing-development-builds) of the plugin.
:::

```
+--------+------------+-------+------------+---------+-----------+----------------------+
| Run Id | Test       | WP    | WC         | Status  | Report    | Name/Version         |
+--------+------------+-------+------------+---------+-----------+----------------------+
| 344745 | security   | 6.1.1 | 7.2.2      | warning |           | My Extension (Zip)   |
| 344759 | woo-e2e    | 6.1.1 | 7.2.0-rc.2 | failed  | Available | My Extension (1.0.0) |
+--------+------------+-------+------------+---------+-----------+----------------------+
```

- `qit get <run ID>` - Get a single test run using the run ID from the `list-tests` command:

```
Run Id              344745
Test Type           security
Wordpress Version   6.1.1
Woocommerce Version 7.2.2
Status              warning
Is Development      Yes
Woo Extension       My Extension
```

:::tip
If a report is available, you can go into the [QIT Dashboard to view the report](woo-com/viewing-test-results.md#viewing-test-logs) or view the link by running `get` and the test run ID:
:::

```
Run Id              361745
Test Type           woo-e2e
Wordpress Version   6.1.1
Woocommerce Version 7.2.2
Status              failed
Result Url          https://testreport.url
Woo Extension       My Extension
```
