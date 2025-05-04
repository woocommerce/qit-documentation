# Other Frameworks

QIT Custom E2E Tests **uses Playwright by default, but it is framework-agnostic by design**. Runners that emit **[CTRF](https://ctrf.io)** results can be integrated, although such setups are considered *experimental* and must be maintained by the implementer.

### 1. Prerequisites

1. **CTRF output** – Your framework **must** produce results in [CTRF](https://ctrf.io) format so QIT can parse them.
2. **Environment constraints** – Tests must run within QIT's environment constraints. See the full list in the [specification](../specification.md).

Make sure your tests are self-contained in your test directory (similar to a plugin). This ensures everything QIT needs is packaged together.

### 2. Integration steps

**Create `qit-e2e.json`**

In the **root of your test directory** (where your test framework’s config typically lives), add a `qit-e2e.json` file. QIT relies on this file to know how to set up and run your tests. Start with an example like this:

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

### 3. Run the tests

From your WordPress plugin or theme directory, run:

```qitbash
qit run:e2e your-plugin-slug ./tests/e2e
```

Replace `your-plugin-slug` with your actual plugin or theme slug. If you’re developing a WordPress theme, you might use `your-theme-slug` instead.

### 4. Develop the tests

For example, you can spin up a persistent environment for development:

```qitbash
qit run:e2e your-plugin-slug ./tests/e2e --persistent
```

Then, while the environment is running, open another terminal and run your tests repeatedly:

```qitbash
cd tests/e2e
export QIT_SITE_URL=<Site URL provided by QIT>
<your-test-command>
```

You can also run in Playwright Codegen or Headed mode.

```qitbash
npx playwright codegen <Site URL provided by QIT>
```

### 5. Reset or Publish

If you need a clean WordPress install at any time:

```qitbash
qit reset
```

When you’re satisfied with your tests, publish them to QIT:

```qitbash
qit publish:e2e your-plugin-slug ./tests/e2e
```