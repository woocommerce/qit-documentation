# Using a Custom Tunnel

`The local test environment is available as early-access.`

While QIT provides built-in tunneling methods—such as `cloudflared-docker`, `cloudflared-binary`, and `cloudflared-persistent`—there may be scenarios where none of the default options suit your needs. In these cases, you can implement your own custom tunneling method by creating a class that extends `CustomTunnel`.

## Why a Custom Tunnel?

- **Non-Standard Tunneling Solutions:** If you rely on a proprietary or internal tool not supported by QIT, a custom tunnel bridges that gap.
- **Advanced Use Cases:** Implement unique authentication flows, complex routing, or integrate with special infrastructure that isn't handled by default tunnels.
- **Fine-Grained Control:** Tailor every aspect of your tunneling process, from how the tunnel is started to how URLs are managed and reported back to QIT.

## Implementing a Custom Tunnel

Create a PHP file that defines a class extending `QIT_CLI\Tunnel\CustomTunnel` and implement the required static methods. For example:

`custom-tunnel.php`:
```php
<?php

use QIT_CLI\Tunnel\CustomTunnel;

class MyCustomTunnel extends CustomTunnel {
    /**
     * Connects the tunnel.
     * 
     * Takes the local URL and environment ID as input and should return the public tunneled URL.
     * 
     * @param string $local_url The local URL (e.g., http://localhost:1234)
     * @param string $env_id The environment ID for reference
     *
     * @return string The public URL of the tunnel
     */
    public static function connect_tunnel(string $local_url, string $env_id): string {
        // Implement logic to start your custom tunnel here.
        // For example, run a shell command to start a tunnel, parse output for the public URL.
        
        $public_url = "https://mycustomtunnel.example.com"; // Replace with actual logic.
        return $public_url;
    }

    /**
     * Determines if this tunnel can be used.
     * Throw an exception if not supported.
     */
    public static function check_is_installed(): void {
        // Check if required binaries or conditions for your custom tunnel are met.
        // Throw exception if not installed.
    }

    /**
     * Checks if the tunnel is properly configured.
     *
     * @return bool
     */
    public static function is_configured(): bool {
        // Return true if everything is set up for this tunnel to work.
        return true;
    }
}
```

This custom class:
- Implements `connect_tunnel`: Start and report the public URL of your tunnel.
- Implements `check_is_installed`: Verify dependencies or prerequisites.
- Implements `is_configured`: Confirm that the tunnel can run with the current setup.

## Using the Custom Tunnel

Include the custom tunnel class via the `qit tunnel:setup` command and follow prompts to select `custom` as your tunnel type. Alternatively, specify it directly in your qit config.

For example:
```bash
qit env:up --tunnel custom
```

When you run this command, QIT calls `MyCustomTunnel::connect_tunnel`, retrieves the public URL, and applies it to your environment.

## Tips

- **Debugging:** If the tunnel fails, add verbose output, log commands, or throw exceptions with clear messages.
- **Check Dependencies:** If your custom tunnel relies on a binary, environment variable, or network service, verify these conditions in `check_is_installed`.
- **Persistent Config:** Like other tunnels, you can store configuration details (like authentication tokens or endpoint URLs) in environment variables or QIT config files.

## Combining with Other Features

A custom tunnel integrates seamlessly with QIT's environment configuration. Run tests that rely on external callbacks or payments through your custom tunnel just like you would with any built-in method.

For example:
```bash
qit run:woo-e2e your-extension --tunnel custom
```

ensures that the Woo E2E tests run against the publicly accessible URL your tunnel provides.

## Next Steps

- [Tunneling](./tunnel.md): Review other tunneling methods and their trade-offs.
- [Persistent Tunnel](./persistent-tunnel.md): If you prefer a stable, well-known subdomain, consider the persistent tunnel setup first.
- [Environment & Configuration](../environment/introduction.md): Explore advanced configurations, environment variables, and other features to enhance your testing workflow.

By creating a custom tunnel, you unlock the flexibility to integrate any tunneling solution into QIT's local environment, ensuring that all testing scenarios—even the most unique—can be properly validated.
