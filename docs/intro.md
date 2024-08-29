---
sidebar_position: 1
slug: /
---

import QITIntro from '@site/src/video/qit_intro.mp4';
import TestTypes from '@site/src/components/TestTypes';
import QITImageURL from '@site/static/img/qit-right.webp';

# What is QIT?

QIT is a testing platform, developed by WooCommerce, for WordPress plugins and themes that allows developers to run a series of managed tests out-of-the-box. It is currently in closed beta operating only in the [WooCommerce Marketplace](https://woocommerce.com/products/) .

<video controls style={{ width:"100%", height:"100%" }}>
    <source src={QITIntro} type="video/mp4"/>
    Your browser does not support the video tag.
</video>

<div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
  <img src={QITImageURL} alt="QIT the Beaver" width={175} style={{ marginRight: '20px' }}/>
  <div>
    <h2>And there's QIT the Beaver</h2>
    <p>
        He's our adorable mascot. He's here to show you that tests can be fun and easy!
    </p>
  </div>
</div>


## Requirements

Currently, to use QIT you need to have at least one extension listed on the WooCommerce.com Marketplace.

## Quick Start Guide

1. `composer require woocommerce/qit-cli --dev`
2. `./vendor/bin/qit connect` to generate a QIT Token and [authenticate](/docs/support/authenticating) using your WooCommerce.com developer account.
4. `./vendor/bin/qit run:activation your-extension`, where "your-extension" is the slug of a WooCommerce.com extension you own.

## What types of tests are available?

<TestTypes />

## QIT and the WooCommerce.com Marketplace
QIT automatically runs tests for every new release on the WooCommerce Marketplace. Additionally, Partner Developers can
run tests on-demand using our CLI tool.

## Can I use QIT if I'm not a Developer on WooCommerce.com?
While the full QIT is exclusive to WooCommerce.com Partner Developers, non-partners can use the local test environment. Full access is planned for the public in the future.

## Ways to Use QIT
- **CLI**: For running and viewing tests, including development builds. [Getting Started with CLI](cli/01-installation.md).
- **Dashboard**: UI-based test runner and results viewer in your WooCommerce.com dashboard. [Dashboard Guide](woo-com/getting-started).
- **GitHub Workflows**: To integrate QIT tests in GitHub development workflows. [Setting Up Workflows](cli/05-github-workflows.md).
