# Creating Configuration Files for QIT Local Test Environment

## Introduction

In the QIT Local Test Environment, configuration files are a powerful way to predefine and standardize environment settings. This guide explains how to create and use JSON or YAML configuration files for your testing environments.

## Creating a Configuration File

### 1. File Format

- **JSON or YAML**: You can create configuration files in either JSON or YAML format.
- **Naming**: Name your file `qit-env.json` or `qit-env.yml`. For overrides, use `qit-env.override.json` or `qit-env.override.yml`.

### 2. Configuration Options

Include any of the following options in your configuration file:
- `wordpress_version`: Specify the version of WordPress.
- `woocommerce_version`: Define the WooCommerce version.
- `php_version`: Set the PHP version.
- `plugins`: List plugins to be included.
- `themes`: Specify themes to be used.
- `volumes`: Define any volume mappings.
- `php_extensions`: List any PHP extensions needed.
- `object_cache`: Enable or disable Redis Object Cache.

### 3. Example Configurations

**JSON Example**:
```json
{
  "wordpress_version": "5.8",
  "woocommerce_version": "4.5",
  "php_version": "7.4",
  "plugins": [
    "woocommerce",
    "akismet"
  ],
  "themes": [
    "storefront"
  ],
  "volumes": [
    "/local/path:/container/path"
  ],
  "php_extensions": [
    "gd",
    "imagick"
  ],
  "object_cache": true
}
```

**YAML Example**:
```yaml
wordpress_version: "5.8"
woocommerce_version: "4.5"
php_version: "7.4"
plugins:
  - "woocommerce"
  - "akismet"
themes:
  - "storefront"
volumes:
  - "/local/path:/container/path"
php_extensions:
  - "gd"
  - "imagick"
object_cache: true
```

## Using Configuration Files

1. **Place the File**: Put your configuration file in the root of your project directory, or in the directory where you run QIT commands.
2. **Run QIT**: When you start QIT (`qit env:up`), it automatically detects the config file in the current directory and applies settings from your configuration file.
3. **Overriding Configurations**: Command line flags will override settings in the configuration file. For example, `qit env:up --php_version=8.0` will use PHP 8.0 regardless of what's set in the config file.

## Tips

- Use override files for temporary or environment-specific settings.
- Keep your main config file under version control to maintain consistency across your team.

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).