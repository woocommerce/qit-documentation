# Local test environment introduction

:::info
The local test environment is available as early-access.
:::

## Introduction

The QIT local test environment is designed with a single purpose: running automated tests in a clean, disposable WordPress environment. With one command, you can spin up a temporary WordPress and WooCommerce setup, perform tests, and tear it down—leaving no trace behind. This ensures consistency, reproducibility, and minimal clutter in your development workflow.

Every time you run `qit env:up`, a fresh environment is created. Any changes you make, such as deleting the database or modifying configurations, vanish once you stop and recreate the environment. This stateless approach frees you from environment drift and persistent data issues.

## Prerequisites

Refer to [Installation](../installation-setup/cli-installation.md) if needed.
- **Docker:** QIT relies on Docker to create isolated environments. Make sure Docker is installed and running. For more information, see [Docker documentation](https://docs.docker.com/compose/install/).

### Platform-specific notes

- **Mac:** If you have Docker Desktop or OrbStack installed, you can start using the QIT Local Test Environment right away. OrbStack can offer improved performance over Docker Desktop.
- **Linux:** With Docker and Composer V2 installed, you can begin testing immediately.
- **Windows:** Use Windows Subsystem for Linux (WSL) for the best experience.
    - WSL 2 is recommended for better speed and easier setup.
    - If you are on the latest Windows version, run `wsl --install` in PowerShell.
    - For older Windows versions, consult [Microsoft's official guide](https://learn.microsoft.com/en-us/windows/wsl/install).

Verify that essential Windows features like Virtual Machine Platform, Windows Subsystem for Linux, and Hyper-V are enabled, and confirm that Virtualization is active in the BIOS.

## Starting your first environment

1. `qit env:up` to start a basic WordPress environment.
2. Access your site at the URL provided in the CLI output.
3. `qit env:down` to remove the environment entirely.

Every time you run `qit env:up`, you get a fresh, predictable environment with no lingering changes.

## Customizing your environment

You can specify PHP, WordPress, and WooCommerce versions, as well as plugins and themes:

```qitbash
qit env:up \
    --php_version=8.3 \
    --plugin=gutenberg \
    --plugin=contact-form-7 \
    --wordpress_version=rc
```

This command creates an environment running PHP 8.3, the latest release candidate of WordPress, and includes Gutenberg and Contact Form 7 plugins by default.

## Using configuration files

Create a `qit.yml` file in your project directory:

```yaml
wordpress_version: rc
php_version: 8.3
plugins:
  - gutenberg
  - contact-form-7
```

Now running `qit env:up` without extra parameters uses these configurations, ensuring consistency across your team and simplifying setup.

## Managing environments

- `qit env:up`: Creates a local test environment.
- `qit env:down`: Stops and removes the running environment.
- `qit env:list`: Lists all running environments.
- `qit env:enter`: Enters the PHP container for debugging or manual operations.
- `qit env:exec`: Executes a command inside the PHP container.

## Env:up options

- `--wordpress_version`: Choose a specific WordPress version.
- `--php_version`: Test across different PHP versions for better compatibility coverage.
- `--plugin`: Automatically install and activate given plugins.
- `--themes`: Specify themes to be included.
- `--volumes`: Map local directories into the environment, useful for plugin or theme development.
- `--php_extensions`: Add necessary PHP extensions.
- `--object_cache`: Enable Redis Object Cache for advanced performance testing scenarios.