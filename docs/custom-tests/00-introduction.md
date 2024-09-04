# Introduction

:::info
The custom E2E tests feature is available as early-access.
:::

The custom E2E tests allows you to easily write and share E2E tests with other developers.

It provides you with a dockerized development environment, and a ready-to-go example test that you can run with one command.

Customize the test to your needs, then share it with other developers, or run it in your CI/CD pipeline.

Or, just use one of our pre-built generic tests to get you started. (Coming soon)

## The power of customization: `run:e2e`

While QIT provides various managed tests, custom E2E tests stand out as the sole category where you, the developer, are the architect of the tests. These are not just any tests; they are comprehensive end-to-end tests designed to ensure your plugin's custom behavior functions flawlessly in real-world scenarios.

## Case study: "QIT the Beaver" tackles plugin challenges

Imagine "QIT the Beaver," our beloved mascot, stepping into a developer's shoes. He launches a plugin on the WooCommerce.com Marketplace, and while it initially receives high praise, soon users report issues related to compatibility and conflicts with other plugins and PHP versions.

> ⭐⭐⭐⭐⭐ Works great
> 
> ⭐⭐⭐⭐⭐ Simply wonderful
> 
> ⭐☆☆☆☆ Doesn't work on PHP 11!
>
> ⭐⭐⭐⭐⭐ Very helpful!
> 
> ⭐☆☆☆☆ Totally broken on PHP 7.2
> 
> ⭐☆☆☆☆ Crashed the page when "Cat Pictures" plugin was enabled!
> 
> ⭐☆☆☆☆ Broke when I updated to WordPress or WooCommerce

What does _QIT the Beaver_ do? Even though he tries very hard, he can't possibly keep track of all the possible scenarios that users will come up when using his plugin!

To bring some peace of mind, he finally decides it's time to write some end-to-end tests.

### Generating the tests

So he pulls up the QIT CLI and runs:

```qitbash
qit scaffold:e2e ./e2e
```

To generate a basic E2E test structure in the `e2e` directory:

```
qit run:e2e --codegen
```

To spin up a local test environment and start a [Playwright Codegen](https://playwright.dev/docs/codegen) session, which generates tests by recording his interactions with the browser.

He records some interactions with his plugin, copies the generated code, and pastes it into his test file.

**It's not 100% copy and paste, but after understanding the workflow with codegen, including what he needs to change in the generated code, it turned out to be much easier than he thought!**

Then he runs the tests and sees them running in a browser:

```qitbash
qit run:e2e qit-the-beaver ./e2e --ui
```

### Publishing the tests

Satisfied with the results, Beaver decides it's showtime. He uploads the tests to QIT’s platform, a move that simplifies future test runs:

```qitbash
qit tag:upload qit-the-beaver ./e2e
```

### Running published tests

Post-upload, running the tests becomes even easier, without needing to specify the path:

```qitbash
qit run:e2e qit-the-beaver
```

To ensure his plugin thrives in diverse environments, QIT experiments with different configurations, replicating conditions reported by users:

```qitbash
qit run:e2e qit-the-beaver \
            --php_version 8.3 \
            --wp nightly \
            --woo nightly \
            --plugin cat-pictures \
            --plugin contact-form-7:activate \
            --theme storefront
```

This comprehensive command allows him to test with PHP 8.3, the latest WordPress release candidate, the nightly WooCommerce version, and alongside popular plugins and themes.

### Running tests from different plugins

The maker of `Cat Pictures` also uploaded their tests to QIT, which means that QIT the Beaver can integrate the tests from the "Cat Pictures" plugin in his test runs. This is done by passing the plugin slug to the `--plugin` flag:

```qitbash
qit run:e2e qit-the-beaver --plugin cat-pictures
```

This will:

- Run the "bootstrap" phase of all plugins, which takes care of all the mocking and setup needed.
- And the "test phase" of `qit-the-beaver`

This asserts that his plugin continues to work as expected when Cat Pictures is active and fully configured in a site.

Alternatively, he could also run `cat-pictures` test phase, too:

```qitbash
qit run:e2e qit-the-beaver --plugin cat-pictures:test
```

With this, it runs the bootstrap and test phases of all plugins, which asserts that not only his plugin continues to work, but that he is also not breaking any expected behavior from others.

With this approach, QIT the Beaver covers a multitude of scenarios, ensuring his plugin performs seamlessly across various setups. It's a win for his peace-of-mind, and most importantly, for his ever-growing base of satisfied customers!

### Publishing a test tag

After his plugin grows and he matures his release strategy, he decides to create a few test tags. This way, he can run different tests for different versions of his plugin.:

```qitbash
qit tag:upload qit-the-beaver:nightly ./e2e
qit tag:upload qit-the-beaver:feature-xyz ./e2e/foo-feature
qit tag:upload qit-the-beaver:fast ./e2e/fast
```

### Using test tags

Now QIT can use his tags like this:

```qitbash
qit run:e2e qit-the-beaver nightly,foo-feature
```

Or if he wants to use a nightly build from a URL:

```qitbash
qit run:e2e qit-the-beaver nightly,foo-feature --source https://github.com/woocommerce/qit-the-beaver/releases/tag/nightly.zip
```

Or in a config file:

```yaml
plugins:
  - qit-the-beaver:
        tests:
            - nightly
            - foo-feature
        source: https://github.com/woocommerce/qit-the-beaver/releases/tag/nightly.zip
```

To wrap up, he adds tagging as part of his GitHub workflows, which fully automates the process for him.

### Using test tags from other plugins

Other plugins can also leverage the test tags `qit-the-beaver` published:

```qitbash
qit run:e2e cat-pictures --plugin qit-the-beaver:test:fast,foo-feature
```
