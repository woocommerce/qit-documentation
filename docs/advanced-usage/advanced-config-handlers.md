# Advanced configuration with custom handlers

## Introduction

While custom handlers primarily focus on fetching and preparing plugins or themes from external sources, you can also leverage them for advanced configuration scenarios. By extending the capabilities of custom handlers and combining them with environment configuration files (qit.yml or qit.json), you gain fine-grained control over how your test environment is built and tailored.

## When to use advanced config handlers

- **Complex dependency graphs:** If your plugin relies on multiple external sources or must be built from several repositories, an advanced config handler can sequentially fetch and prepare each component.
- **Conditional logic:** Implement logic based on environment variables, branch names, or feature flags. For instance, use a different repository branch or build step depending on the test scenario.
- **Integration with private artifact repositories:** Combine authentication tokens, environment variables, and handler logic to fetch code from private registries or services like AWS S3, GCP, or Azure Storage.
- **Version pinning and rollbacks:** Detect version changes (using `populate_extension_versions`) and decide which artifact to use. Allow easy rollbacks by referencing a previous commit or build artifact based on conditions defined in your config.

## Example: dynamic branch selection

Suppose you want to dynamically choose a Git branch based on an environment variable set by your CI pipeline. In your `advanced-handler.php`:

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class DynamicBranchHandler extends CustomHandler {
    public function should_handle(Extension $extension): bool {
        return strpos($extension->extension_identifier, "my-dynamic-plugin") !== false;
    }

    public function populate_extension_versions(array $extensions): void {
        foreach ($extensions as $extension) {
            if ($this->should_handle($extension)) {
                $repo_url = "git@github.com:your-username/your-repo.git";
                $branch = getenv("TEST_BRANCH") ?: "main";

                // Fetch the latest commit from the chosen branch
                exec("git ls-remote $repo_url $branch", $output, $result_code);
                if ($result_code !== 0 || !isset($output[0])) {
                    throw new \Exception("Could not fetch the latest commit ID for branch $branch");
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
                
                // Check the cache
                if (file_exists($cache_path)) {
                    $extension->path = $cache_path;
                    continue;
                }

                $repo_url = "git@github.com:your-username/your-repo.git";
                $branch = getenv("TEST_BRANCH") ?: "main";

                $repo_dir = sys_get_temp_dir() . "/" . uniqid("my-dynamic-plugin-");
                exec("git clone --branch $branch $repo_url $repo_dir 2>&1", $output, $result_code);
                if ($result_code !== 0) {
                    throw new \Exception("Could not clone repository for branch $branch");
                }

                // Run build steps if needed
                chdir($repo_dir);
                exec("npm run build", $output, $result_code);
                if ($result_code !== 0) {
                    throw new \Exception("Build failed for branch $branch");
                }

                $build_zip = "$repo_dir/my-build.zip";
                if (!rename($build_zip, $cache_path)) {
                    throw new \Exception("Could not move the build zip to the cache path");
                }

                if (!file_exists($cache_path)) {
                    throw new \Exception("Build output not found after creation");
                }

                $extension->path = $cache_path;
            }
        }
    }
}
```

By referencing `TEST_BRANCH` as an environment variable, you can set this in your CI pipeline:
```qitbash
qit run:e2e my-dynamic-plugin --env TEST_BRANCH=feature-branch
```

The handler picks the correct branch and commits, ensuring the environment reflects the desired configuration.

## Integrating with configuration files

Define your `my-dynamic-plugin` in `qit.yml`:
```yaml
requires:
  - advanced-handler.php

plugins:
  - my-dynamic-plugin
```

Now, running `qit env:up` or `qit run:e2e my-dynamic-plugin` will automatically invoke the advanced handler, selecting branches, versions, or artifacts based on environment variables or other logic you implement.

## Handling multiple extensions and conditional logic

You can extend the logic in `should_handle` to manage multiple extensions, each with its own fetching and build strategies. For example:
- Use different branches for different plugins.
- Apply caching only to specific plugins.
- Alter build steps if a plugin has a "beta" tag in its name.

The possibilities are limited only by your scripting and environment logic.

## Tips and best practices

- **Keep it modular:** Break down complex logic into smaller functions within your handler to maintain readability.
- **Verbose logging:** Use `$this->output->isVerbose()` or `$this->output->isVeryVerbose()` checks to print debug information. This helps diagnose issues in complex setups.
- **Secure credentials:** If you need authentication tokens for private repositories, store them in environment variables rather than code.
- **Test incrementally:** Start with a simple scenario and add complexity step by step. Validate each new piece of logic before moving on.
