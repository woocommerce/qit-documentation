# Generating Tests

:::info
The Custom Tests feature is coming soon.
:::

## Introduction

You can scaffold a basic E2E test with:

```qitbash
qit scaffold:e2e ./e2e
```

This will create a basic E2E test in the `e2e` directory with essentially a `example.spec.js` file and a `bootstrap` directory:

```
bootstrap (Optional)
    bootstrap.sh
    bootstrap.php
    must-use-plugin.php
example.spec.js
```

:::tip
Bootstrap files are optional and can be removed if not needed. [Learn more about bootstrapping](/docs/custom-tests/bootstrap-and-test-phases) and its use cases.
:::

You can run your first test locally with:

```qitbash
qit run:e2e <your-plugin> ./e2e

(Optionally add `--ui` to see the browser while it runs)
```

You can then expand it with more tests, or even generate tests with Playwright Codegen.

## Codegen

Codegen is a helpful Playwright feature for generating most of the E2E test code for you.

It's a semi automated process, it's not meant to be 100% copy and paste, but it will save you a lot of time.

```qitbash
qit run:e2e <your-plugin> --codegen
```

This command will start the test environment and open a browser window. You can interact with the browser and perform the actions you want to test. When you're done, you can copy and paste the test code in your test directory.

It essentially records your interactions with the browser and generates the code for you, which you then copy and paste into a test file.

### Adjusting Codegen URLs

When you generate tests with `--codegen`, they will be generated with the URLs you visited during the recording, eg:


#### How Codegen Generates It:

```js
await page.goto('http://localhost:32456');
await page.goto('http://localhost:32456?cat=pictures');
await page.goto('http://localhost:32456/my-page');
await page.goto('http://localhost:32456/wp-admin');
```

After pasting it in a test file, remove the URLs, as the test run uses a `baseURL`.

#### How it should look like in your test file:

```js
await page.goto('/');
await page.goto('/?cat=pictures');
await page.goto('/my-page');
await page.goto('/wp-admin');
```

## Using QIT Helpers

We have a set of helpers that you can use in your tests to make your life easier. You can find them in the QIT Helpers documentation _(Coming soon)_.

```js
// Add this to the top of a test file.
const qit = require('qitHelpers');

// Example: Login as an admin and navigate to /wp-admin.
qit.loginAsAdmin();

// Example: Login as the "customer" user.
qit.loginAs('customer', 'password');
```