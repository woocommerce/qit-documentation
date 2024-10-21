# Using a Custom Tunnel

If you need to use a custom tunneling method, you need to:
- Create a PHP file with a class that extends `\QIT_CLI\Tunnel\CustomTunnel`
- Require this file at runtime with `--require myCustomTunnel.php`
- Run the command with `--tunnel`

Example:

```qitbash
qit env:up --tunnel --require myCustomTunnel.php
```

Your class should implement the following methods:

```php
/**
 * Connects the tunnel.
 * 
 * Takes as input the local URL, and should return the tunnelled URL.
 *
 * Example: $local_url = 'http://localhost:1234'
 * 		    $env_id = '1234'
 * 
 * Returns: 'https://mytunnel.example.com'
 *
 * @param string $local_url
 * @param string $env_id
 *
 * @return string The public URL of the tunnel.
 */
abstract public static function connect_tunnel( string $local_url, string $env_id ): string;

/**
 * Determines whether this tunnel can be used.
 *
 * @throws \RuntimeException If the tunnel is not supported.
 */
abstract public static function check_is_installed(): void;

/**
 * Checks if the tunnel is properly configured.
 *
 * @return bool
 */
abstract public static function is_configured(): bool;
```


Example of a custom tunneling method:

```php
<?php

class MyCustomTunnel extends \QIT_CLI\Tunnel\CustomTunnel {
    public static function connect_tunnel( string $local_url, string $env_id ): string {
        /*
         * If we save the PID of the tunnel process in this pattern,
         * this will allow us to stop the tunnel when the environment is stopped.
         * This PID is killed when the environment is stopped.
         */
        $pid_file = sys_get_temp_dir() . "/qit_env_tunnel_{$env_id}.pid";
        
        /*
         * Connect to the tunnel and return the public URL.
         * For example purposes, let's assume that "mytunnel"
         * has a "--pidfile" option to save the PID of the tunnel process. 
         */
        exec("mytunnel connect $local_url --pidfile $pid_file" , $output);
        
        // Let's assume the public URL is the first line of the output.
        return $output[0];
    }

    public static function check_is_installed(): void {
        // Check if the tunnel binary is installed.
        exec("mytunnel --version", $output, $return_code);
        
        if ($return_code !== 0) {
            throw new \Exception("MyTunnel is not installed.");
        }
    }

    public static function is_configured(): bool {
        // Let's assume this tunnel doesn't need configuration/auth.
        // You could use getenv() to check for configuration variables and use it when connecting.
        return true;
    }
}
```

You can always refer to QIT CLI own tunnel implementations for inspiration:

https://github.com/woocommerce/qit-cli/tree/trunk/src/src/Tunnel/Tunnels