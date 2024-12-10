# Compatibility testing with custom E2E tests

In addition to testing individual extensions, QIT supports complex **compatibility testing** scenarios involving multiple plugins. By carefully assigning `action` values (`test`, `bootstrap`, or `activate`) to each plugin and leveraging QIT’s lifecycle phases (shared and isolated setups/teardowns, DB export/import), you can confirm that your extension works smoothly in a multi-plugin environment. This approach ensures stable and reliable experiences for merchants running diverse sets of plugins.

## Key concepts

When including multiple plugins in a single test run, their actions determine which lifecycle phases they participate in. QIT’s lifecycle phases include:

- **Shared setup/teardown:** Runs once before/after **all** plugins. Establishes a global baseline (shared setup), then cleans up globally at the end (shared teardown). After shared setup finishes, QIT exports a DB snapshot that serves as the starting point for any plugin’s isolated testing.
- **Isolated setup/teardown (per plugin):** If a plugin is tested (`action: test`), it receives its own isolated phases and tests. Before its isolated setup runs, QIT imports the baseline DB snapshot, ensuring a consistent state. After its tests complete, isolated teardown returns the environment to the baseline, preventing side effects from carrying over.
- **Test phase (per plugin):** For `action: test` plugins, QIT runs the actual E2E tests in this phase.

**Actions:**

1. **`test` (SUT or Additional Plugins):**
   - **Shared setup/teardown:** This plugin participates fully, meaning QIT runs shared setup and teardown steps specifically for it (you’ll see `setup:shared` and `teardown:shared` entries in the logs for this plugin).
   - **Isolated setup/teardown:** The plugin also gets isolated phases. Each time it’s tested, QIT imports the baseline DB, runs isolated setup, executes its tests, then isolated teardown restores the environment.
   - **Test phase:** The plugin runs its own tests, just like the SUT. This is a full participation mode, suitable for plugins you want to thoroughly validate.

2. **`bootstrap`:**
   - **Shared setup/teardown:** A `bootstrap` plugin is included in shared setup and teardown. You’ll see `setup:shared` and `teardown:shared` steps for it, just as you do for `test` plugins. However, it does **not** get isolated phases or run its own tests.
   - **No isolated or test phase:** The `bootstrap` plugin is active throughout the entire run and benefits from the global conditions set by shared setup, but it never undergoes isolated setup/teardown nor does it run tests. This mode is ideal for plugins that need to be present (e.g., to provide certain functionalities or conditions) but don’t require direct testing.

3. **`activate`:**
   - **Activated only:** A plugin with `action: activate` is simply activated and remains active throughout the run. It does **not** participate in shared setup/teardown steps individually (no `setup:shared` or `teardown:shared` lines in the logs for this plugin), nor does it have isolated phases or a test phase.
   - **Background presence:** Use `activate` for plugins that must be present in the environment but don’t need configuration or test validations. They influence conditions passively.

**Summary of Differences:**

| Action      | Shared Setup/Teardown | Isolated Setup/Teardown | Test Phase | Presence in Logs |
|-------------|-----------------------|-------------------------|------------|------------------|
| `test`      | Yes (own shared steps)| Yes (own isolated steps)| Yes        | Fully logged with all phases |
| `bootstrap` | Yes (own shared steps)| No                      | No         | Logged for shared steps, no isolated or test logs |
| `activate`  | No (no own shared steps)| No                    | No         | Simply present, no distinct shared/isolated logs |

This detailed breakdown clarifies the subtle but important distinctions between `test`, `bootstrap`, and `activate`.

## Lifecycle management for compatibility

- **Shared setup/teardown:** Establishes a global baseline. All `test` and `bootstrap` plugins appear here with their own shared steps. `activate` plugins do not have dedicated shared steps but remain active in the background.
- **DB export/import:** After shared setup, QIT exports a baseline DB snapshot. Each `test` plugin’s isolated testing cycle begins with this snapshot, ensuring consistent conditions.
- **Isolated phases:** Only `test` plugins (including the SUT) get isolated setup/teardown and tests. `bootstrap` and `activate` plugins remain stable in the background, influencing but not altering the snapshot cycle.

## Example scenario

**Scenario:**
- **SUT:** `woocommerce-amazon-s3-storage` (`action: test`)
- **Additional plugin 1:** `woocommerce-progressive-discounts` (`action: test`)
- **Additional plugin 2:** `woocommerce-extra-plugin` (`action: activate`)
- **Dependencies:** Handled automatically via `--dependencies=bootstrap`

Your `qit.yml` might be:

```yaml
plugins:
woocommerce-amazon-s3-storage:
source: ./woocommerce-amazon-s3-storage
test_tags:
- ./woocommerce-amazon-s3-storage-tests
woocommerce-progressive-discounts:
action: test
source: ./woocommerce-progressive-discounts
test_tags:
- ./woocommerce-progressive-discounts-tests
woocommerce-extra-plugin:
action: activate
source: ./woocommerce-extra-plugin
```

**Running the Test:**

```qitbash
qit run:e2e woocommerce-amazon-s3-storage
```

**What Happens Internally:**

1. **Shared Setup/Teardown:**  
   The SUT and `woocommerce-progressive-discounts` (both `test`) receive shared steps logged specifically for them. `woocommerce-extra-plugin` is active but does not have its own shared steps.

2. **DB Export:**  
   After shared setup, QIT exports a baseline DB snapshot.

3. **SUT Isolated Phases (`action: test`):**  
   QIT imports the baseline snapshot, runs isolated setup, tests, and isolated teardown for the SUT. `woocommerce-extra-plugin` remains active but does not have isolated steps. `woocommerce-progressive-discounts` waits its turn.

4. **Next Tested Plugin (`action: test`):**  
   QIT imports the baseline snapshot again for `woocommerce-progressive-discounts`. It undergoes isolated setup, runs tests, and isolated teardown, just like the SUT did. The presence of `woocommerce-extra-plugin` continues unchanged in the background.

5. **Shared Teardown:**  
   After all `test` plugins complete, QIT runs shared teardown steps to clean up the global environment.

If a compatibility issue arises only when all three plugins are present—some tested (`test`), some just present (`activate`), and dependencies `bootstrap`ed—you’ll catch it before release. You can adjust code or tests and re-run to confirm the fix.

## When to add more detail

For more intricate scenarios (multiple `test` plugins, advanced dependencies, intricate states):
- **Dedicated configs:** Maintain separate qit.yml or test tags for multi-plugin scenarios.
- **Enhanced lifecycle scripts:** Add custom shell/JS steps in shared/isolated phases to fine-tune conditions.
