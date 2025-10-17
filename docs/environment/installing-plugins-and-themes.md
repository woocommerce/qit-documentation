# Installing plugins and themes

## Introduction

When setting up your local test environment, you often need specific plugins or themes to replicate real-world conditions. Whether testing your extension’s compatibility with WooCommerce, Gutenberg, or a popular theme, QIT makes it easy to install these components as part of your test environment setup.

## Installing from wordpress.org

If the plugin or theme is available on WordPress.org:
- **CLI flags:** Use `--plugin` or `--themes` with `qit env:up`:
  `qit env:up --plugin=woocommerce --plugin=contact-form-7 --themes=storefront`

- **Configuration file (qit.json):** Add them to your environment configuration:
  ```json
  {
    "environments": {
      "default": {
        "wp": "rc",
        "php": "8.0",
        "plugins": [
          "woocommerce",
          "contact-form-7"
        ],
        "themes": [
          "storefront"
        ]
      }
    }
  }
  ```

Now run `qit env:up` without extra parameters to load these plugins and themes automatically.

## Installing woocommerce.com extensions

If you have access to premium plugins from the WooCommerce Marketplace, QIT can install them if your account is authenticated. Simply reference them by slug in your config or CLI. QIT uses your authentication credentials to fetch and install these premium extensions.

## Local zips and custom sources

For plugins and themes not on WordPress.org or the WooCommerce Marketplace, you can install them by passing a zip file or pointing to a local directory:

```bash
# Local zip files
qit env:up --plugin=./my-custom-plugin.zip --theme=./my-local-theme.zip

# Local directories
qit env:up --plugin=./relative/path/to/my-extension
```

If you have them in a local directory with a proper `my-extension.php` file, QIT can load them directly.

### Explicit Slug Format

When using local paths, QIT infers the plugin slug from the filename or directory name. To avoid inference issues (especially with version numbers in filenames), you can explicitly specify the slug:

```bash
# Format: slug@path
qit env:up --plugin=my-plugin@./builds/my-plugin-v2.0.0.zip

# Prevents inference warnings
qit env:up --plugin=payment-gateway@./payment-gateway

# Multiple plugins with explicit slugs
qit env:up \
  --plugin=my-plugin@./my-plugin.zip \
  --plugin=test-helper@../helpers/test-helper.zip
```

**When to use explicit slugs:**
- Filenames contain version numbers (e.g., `plugin-1.2.3.zip`)
- Directory name doesn't match the plugin slug
- You want to be explicit and avoid warnings
- Working in CI/CD pipelines where clarity is important

This flexibility ensures you can test pre-release versions, private repositories, or custom forks without publishing them first.

## Combining multiple sources

Mix and match sources:
- Include plugins from WordPress.org, WooCommerce.com premium extensions, and local zips.
- Use a combination of CLI flags and configuration files for maximum convenience.

For example, a `qit.json` file:
```json
{
  "environments": {
    "default": {
      "wp": "stable",
      "php": "8.1",
      "plugins": [
        "woocommerce",
        {
          "slug": "my-custom-plugin",
          "from": "local",
          "path": "./my-custom-plugin.zip"
        }
      ],
      "themes": [
        "storefront"
      ]
    }
  }
}
```

Run `qit env:up` and QIT installs WooCommerce from WordPress.org and your custom plugin from the zip file.

### Path Resolution in Configuration Files

When using local paths in qit.json:
- **Relative paths** are resolved relative to the qit.json file location
- **Absolute paths** are used as-is

```json
{
  "environments": {
    "default": {
      "plugins": [
        {
          "slug": "my-plugin",
          "from": "local",
          "path": "../my-plugin"
        }
      ]
    }
  }
}
```

If qit.json is in `/project/tests/qit.json`, the path `../my-plugin` resolves to `/project/my-plugin`.

## Verifying installations

After QIT finishes provisioning, run:
`qit env:list`
to see active environments and `qit env:enter` to inspect the WordPress installation. Check `Plugins` or `Appearance > Themes` in wp-admin to confirm the components are installed as expected.
