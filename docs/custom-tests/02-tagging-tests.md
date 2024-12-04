# Tagging tests

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

You can publish your tests to QIT so that other developers can use it to run compatibility tests with their own extensions.

Similarly, you can run other developers' tests to ensure that your extension is compatible with theirs.

One plugin can have multiple test tags, which can be used to run different sets of tests.

## Listing available test tags

To list all the available test tags you can use:

```qitbash
qit tag:list
```

To list the test tags for a specific plugin/theme:

```qitbash
qit tag:list example-plugin
```

## Uploading tests

You can upload your tests and make them available as a tag with the command:

```qitbash
qit tag:upload example-plugin /path/to/tests
```

By default, the test will be uploaded as the `default` tag.

If you want to specify a test tag, you can add the tag in this format: `extension:tag`:

```qitbash
qit tag:upload example-plugin:my-tag /path/to/tests
```

## Running test tags

Now you can run your test both locally and in CI using the `default` tag:

```qitbash
qit run:e2e example-plugin
```

Or, if it's a specific tag:

```qitbash
qit run:e2e example-plugin my-tag
```

## Running test tags from other plugins

Other developers that have access to your extension can also use your tests for compatibility testing.

Let's suppose that `example-plugin-2` has published their tests. You can run your tests and theirs with:

```qitbash
qit run:e2e example-plugin --plugin example-plugin-2:test
```

## Running multiple tags

You can also compose multiple tags by passing a comma-separated list of test tags:

```qitbash
qit run:e2e example-plugin default,rc --plugin example-plugin-2:test:some-feature
```

## Deleting test tags

You can delete test tags that you have previously published:

```qitbash
qit tag:delete example-plugin:my-tag
```
