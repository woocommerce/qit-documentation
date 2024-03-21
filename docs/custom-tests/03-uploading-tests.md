# Uploading Tests

## Introduction

To upload tests, you will need to have a directory with the following structure:

- `tests` directory, with at least one Playwright test

Optionally, you can also have a `bootstrap` directory with the following files:

- `bootstrap.sh`
- `bootstrap.php`
- `must-use-plugin.php`

You can have other files and directories if you want, such as data files, but the ones listed above are the ones that QIT will look for.

## Uploading Tests

Just run `qit upload:test <plugin-slug> <path-to-test-directory>` and your tests will be uploaded to the QIT server.

## Example

Let's say you have a test for the `qit-the-beaver-plugin` plugin and it's located in the `tests` directory of your project. You can upload it with the following command:

```bash
qit upload:test qit-the-beaver-plugin tests
```

## Using the Uploaded Tests

To use the uploaded tests, just run `qit run:e2e <plugin-slug>`. QIT will download the tests from the server and run them.

These tests will also be used for other plugins that install your plugin for compatibility testing, eg:

`qit run:e2e cat-pictures --plugins qit-the-beaver-plugin`

This will run `cat-pictures` E2E tests, and will install `qit-the-beaver-plugin` and bootstrap it.

Alternatively, they could run with `--compatibility="full"` and also run the tests of `qit-the-beaver-plugin` and any other plugin that is installed and have custom tests in QIT.