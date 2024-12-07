# Troubleshooting

When running tests with QIT, you may occasionally encounter errors, unexpected failures, or other issues. This guide provides tips for diagnosing and resolving common problems, ensuring you can get back to a smooth testing workflow quickly.

## Common Issues

### 1. Tests Suddenly Failing Without Changes

- **Check Dependencies:** If your environment relies on external services, ensure they are accessible. A payment API might be down or a required binary might have been removed.
- **Review Version Changes:** If WordPress or WooCommerce released a new version, it may break assumptions in your tests. Run the test with a stable version (e.g., `qit run:e2e your-extension --wordpress_version=previous-stable`) to verify if the issue is version-specific.
- **Caching Issues:** If using custom handlers with caching, confirm that the cached version of your plugin is not outdated or corrupted.

### 2. Tests Passing Locally but Failing in the Cloud

- **Environment Parity:** Verify that your local environment's PHP, WordPress, and plugin versions match the cloud environment. Use `--php_version`, `--wordpress_version`, and `--plugin` arguments or config files for consistency.
- **Network or Integration Issues:** Tests that rely on external APIs or webhooks might fail in the cloud if the tunnel is not set up or if access tokens differ between environments.
- **Excessive Flakiness:** Consider adding retries, adjusting timeouts, or refining selectors in your tests. Flaky tests often fail under different conditions, like slower network speeds in the cloud.

### 3. Errors in CLI Output

- **Invalid Slug or Command:** Check extension slugs with `qit extensions`. Verify your command syntax (`qit run:activation your-extension`).
- **Missing Authentication:** Ensure QIT is authenticated. If you see authentication errors, run `qit connect` again or verify QIT tokens.
- **Zips Not Validated:** If you're testing a local zip, run `qit woo:validate-zip <path>` to ensure it meets QIT's criteria.

### 4. Tunnel and Network Issues

- **DNS Delays:** Temporary tunnels may introduce DNS propagation times. Consider persistent tunnels for immediate resolution.
- **WSL Not Supported for Tunneling:** If on Windows, use native macOS or Linux for tunneling, or consider a custom tunnel solution.
- **Check Tunnel Setup:** Run `qit tunnel:setup` or `qit tunnel:set-default` again if tunnels fail unexpectedly.

### 5. Custom Handlers or Helpers Not Working

- **Check Handler Logic:** If a custom handler fails, add verbose logging or print statements. Ensure required binaries (git, npm) are installed and accessible.
- **Review Security and Auth:** If you rely on private repos, confirm SSH keys, tokens, or environment variables are correct.
- **Test Step-by-Step:** Try running individual steps (like `git clone`) outside QIT to ensure they work as expected.

## Debugging Tools

- **Verbose Mode:** Add `-v` or `-vv` to QIT commands for more detailed output. For example:
  ```bash
  qit run:e2e your-extension -vv
  ```
- **Allure Reports:** For end-to-end test failures, review Allure reports to see screenshots, stack traces, and step-by-step failures.
- **WP-CLI Inside Container:** `qit env:enter` allows you to run WP-CLI commands directly in the test environment, letting you inspect plugins, themes, or database state.

## Best Practices

- **Start Small:** If a complex test is failing, reduce it to a simpler scenario. Add steps back until you find the cause.
- **Use Config Files and Env Vars:** Centralize configurations, and keep sensitive data or variable elements out of the code.
- **Isolate External Factors:** Mock external services or use tunnels to ensure stable conditions.

## When to Seek Help

If you've tried the suggestions above and still encounter issues:
- **Check QIT GitHub Issues:** There might be known issues or solutions posted by other developers.
- **Open a New Issue:** Provide logs, details, and steps to reproduce. The QIT team or community may offer guidance.

## Next Steps

- [Viewing Allure Reports](#): Dive deeper into failure details.
- [Useful Commands](#): Identify test runs, view logs, and retrieve reports efficiently.
- [Customizing Environments](#): Adjust versions, tunnels, and handlers to create a more stable and controlled testing environment.

By following these troubleshooting steps, you can quickly isolate problems, refine your tests, and maintain a stable and productive development workflow.