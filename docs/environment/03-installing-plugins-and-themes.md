# Installing Plugins and Themes

:::info
The Local Test Environment is coming soon.
:::

## Introduction

When starting an environment you can choose to install different plugins and themes with `--plugin`, `--themes` or through the config files.

You can install any plugins from WordPress.org, and any plugins from Woo.com that you have access to.

If you are running a custom E2E test with `qit run:e2e`, it will also download their custom tests, if they have any registered in QIT.


## Testing Premium Plugins

Authentication to download premium plugins listed on Woo.com are automatically handled for you based on your Partner Developer credentials.

Currently, you can download premium plugins and tests from plugins you own on Woo.com, and we are exploring ways of allowing
plugin developers to optionally allow other Partner Developers access to their plugins and tests to encourage compatibility testing.

While QIT is a Woo.com exclusive for now, you can only download custom tests for plugins that are listed in the Woo.com Marketplace.

## Installing Premium Plugins from Other Sources

While you cannot download custom tests from other sources, you can download the plugins and install them in your environment.

You can do this by implementing a Custom Handler, which gives you total control over where to fetch your plugin files from.

Read more about it on the next section.