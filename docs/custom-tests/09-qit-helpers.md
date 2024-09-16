# QIT Helpers

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

The QIT Helpers is available in the context of Custom E2E tests and provides a set of helper functions.

```js
import qit from '/qitHelpers';
```

## Functions

### loginAsAdmin

Logs in as an admin user. Requires the "page" object.

```js
await qit.loginAsAdmin(page);
```

### loginAs

Logs in as a specific user. Requires the "page" object, username, and password.

```js
await qit.loginAs(page, 'username', 'password');
```

### wp

Executes a WP-CLI command in the PHP container that is executing the test.

```js
await qit.wp('plugin list');
```

### attachScreenshot

Attaches a screenshot to the test context. Requires the "page" object and the "testInfo" object.

```js
const context = {
    "Some optional context to embed": ["Some Value"]
};

await qit.attachScreenshot('example-screenshot', context, page, testInfo);
```

### getEnv

Gets an environment variable. Requires the key of the environment variable.

```js
const value = qit.getEnv('MY_ENV_VAR');
```

### setEnv

Sets an environment variable. Requires the key and value of the environment variable.

```js
    qit.setEnv('MY_ENV_VAR', 'my-value');
```