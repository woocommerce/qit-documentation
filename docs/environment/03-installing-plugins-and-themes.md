# Installing plugins and themes

:::info
The local test environment is available as early-access.
:::

## Introduction

When starting an environment you can choose to install different plugins and themes with `--plugin`, `--themes` or through the config files.

You can install any plugins from WordPress.org, and any plugins from WooCommerce.com that you have access to.

If you are running a custom E2E test with `qit run:e2e`, it will also download their custom tests, if they have any registered in QIT.


## Testing premium plugins

Authentication to download premium plugins listed on WooCommerce.com is automatically handled for you based on your Partner Developer credentials.

Currently, you can download premium plugins and tests from plugins you own on WooCommerce.com, and we are exploring ways of allowing
plugin developers to optionally allow other Partner Developers access to their plugins and tests to encourage compatibility testing.

While QIT is a WooCommerce.com exclusive for now, you can only download custom tests for plugins that are listed in the WooCommerce.com Marketplace.

## Installing premium plugins from other sources

While you cannot download custom tests from other sources, you can download the plugins and install them in your environment.

You can do this by implementing a custom handler, which gives you total control over where to fetch your plugin files from.

Read more about it on the next section.
