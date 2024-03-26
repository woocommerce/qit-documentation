# Uploading Tests

:::info
The Custom Tests feature is coming soon.
:::

## Introduction

To upload tests, you will need to have a directory with the following structure:

- `tests` directory, with at least one Playwright test

Optionally, you can also have a `bootstrap` directory with the following files:

- `bootstrap.sh`
- `bootstrap.php`
- `must-use-plugin.php`

You can have other files and directories if you want, such as data files, but the ones listed above are the ones that QIT will look for.

## Uploading Tests

```qitbash
qit upload:test <plugin-slug> <path-to-test-directory>
```

Just run this and your tests will be uploaded to the QIT server.

## Example

Let's say you have a test for the `qit-the-beaver-plugin` plugin and it's located in the `tests` directory of your project. You can upload it with the following command:

```qitbash
qit upload:test qit-the-beaver-plugin /path-to/tests
```

## Using the Uploaded Tests

To use the uploaded tests, just run `qit run:e2e <plugin-slug>`. QIT will download the tests from the server and run them.

These tests can also be used by other plugins for compatibility testing, eg:

```qitbash
qit run:e2e cat-pictures --plugins qit-the-beaver-plugin
```

When the maker of `cat-pictures` runs an E2E test with `qit-the-beaver` as an additional plugin, we will install `qit-the-beaver-plugin` and bootstrap it.

Alternatively, they could run with `--compatibility="full"` and not only bootstrap `qit-the-beaver-plugin`, but also run its "tests" phase, for a more in-depth compatibility testing.