# Troubleshooting

When running tests with QIT, you may occasionally encounter errors, unexpected failures, or other issues. This guide provides tips for diagnosing and resolving common problems, ensuring you can get back to a smooth testing workflow quickly.

## Common issues

### 1. tests suddenly failing without changes

- **Check dependencies:** If your environment relies on external services, ensure they are accessible. A payment API might be down or a required binary might have been removed.
- **Review version changes:** If WordPress or WooCommerce released a new version, it may break assumptions in your tests. Run the test with a stable version (e.g., `qit run:e2e your-extension --wordpress_version=previous-stable`) to verify if the issue is version-specific.
- **Caching issues:** If using custom handlers with caching, confirm that the cached version of your plugin is not outdated or corrupted.

### 2. tests passing locally but failing in the cloud

- **Environment parity:** Verify that your local environment's PHP, WordPress, and plugin versions match the cloud environment. Use `--php_version`, `--wordpress_version`, and `--plugin` arguments or config files for consistency.
- **Network or integration issues:** Tests that rely on external APIs or webhooks might fail in the cloud if the tunnel is not set up or if access tokens differ between environments.
- **Excessive flakiness:** Consider adding retries, adjusting timeouts, or refining selectors in your tests. Flaky tests often fail under different conditions, like slower network speeds in the cloud.

### 3. errors in CLI output

- **Invalid slug or command:** Check extension slugs with `qit extensions`. Verify your command syntax (`qit run:activation your-extension`).
- **Missing authentication:** Ensure QIT is authenticated. If you see authentication errors, run `qit connect` again or verify QIT tokens.
- **Zips not validated:** If you're testing a local zip, run `qit woo:validate-zip <path>` to ensure it meets QIT's criteria.

### 4. tunnel and network issues

- **DNS delays:** Temporary tunnels may introduce DNS propagation times. Consider persistent tunnels for immediate resolution.
- **WSL not supported for tunneling:** If on Windows, use native macOS or Linux for tunneling, or consider a custom tunnel solution.
- **Check tunnel setup:** Run `qit tunnel:setup` or `qit tunnel:set-default` again if tunnels fail unexpectedly.

### 5. custom handlers or helpers not working

- **Check handler logic:** If a custom handler fails, add verbose logging or print statements. Ensure required binaries (git, npm) are installed and accessible.
- **Review security and auth:** If you rely on private repos, confirm SSH keys, tokens, or environment variables are correct.
- **Test step-by-step:** Try running individual steps (like `git clone`) outside QIT to ensure they work as expected.

## Debugging tools

- **Verbose mode:** Add `-v` or `-vv` to QIT commands for more detailed output. For example:
  ```bash
  qit run:e2e your-extension -vv
  ```
- **Allure reports:** For end-to-end test failures, review Allure reports to see screenshots, stack traces, and step-by-step failures.
- **WP-CLI inside container:** `qit env:enter` allows you to run WP-CLI commands directly in the test environment, letting you inspect plugins, themes, or database state.

## Best practices

- **Start small:** If a complex test is failing, reduce it to a simpler scenario. Add steps back until you find the cause.
- **Use config files and env vars:** Centralize configurations, and keep sensitive data or variable elements out of the code.
- **Isolate external factors:** Mock external services or use tunnels to ensure stable conditions.

## When to seek help

If you've tried the suggestions above and still encounter issues:
- **Check QIT GitHub issues:** There might be known issues or solutions posted by other developers.
- **Open a new issue:** Provide logs, details, and steps to reproduce. The QIT team or community may offer guidance.

## Next steps

- [Viewing Allure Reports](./viewing-allure-reports.md): Dive deeper into failure details.
- [Useful Commands](./useful-commands.md): Identify test runs, view logs, and retrieve reports efficiently.
- [Customizing Environments](../environment/introduction.md): Adjust versions, tunnels, and handlers to create a more stable and controlled testing environment.