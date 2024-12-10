# Woo API tests

Woo API tests verify that your extension interacts cleanly with the WooCommerce REST API. By creating and manipulating products, orders, and customers through API requests, these tests ensure that your extension doesn’t introduce errors or alter expected responses, helping maintain a stable and reliable store experience.

## How it works

The Woo API tests:
- Set up a fresh WordPress and WooCommerce environment.
- Install and activate your extension.
- Execute the WooCommerce Core API test suite against the configured environment.
- Perform actions like creating products, customers, and orders via the REST API, then validate that the responses match expected outcomes.

By running these tests, you confirm that your extension does not break or degrade the WooCommerce API, preserving compatibility with third-party integrations, mobile apps, and headless storefronts.

## What the tests check

The tests cover essential WooCommerce REST API endpoints, including:
- Creating, updating, and deleting products.
- Managing customers and their details.
- Placing, retrieving, and updating orders.

If your extension interacts with these endpoints (for example, by adding custom product fields or modifying order data), Woo API tests help catch issues before merchants or customers encounter them.

## Interpreting results

- **Success:** All API operations returned expected responses, and no errors or warnings were triggered.
- **Warning/Failed:** Some requests did not meet expectations or produced errors, indicating potential compatibility or logic issues.

For failed tests, QIT provides logs and, when applicable, links to detailed reports. Use these insights to understand what went wrong and how to address the issue.

## Best practices

- **Maintain backwards compatibility:** Keep your extension updated as WooCommerce evolves, ensuring your API integrations remain valid and stable.
- **Test complex scenarios:** If you rely on custom data fields or extensive use of filters and hooks, run tests after any significant change to confirm the API still responds correctly.
- **Combine with other tests:** Running Woo API tests alongside Woo E2E and Security tests provides a comprehensive picture of your extension’s quality and stability.

## Running woo API tests

To run the Woo API tests:

```qitbash
qit run:woo-api your-extension
```

Replace `your-extension` with your plugin’s slug. The tests will run in QIT’s cloud environment, and the CLI or Vendor Dashboard will display the results.

## Next steps

- [Woo E2E Tests](./woo-e2e.md): Validate essential storefront flows in addition to confirming API integrity.
- [Security Tests](./security.md): Ensure that your extension meets security and coding standards.
- [Notifications and Results](../using-qit/notifications-results.md): Learn how to stay informed about test outcomes and access detailed reports.
