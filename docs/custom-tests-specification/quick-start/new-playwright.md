# New Playright Tests

To create a new Playwright test suite with QIT, follow these steps:

1. Run the following command to create a new test suite:

   ```qitbash
   qit scaffold:e2e ./tests/e2e
   ```
2. This creates a new directory `tests/e2e` with the following structure:

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

3. Run the tests:

   ```qitbash
   qit run:e2e your-plugin-slug ./tests/e2e
   ```

4. Develop the tests with Playwright. For example, you can spin up a persistent environment for development:

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