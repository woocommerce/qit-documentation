# Running Tests from Other Plugins

:::info
The Custom Tests feature is available as early-access.
:::

## Introduction

You can run tests from other plugins that you have access to.

This is useful for compatibility testing, or to run tests that are not part of your plugin, such as getting cheap coverage for your own plugin by leveraging tests that are already written.

## Running a Test from Another Plugin

To run a test from another plugin, you can use the `--plugin` flag:

```qitbash
qit run:e2e qit-beaver --plugin cat-pictures
```

In this example, `qit-beaver` is the SUT (System-Under-Test), and `cat-pictures` is an additional plugin.

By default, the SUT always runs the bootstrap and test phases. The additional plugin only runs the bootstrap phase.

You can also run the test phase of the additional plugin by passing a flag:

```qitbash
qit run:e2e qit-beaver --plugin cat-pictures:test
```

Now the test phases of both plugins are run. This is useful for ensuring that your plugin does not break the expected behavior of other plugins.

## Discovering Available Tests

You can see all the test tags you have access to by running:

```qitbash
qit test-tags
```

This will print a table like this:

```
+-----------------------+---------------+--------+
| Slug                  | E2E Tests     | Type   |
+-----------------------+---------------+--------+
| qit-beaver            | default       | plugin |
| cat-pictures          | rc, default   | plugin |
+-----------------------+---------------+--------+
```

This table shows the available test tags for each plugin. You can use these tags to run specific tests.

## Compositing Tests

You can run multiple tests by passing a comma-separated list of tags:

```qitbash
qit run:e2e qit-beaver --plugin cat-pictures:test:rc,default
```