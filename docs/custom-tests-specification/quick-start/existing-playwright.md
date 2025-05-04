# Existing Playwright Tests

This guide shows you how to adapt your **existing Playwright tests** to work with QIT in a WordPress environment - whether you are developing a plugin or a theme.

### 1. Add a `qit-e2e.json` file

In the **root of your test directory** (where `playwright.config.js` is located), add a file named `qit-e2e.json`. Use this simplified example as a starting point:
 
To start, you can use this simplified example:
   ```json
   {
       "test_command": "npx playwright test",
       "test_results": {
           "ctrf": "./results/ctrf.json"
       },
       "lifecycle": {
           "setup": "./bootstrap/setup.sh"
       }
   }
   ```

You can find more options in the `qit-e2e.json` [specification](./../specification.md).

### 2. Add `QIT_SITE_URL` to Your Playwright Configuration

In your `playwright.config.js` file, set a `baseURL` using the `QIT_SITE_URL` environment variable:

```javascript
module.exports = {
    use: {
        baseURL: process.env.QIT_SITE_URL || 'http://localhost:8888',
    },
};
```

**Why this matters:** QIT dynamically assigns a local WordPress site URL when spinning up the test environment, so your Playwright tests need to rely on the `QIT_SITE_URL` variable to know where WordPress is running.

### 3. Install a CTRF Reporter

Install the [CTRF JSON Reporter](https://www.npmjs.com/package/playwright-ctrf-json-reporter) so QIT can ingest your test results:

```bash
npm i playwright-ctrf-json-reporter
```

Then, reference it in your `playwright.config.js` file:

```javascript
module.exports = {
    reporter: [
        [
            'playwright-ctrf-json-reporter',
            {
                outputFile: 'ctrf.json',
                outputDir: './results',
            }
        ],
    ],
};
```


### 4. (Optional) Add an Allure Reporter

If you want screenshots and videos to show up in your QIT reports, install and configure the Allure Reporter:

```bash
npm i allure-playwright
```

Update your `playwright.config.js` to include it:

```javascript
module.exports = {
    reporter: [
        [
            'allure-playwright',
            {
                resultsDir: './results/allure',
                detail: true,
                suiteTitle: true,
            },
        ],
    ],
};
```

### 5. Personalize your test environment

Create or modify a `bootstrap/setup.sh` script to customize your WordPress environment. For example, to install and activate a theme:

```bash
#!/bin/bash

wp theme install some-example-theme
wp theme activate some-example-theme
```

Feel free to add any other commands needed before your tests run.

### Putting it all together:

Below is an example `playwright.config.js` illustrating how you can combine all your reporters and environment settings:

```javascript
module.exports = {
    use: {
        baseURL: process.env.QIT_SITE_URL || 'http://localhost:8888',
    },
    reporter: [
        ['list'],
        [
            'playwright-ctrf-json-reporter',
            {
                outputFile: 'ctrf.json',
                outputDir: './results',
            }
        ],
        [
            'allure-playwright',
            {
                resultsDir: './results/allure',
                detail: true,
                suiteTitle: true,
            },
        ],
    ],
};
```


### Example structure

Below is an example of how your directory might look after adding QIT-specific files and your Playwright tests:

```bash
your-plugin/
├── your-plugin.php
├── tests/e2e/
├──── qit-e2e.json
├──── playwright.config.js
├──── package.json
├──── bootstrap/
│     ├── setup.sh
│     └── mu-plugin.php
└──── tests/
     └── example.spec.ts
```

Make sure your tests are **self-contained** within your test directory. They should not reference files outside the folder containing `qit-e2e.json`.

### Run the tests

From the root of your plugin or theme, run:

```qitbash
qit run:e2e your-plugin-slug ./tests/e2e
```

:::info
Replace `your-plugin-slug` with your actual plugin or theme slug. If you are building a WordPress theme, you might use a placeholder like `your-theme-slug` instead.
:::

### Develop the tests with Playwright

For iterative development, spin up a **persistent** QIT environment:

```qitbash
qit run:e2e your-plugin-slug ./tests/e2e --persistent
```

Then, in a separate terminal, navigate to your tests directory and run them repeatedly:

```qitbash
cd tests/e2e
export QIT_SITE_URL=<Site URL provided by QIT>
npx playwright test
```

To visually debug or generate test code, you can use Playwright Codegen:

```qitbash
npx playwright codegen <Site URL provided by QIT>
```

Check out the [Playwright documentation](https://playwright.dev/docs/codegen-intro) for additional details on recording and debugging test steps.

### Reset or Publish

You can always reset your QIT environment to a fresh WordPress install:

```qitbash
qit reset
```

Finally, once your existing tests are validated and running smoothly:

```qitbash
qit publish:e2e your-plugin-slug ./tests/e2e
```

That’s it! By following these steps, you’ve adapted your existing Playwright tests to be **QIT-ready** for a WordPress plugin or theme.