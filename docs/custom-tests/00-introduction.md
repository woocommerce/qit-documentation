# Introduction

All QIT tests are Managed by QIT. We have one exception, which is the Custom E2E tests: `run:e2e`

This is the only type of test in QIT that the developers write the tests themselves.

It's essentially an end-to-end test that asserts that the custom behavior of your plugin is working as expected.

## Example: "QIT the Beaver" Publishes a Plugin

Picture this scenario: QIT the Beaver, the beloved mascot of QIT, steps into the shoes of a developer and launches a plugin in the Woo.com Marketplace. Initially, it's a hit, with glowing reviews. But soon, mixed feedback begins to surface, highlighting compatibility issues with different PHP versions and conflicts with other plugins.

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

So he pulls up the QIT CLI and run:

- `qit run:e2e qit-the-beaver-plugin --codegen`

This will create a test environment for him to connect with [Playwright Codegen](https://playwright.dev/docs/codegen), to generate his tests just by navigating around and with some small tweaks to the generated code.

It's not 100% copy and paste, but after some tinkering it turned out to be much easier than he thought!

Once he generates the tests, he saves them to `my-plugins/tests/qit-e2e` for example, like this:

```
.
├── tests
│    └── qit
│        └── tests
│            └── first-test.spec.js
└── qit-the-beaver-plugin.php
```

Now he can run his tests locally with:

- `qit run:e2e qit-the-beaver-plugin /path-to/my-plugins/tests/qit-e2e`

He can even start the tests manually and view them running in a browser with:

- `qit run:e2e qit-the-beaver-plugin /path-to/my-plugins/tests/qit-e2e --ui`

QIT the Beaver is happy with his tests, so he publishes it, with:

- `qit upload:test qit-the-beaver-plugin /path-to/my-plugins/tests/qit-e2e`

This will upload his tests to the testing platform, which allows him to ommit the path from now on:

- `qit run:e2e qit-the-beaver-plugin`

He's happy with the current coverage so far, so he decides to start tinkering with the environment:

```
qit run:e2e qit-the-beaver-plugin \
    --php_version=8.3 \
    --wordpress_version=rc \
    --woocommerce_version=nightly \
    --plugins cat-pictures \
    --plugins contact-form-7 \
    --themes storefront
```

Now he's running a test trying to replicate his customer's complaints, with:

- PHP 8.3
- WordPress RC
- WooCommerce Nightly
- With both "Cat Pictures" and "Contact Form 7" plugins installed, and Storefront theme

Now, QIT the Beaver can come up with a few different scenarios to run his tests on CI to make sure everything is covered!

He tackled all scenarios with a few parameters and his customers are happier than ever!