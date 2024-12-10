---  
sidebar_position: 1  
slug: /
---

import QITIntro from '@site/src/video/qit_intro.mp4';  
import TestTypes from '@site/src/components/TestTypes';  
import QITImageURL from '@site/static/img/qit-right.webp';

# Introduction to QIT

QIT (Quality Insights Toolkit) is a testing platform developed by WooCommerce for WordPress plugins and themes. It allows developers to quickly run a variety of managed tests out-of-the-box, as well as integrate their own custom E2E tests to ensure their extensions are reliable, secure, and compatible.

**Key Features:**
- **Managed test suites:** Run pre-configured end-to-end tests, activation tests, security scans, PHPStan analysis, API tests, and more.
- **Custom E2E testing:** Write and run your own Playwright-based E2E tests directly through QIT.
- **Continuous quality checks:** Easily integrate QIT with your development workflows (CLI, GitHub Actions, etc.).
- **Marketplace integration:** Currently in closed beta for extensions listed on the WooCommerce Marketplace.

<video controls style={{ width:"100%", height:"100%" }}>
  <source src={QITIntro} type="video/mp4"/>  
  Your browser does not support the video tag.  
</video>

## Requirements

- **Woocommerce.com partner developer account:** You must have at least one extension listed on the WooCommerce.com Marketplace to access QIT.
- **PHP 7.2.5+ and composer:** Required if you plan to use QIT locally via the CLI.

## Quick start guide

**Recommended Approach: Global Installation via Composer**

For the simplest and most consistent experience, install QIT CLI globally. This ensures QIT is readily available across all your projects without repeated per-project installations.

1. **Install QIT CLI Globally:**  
   ```bash
   composer global require woocommerce/qit-cli
   ```
   Make sure your global Composer `bin` directory is in your `PATH`.  
   Example:  
   ```bash
   export PATH="$PATH:$HOME/.composer/vendor/bin"
   ```

2. **Authenticate with QIT:**  
   ```qitbash
   qit connect
   ```
   This generates a QIT Token and prompts you to [authenticate](./installation-setup/authenticating.md) with your WooCommerce.com developer account.

3. **Run Your First Test:**  
   ```qitbash
   qit run:activation your-extension
   ```
   Replace 'your-extension' with the slug of a WooCommerce.com extension you own. This runs a simple activation test to ensure your plugin can be activated without errors.

**Alternative: Per-Project Installation (If Preferred)**  
If you prefer isolating QIT to a single project, you can still install it locally using:
```bash
composer require woocommerce/qit-cli --dev
```
And run commands via:
```bash
./vendor/bin/qit connect
./vendor/bin/qit run:activation your-extension
```
However, the global installation approach is recommended for most developers.

## What tests are available?

QIT provides multiple managed test types right out of the box:

<TestTypes />

Each test type runs in a controlled environment, providing consistent, reproducible results. For detailed explanations of each test type, see the [Managed Tests Introduction](/docs/managed-tests/introduction).

## QIT & WooCommerce Marketplace

QIT automatically runs tests for every new release published on the WooCommerce Marketplace. Partner Developers can also run tests on-demand using the CLI or the WooCommerce.com Vendor Dashboard.

## Non-partner developers

While full QIT access is currently exclusive to WooCommerce.com Partner Developers, a local test environment is available for non-partners. We plan to open full access publicly in the future. Stay tuned!

## Ways to use QIT

- **Command line (CLI):** Perfect for integrating into your local development workflow or CI pipelines. See [CLI Getting Started](./installation-setup/cli-installation.md).
- **Woocommerce.com dashboard:** Run and view tests directly in the vendor dashboard UI. See [Getting Started with Dashboard](./using-qit/running-tests-dashboard.md).
- **GitHub actions:** Integrate QIT tests into your GitHub workflows. See [GitHub Workflows Setup](./using-qit/github-workflows.md).

## Next steps

- **Want to learn more about authenticating?** Check out [Authentication](./installation-setup/authenticating.md).
- **Ready to run more tests?** See [Running Tests with QIT CLI](./using-qit/running-tests-cli.md).
- **Curious about custom E2E tests?** Visit the [Custom Tests Introduction](./custom-tests/introduction.md).

:::info  
If you encounter any issues or have questions, feel free to [contact us](mailto:qit@woocommerce.com) or open an issue on [GitHub](https://github.com/woocommerce/qit-cli/issues).  
:::
