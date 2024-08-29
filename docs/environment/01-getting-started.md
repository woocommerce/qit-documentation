---
sidebar_position: 1
---

# Local test environment

:::info
The local test environment is available as early-access.
:::

## Introduction

The QIT local test environment was engineered to do one thing, and one thing well: running automated tests.

It allows you to create a local WordPress environment with a single command. These environments are disposable, meaning that whatever changes you do in it do not persist across runs. So if you do `qit env:up`, and you delete the database of that site entirely, and then do `qit env:up` again, you will get a fresh new site with no trace of the previous one.

## Prerequisites

Before you begin, ensure that you have the following prerequisites installed:

- **QIT CLI**: If you haven't already installed the QIT CLI tool, follow the instructions in the [Installation Guide](cli/01-installation.md).
- **Docker**: QIT relies on Docker for creating isolated environments. Make sure Docker is installed and running on your system. [Download Docker here](https://www.docker.com/get-started).

### Getting started - Mac

Assuming you have [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) or [OrbStack](https://orbstack.dev/) installed, you can start using the QIT Local Test Environment right away. For the best experience, we recommend OrbStack, as it can be **much faster** than Docker Desktop.

### Getting started - Linux

Assuming you have Docker, preferably the most up-to-date version, with Composer V2, you can start using the QIT Local Test Environment right away.

### Getting started - Windows

The QIT local test environment works on Mac and Linux natively, but for Windows, **you have to use Windows WSL**. 

- Use WSL 2, as it is faster and easier to install than WSL 1.
- On the latest version of Windows, simply open PowerShell and run `wsl --install`
- For older versions like Windows 10, refer to [YouTube installation videos](https://www.youtube.com/results?search_query=windows+wsl+install) or Microsoft's [official guide](https://learn.microsoft.com/en-us/windows/wsl/install). 

Ensure that Windows Features such as Virtual Machine Platform, Windows Subsystem for Linux, and Hyper-V are enabled, and that Virtualization is enabled in the BIOS. 

## Starting your first environment

Creating a local test environment with QIT is straightforward:

1. `qit env:up` to start a basic WordPress environment.
2. Access your site at the URL provided.
3. `qit env:down` and the environment is gone.

## Customizing your environment

Now let's spin up a customized local test environment with a few options:

```qitbash
qit env:up \
    --php_version=8.3 \
    --plugin gutenberg \
    --plugin contact-form-7 \
    --wordpress_version=rc
```

This will create an environment with PHP 8.3 on WordPress RC version, with Gutenberg, and Contact Form 7.

## Using configuration files

Create a `qit-env.yml` file in your project directory with the following content:

```yaml
wordpress_version: rc
php_version: 8.3
plugins:
  - gutenberg
  - contact-form-7
```

Now you just do `qit env:up`, without any additional parameters, and you get the same environment as before, as well as anyone on your team.

## Managing environments

- **env:up**: Creates a Local Test Environment
- **env:down**: Stops a running local test environment.
- **env:list**: Lists all running environments.
- **env:enter**: Enters the PHP container of a running test environment.
- **env:exec**: Execute a command inside the PHP container.

## `env:up` options

- **--wordpress_version**: Choose the specific version of WordPress for your test environment.
- **--php_version**: Test your project with different PHP versions to ensure compatibility.
- **--plugin**: Easily include plugins in your test environment.
- **--themes**: Specify themes to be used.
- **--volumes**: Map local directories to your test environment, useful for plugin/theme development.
- **--php_extensions**: Customize the PHP environment with necessary extensions.
- **--object_cache**: Enable Redis Object Cache for advanced testing scenarios.
