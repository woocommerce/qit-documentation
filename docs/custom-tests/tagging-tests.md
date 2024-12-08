# Tagging Tests

As you expand your suite of custom E2E tests, organizing and sharing them becomes increasingly important. Tagging tests allows you to categorize, upload, and run them by name, making it easier to manage complex compatibility checks, run targeted subsets of tests, and collaborate with other developers.

## Why Tag Tests?

- **Organization:** Categorize tests by feature, scenario, or complexity. For example, assign `checkout` to tests that focus on the cart and payment flow, or `compatibility` for those verifying your plugin alongside another.
- **Targeted Execution:** Instead of running all tests at once, run specific tags to focus on a particular area. This speeds up debugging and reduces noise.
- **Collaboration and Sharing:** Publish tagged tests to QIT so other developers can run them. This is especially useful for verifying compatibility across multiple plugins in the WooCommerce ecosystem.

## Listing Available Tags

To see which tags are currently available:
`qit tag:list`

This command lists all tags you have access to. You can also specify a plugin slug:
`qit tag:list example-plugin`

This helps you understand how tests are organized and which tagged sets you can leverage.

## Uploading Tests with a Tag

To upload your tests and make them available under a specific tag:
`qit tag:upload example-plugin:my-tag ./path/to/tests`

By default, uploading without specifying a tag uses `default`. Using `example-plugin:my-tag` creates or updates a custom tag that others (with appropriate access) can run later.

For instance:
- `example-plugin:default`
- `example-plugin:beta`
- `example-plugin:checkout-scenarios`

These tags help you and other team members quickly select the tests needed at any given moment.

## Running Test Tags

Once tests are tagged and uploaded, you can run them directly:
`qit run:e2e example-plugin my-tag`

Or even run multiple tags at once:
`qit run:e2e example-plugin default,rc`

This flexibility lets you compose test sets dynamically. For example, combine a stable scenario set (default) with a release candidate scenario (rc).

## Running Tests from Other Plugins

If another developer publishes their tests under a tag, you can integrate them:
`qit run:e2e example-plugin --plugin another-plugin:test`

This cross-plugin testing scenario is powerful for ensuring compatibility between multiple extensions. Combine tags from multiple sources to run a suite of tests that replicate complex, multi-extension environments.

## Multiple Tags

Comma-separate tags to combine multiple test sets:
`qit run:e2e example-plugin default,foo-feature --plugin another-plugin:rc,some-feature`

This command runs a combination of test sets from multiple plugins, ensuring you cover diverse scenarios at once.

## Deleting Test Tags

If you no longer need a certain tagged set:
`qit tag:delete example-plugin:my-tag`

This removes that tag from your listing, keeping your environment clean and reducing clutter.

## Next Steps

- [Running Tests](./running-tests.md): Learn more about executing tagged tests locally or in the QIT cloud environment.
- [Understanding the Lifecycle](./understanding-lifecycle.md): Delve into how tagging interacts with the shared setup, isolated setup, and teardown stages.
- [Publishing Tests](./tagging-tests.md): Explore advanced scenarios like publishing tests publicly or integrating with CI for ongoing quality assurance.