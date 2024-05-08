# Themes

:::info
The Custom Tests feature is coming soon.
:::

## Introduction

You can use the Custom Tests to test both plugins and themes.

## Using a specific Theme on your Tests

If you are developing a plugin, and you write E2E tests that interact with the front-end, you will want to make sure that a specific theme is active when the tests run.

On your Bootstrap Phase, you can install the theme:

`bootstrap.sh`
```
wp install theme deli
```

And on your Entrypoint, you can activate it.

Here's an example where we activate a child theme of Storefront, by installing Storefront and then activating the child theme:

`entrypoint.qit.js`
```js
import { test, expect } from '@playwright/test';
import qit from '/qitHelpers';

test('I can activate my theme', async ({ page }) => {
    await qit.loginAsAdmin(page);
    await page.getByRole('link', { name: 'Appearance' }).click();
    await expect(page.getByRole('cell', { name: 'Deli' })).toBeVisible();
    await page.getByRole('link', { name: 'Install Parent Theme' }).click();
    await page.getByRole('link', { name: 'Activate "Storefront"' }).click();
    await page.getByLabel('Activate Deli').click();
    await page.goto('/');
});
```

This entrypoint was generated with Codegen. The easiest way is to start a codegen session, activate the theme, and use the generated code on your entrypoint.

## Testing a Theme

If you are developing a theme, the previous section applies as well. And when you run it, be sure to add the `--testing_theme` flag:

```qitbash
qit run:e2e qit-beaver-theme --testing_theme
```
