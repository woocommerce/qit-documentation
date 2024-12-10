# Creating configuration files

:::info
The local test environment is available as early-access.
:::

## Introduction

While you can customize your test environment through CLI parameters, configuration files offer a more scalable and team-friendly approach. By defining your WordPress, WooCommerce, PHP versions, and additional plugins or themes in a JSON or YAML file, you ensure consistent setups for every team member without relying on lengthy command-line arguments.

## Benefits of configuration files

- **Consistency:** Store environment options in version-controlled files, ensuring each developer runs tests in the same conditions.
- **Maintainability:** Update a single file rather than editing multiple CLI commands or scripts.
- **Portability:** New team members can spin up the exact environment by simply running 'qit env:up' after pulling the repository.

## Supported formats

QIT accepts both JSON and YAML files named 'qit.json' or 'qit.yml'. For example:
- 'qit.json'
- 'qit.yml'

If both are present, QIT will prioritize one format (YAML typically has priority if both exist). Check QIT’s documentation or run 'qit env:up --help' for details.

## Example configurations

### JSON example

```json
{
  "wordpress_version": "rc",
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

### YAML example

```yaml
wordpress_version: rc
php_version: 7.4
plugins:
  - woocommerce
  - akismet
themes:
  - storefront
volumes:
  - "/local/path:/container/path"
php_extensions:
  - gd
  - imagick
object_cache: true
```

## Using the config file

Place the file (`qit.json` or `qit.yml`) in the root of your project directory. Running `qit env:up` uses the settings automatically. If you previously passed parameters via the CLI, consider removing them from scripts and rely on the config file for a cleaner, more maintainable setup.

## Overriding with command-line arguments

Command-line flags override config file settings. For example, if `qit.yml` sets `php_version: 7.4` but you run:
`qit env:up --php_version=8.0`
the environment will use PHP 8.0 despite the config file.

This allows you to temporarily test different conditions without permanently altering the configuration file.

## Tips

- **Start simple:** Begin with essential settings (WordPress version, PHP version, plugins) before adding complex setups.
- **Version control:** Commit `qit.json` or `qit.yml` to your repository. Other team members can run `qit env:up` immediately, ensuring consistent environments.
- **Iterate as needed:** As you discover new requirements, update the config file and share it with your team.

## Next steps

- [Installing Plugins and Themes](./installing-plugins-and-themes.md): Learn how to specify additional plugins or themes directly in your configuration files.
- [Tunnel Options](../environment/tunnel.md): Explore how to configure tunnels and advanced options for more complex testing scenarios.
- [Environment & Configuration](../environment/introduction.md): Dive deeper into customizing every aspect of your test environment for maximum flexibility and reliability.
