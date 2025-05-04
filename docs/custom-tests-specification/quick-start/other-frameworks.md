# Other Frameworks

QIT Custom E2E Tests **uses Playwright by default, but it is framework-agnostic by design**. Runners that emit **[CTRF](https://ctrf.io)** results can be integrated, although such setups are considered *experimental* and must be maintained by the implementer.

#### Prerequisites

1. **CTRF output** – Your framework **must** produce results in CTRF so QIT can parse them.
2. **Environment constraints** – Tests must run within QIT's environment constraints. See the full list in the [specification](../specification.md).

#### Integration steps

1. **Create `qit-e2e.json`**

Create a `qit-e2e.json` file in the root of your test directory. This file is essential for QIT to understand how to run your tests.

   ```json
   {
       "test_command": "your-test-command",
       "test_results": {
           "ctrf": "./results/ctrf.json"
       },
       "lifecycle": {
           "setup": "./bootstrap/setup.sh"
       }
   }
   ```

   See more options for the `qit-e2e.json` file in the [specification](../specification.md).

**Use `QIT_SITE_URL`** environment variable in your test framework to point to the QIT environment. This is crucial for your tests to run correctly.

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