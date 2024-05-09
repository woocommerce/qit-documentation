# Tagging Tests

:::info
The Custom Tests feature is available as early-access.
:::

## Introduction

You can use test tags to run specific tests from a plugin/theme.

Each extension can have one or multiple test tags, and we also offer some generic tests that can be used by any plugin/theme.

## Listing available test tags

To list all the available test tags you can use:

```qitbash
qit tag:list
```

To list the test tags for a specific plugin/theme:

```qitbash
qit tag:list qit-beaver
```

## Uploading Tests

You can upload your tests and make them available as a tag with the command:

```qitbash
qit tag:upload qit-beaver /path/to/tests
```

By default, the test will be uploaded as the `default` tag.

If you want to specify a test tag, you can use the `--tag <tag-name>` flag:

```qitbash
qit tag:upload qit-beaver /path/to/tests --tag my-tag
```

## Running Test Tags

Now you can run your test both locally and in CI using the `default` tag:

```qitbash
qit run:e2e qit-beaver
```

Or, if it's a specific tag:

```qitbash
qit run:e2e qit-beaver:test:my-tag
```

## Running Test Tags from Other Plugins

Other developers that have access to your extension can also use your tests for compatibility testing.

Let's suppose that `qit-dog` has published their tests. You can run your tests and theirs with:

```qitbash
qit run:e2e qit-beaver --plugin qit-dog:test
```

## Running Multiple Tags

You can also compose multiple tags by passing a comma-separated list of test tags:

```qitbash
qit run:e2e qit-beaver:test:default,rc --plugin qit-dog:test:feature-dog-pictures
```

## Deleting Test Tags

You can delete test tags that you have previously published:

```qitbash
qit tag:delete qit-beaver:my-tag
```