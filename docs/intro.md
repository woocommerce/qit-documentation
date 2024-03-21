---
sidebar_position: 1
slug: /
---

import QITIntro from '@site/src/video/qit_intro.mp4';
import TestTypes from '@site/src/components/TestTypes';

# What is QIT? 

QIT is a testing platform for Wordpress Plugins and Themes developed by WooCommerce that allows developers to run a series of managed tests out-of-the-box. We are currently in closed beta operating only in the [Woo Marketplace](https://woo.com/products/) .

<video controls style={{ width:"100%", height:"100%" }}>
    <source src={QITIntro} />
</video>


## Requirements

Currently, to use QIT you need to have at least one extension listed on the Woo.com Marketplace.

## Quick Start Guide

1. `composer require woocommerce/qit-cli --dev`
2. `./vendor/bin/qit connect` to generate a QIT Token and [authenticate](/docs/support/authenticating) using your Woo.com developer account.
4. `./vendor/bin/qit run:activation your-extension`, where "your-extension" is the slug of a Woo.com extension you own.

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

## QIT and Woo.com Marketplace
Partner Developers at Woo.com can use the Quality Insights Toolkit (QIT) to test extensions for the marketplace. This includes running tests on local development builds or as part of CI workflows.

## Can I use QIT if I'm not a Developer on Woo.com?
While the full QIT is exclusive to Woo.com Partner Developers, non-partners can use the local test environment. Full access is planned for the public in the future.

## Ways to Use QIT
QIT automatically runs tests for new Woo Marketplace extension versions. Additionally, developers can manually run tests using:
- **CLI**: For running and viewing tests, including development builds. [Getting Started with CLI](cli/getting-started).
- **Dashboard**: UI-based test runner and results viewer in your Woo.com dashboard. [Dashboard Guide](woo-com/getting-started).
- **GitHub Workflows**: To integrate QIT tests in GitHub development workflows. [Setting Up Workflows](workflows/getting-started).