# Installation and Setup

## Overview

Setting up the QIT Local Test Environment is designed to be a straightforward process. This guide will take you through the necessary steps to get your environment up and running.

## Prerequisites

Before you begin, ensure that you have the following prerequisites installed:
- **Docker**: QIT relies on Docker for creating isolated environments. Make sure Docker is installed and running on your system. [Download Docker here](https://www.docker.com/get-started).
- **PHP**: You need PHP installed on your local machine to interact with QIT's CLI tools. [PHP Installation Guide](https://www.php.net/manual/en/install.php).

## Installation

If you haven't already installed the QIT CLI tool, following the instructions in the [Installation Guide](cli/getting-started.md).


## Setting Up Your Environment

1. **Initialize the Environment:**
   Start your local test environment by running `qit env:up`. This command creates a basic WordPress installation with default settings.

2. **Accessing Your Test Site:**
   Once ready, QIT provides a URL for accessing your WordPress site, typically `http://localhost:<RANDOM_PORT>`.

## Customization

The Local Test Environment is highly customizable. Specify WordPress, WooCommerce, and PHP versions, and include specific plugins and themes. For details, refer to the Configuration Options section.

## Next Steps

- Configure your environment with the [Configuration Options](local-test-environment/configuration-options.md).
- Learn about extending your environment in the [Installing Plugins From Other Sources](local-test-environment/installing-plugins-other-sources.md) section.
- For advanced features, see the [Advanced Usage](local-test-environment/advanced-usage.md) section.

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).