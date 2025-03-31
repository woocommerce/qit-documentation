# Group Tests

Group tests allow you to organize and execute multiple test runs together, either as a logical group or as a batch. This feature is particularly useful when you need to run multiple tests in sequence or want to organize related tests together.

## Overview

Group tests work with all test types, but there's an important distinction in how they're executed:

- **Local Tests (E2E and Activation):** Run on your local machine using the QIT CLI.
- **Remote Tests (all other test types):** Run on QIT's infrastructure.

## Basic workflow

1. **Add tests to a group** using the `--group` flag
2. **Register the group** (optional) with a custom identifier
3. **Run the group** to execute all tests

## Adding tests to a group

To add a test to a group, simply append the `--group` flag to any test command:

```qitbash
qit run:activation your-extension --group
```

You can add multiple tests to the same group:

```qitbash
qit run:activation your-extension --group --extension_set compatibility
qit run:security your-extension --group
```

## Registering a group

While optional, registering a group with a custom identifier helps you track and reference it later:

```qitbash
qit group:register --group-identifier commit-1234567890
```

## Running a group

You can run a group in two ways:

1. **Run without registration:**
```qitbash
qit group:run
```

2. **Run with a specific group identifier:**
```qitbash
qit group:run --group-identifier commit-1234567890
```

When you run a group:
- Remote tests are triggered on QIT's infrastructure
- Local tests (E2E and Activation) run sequentially on your machine
- No additional input is required once the group starts running

## Batch mode

If you want to run tests without grouping them logically, use the `--skip-grouping` flag:

```qitbash
qit group:run --skip-grouping
```

This will execute the tests without maintaining the group relationship between them.

## Managing groups

### View current group

To see the currently stored group:

```qitbash
qit group:show
```

### Fetch a specific group

To retrieve a specific group from remote:

```qitbash
qit group:fetch --group-identifier commit-1234567890
```

### Clear the current group

To remove the current group:

```qitbash
qit group:clear
```

## Important note

- **Duplicate prevention:** If a test with identical parameters is already in the group, it won't be added again

## Example workflow

Here's a complete example of using group tests:

```qitbash
# Add tests to the group
qit run:activation your-extension --group --extension_set compatibility
qit run:security your-extension --group

# Register the group with an identifier
qit group:register --group-identifier commit-1234567890

# Run the group
qit group:run
```

The manager will respond with:
```
Group enqueued on QIT servers!
Group ID: <id>
Group Identifier: commit-1234567890
--------------------------------
Test Run ID: <test_run_id>
Test Type: Activation
Test Results Manager URL: <url>
-------------------------------
Test Run ID: <test_run_id>
Test Type: Security
Test Results Manager URL: <url>
```

## Best practices

- Use meaningful group identifiers that help you track related tests.
- Clear groups when you're done to prevent accidental test runs.


