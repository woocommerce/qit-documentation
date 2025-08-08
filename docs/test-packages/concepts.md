# Core Concepts

## Package-Based Architecture

Test Packages represent a fundamental shift in how tests are organized and executed. Instead of loose collections of test files, everything is a package with explicit dependencies, phases, and results.

## Package Types

### Test Packages
A Test Package is one that executes tests. It's identified by having a `run` phase in its manifest.

**Characteristics:**
- Contains Playwright E2E test code
- Produces test results in CTRF format
- Generates artifacts (screenshots, logs, videos)
- Must declare where results will be found

**Use for:**
- E2E test suites
- Integration tests
- Smoke tests
- Regression tests

### Utility Packages
A Utility Package provides supporting functionality without running tests. It has no `run` phase.

**Characteristics:**
- Sets up test environments
- Seeds test data
- Configures WordPress/WooCommerce
- Cleans up after test runs

**Use for:**
- Disabling onboarding wizards
- Creating test users
- Installing helper plugins
- Database seeding

## The Manifest

Every package has a `manifest.json` that serves as its contract with the system. The manifest declares:

- **Identity**: Package name and namespace
- **Requirements**: What the package needs to run
- **Phases**: What commands to execute when
- **Results**: Where to find test output (test packages only)

## Lifecycle Phases

Phases define when commands execute in the test lifecycle:

### globalSetup
Runs **once** before all packages. Changes made here affect the entire test run.

### setup
Runs before **this package's** tests. Package-specific preparation.

### run
The actual test execution. Only test packages have this phase.

### teardown
Cleanup after **this package**. Package-specific cleanup.

### globalTeardown
Runs **once** after all packages. Final cleanup for the entire test run.

## Database Isolation

QIT ensures complete isolation between packages through database snapshots:

1. After `globalSetup`, a baseline snapshot is taken
2. Before each package (except the first), the database is restored
3. Each package starts from the exact same state
4. Changes made by one package never affect another

This means you can:
- Write tests without worrying about cleanup
- Run packages in any order (though order still matters for other reasons)
- Debug with confidence knowing the starting state

## Result Collection

Test packages must produce results in CTRF (Common Test Results Format):

```json
{
  "results": {
    "summary": {
      "tests": 10,
      "passed": 8,
      "failed": 2
    },
    "tests": [
      {
        "name": "Checkout flow",
        "status": "passed",
        "duration": 1234
      }
    ]
  }
}
```

Additionally, packages can produce:
- **Blob artifacts**: Screenshots, videos, logs
- **Allure results**: Advanced test reporting

## Secret Management

Secrets provide a secure way to handle sensitive data:

1. **Declaration**: Packages declare required secrets in their manifest
2. **Validation**: All secrets are validated before any execution
3. **Injection**: Secrets are passed as environment variables
4. **Redaction**: Secret values are automatically redacted from all output

## Orchestration

The orchestrator manages the entire execution flow:

- **Visual feedback**: Shows progress through a CLI UI
- **Lifecycle CTRF**: Generates test results for setup/teardown phases
- **Output management**: Handles output suppression in CI
- **Error handling**: Captures and reports failures at any phase

## Command Execution

Commands in phases can be:
- Shell commands: `mkdir -p results`
- WP-CLI commands: `wp plugin install`
- NPM scripts: `npm test`
- Custom scripts: `./scripts/setup.sh`

Commands execute in the package directory and have access to:
- Environment variables
- Declared secrets
- Package files
- QIT-provided variables

## Configuration

A configuration file ties everything together:

```json
{
  "test_packages": [
    "./packages/utilities/setup",
    "./packages/tests/checkout",
    "./packages/tests/payment"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest"
  }
}
```

This defines:
- Which packages to run
- The order of execution
- Environment specifications

## Exit Codes

QIT uses consistent exit codes:

- **0**: Success - all tests passed
- **1**: Failure - test failures or configuration errors
- **3**: Infrastructure - Docker or network issues

## CI Mode

When `CI` environment variable is set:
- Command output is suppressed (unless verbose)
- Only essential information is shown
- Errors are always visible
- Cleaner logs for CI systems

## Key Principles

1. **Fail Fast**: Validation happens early
2. **Isolation by Default**: Packages can't interfere
3. **Explicit Over Implicit**: Everything is declared
4. **Deterministic**: Same input = same execution
5. **Observable**: See what's happening at each step