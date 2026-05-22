---
description: "Guide to PHP debugging in QIT environments with Xdebug. Covers step debugging (breakpoints, variable inspection), profiling (cachegrind), and tracing. Explains --xdebug flag usage, IDE setup for PhpStorm and VS Code, path mappings, output directory for profile/trace files, qit.json configuration, and advanced options (port override via XDEBUG_CONFIG, custom ini via --volume)."
---

# Xdebug debugging

## Introduction

QIT environments include Xdebug pre-installed but disabled by default. The `--xdebug` flag activates it on demand with zero configuration, enabling:

- **Step debugging** — set breakpoints, inspect variables, step through code
- **Profiling** — generate cachegrind files to find performance bottlenecks
- **Tracing** — log every function call for execution flow analysis

:::tip AI-agent debugging
Using an AI coding agent? It can drive Xdebug directly via [Xdebug MCP](https://github.com/kpanuragh/xdebug-mcp), setting breakpoints and inspecting variables conversationally with no IDE needed. See [Recommended Tools](/ai/recommended-tools) for the full AI toolkit.
:::

## Quick start

```qitbash
qit env:up --xdebug
```

This starts an environment with Xdebug in **debug** mode (step debugging). Your IDE can connect on port **9003** to set breakpoints and inspect PHP execution.

Verify it's working:

```bash
docker exec <php_container> php -i | grep xdebug.mode
# xdebug.mode => debug => debug
```

The PHP container name is shown as `qit_env_php_<env_id>` in the environment output.

## Modes

### Debug (default)

Step debugging with breakpoints and variable inspection:

```qitbash
qit env:up --xdebug
```

### Profile

Generate cachegrind files for performance analysis:

```qitbash
qit env:up --xdebug=profile
```

Cachegrind files are saved to the **output directory** shown in the environment summary. Open them with [KCachegrind](https://kcachegrind.github.io/), [QCacheGrind](https://sourceforge.net/projects/qcachegrindwin/), or PhpStorm's built-in profiler.

### Trace

Log every function call with parameters and return values:

```qitbash
qit env:up --xdebug=trace
```

Trace files are saved to the same output directory.

### Combined modes

Combine modes with commas:

```qitbash
qit env:up --xdebug=debug,develop
```

The `develop` mode enhances `var_dump()` output and error pages — useful alongside step debugging.

## IDE setup

When `--xdebug` is used, the environment summary shows path mappings:

```
Xdebug:      Enabled (mode=debug, port=9003)
Output dir:  /path/to/temporary-envs/e2e-qitenvXXX/xdebug-output
Path mappings (host -> container):
  /home/user/my-plugin -> /var/www/html/wp-content/plugins/my-plugin
```

### PhpStorm

1. Go to **Settings → PHP → Debug** and set Xdebug port to **9003**
2. Go to **Settings → PHP → Servers**, add a server:
   - Host: `localhost`
   - Port: the nginx port from the environment output
   - Debugger: Xdebug
   - Check **Use path mappings** and map your local plugin directory to its container path (shown in the environment output)
3. Click **Start Listening for PHP Debug Connections** (phone icon in toolbar)
4. Set a breakpoint and trigger a page load — PhpStorm will catch it

### VS Code

1. Install the [PHP Debug extension](https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug)
2. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/var/www/html/wp-content/plugins/my-plugin": "${workspaceFolder}"
      }
    }
  ]
}
```

3. Replace the path mapping with the paths shown in your environment output
4. Start debugging (F5), set a breakpoint, trigger a page load

## Output directory

When Xdebug is enabled in any mode, an output directory is automatically mounted:

- **Container path:** `/tmp/xdebug-output`
- **Host path:** shown in the environment summary as `Output dir`

This is where cachegrind files (profile mode) and trace files (trace mode) are written. The directory persists on the host after the environment is stopped, so you can analyze results after tearing down.

## Configuration via qit.json

Add Xdebug to your environment configuration:

```json
{
  "environments": {
    "default": {
      "php": "8.3",
      "xdebug": true
    },
    "profiling": {
      "extends": "default",
      "xdebug": "profile"
    }
  }
}
```

- `"xdebug": true` — shorthand for debug mode
- `"xdebug": "profile"` — specific mode
- `"xdebug": "debug,develop"` — combined modes

CLI flags override the config: `qit env:up --xdebug=trace` overrides `"xdebug": true` in qit.json.

## Advanced

### Custom port

The default Xdebug port is 9003. To use a different port, pass the `XDEBUG_CONFIG` environment variable (which Xdebug reads natively):

```qitbash
qit env:up --xdebug --env XDEBUG_CONFIG="client_port=9004"
```

### Custom PHP configuration

To override any PHP or Xdebug setting, mount a custom ini file:

```qitbash
qit env:up --xdebug --volume /path/to/my-xdebug.ini:/usr/local/etc/php/conf.d/zzz-custom.ini
```

The `zzz-` prefix ensures it loads last and overrides all other ini files.

## Performance

Xdebug is **pre-installed in the Docker image but disabled by default** (`xdebug.mode=off`). When disabled, there is zero measurable performance overhead — it's safe for CI and production-like testing.

The `--xdebug` flag writes an ini override to enable the requested mode and restarts PHP-FPM. Without the flag, Xdebug never activates.
