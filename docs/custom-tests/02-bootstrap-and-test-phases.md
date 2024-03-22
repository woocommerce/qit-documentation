# Bootstrap and Test Phases

## Introduction

The Custom E2E Tests have two phases: the **Bootstrap Phase** and the **Test Phase**.

In the bootstrap phase, you will add any kind of setup logic that your plugin needs to run.

For instance, if your plugin connects to an external service, you can mock the responses, enable some kind of dev mode, or even set up staging credentials.

The test phase is where you will write the actual tests. This is where you will use Playwright to interact with the browser and assert that your plugin is working as expected.

If you run this command: `qit run:e2e qit-beaver-plugin --plugins cat-pictures`, the compatibility mode is "Default", which means it will:

- Spin up the environment
- Run the bootstrap phases of all the plugins
- **Run the test phase of `qit-beaver-plugin`**

If instead you run with compatibility mode full, `qiit run:e2e qit-beaver-plugin --plugins cat-pictures --compatibility_mode=full`, it will:

- Spin up the environment
- Run the bootstrap phases of all the plugins
- **Run the test phase of all plugins**

Essentially, when you run in with the default compatibility mode, you are asserting that your plugin continues to behave as expected
when other plugins are installed and configured in a site.

In "full" compatibility mode, you have the coverage above, plus you are asserting that your plugin does not break other plugins.

:::tip
When running with "full" compatibility mode, any flakiness in the tests of other plugins will cause your tests to fail.
:::

## Bootstrap Phase

The bootstrap phase is where you will add any kind of setup logic that your plugin needs to run.

You can have 3 types of bootstrap files:

### `bootstrap.sh`

This is a bash script that, if present, will be called. Here you can use `wp` (WP-CLI) and bash in general.

### `bootstrap.php`

This is a PHP file that, if present, will be called. WordPress is NOT loaded on the context of this file.

### `must-use-plugin.php`

This is a file that, if present, will be copied to the `wp-content/mu-plugins` directory and will run on ALL requests on the E2E test. WordPress is loaded on the context of this file.

If you want to put logic in there that should run only once, make sure to set a flag to prevent it from running multiple times.

### Where to put the files

You can put these files in the `bootstrap` directory of your custom E2E test, eg:

```
.
├── tests
│    └── qit
│        ├── bootstrap
│        │   ├── bootstrap.php
│        │   ├── bootstrap.sh
│        │   └── must-use-plugin.php
│        └── tests
│            └── first-test.spec.js
└── qit-the-beaver-plugin.php
```

## Test Phase

The Test Phase is where your actual E2E files are.

Right now, we support only Playwright tests, but we are also expecting to expand it to wp-browser E2E tests as well.
