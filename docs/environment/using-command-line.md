# Using the Command Line

## Introduction

Mastering the command-line interface (CLI) of the QIT Local Test Environment allows you to efficiently manage and customize your WordPress testing environments. This guide details the key CLI commands available in QIT.

## Key Commands

### 1. Starting and Stopping the Environment

- **env:up (env:start)**:
    - Creates a temporary local test environment. It's ephemeral, so every restart is like starting fresh.
    - Can be customized with various options like `--wordpress_version`, `--php_version`, `--plugins`, and `--themes`.

- **env:down (env:stop)**:
    - Stops the running local test environment.

### 2. Environment Management

- **env:list**:
    - Lists all running environments.
    - Use `-f, --field[=FIELD]` to display specific fields.

- **env:enter**:
    - Enter the PHP container of a running test environment.
    - Options include `--user[=USER]` to specify the user.
    - Since our Docker images are based on Alpine, which makes them really small and ideal for CI, they lack some basic functionality that are useful for development. That's why when you enter it, we install some quality-of-line tooling inside the container, such as bash, vim and less. You can avoid installing this tooling with `--no-dev` flag when entering.

- **env:exec**:
    - Execute a command inside the PHP container.
    - Accepts arguments like `--env_var[=ENV_VAR]`, `--user[=USER]`, `--timeout[=TIMEOUT]`, and `--image[=IMAGE]`.

### 3. Advanced Configuration and Customization

- Customize your test environment at startup using flags with `env:up`. This includes setting versions, activating plugins/themes, and configuring PHP extensions and volume mappings.
- For example, to start an environment with specific WordPress version, with WooCommerce Nightly and with a custom plugin, use:
    ```bash
    qit env:up --wordpress_version=rc --plugins=custom-plugin --plugins=https://github.com/woocommerce/woocommerce/releases/download/nightly/woocommerce-trunk-nightly.zip
    ```

## Scripting and Automation

- The CLI commands can be used in scripts to automate setting up, running, and tearing down environments, making them ideal for integration in larger automation workflows or CI/CD pipelines.

## Getting Help

- For help with a specific command, append `--help` to it. For example, `qit env:up --help` will display detailed information and options for the `env:up` command.

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).