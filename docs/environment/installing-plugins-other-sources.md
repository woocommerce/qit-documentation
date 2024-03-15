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

### Example Custom Handlers

You can get really creative with this, and essentially do anything you want. Here are a few examples to get you started:

#### Example 1: Fetching from a Public GitHub Repository

This example assumes that you have a public GitHub repository and want to use it as a plugin in your environment.

We assume for simplicity purposes, that the GitHub Repository is a WordPress plugin, and that it has a `main` branch.

Example command: `qit env:up --requires=public-handler.php --plugins=my-public-plugin`

Or just `qit env:up` if you have this `qit-env.yml` file:

```yaml
plugins:
  - my-public-plugin
requires:
  - public-handler.php
```

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class PublicHandlerExample extends CustomHandler {
	public function should_handle( Extension $extension ): bool {
		return strpos( $extension->extension_identifier, 'my-public-plugin' ) !== false;
	}

	public function populate_extension_versions( array $extensions ): void {
		// No need to do anything here if we don't plan to cache it.
	}

	/**
	 * @param array<Extension> $extensions
	 */
	public function maybe_download_extensions( array $extensions, string $cache_dir ): void {
		foreach ( $extensions as $extension ) {
			if ( $this->should_handle( $extension ) ) {
				// The URL of the GitHub repository ZIP file.
				$zip_url = 'https://github.com/your-username/your-repo/archive/refs/heads/main.zip';

				// Creates a unique file name for the ZIP file.
				$zip_file = sys_get_temp_dir() . '/' . uniqid( 'my-custom-plugin-' ) . '.zip';

				if ( file_put_contents( $zip_file, file_get_contents( $zip_url ) ) === false ) {
					throw new \Exception( "Could not download ZIP file" );
				}

				if ( file_exists( $zip_file ) ) {
					$extension->path = $zip_file;
				} else {
					throw new \Exception( "ZIP file not found after download" );
				}
			}
		}
	}
}
```

In this example, we will clone our public repo to a temp directory, create a zip of it and use the zip as a plugin in our environment.

#### Example 2: Fetching from a Private GitHub Repository

This example is similar to the previous one, but it assumes that the GitHub repository is private and requires authentication.

Example command: `qit env:up --requires=private-handler.php --plugins=my-private-plugin`

Or just `qit env:up` if you have this `qit-env.yml` file:

```yaml
plugins:
  - my-private-plugin
requires:
  - private-handler.php
```

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class PrivateGitHubHandler extends CustomHandler {
	public function should_handle( Extension $extension ): bool {
		return strpos( $extension->extension_identifier, 'my-private-plugin' ) !== false;
	}

	public function populate_extension_versions( array $extensions ): void {
		// No need to do anything here if we don't plan to cache it.
	}

    /**
    * @param array<Extension> $extensions
    */
    public function maybe_download_extensions(array $extensions, string $cache_dir): void {
        foreach ($extensions as $extension) {
            if ($this->should_handle($extension)) {
                // Define the GitHub repository URL.
                $repo_url = 'git@github.com:your-github-username/my-custom-plugin.git';
                $branch = 'main';
    
                // Create a unique directory and file name for the repository clone and ZIP file.
                $repo_dir = sys_get_temp_dir() . '/' . uniqid('my-custom-plugin-');
                $zip_file = $repo_dir . '.zip';
    
                // Git commands to clone the repository and create a ZIP archive of the specified branch.
                $git_clone_cmd = "git clone --branch $branch $repo_url $repo_dir";
                $git_archive_cmd = "git -C $repo_dir archive --format=zip --output $zip_file HEAD";
    
                // Execute the Git clone command.
                exec( $git_clone_cmd, $output, $result_code );
    
                // Check if the clone was successful.
                if ( $result_code !== 0 ) {
                    throw new \Exception("Could not clone the repository: " . implode("\n", $output));
                }
    
                // Execute the Git archive command.
                exec( $git_archive_cmd, $output, $result_code );
    
                // Check if the archive command was successful.
                if ( $result_code !== 0 ) {
                    throw new \Exception("Could not create ZIP file: " . implode("\n", $output));
                }
    
                if ( file_exists( $zip_file ) ) {
                    $extension->path = $zip_file;
                } else {
                    throw new \Exception("ZIP file not found after creation");
                }
            }
        }
    }
}
```

#### Example 3: Fetching from a Private GitHub Repository, building it, and caching the build file

You can get really creative with custom handlers. In this example, we will:

- Clone a remote GitHub repository locally
- Run a build script
- Use the resulting zip file in our environment
- Cache the build file for future use
- Whenever the remote repository changes, we will clone it again, re-build, and re-cache the zip file.

Example command: `qit env:up --requires=advanced-handler.php --plugins=my-advanced-plugin`

Or just `qit env:up` if you have this `qit-env.yml` file:

```yaml
plugins:
  - my-advanced-plugin
requires:
    - advanced-handler.php
```

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class AdvancedGitHubHandler extends CustomHandler {
	public function should_handle( Extension $extension ): bool {
		// If the plugin slug is "my-custom-plugin", we handle it here.
		return strpos( $extension->extension_identifier, 'my-advanced-plugin' ) !== false;
	}

	/**
	 * The only purpose of this method is to set "$extension->version" on the extensions
	 * that it handles. It's fine to ignore this method completely if you don't plan to
	 * support caching (eg: you will download it every time the environment runs).
	 *
	 * @param array<Extension> $extensions An array with all extensions to install in the environment.
	 *
	 * @return void
	 */
	public function populate_extension_versions( array $extensions ): void {
		foreach ( $extensions as $extension ) {
			if ( $this->should_handle( $extension ) ) {
				/*
				 * In this example, we are installing a plugin that exists in a remote GitHub Repository,
				 * so we will set $extension->version to the last commit ID on remote.
				 */

				// Here we set an example GitHub repository that we will be reading from. This could be a private repo, for instance.
				$repo_url = 'git@github.com:your-username/your-repo.git';

				/*
				 * We will hardcode the branch to keep the example simple, but we could
				 * get creative and use a format like this "my-custom-plugin#my-branch":
				 *
				 * [ $repo, $branch ] = explode( '#', $extension->extension_identifier );
				 */
				$branch = 'main';

				// Example output: "cde7540d569b29772f95161513835e1a596c419c        refs/heads/trunk"
				exec( "git ls-remote $repo_url $branch", $output, $result_code );

				if ( $result_code !== 0 || ! isset( $output[0] ) ) {
					throw new \Exception( "Could not fetch the latest commit ID" );
				}

				/*
				 * Here we explode the first line of the output ($output[0]),
				 * using the tab character as the delimiter, and we get the first element,
				 * which will be the commit ID.
				 */
				$latest_commit_id = explode( "\t", $output[0] )[0];

				// Set the version to the latest commit ID.
				// This way, we will always use a local cache, and only download it again when the remote ID changes.
				$extension->version = $latest_commit_id;
			}
		}
	}

	public function maybe_download_extensions( array $extensions, string $cache_dir ): void {
		foreach ( $extensions as $extension ) {
			if ( $this->should_handle( $extension ) ) {
				$cache_path = $this->make_cache_path( $cache_dir, $extension->type, $extension->extension_identifier, $extension->version, '-' );

				// Cache hit?
				if ( file_exists( $cache_path ) ) {
					if ( $this->output->isVeryVerbose() ) {
						$this->output->writeln( "Using cached {$extension->type} {$extension->extension_identifier}." );
					}
					$extension->path = $cache_path;
					continue;
				} else {
					if ( $this->output->isVeryVerbose() ) {
						$this->output->writeln( "Cache miss on {$extension->type} {$extension->extension_identifier}." );
					}

					// Creates a temporary directory to clone the GitHub repository.
					$repo_dir = sys_get_temp_dir() . '/' . uniqid( 'my-custom-plugin-' );

					// Clones it using `git`, which has authentication already.
					exec( "git clone git@github.com:your-username/your-repo.git $repo_dir 2>&1", $output, $result_code );

					if ( $result_code !== 0 ) {
						throw new \Exception( "Could not clone repository" );
					}

					if ( $this->output->isVerbose() ) {
						foreach ( $output as $line ) {
							$this->output->writeln( $line );
						}
					}

					// Changes the current directory to the cloned repository.
					chdir( $repo_dir );

					// Assuming your extension has a build script, we can run it here.
					exec( "npm run build", $output, $result_code );

					if ( $result_code !== 0 ) {
						throw new \Exception( "Build failed" );
					}

					if ( $this->output->isVerbose() ) {
						foreach ( $output as $line ) {
							$this->output->writeln( $line );
						}
					}

					// Assuming 'npm run build' creates a zip file named 'my-build.zip'
					$build_zip = "$repo_dir/my-build.zip";

					// Save to cache.
					if ( ! rename( $build_zip, $cache_path ) ) {
						throw new \Exception( "Could not move the build zip to the cache path" );
					}

					if ( file_exists( $cache_path ) ) {
						// This is ultimately what this method should do: set the path to the zip file on $extension.
						$extension->path = $cache_path;
					} else {
						throw new \Exception( "Build failed" );
					}
				}
			}
		}
	}
}
```

## Using the Custom Handler

Once you have implemented your custom handler, you can use it by including it with the `--requires` option in the QIT command. Your handler will then be invoked for any plugins or themes that meet its handling criteria, eg:

```shell
qit env:up --requires=my-custom-handler.php --plugins=my-custom-plugin
```

Or add to the config File:

JSON:
    
```json
{
    "requires": [
      "my-custom-handler.php"
    ]
}
```

YML:

```yaml
requires
  - my-custom-handler.php
```

### Using Multiple Custom Handlers

You can use multiple custom handlers by including them in your config files, or at runtime with the `--requires` option in the QIT command. For example:

`qit-env.yml`

```yaml
plugins:
    - my-public-plugin
    - my-private-plugin
    - my-plugin-that-needs-build
requires:
  - public-handler.php
  - private-handler.php
  - advanced-handler.php
```

When you run `qit:up`, QIT will use the custom handlers to fetch the plugins and themes from the specified sources.

## Tips and Best Practices

- **Test Your Handler**: Ensure your custom handler works as expected in various scenarios.
- **Handle Dependencies**: If your plugin or theme has dependencies, ensure your handler can resolve them.
- **Security**: Always consider security implications when fetching from external sources.

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).
