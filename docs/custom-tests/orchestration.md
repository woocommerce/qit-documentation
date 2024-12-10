# Orchestration

:::info
This page assumes you’re already familiar with the basics covered in [Understanding the Lifecycle](./understanding-lifecycle).
:::

When working on complex E2E testing scenarios—especially those that involve testing multiple plugins together—there’s a layer of complexity beyond the basic lifecycle. This layer is what we call **Orchestration**.

Orchestration manages the order and context in which tests for multiple plugins are executed within a single run. It ensures that:

- **Shared states are applied once:** Steps needed by all plugins under test (e.g., disabling onboarding wizards, applying global settings) occur in a shared setup phase.
- **Isolated states remain independent:** Each plugin’s tests run with a clean, predictable baseline, ensuring no plugin’s tests interfere with another’s state.
- **Consistent test runs:** By carefully restoring database snapshots and running isolated setup/teardown phases per plugin, orchestration guarantees repeatable results for compatibility tests.

## Key concepts

### Shared vs. isolated

- **Shared setup/teardown:** Executed once before and after *all* plugins’ tests run. This phase is ideal for establishing a global baseline, such as turning off onboarding screens or applying universal configurations.

- **Isolated setup/teardown:** Executed before and after *each plugin’s individual tests*. This ensures that when one plugin’s tests start, they do so from a known, standardized database state. When these tests finish, their changes are undone, leaving the environment ready for the next plugin.

### Database snapshots

Orchestration relies heavily on taking database snapshots after the shared setup is complete. For each plugin’s isolated test run, QIT imports this snapshot, ensuring that every plugin’s tests start from the same initial conditions.

### Per-plugin sequencing

A typical orchestrated run might look like this:

1. **Shared Setup:**  
   Runs once, preparing global conditions. Results are saved in a DB snapshot.

2. **For Each Plugin:**
    - **DB import:** Restore the saved snapshot, ensuring a consistent baseline.
    - **Isolated setup:** Configure the environment uniquely for that plugin’s tests—activate a feature flag, set an option, or install a particular theme.
    - **Test execution:** Run the plugin’s tests.
    - **Isolated teardown:** Clean up after the tests (e.g., remove temp data, revert plugin-specific settings).

3. **Shared Teardown:**  
   Once all plugins have been tested, run shared teardown steps. This phase cleans up any global state introduced during the shared setup, ensuring no residual side effects remain.

### Understanding vs. orchestration

- **Understanding the lifecycle:** Focuses on what happens during a single test run—shared setup, isolated setup, tests, teardown—primarily considering one plugin at a time.

- **Orchestration:** Introduces multiple plugins and manages their runs within the same environment. It ensures that each plugin’s tests remain isolated from each other while still allowing shared phases to run once at the start and end.

## Example use case

Imagine running compatibility tests between two plugins: **Plugin A** and **Plugin B**. Both need the same initial conditions—like disabling Woo onboarding—and both must run on a clean database.

1. **Shared Setup:**
    - Disable WooCommerce onboarding once.
    - Set a global store option for testing.

2. **Snapshot Database:**  
   Save the DB state after shared setup.

3. **Isolated Setup for Plugin A:**
    - Import the snapshot, ensuring baseline conditions.
    - Install and activate Plugin A’s dependencies.
    - Run Plugin A’s isolated setup scripts.

   **Run Plugin A’s Tests.**

   **Isolated Teardown for Plugin A:**
    - Remove temp data and revert Plugin A’s changes.

4. **Isolated Setup for Plugin B:**
    - Import the snapshot again, resetting the environment.
    - Install and activate Plugin B’s dependencies.
    - Run Plugin B’s isolated setup scripts.

   **Run Plugin B’s Tests.**

   **Isolated Teardown for Plugin B:**
    - Remove temp data and revert Plugin B’s changes.

5. **Shared Teardown:**
    - Cleanup any global mocks or settings applied in the shared setup.

Orchestration handles multiple plugins with different actions. If you need to recall how `test`, `bootstrap`, and `activate` differ in their lifecycle participation, revisit [Compatibility Testing with Custom E2E Tests](./compatibility-tests.md).
