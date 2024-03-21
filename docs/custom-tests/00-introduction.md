# Introduction

Welcome to the most dynamic and developer-driven aspect of Quality Insights Toolkit (QIT): Custom End-to-End (E2E) Testing. At QIT, we understand that every plugin has unique functionalities and requirements. That's why we empower you, the developers, to take the reins in testing the specific behaviors and features of your plugins.

## The Power of Customization: `run:e2e`

While QIT provides various managed tests, Custom E2E tests stand out as the sole category where you, the developer, are the architect of the tests. These are not just any tests; they are comprehensive end-to-end tests designed to ensure your plugin's custom behavior functions flawlessly in real-world scenarios.

## Case Study: "QIT the Beaver" Tackles Plugin Challenges

Imagine "QIT the Beaver," our beloved mascot, stepping into a developer's shoes. He launches a plugin on the Woo.com Marketplace, and while it initially receives high praise, soon users report issues related to compatibility and conflicts with other plugins and PHP versions.

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


### Generating the Tests

So he pulls up the QIT CLI and run:

```qitbash
qit run:e2e qit-the-beaver-plugin --codegen
```

This will spin up a local test environment for him to connect with [Playwright Codegen](https://playwright.dev/docs/codegen), to generate his tests just by navigating around and with some small tweaks to the generated code.

It's not 100% copy and paste, but after some tinkering it turned out to be much easier than he thought!

Once he generates the tests, he saves them to `beaver-plugin/tests/qit` for example, like this:

```
.
├── tests
│    └── qit-e2e
│        └── tests
│            └── first-test.spec.js
└── qit-the-beaver-plugin.php
```

### Running the Tests Locally

First things first, QIT the Beaver tests the waters by running the tests locally. A simple command does the trick:

```qitbash
qit run:e2e qit-the-beaver-plugin /path-to/tests/qit-e2e
```

### Viewing the Test Running

To see the magic in action, he opts for an interactive test session, which opens a browser window where he can watch the tests unfold:

```qitbash
qit run:e2e qit-the-beaver-plugin \--plugins cat-picturespath-to/tests/qit-e2e --ui
```

### Publishing the Tests

Satisfied with the results, QIT decides it's showtime. He uploads the tests to QIT’s platform, a move that simplifies future test runs:

```qitbash
qit upload:test qit-the-beaver-plugin /path-to/tests/qit-e2e
```

### Running published tests

Post-upload, running the tests becomes even easier, without needing to specify the path:

```qitbash
qit run:e2e qit-the-beaver-plugin
```

To ensure his plugin thrives in diverse environments, QIT experiments with different configurations, replicating conditions reported by users:

```qitbash
qit run:e2e qit-the-beaver-plugin \
            --php_version=8.3 \
            --wordpress_version=rc \
            --woocommerce_version=nightly \
            --plugins cat-pictures \
            --plugins contact-form-7 \
            --themes storefront
```

This comprehensive command allows him to test with PHP 8.3, the latest WordPress release candidate, the nightly WooCommerce version, and alongside popular plugins and themes.


### Running Tests from Different Plugins

The maker or `Cat Pictures` also uploaded their tests to QIT, which means that QIT the Beaver can integrate the tests from the "Cat Pictures" plugin in his test runs. This is done by passing the plugin slug to the `--plugins` flag:

```qitbash
qit run:e2e qit-the-beaver-plugin --plugins cat-pictures
```

This will:

- Run the "bootstrap" phase of all plugins, which takes care of all the mocking and setup needed.
- And the "test" phase of `qit-beaver-plugin`

This asserts that his plugin continues to work as expected when Cat Pictures is active and fully configured in a site.

Alternatively, he could also run a full compatibility test:


```qitbash
qit run:e2e qit-the-beaver-plugin --plugins cat-pictures --compatibility=full
```

With this, it runs the bootstrap and test phases of all plugins, which asserts that not only his plugin continues to work, but that he is also not breaking any expected behavior from others.

With this approach, QIT the Beaver covers a multitude of scenarios, ensuring his plugin performs seamlessly across various setups. It's a win for his peace-of-mind, and most importantly, for his ever-growing base of satisfied customers!