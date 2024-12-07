# QIT Helpers

:::info
The custom E2E tests feature is available as early access.
:::

QIT provides a set of built-in helper functions to simplify common tasks in your custom E2E tests. These helpers eliminate the need to re-invent wheels, letting you focus on validating your extension's unique functionality rather than boilerplate setup steps.

## Why Use Helpers?

- **Less Boilerplate:** Quickly log in as an admin or run WP-CLI commands without manually writing those steps every time.
- **Consistent Operations:** Helpers ensure that tasks like user authentication or database manipulation are handled consistently, reducing flakiness and errors.
- **Faster Iteration:** Spend more time refining your test scenarios rather than dealing with repetitive, low-level details.

## Available Helpers

### Authentication Helpers

- `qit.loginAsAdmin(page)`:  
  Logs into wp-admin as an administrator user. Useful for tests that require administrative actions before running front-end scenarios.

- `qit.loginAs(page, "username", "password")`:  
  Logs in as a specific user, allowing you to test scenarios that depend on particular user roles or capabilities.

### WP-CLI Helpers

- `qit.wp("plugin list")`:  
  Runs a WP-CLI command directly in the PHP container, enabling you to manipulate the WordPress installation on-the-fly (e.g., installing a plugin or changing a setting).

### Reporting Helpers

- `qit.attachScreenshot("name", context, page, testInfo)`:  
  Attaches a screenshot to the test context, enabling better visual debugging in reports. Add optional contextual data to help trace issues.

### Environment Helpers

- `qit.getEnv("MY_ENV_VAR")`:  
  Retrieves an environment variable value, letting you pass sensitive data into your tests without hardcoding them.

- `qit.setEnv("MY_ENV_VAR", "my-value")`:  
  Sets environment variables dynamically, allowing you to adjust configurations or test conditions on the fly.

## Example Usage

Imagine a test that needs to install and activate a plugin via WP-CLI, then log in as admin and navigate to an admin page:

`import qit from '/qitHelpers';`

```javascript
test("My custom scenario", async ({ page, testInfo }) => {
    // Set environment variables if needed
    qit.setEnv("MY_PLUGIN_KEY", "abc123");

    // Install a plugin via WP-CLI
    await qit.wp("plugin install hello-dolly --activate");

    // Log in as admin to configure plugin settings
    await qit.loginAsAdmin(page);
    await page.goto("/wp-admin/admin.php?page=my-plugin-settings");

    // Attach a screenshot for debugging
    await qit.attachScreenshot("plugin-settings-page", { scenario: "initial-load" }, page, testInfo);

    // Perform test actions and assertions
    // ...
});
```

Adjusting the code to use relative URLs and environment variables ensures portability and flexibility. The helpers handle repetitive tasks, freeing you to focus on the scenario's logic.

## Best Practices

- **Use loginAsAdmin at the Start:** Keep authentication steps at the beginning of a test, so subsequent actions assume a stable, known state.
- **Prefer qit.wp Over Direct DB Access:** Rely on WP-CLI for database or configuration changes. It maintains WordPress standards and reduces the risk of introducing instability.
- **Leverage Screenshots and Env Variables:** Attach screenshots at key steps for visual confirmation. Use environment variables for sensitive data or toggling test modes without editing the test code itself.

## Next Steps

- [Understanding the Lifecycle](#): See how helpers fit into different lifecycle phases (e.g., setup, test, teardown).
- [Architecture & Security](#): Discover how QIT's underlying architecture supports secure and isolated test runs while using helpers.
- [Running Tests](#): Practice using helpers in both local and cloud test environments for rapid feedback and continuous integration.

By incorporating QIT Helpers into your E2E tests, you streamline the testing process, reduce duplication, and produce cleaner, more maintainable code. In turn, this leads to quicker iteration, better reliability, and increased confidence in your extension's quality.
