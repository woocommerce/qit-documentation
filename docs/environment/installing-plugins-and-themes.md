# Installing Plugins and Themes

:::info
The local test environment is available as early-access.
:::

## Introduction

When setting up your local test environment, you often need specific plugins or themes to replicate real-world conditions. Whether testing your extension’s compatibility with WooCommerce, Gutenberg, or a popular theme, QIT makes it easy to install these components as part of your test environment setup.

## Installing from WordPress.org

If the plugin or theme is available on WordPress.org:
- **CLI Flags:** Use `--plugin` or `--themes` with `qit env:up`:
  `qit env:up --plugin=woocommerce --plugin=contact-form-7 --themes=storefront`

- **Configuration File:** Add them to 'qit.yml':
  ```yaml
  wordpress_version: rc
  php_version: 8.0
  plugins:
    - woocommerce
    - contact-form-7
  themes:
    - storefront
    ```

Now run `qit env:up` without extra parameters to load these plugins and themes automatically.

## Installing WooCommerce.com Extensions

If you have access to premium plugins from the WooCommerce Marketplace, QIT can install them if your account is authenticated. Simply reference them by slug in your config or CLI. QIT uses your authentication credentials to fetch and install these premium extensions.

## Local Zips and Custom Sources

For plugins and themes not on WordPress.org or the WooCommerce Marketplace, you can install them by passing a zip file or pointing to a local directory:
`qit env:up --plugin=./my-custom-plugin.zip --themes=./my-local-theme.zip`

If you have them in a local directory with a proper `my-extension.php` file, QIT can load them directly:
`qit env:up --plugin=./relative/path/to/my-extension`

This flexibility ensures you can test pre-release versions, private repositories, or custom forks without publishing them first.

## Combining Multiple Sources

Mix and match sources:
- Include plugins from WordPress.org, WooCommerce.com premium extensions, and local zips.
- Use a combination of CLI flags and configuration files for maximum convenience.

For example, a `qit.yml` file:
```yaml
wordpress_version: stable
php_version: 8.1
plugins:
  - woocommerce
  - ./my-custom-plugin.zip
themes:
  - storefront
```

Run `qit env:up` and QIT installs WooCommerce from WordPress.org and your custom plugin from the zip file.

## Verifying Installations

After QIT finishes provisioning, run:
`qit env:list`
to see active environments and `qit env:enter` to inspect the WordPress installation. Check `Plugins` or `Appearance > Themes` in wp-admin to confirm the components are installed as expected.

## Next Steps

- [Installing from Other Sources](./installing-from-other-sources.md): If you need to fetch plugins or themes from non-standard repositories, explore how to implement custom handlers.
- [Tunneling](./tunnel.md): If testing external integrations (like SaaS services or APIs), consider using a tunnel to make your local environment accessible over the internet.
- [Environment & Configuration](../environment/introduction.md): Learn more about refining your test environment setup and integrating advanced features.
