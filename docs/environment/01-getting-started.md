---
sidebar_position: 1
---

# Local Test Environment

## Introduction

The QIT Local Test Environment was engineered to do one thing, and one thing well: Running Automated Tests.

It allows you to create a local WordPress environment with a single command. These environments are disposable, meaning that whatever changes you do in it do not persist across runs. So if you do `qit env:up`, and you delete the database of that site entirely, and then do `qit env:up` again, you will get a fresh new site with no trace of the previous one.

## Prerequisites

Before you begin, ensure that you have the following prerequisites installed:

- **QIT CLI**: If you haven't already installed the QIT CLI tool, follow the instructions in the [Installation Guide](cli/getting-started.md).
- **Docker**: QIT relies on Docker for creating isolated environments. Make sure Docker is installed and running on your system. [Download Docker here](https://www.docker.com/get-started).

## Getting Started

Creating a local test environment with QIT is straightforward:

1. `qit env:up` to start a basic WordPress environment.
2. Access your site at the URL provided.
3. `qit env:down` and the environment is gone.

## Customizing Your Environment

Now let's spin up a customized local test environment with a few options:

```qitbash
qit env:up \
    --php_version=8.3 \
    --plugins gutenberg \
    --plugins contact-form-7 \
    --wordpress_version=rc
```

This will create an environment with PHP 8.3 on WordPress RC version, with Gutenberg, and Contact Form 7.

## Using Configuration Files

Create a `qit-env.yml` file in your project directory with the following content:

```yaml
wordpress_version: rc
php_version: 8.3
plugins:
  - gutenberg
  - contact-form-7
```

Now you just do `qit env:up`, without any additional parameters, and you get the same environment as before, as well as anyone on your team.

## Managing Environments

- **env:up**: Creates a Local Test Environment
- **env:down**: Stops a running local test environment.
- **env:list**: Lists all running environments.
- **env:enter**: Enters the PHP container of a running test environment.
- **env:exec**: Execute a command inside the PHP container.

## `env:up` Options

- **--wordpress_version**: Choose the specific version of WordPress for your test environment.
- **--php_version**: Test your project with different PHP versions to ensure compatibility.
- **--plugins**: Easily include plugins in your test environment.
- **--themes**: Specify themes to be used.
- **--volumes**: Map local directories to your test environment, useful for plugin/theme development.
- **--php_extensions**: Customize the PHP environment with necessary extensions.
- **--object_cache**: Enable Redis Object Cache for advanced testing scenarios.



## Next Steps

- Learn how to create and use configuration files in [Creating Configuration Files](environment/creating-config-files.md).
- Configure your environment with the [Configuration Options](environment/configuration-options.md).
- Learn how to extend your environment with premium plugins and themes in [Installing Plugins From Other Sources](environment/installing-plugins-other-sources.md).

We're excited to see how QIT Local Test Environment streamlines your WordPress testing. Happy coding!

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).