import CustomTestsDiagram from '@site/src/img/custom-tests-diagram.png';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Bootstrap and Test Phases

:::info
The Custom Tests feature is coming soon.
:::

## Introduction

The E2E Tests have three key parts: the **Bootstrap Phase**, the **Entrypoint**, and the **Test Phase**.

This is the flow of execution:

<img src={CustomTestsDiagram}/>

## The Bootstrap Phase

In this phase, set up everything your tests needs, and do the initial setup of your plugin.

If you plugin has an onboarding wizard, this is where you need to configure it so that it doesn't show up anymore. Get rid of any data consent forms, or any other setup that needs to be done before the tests run.

If your plugin integrates with an external service, here's where you can configure mock responses, enable a development mode or anything else you need.

If your tests expects a specific theme to be active, you **install** them in this step so that they are available on your Test Phase, and you **activate it** in the beginning of your Test Phase eg:

**bootstrap.sh**

```bash
# Install Storefront Theme so that we can activate it on our Test phase.
wp theme install storefront
```

### `bootstrap.sh`

This is a bash script that, if present, will be called. Here you can use `wp` (WP-CLI) and bash in general.

### `bootstrap.php`

This is a PHP file that, if present, will be called. WordPress is NOT loaded on the context of this file.

### `must-use-plugin.php`

This is a file that, if present, will be copied to the `wp-content/mu-plugins` directory and will run on ALL requests on the E2E test. WordPress is loaded on the context of this file.

If you want to put logic in there that should run only once, make sure to set a flag to prevent it from running multiple times.

### Where to Put the Bootstrap Files

Place them in the bootstrap directory within your E2E test suite. Here’s how your directory structure should look:

```
bootstrap             (Optional)
  bootstrap.php       (Optional)
  bootstrap.sh        (Optional)
  must-use-plugin.php (Optional)
entrypoint.qit.js     (Optional)
example.spec.js
```

**You can put the tests anywhere you want**, even outside the plugin structure. Just for example purposes, here's what a typical directory structure could look like, using the `qit-beaver` plugin as an example:

```
.
├── tests                            # Test files directory
│    └── e2e                         # End-to-end test suite
│        ├── bootstrap               # Bootstrap files for setting up tests
│        │   ├── bootstrap.php       
│        │   ├── bootstrap.sh        
│        │   └── must-use-plugin.php
│        ├── entrypoint.qit.js       # The Test Phase entrypoint 
│        └── example.spec.js         # E2E test file
├── src                              # QIT Beaver Source code
└── qit-beaver.php                   # Main plugin file
```

## The Entrypoint

The `entrypoint.spec.js` is a file that, if present, will be called when your **Test Phase** starts. This is a good place to put any setup logic, such as **activating** a theme that you have previously **installed** in the Bootstrap Phase.

## The Test Phase

This is where the actual testing happens. We utilize Playwright to interact with the browser and verify your plugin's functionality. By default, the only test phase that gets executed is the one from the plugin you are running the tests from.

:::tip
When running with the test phase of other plugins, any flakiness in the tests of other plugins can cause your tests to fail.
:::

### E2E Test

If you run this command: `qit run:e2e qit-the-beaver --plugin cat-pictures`:

- Run the bootstrap phases of all the plugins
- **Run the test phase of `qit-the-beaver`**

### Compatibility Test

If instead you run with compatibility mode full, `qiit run:e2e qit-the-beaver --plugin cat-pictures --compatibility_mode=full`, it will:

- Run the bootstrap phases of all the plugins
- **Run the test phase of all plugins**

Essentially, when you run in with the default compatibility mode, you are asserting that your plugin continues to behave as expected
when other plugins are installed and configured in a site.

In "full" compatibility mode, you have the coverage above, plus you are asserting that your plugin does not break other plugins.

The test phase is composed of 4 sub-phases:

### 1. Setup

A database dump that was generated after the bootstrap phase is imported, which provides a clean state for each the test phase of each plugin.

### 2. Entrypoint

The `entrypoint.spec.js` is executed, if it exists.

### 3. Tests

The tests of that plugin are executed.

If you have installed a Theme in the Bootstrap Phase, you can activate it here:

```
tests
    bootstrap
        bootstrap.sh
    entrypoint.qit.js
    example.spec.js
```
