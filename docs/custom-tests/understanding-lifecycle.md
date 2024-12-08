# Understanding the Lifecycle

Custom E2E tests in QIT follow a structured lifecycle to ensure consistency, isolation, and reproducibility. By understanding the order of operations, you can write more effective tests and leverage shared setups, teardowns, and database snapshots to streamline your workflows.

## Lifecycle Phases Overview

1. **Starting the Environment**  
   QIT provisions a test environment (WordPress, WooCommerce, PHP) based on your specified versions and configurations. It installs and activates plugins, including your extension, ensuring a clean slate for every run.

2. **Installing Additional Dependencies**  
   If your tests require extra NPM packages or custom dependencies, specify them in `dependencies.json`. QIT installs these before running any tests, ensuring your environment has all the tools you need.

3. **Shared Setup Phase**  
   Shared setup scripts, if present, run before any plugin’s isolated setup. Use this phase to:
    - Disable onboarding wizards or data consent forms common to all tests.
    - Mock external services or configure global settings that every test needs.

   Any changes here persist across all subsequent tests.

4. **Database Export**  
   QIT takes a snapshot of the database after the shared setup completes. This snapshot acts as a baseline, ensuring that each plugin test starts from the same state.

5. **Database Import (Per Plugin Test)**  
   For each plugin test, QIT restores the database snapshot taken after the shared setup. This guarantees that tests start from a consistent state, unaffected by previous tests.

6. **Isolated Setup Phase (Per Plugin)**  
   Each test can have an isolated setup—Playwright and shell scripts run here, installing themes, configuring WordPress settings, or adding test data unique to the plugin’s scenario.

   Changes made in isolated setup affect only that plugin test and do not carry over to others.

7. **Test Phase (Per Plugin)**  
   The actual test files (like example.spec.js) run now, navigating the WordPress site, interacting with WooCommerce flows, and verifying that your extension behaves as intended.

8. **Teardown Phase (Per Plugin)**  
   After each plugin’s tests complete, a corresponding teardown phase (if defined) cleans up any temporary data or configurations. It reverts the environment to a known state before moving on.

9. **Shared Teardown**  
   After all plugin tests finish, shared teardown scripts run to restore global conditions. Use this to remove mocks, revert global settings, or clean up resources created in the shared setup.

10. **Post-Processing and Reporting**  
    Once all tests are done, QIT compiles logs, screenshots, and results. These outputs are made available through the CLI, dashboard, or shareable URLs, helping you analyze outcomes and improve test quality.

## Files and Directories Involved

The `bootstrap` directory may contain:
- `setup.js` or `setup.sh`: Run before your tests.
- `shared-setup.js` or `shared-setup.sh`: Scripts that run before all tests in a compatibility scenario.
- `shared-teardown.js` or `shared-teardown.sh`: Run after all tests complete.
- `teardown.js` or `teardown.sh`: Clean up after your plugin’s individual tests.

This structure allows fine-grained control:
- **Shared Setup/Teardown:** Affects all tests in a compatibility test scenario.
- **Isolated Setup/Teardown:** Affects only individual plugin tests, ensuring that each plugin test scenario is isolated and reproducible.

Note: Different plugin actions (`test`, `bootstrap`, `activate`) influence whether plugins appear in shared phases, isolated phases, or neither. For a full explanation of these actions, see [Compatibility Testing with Custom E2E Tests](./compatibility-tests.md).

## Practical Tips

- **Use Shared Setup Wisely:** Common tasks (e.g., disabling onboarding wizards) belong in shared setup, so you don’t repeat them in every test.
- **Keep Tests Independent:** Rely on database snapshots to ensure each test runs in a controlled state. Avoid depending on changes made by previous tests.
- **Employ Teardown Scripts:** Clean up after tests to prevent side effects that might affect later runs or consume unnecessary resources.

## Next Steps

- [Orchestration](./orchestration): Learn how QIT manages multiple plugins and shared states within a single test run, ensuring that each plugin’s tests run in isolation while benefiting from shared setup and teardown steps.
- [Themes](./themes): Explore how to test with different themes or enforce a specific theme during setup phases.
- [Architecture & Security](./security-architecture): Discover how QIT enforces isolation, security, and reliability in custom E2E test runs.
- [QIT Helpers](./qit-helpers): Simplify test scripting by using built-in helpers for common tasks.

By mastering the lifecycle, you’ll write more predictable, maintainable, and reliable custom E2E tests. This ensures consistent results, faster debugging, and higher confidence in your extension’s compatibility and quality.
