# Existing Playwright Tests

To make your existing Playwright tests work with QIT, follow these steps:

1. Add a `qit-e2e.json` file to root of your test directory (the same directory where `playwright.config.js` is).
 
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

See more options for the `qit-e2e.json` file in the [specification](./../specification.md).
   
2. Add `QIT_SITE_URL` to your `playwright.config.js` file, example:

```javascript
module.exports = {
    use: {
        baseURL: process.env.QIT_SITE_URL || 'http://localhost:8888',
    },
};
```

2. Install a CTRF Reporter:

```bash
npm i playwright-ctrf-json-reporter
```

And then in your `playwright.config.js` file, add the reporter:

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

3. Optionally add an Allure Reporter if you want screenshots and videos of your test runs in QIT reports:

```bash
npm i allure-playwright
```

And then in your `playwright.config.js` file, add the reporter:

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

4. Add a `bootstrap/setup.sh` file to your test suite, use it to personalize your environment. For example, if you want to install a theme, you can add the following:

```bash
#!/bin/bash

wp theme install some-example-theme
wp theme activate some-example-theme
```

### Putting it all together:

`playwright.config.js`:

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

### Extra tips

- Remember that your tests should be self-contained (like a WordPress plugin), so they should NOT reference files OUTSIDE of your test directory (the directory where your `qit-e2e.json` file is located).

### Example structure

   ```bash
   tests/e2e/
   ├── qit-e2e.json
   ├── playwright.config.js
   ├── package.json
   ├── bootstrap/
   │   ├── setup.sh
   │   └── mu-plugin.php
   └── tests/
       └── example.spec.ts
   ```

### Run the tests

   ```qitbash
   qit run:e2e your-plugin-slug ./tests/e2e
   ```

### Develop the tests with Playwright

For example, you can spin up a persistent environment for development:

   ```qitbash
   qit run:e2e your-plugin-slug ./tests/e2e --persistent
   ```

   Then run the test several times while developing:

   ```qitbash
   cd tests/e2e
   QIT_SITE_URL=http://localhost:8080 npx playwright test
   ```

   You can also run in Playwright Codegen or Headed mode.

   ```qitbash
   npx playwright codegen http://localhost:8080
   ```

   Check out the [Playwright documentation](https://playwright.dev/docs/codegen-intro) for more options.

   You can always reset the environment to a clean state by running:

   ```qitbash
   qit reset
   ```

   When you are happy with the results, you can publish your tests to QIT with:

   ```qitbash
   qit publish:e2e your-plugin-slug ./tests/e2e
   ```