---
sidebar_position: 1
slug: /
---

import QITIntro from '@site/src/video/qit_intro.mp4';
import TestTypes from '@site/src/components/TestTypes';

# Introduction 

The Quality Insights Toolkit (QIT) is an initiative by WooCommerce that provides extension developers in the [Woo Marketplace](https://woo.com/products/) with a series of automated tests out-of-the-box.

<video controls style={{ width:"100%", height:"100%" }}>
    <source src={QITIntro} />
</video>

## Quick Start Guide

To use QIT, you need to have at least one extension listed on the Woo.com Marketplace.

1. `composer require woocommerce/qit-cli --dev`
2. `./vendor/bin/qit login` to authenticate with your Woo.com developer account.
3. `qit run:activation your-extension`, where "your-extension" is the slug of a Woo.com extension you own.

## What types of tests are available?

<TestTypes />

### Coming soon: Local Test Environment and Compatibility Tests

We are working on adding more features to the toolkit, including:

- Upload your custom E2E tests to QIT
- Spin up a local test environment with a single command
- Run your E2E tests with other extensions active in the same site, to test that your plugin continues to work as expected with other extensions installed in the same site
- Run the E2E tests of other extensions with your plugin active to test your changes don't break other extensions
- Install plugins from both Woo.com Marketplace or the WordPress.org Plugin Repository
- Configure various parameters of the test environment with config files or arguments

## How can I use the toolkit? 

Tests are executed automatically by us whenever you publish a new version of your extension on the WooCommerce Marketplace. You can also run tests manually using the following tools:

- [CLI](cli/getting-started.md): A CLI tool that allows you to run and view tests, including against development builds.
- [Dashboard](dashboard/getting-started.md): A UI-based test runner and test results viewer, available in your WooCommerce dashboard.
- [GitHub Workflows](workflows/getting-started.md): GitHub workflow files that allow running tests regularly with QIT as part of a GitHub development workflow.

## Why does this toolkit exist? 

The primary goal of these tools is to assist extension developers to easily integrate a variety of tests into their development workflows, and promote and encourage quality around WooCommerce extensions available in the marketplace.