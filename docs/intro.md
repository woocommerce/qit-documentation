---
sidebar_position: 1
slug: /
---

import QITIntro from '@site/static/video/qit_intro.mp4';
import TestTypes from '@site/src/components/TestTypes';

# Introduction 

The Quality Insights Toolkit (QIT) is an initiative by WooCommerce that provides extension developers in the [Woo Marketplace](https://woo.com/products/) with a series of automated tests out-of-the-box.

To ensure that all extensions in the Woo Marketplace meet our quality standards, we run a series of automated tests. As part of our commitment to supporting developers, we also provide ways for developers to easily integrate these tests into their development workflows.

<video controls style={{ width:"100%", height:"100%" }}>
    <source src={QITIntro} />
</video>

## Quick Start Guide

1. `composer install woocommerce/qit-cli --dev`
2. `./vendor/bin/qit` to authenticate with your Woo.com developer account.
3. `qit run:activation your-extension`, where "your-extension" is the slug of a Woo.com extension you own.

## What you can do with QIT

- Run tests for your extensions, including development builds
- Integrate with GitHub Workflows
- Run tests with other extensions active at the same time
- Run tests with different versions of PHP, WordPress, and WooCommerce

And coming soon:

- Upload your custom E2E tests to QIT
- Spin up a local test environment with a single command
- Run Compatibility tests with other extensions, making sure your plugin continues to work as expected with other extensions installed in the same site
- Install plugins from both Woo.com Marketplace or the WordPress.org Plugin Repository
- Configure various parameters of the test environment with config files or arguments

## Who is this toolkit for? 

This toolkit is for extension developers who are selling their extensions on the WooCommerce Marketplace.

## What types of tests are available?

<TestTypes />

## How can I use the toolkit? 

Tests are executed automatically by us whenever you publish a new version of your extension on the WooCommerce Marketplace. You can also run tests manually using the following tools:

- [CLI](cli/getting-started.md): A CLI tool that allows you to run and view tests, including against development builds.
- [Dashboard](dashboard/getting-started.md): A UI-based test runner and test results viewer, available in your WooCommerce dashboard.
- [GitHub Workflows](workflows/getting-started.md): GitHub workflow files that allow running tests regularly with QIT as part of a GitHub development workflow.

## Why does this toolkit exist? 

The primary goal of these tools is to assist extension developers to easily integrate a variety of tests into their development workflows, and promote and encourage quality around WooCommerce extensions available in the marketplace.