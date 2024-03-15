# Configuration Options for QIT Local Test Environment

## Introduction

Customizing your QIT Local Test Environment is key to aligning it with your specific development or testing requirements. This document covers the various configuration options available to tailor your environment.

## WordPress Version

- **Overview**: Choose the specific version of WordPress for your test environment.
- **Usage**: Specify the version using the `--wordpress_version` flag in the `qit env:up` command.
- **Example**: To use WordPress version rc, run `qit env:up --wordpress_version=rc`.

## PHP Version

- **Overview**: Test your project with different PHP versions to ensure compatibility.
- **Usage**: The `--php_version` flag allows selection of the PHP version.
- **Example**: To set PHP to version 7.4, execute `qit env:up --php_version=7.4`.

## Plugins and Themes

- **Overview**: Easily include plugins and themes in your test environment.
Accepts WordPress.org plugin slugs, Woo.com product slugs, permalinks, IDs, and direct zip URLs.
You can also download build and install plugins and themes from private GitHub repositories or other marketplaces with [Custom Handlers](installing-plugins-other-sources.md).
- **Usage**: Add plugins and themes using the `--plugins` and `--themes` flags respectively.
- **Example**: To include a specific plugin, run `qit env:up --plugins=plugin-slug`.

## Volume Mapping

- **Overview**: Map local directories to your test environment, useful for plugin/theme development.
- **Usage**: Use the `--volumes` flag to specify directory mappings.
- **Example**: `qit env:up --volumes=/local/path:/container/path`.

## PHP Extensions

- **Overview**: Customize the PHP environment with necessary extensions.
- **Usage**: Specify extensions with the `--php_extensions` flag.
- **Example**: For GD and Imagick extensions, `qit env:up --php_extensions=gd --php_extensions=imagick`.

## Object Cache

- **Overview**: Enable Redis Object Cache for advanced testing scenarios.
- **Usage**: Use the `--object_cache` flag to enable this feature.
- **Example**: `qit env:up --object_cache`.

## Advanced Configurations

- **Custom Config Files**: Create JSON or YAML config files for preset environment setups. Place these files in your project directory.
- **Example Config File**:
  ```yaml
  wordpress_version: "rc"
  php_version: "7.4"
  plugins:
    - "woocommerce"
    - "akismet"
  themes:
    - "storefront"
    ```

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).
