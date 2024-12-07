# Installing plugins and themes from other sources

:::info
The local test environment is available as early-access.
:::

## Introduction

While QIT supports installing plugins and themes from WordPress.org and local zip files, you may need to fetch extensions from premium marketplaces, private repositories, or other specialized sources that QIT does not natively support. Custom handlers allow you to define exactly how QIT should retrieve, build, and prepare these extensions before installing them into your test environment.

## Implementing Custom Handlers

### Understanding Custom Handlers

Custom handlers integrate QIT with external sources, making it possible to install plugins or themes from places like private GitHub repositories, premium marketplaces, or artifact registries. By customizing their behavior, you can implement additional build steps, authentication, or caching logic.

### Creating a Custom Handler

1. `Extend the CustomHandler Class:`  
   Create a new class that extends `CustomHandler` provided by QIT.

2. `Implement Required Methods:`
    - `should_handle`: Determine if the given extension slug should be handled by this class.
    - `populate_extension_versions`: Optionally define a version or commit hash for caching.
    - `maybe_download_extensions`: Fetch, build, or download the extension and set its `path` attribute to the resulting file.

3. `Use the Custom Handler:`  
   Include the custom handler file with `qit env:up --require=my-custom-handler.php` or specify it in `qit.yml`. QIT will then invoke your handler to fetch the specified extensions.

### Example Custom Handlers

Below are several examples to illustrate different scenarios. Adjust them to meet your project's needs.

#### Example 1: Fetching from a Public GitHub Repository

Assume you have a public GitHub repo hosting a WordPress plugin on the 'main' branch.

Command:
`qit env:up --requires=public-handler.php --plugins=my-public-plugin`

Or in `qit.yml`:
```yaml
plugins:
  - my-public-plugin
requires:
  - public-handler.php
```

`public-handler.php`:
```php
<?php
use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class PublicHandlerExample extends CustomHandler {
    public function should_handle( Extension $extension ): bool {
        return strpos( $extension->extension_identifier, "my-public-plugin" ) !== false;
    }

    public function populate_extension_versions( array $extensions ): void {
        // No caching needed here.
    }

    public function maybe_download_extensions( array $extensions, string $cache_dir ): void {
        foreach ( $extensions as $extension ) {
            if ( $this->should_handle( $extension ) ) {
                $zip_url = "https://github.com/your-username/your-repo/archive/refs/heads/main.zip";
                $zip_file = sys_get_temp_dir() . "/" . uniqid("my-custom-plugin-") . ".zip";

                if ( file_put_contents($zip_file, file_get_contents($zip_url)) === false ) {
                    throw new \Exception("Could not download ZIP file");
                }

                if ( file_exists($zip_file) ) {
                    $extension->path = $zip_file;
                } else {
                    throw new \Exception("ZIP file not found after download");
                }
            }
        }
    }
}
```

#### Example 2: Fetching from a Private GitHub Repository

For private repositories requiring authentication, you can use git clone and git archive commands to fetch and zip the code before installation.

Command:
`qit env:up --requires=private-handler.php --plugins=my-private-plugin`

Or in `qit.yml`:
```yaml
plugins:
  - my-private-plugin
requires:
  - private-handler.php
```

`private-handler.php`:
```php
<?php
use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class PrivateGitHubHandler extends CustomHandler {
    public function should_handle( Extension $extension ): bool {
        return strpos( $extension->extension_identifier, "my-private-plugin" ) !== false;
    }

    public function populate_extension_versions( array $extensions ): void {
        // No caching logic here, but you could add it if desired.
    }

    public function maybe_download_extensions(array $extensions, string $cache_dir): void {
        foreach ($extensions as $extension) {
            if ($this->should_handle($extension)) {
                $repo_url = "git@github.com:your-github-username/my-custom-plugin.git";
                $branch = "main";

                $repo_dir = sys_get_temp_dir() . "/" . uniqid("my-custom-plugin-");
                $zip_file = $repo_dir . ".zip";

                $git_clone_cmd = "git clone --branch $branch $repo_url $repo_dir";
                $git_archive_cmd = "git -C $repo_dir archive --format=zip --output $zip_file HEAD";

                exec($git_clone_cmd, $output, $result_code);
                if ($result_code !== 0) {
                    throw new \Exception("Could not clone the repository: " . implode("\n", $output));
                }

                exec($git_archive_cmd, $output, $result_code);
                if ($result_code !== 0) {
                    throw new \Exception("Could not create ZIP file: " . implode("\n", $output));
                }

                if ( file_exists($zip_file) ) {
                    $extension->path = $zip_file;
                } else {
                    throw new \Exception("ZIP file not found after creation");
                }
            }
        }
    }
}
```

#### Example 3: Building, Caching, and Using a Specific Commit

This example:
- Clones a private repo.
- Finds the latest commit ID for caching.
- Runs `npm run build` to produce a `my-build.zip`.
- Caches the built zip for future runs unless the commit changes.

Command:
`qit env:up --requires=advanced-handler.php --plugins=my-advanced-plugin`

Or in `qit.yml`:
```yaml
plugins:
  - my-advanced-plugin
requires:
  - advanced-handler.php
```

`advanced-handler.php`:
```php
<?php
use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class AdvancedGitHubHandler extends CustomHandler {
    public function should_handle(Extension $extension): bool {
        return strpos($extension->extension_identifier, "my-advanced-plugin") !== false;
    }

    public function populate_extension_versions(array $extensions): void {
        foreach ($extensions as $extension) {
            if ($this->should_handle($extension)) {
                $repo_url = "git@github.com:your-username/your-repo.git";
                $branch = "main";

                exec("git ls-remote $repo_url $branch", $output, $result_code);
                if ($result_code !== 0 || !isset($output[0])) {
                    throw new \Exception("Could not fetch the latest commit ID");
                }

                $latest_commit_id = explode("\t", $output[0])[0];
                $extension->version = $latest_commit_id;
            }
        }
    }

    public function maybe_download_extensions(array $extensions, string $cache_dir): void {
        foreach ($extensions as $extension) {
            if ($this->should_handle($extension)) {
                $cache_path = $this->make_cache_path($cache_dir, $extension->type, $extension->extension_identifier, $extension->version, "-");

                if (file_exists($cache_path)) {
                    if ($this->output->isVeryVerbose()) {
                        $this->output->writeln("Using cached {$extension->type} {$extension->extension_identifier}.");
                    }
                    $extension->path = $cache_path;
                    continue;
                } else {
                    if ($this->output->isVeryVerbose()) {
                        $this->output->writeln("Cache miss on {$extension->type} {$extension->extension_identifier}.");
                    }

                    $repo_dir = sys_get_temp_dir() . "/" . uniqid("my-custom-plugin-");
                    exec("git clone git@github.com:your-username/your-repo.git $repo_dir 2>&1", $output, $result_code);
                    if ($result_code !== 0) {
                        throw new \Exception("Could not clone repository");
                    }

                    if ($this->output->isVerbose()) {
                        foreach ($output as $line) {
                            $this->output->writeln($line);
                        }
                    }

                    chdir($repo_dir);
                    exec("npm run build", $output, $result_code);
                    if ($result_code !== 0) {
                        throw new \Exception("Build failed");
                    }

                    if ($this->output->isVerbose()) {
                        foreach ($output as $line) {
                            $this->output->writeln($line);
                        }
                    }

                    $build_zip = "$repo_dir/my-build.zip";

                    if (!rename($build_zip, $cache_path)) {
                        throw new \Exception("Could not move the build zip to the cache path");
                    }

                    if (file_exists($cache_path)) {
                        $extension->path = $cache_path;
                    } else {
                        throw new \Exception("Build failed");
                    }
                }
            }
        }
    }
}
```

## Using the Custom Handler

Include your handler using:
`qit env:up --requires=my-custom-handler.php --plugins=my-custom-plugin`

Or in `qit.yml`:
```yaml
requires:
  - my-custom-handler.php
```

QIT will invoke your handler for the specified plugin.

### Multiple Custom Handlers

You can define multiple handlers:
```yaml
requires:
  - public-handler.php
  - private-handler.php
  - advanced-handler.php

plugins:
  - my-public-plugin
  - my-private-plugin
  - my-advanced-plugin
```

QIT attempts each handler until it finds one that can handle the specified plugin.

## Tips and Best Practices

- `Test Your Handler`: Ensure it correctly downloads and sets up plugins in various scenarios.
- `Handle Dependencies`: Resolve plugin dependencies (like submodules or external packages).
- `Security`: Avoid hardcoding secrets; rely on environment variables or QIT's authentication.
- `Caching for Speed`: Use commit hashes or versions to skip unnecessary rebuilds.

## Support

For guidance or issues, open an issue on the QIT GitHub repository. With custom handlers, you can fetch plugins and themes from any source, maintaining a flexible and powerful local testing environment.