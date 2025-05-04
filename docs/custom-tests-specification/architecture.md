# Architecture

#### Understand how QIT runs Custom E2E Tests

### Single Plugin

QIT can run a single plugin in a disposable environment. This is useful for testing a plugin in isolation.

```mermaid
sequenceDiagram
    participant QIT
    participant TestEnvironment

    activate QIT

    %% --- Environment Setup ---
    Note over QIT,TestEnvironment: Environment Setup Phase
    QIT->>TestEnvironment: 1. Create Environment
    activate TestEnvironment
    Note right of TestEnvironment: Creates a disposable, dockerized environment.<br>Installs WordPress, PHP<br>and the plugin under test.

    QIT->>TestEnvironment: 2. Run Shared Setup (if defined)
    Note right of TestEnvironment: Executes `lifecycle.sharedSetup` script<br>if defined in plugin-a's qit-e2e.json.
    %% DB Snapshot/Import steps are omitted for single-plugin tests

    %% --- Test Execution for plugin-a ---
    Note over QIT,TestEnvironment: Executing tests for plugin-a
    QIT->>TestEnvironment: 3. Run Plugin A Setup (`lifecycle.setup` in plugin-a's qit-e2e.json)
    QIT->>TestEnvironment: 4. Run Plugin A E2E test (`test_command` in plugin-a's qit-e2e.json)
    activate TestEnvironment # LightSkyBlue
    Note right of TestEnvironment: (Runs plugin-a E2E Tests)
    deactivate TestEnvironment # LightSkyBlue
    QIT->>TestEnvironment: 5. Run Plugin A Teardown (`lifecycle.teardown` in plugin-a's qit-e2e.json)
    QIT->>TestEnvironment: 6. Collect Results for plugin-a (From plugin-a's `test_results` paths)
    TestEnvironment-->>QIT: (Raw results & logs for plugin-a)

    %% --- Teardown Phase ---
    Note over QIT,TestEnvironment: Teardown Phase
    QIT->>TestEnvironment: 7. Run Shared Teardown (if defined)
    Note right of TestEnvironment: Executes `lifecycle.sharedTeardown` script<br>if defined in plugin-a's qit-e2e.json.

    %% --- Result Processing & Reporting ---
    Note over QIT,TestEnvironment: Result Processing & Reporting Phase
    QIT->>QIT: 8. Process Results
    Note right of QIT: Processes results from plugin-a,<br>captures logs, and prepares the final report.

    QIT->>TestEnvironment: 9. Destroy Environment
    deactivate TestEnvironment

    Note over QIT: Show Final Status & Report URL
    deactivate QIT
```

### Multiple Plugins

QIT can run multiple plugins in a single environment. This is useful for testing compatibility between plugins or themes.

When running in a multi-plugin environment, QIT will create a single environment and run the tests for each plugin in sequence, restoring a snapshot of the database state between each plugin's tests. This ensures that each plugin's tests run in a clean environment, without any interference from the other plugins.

```mermaid
sequenceDiagram
    participant QIT
    participant TestEnvironment

    activate QIT

    %% --- Environment Setup ---
    Note over QIT,TestEnvironment: Environment Setup Phase
    QIT->>TestEnvironment: 1. Create Environment
    activate TestEnvironment
    Note right of TestEnvironment: Creates a disposable, dockerized environment.<br>Installs WordPress, PHP<br>AND specified plugins (plugin-a, plugin-b, plugin-c)<br>based on CLI options / qit-env.json.

    QIT->>TestEnvironment: 2. Run Shared Setup (if defined)
    Note right of TestEnvironment: Executes combined `lifecycle.sharedSetup` scripts<br>from relevant plugins (e.g., plugin-a, plugin-b, plugin-c if defined in qit-e2e.json).

    QIT->>TestEnvironment: 3. Snapshot Initial Database State
    Note right of TestEnvironment: Saves the DB state after shared setup.

    %% --- Test Execution for plugin-a ---
    Note over QIT,TestEnvironment: Executing tests for plugin-a
    QIT->>TestEnvironment: Import Initial Database State
    Note right of TestEnvironment: Resets DB to the state saved after Shared Setup.
    QIT->>TestEnvironment: Run Plugin-Specific Setup (plugin-a's `lifecycle.setup`)
    QIT->>TestEnvironment: Run Plugin's Test Command (plugin-a's `test.command`)
    activate TestEnvironment # LightSkyBlue
    Note right of TestEnvironment: (plugin-a Test Execution...)
    deactivate TestEnvironment # LightSkyBlue
    QIT->>TestEnvironment: Run Plugin-Specific Teardown (plugin-a's `lifecycle.teardown`)
    QIT->>TestEnvironment: Collect Results for plugin-a (From plugin-a's `test.results` paths)
    TestEnvironment-->>QIT: (Raw results & logs for plugin-a)

    %% --- Test Execution for plugin-b ---
    Note over QIT,TestEnvironment: Executing tests for plugin-b
    QIT->>TestEnvironment: Import Initial Database State
    Note right of TestEnvironment: Resets DB to the state saved after Shared Setup.
    QIT->>TestEnvironment: Run Plugin-Specific Setup (plugin-b's `lifecycle.setup`)
    QIT->>TestEnvironment: Run Plugin's Test Command (plugin-b's `test.command`)
    activate TestEnvironment # LightSkyBlue
    Note right of TestEnvironment: (plugin-b Test Execution...)
    deactivate TestEnvironment # LightSkyBlue
    QIT->>TestEnvironment: Run Plugin-Specific Teardown (plugin-b's `lifecycle.teardown`)
    QIT->>TestEnvironment: Collect Results for plugin-b (From plugin-b's `test.results` paths)
    TestEnvironment-->>QIT: (Raw results & logs for plugin-b)

    %% --- Test Execution for plugin-c ---
    Note over QIT,TestEnvironment: Executing tests for plugin-c
    QIT->>TestEnvironment: Import Initial Database State
    Note right of TestEnvironment: Resets DB to the state saved after Shared Setup.
    QIT->>TestEnvironment: Run Plugin-Specific Setup (plugin-c's `lifecycle.setup`)
    QIT->>TestEnvironment: Run Plugin's Test Command (plugin-c's `test.command`)
    activate TestEnvironment # LightSkyBlue
    Note right of TestEnvironment: (plugin-c Test Execution...)
    deactivate TestEnvironment # LightSkyBlue
    QIT->>TestEnvironment: Run Plugin-Specific Teardown (plugin-c's `lifecycle.teardown`)
    QIT->>TestEnvironment: Collect Results for plugin-c (From plugin-c's `test.results` paths)
    TestEnvironment-->>QIT: (Raw results & logs for plugin-c)

    %% --- Final Steps ---
    Note over QIT,TestEnvironment: Teardown Phase
    QIT->>TestEnvironment: 4. Run Shared Teardown (if defined)
    Note right of TestEnvironment: Executes combined `lifecycle.sharedTeardown` scripts<br>from relevant plugins (e.g., plugin-a, plugin-b, plugin-c if defined in qit-e2e.json).

    %% --- Result Processing & Reporting ---
    Note over QIT,TestEnvironment: Result Processing & Reporting Phase
    QIT->>QIT: 5. Process & Merge All Results
    Note right of QIT: Combines results from plugin-a, plugin-b, plugin-c,<br>captures logs, and prepares the final report.

    QIT->>TestEnvironment: 6. Destroy Environment
    deactivate TestEnvironment

    Note over QIT: Show Final Status & Report URL
    deactivate QIT
```
