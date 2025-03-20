# Installing the QIT CLI

The QIT Command Line Interface (CLI) is your primary tool for running tests locally and integrating QIT into your development workflow. Installing it globally via Composer is often the most convenient approach. If you don't have Composer installed, refer to the official Composer documentation before proceeding.

## Requirements

- **PHP 7.2.5 or higher**
- **Unix-like environment** (Linux, macOS, Windows WSL)
- **Composer** (for installation and updates)

## Recommended installation: global via composer

By installing the QIT CLI globally, you can access it from any project directory on your system. This approach simplifies your workflow if you work on multiple extensions or projects.

1. Install QIT CLI globally:
   `composer global require "woocommerce/qit-cli:*"`

2. Ensure the Composer global `bin` directory is in your `PATH`. For example:
   `export PATH="$PATH:$HOME/.composer/vendor/bin"`

   Depending on your operating system, the location of the Composer `bin` directory may vary. Consult Composer's documentation if you're unsure.

3. Once set up, you can run the CLI with:
   `qit`

**Why Global Installation?**
- **Consistency:** Have a single version of QIT CLI across all your projects.
- **Convenience:** No need to re-install QIT CLI per project.
- **Easy updates:** A single `composer global update` keeps QIT CLI current.

## Updating the QIT CLI

To update the QIT CLI when installed globally via Composer:

`composer global update "woocommerce/qit-cli:*"`

This will fetch and install the latest version, ensuring you always have the newest features and fixes.

## Next steps

- **Authenticate with QIT:** After installing, connect the CLI to your WooCommerce Marketplace account. See [Authenticating](./authenticating.md) for details.
- **Run your first test:** Once authenticated, try running a basic test:
  `qit run:activation your-extension`
- **Learn more:** Check out [Running Tests](./../using-qit/running-tests-cli.md) to discover how to integrate QIT CLI commands into your development process and CI pipelines.
