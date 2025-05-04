# New Playright Tests

This guide shows you how to set up and run end-to-end Playwright tests with QIT for your WordPress plugin or theme.

### 1. Scaffold your test suite

In the root directory of your WordPress plugin or theme, run:

```qitbash
qit scaffold:e2e ./tests/e2e
```
This command will create a new `tests/e2e` folder with the following structure:

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

### 2. Run your tests

Still in your plugin or theme directory, use:

```qitbash
qit run:e2e your-plugin-slug ./tests/e2e
```

:::info
Replace `your-plugin-slug` with your actual plugin or theme slug. If you are building a WordPress theme, you might use a placeholder like `your-theme-slug` instead.
:::

### 3. Develop the tests with Playwright.

To spin up a persistent environment for development, run:

```qitbash
qit run:e2e your-plugin-slug ./tests/e2e --persistent
```

Within this environment, you can quickly re-run tests as you code:

```qitbash
cd tests/e2e
export QIT_SITE_URL=<Site URL provided by QIT>
npx playwright test
```

#### Using Playwright Codegen or Headed mode

If you want to record or visually debug your test interactions, use:

```qitbash
npx playwright codegen <Site URL provided by QIT>
```

Check the [Playwright documentation](https://playwright.dev/docs/codegen-intro) for additional tips on recording and debugging.

### 4. Reset or Publish

You can reset to a clean WordPress test environment at any time:

```qitbash
qit reset
```

When your tests are stable and ready to share or integrate into CI, publish them to QIT:

```qitbash
qit publish:e2e your-plugin-slug ./tests/e2e
```

**That’s it!** You’ve successfully set up end-to-end Playwright tests for your WordPress plugin or theme using QIT.

:::tip
Remember to exclude the `tests` directory from your plugin or theme zip file before publishing it to a marketplace for distribution.
:::