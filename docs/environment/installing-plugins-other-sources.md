# Installing Plugins and Themes From Other Sources in QIT Local Test Environment

## Introduction

The QIT Local Test Environment offers the flexibility to install plugins and themes from various sources, including private repositories, custom sources, or marketplaces like Envato. This guide outlines the process for extending your environment with these external resources.

## Implementing Custom Handlers

### Understanding Custom Handlers

Custom handlers allow QIT to integrate with external sources for plugin and theme installation. They are particularly useful for fetching extensions from premium marketplaces or private repositories that QIT does not support natively.

### Creating a Custom Handler

- **Extend the CustomHandler Class**: Create a new class that extends the `CustomHandler` abstract class provided by QIT.
- **Implement Required Methods**: Your custom handler must implement methods like `should_handle`, `populate_extension_versions`, and `maybe_download_extensions`.
- **Use the Custom Handler**: Include your custom handler file using the `--require` flag when starting QIT. For example, `qit env:up --require=my-custom-handler.php`.

### Example Custom Handler

Let's implement a custom handler that will "handle" when we call `--plugins my-custom-plugin`.

You can get really creative with this, and essentially do anything you want.

```php
class MyPrivateGitHubHandler extends \QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler {
    public function should_handle( Extension $extension ): bool {
        return strpos( $extension->extension_identifier, 'my-custom-plugin' ) !== false;
    }

    public function populate_extension_versions( array $extensions ): void {
         // We could fetch the commit ID on the remote to use it as $version, but skip this to keep the example simple.
    }

    public function maybe_download_extensions( array $extensions, string $cache_dir ): void {
         foreach ( $extensions as $extension ) {
            if ( $this->should_handle( $extension ) ) {     
                // Creates a temporary directory to clone the GitHub repository.           
                $temp_repo = sys_get_temp_dir() . uniqid( 'my-custom-plugin-' );
                
                // Clones it using `git`, which has authentication already.
                passthru( "git clone https://github.com/your-github-username/my-custom-plugin.git {$clone_path}" );
                
                // Changes the current directory to the cloned repository.
                chdir( $clone_path );
                
                // Assuming your extension has a build script, we can run it here.
                passthru( "npm run build" );
                
                // Assuming 'npm run build' creates a zip file named 'my-build.zip'
                $build_zip = "{$temp_repo}/my-build.zip";
                
                if ( file_exists( $build_zip ) ) {
                    $extension->path = $build_zip;
                } else {
                    throw new \Exception( "Build failed" );
                }
            }
        }
    }
}
```

In this example, we will clone our private repo to a temp directory, build it, and use the resulting zip file in our environment.

## Using the Custom Handler

Once you have implemented your custom handler, you can use it by including it with the `--require` option in the QIT command. Your handler will then be invoked for any plugins or themes that meet its handling criteria, eg:

```shell
qit env:up --require=my-custom-handler.php --plugins=my-custom-plugin
```

Or add to the config File:

JSON:
    
```json
{
"require": "my-custom-handler.php"
}
```

YML:

```yaml
require: "my-custom-handler.php"
```

## Tips and Best Practices

- **Test Your Handler**: Ensure your custom handler works as expected in various scenarios.
- **Handle Dependencies**: If your plugin or theme has dependencies, ensure your handler can resolve them.
- **Security**: Always consider security implications when fetching from external sources.

For more advanced usage and customization options, explore our [Advanced Usage](local-test-environment/advanced-usage.md) section or visit the [Troubleshooting](local-test-environment/troubleshooting.md) guide for any issues.
