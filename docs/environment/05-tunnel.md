# Tunnels - Exposing your site to the web

:::info
The local test environment is available as early-access.
:::

## Introduction

Tunnelling allows to expose your test environment to the web. This is useful to test plugins that require a valid URL with HTTPS, such as payment gateways or SaaS.

## Starting a tunnel

To start a tunnel, pass the `--tunnel` flag to the `qit env:up` command:

```qitbash
qit env:up --tunnel
```

This will start the test environment and expose it to the web. You will see a URL in the terminal that you can use to access the test environment.

## Tunnels on Mac

On Macs, there are two requirements for tunnels to work out-of-the-box:

- You need to install `cloudflared` with `brew install cloudflared`.
- For the best performance, you should also change your DNS to `1.1.1.1`, which is managed by Cloudflare. [How to setup the DNS on Mac](https://developers.cloudflare.com/1.1.1.1/setup/macos/).

No additional configuration is needed, this will work out-of-the-box.

You can also run `cloudflared login` to connect to your Cloudflare account if you want. **This is optional.**

## Tunnels on Linux

On Linux, you don't need to install anything, just pass `--tunnel` and it will work out-of-the-box, as it uses a dockerized version of the Cloudflare tunnel.

This is especially useful for running tunneled tests in CI - no configuration needed.

## Tunnels on WSL

Unfortunately, tunnels are not supported in WSL at this moment.

## Using a local tunnel on Linux

On Linux, you have the option to use a local `cloudflared` binary if you prefer, just pass `--tunnel local` and it will use the local binary instead of the dockerized version.

## Running a test with tunnel

Some test types have support for tunnels, such as `e2e` and `activation`. To run a test with tunnel, just pass the `--tunnel` flag.

```qitbash
qit run:e2e example-extension --tunnel
```

```qitbash
qit run:activation example-extension --tunnel
```

To know if a test type supports tunnelling or now, check the help, eg: `qit run:e2e --help`.

## Stopping a tunnel

The tunnel stops automatically when you shut down the environment, or when the test ends.

# Using Custom Tunnels

If you want to use your own tunnel, you can use `--tunnel custom` and `--require my-custom-tunnel.php`.

`my-custom-tunnel.php` should be a class that extends `\QIT_CLI\Tunnel\CustomTunnel`:

```php
<?php

class MyCustomTunnel extends \QIT_CLI\Tunnel\CustomTunnel {
	public static function connect_tunnel( string $site_url, string $env_id ): string {
		// TODO: Implement connect_tunnel() method.
	}
}
```

The lifecycle of the tunnel is managed externally so you are responsible for starting and stopping the tunnel.

## Persistent Cloudflare tunnel:

It's also possible to use a persistent Cloudflare tunnel to get around the DNS delay when starting a new randomized tunnel.

**Requirements:**

- For this type of tunnel, you need to have a Cloudflare account and a website registered in it.
- `cloudflared login` and choose a website to use.
- `cloudflared tunnel create your-tunnel-name` to create a tunnel.
- `cloudflared tunnel list` to get the UID of your newly created tunnel.
- `cloudflared tunnel route dns UUID_HERE` paste the UUID of your tunnel to route the DNS.

Now you should be able to create a tunnel using your domain:

`cloudflared tunnel run --hello-world your-tunnel-name`

Assuming this is working, just use the script below, replacing `your-tunnel-name` with your actual tunnel name, and `your-domain.com` with your actual domain.

Usage:
- `qit env:up --tunnel custom --require PersistentCloudFlareTunnel.php`
- Or in a test: `qit run:e2e example-extension --tunnel custom --require PersistentCloudFlareTunnel.php`

```php
<?php

class PersistentCloudFlareTunnel extends \QIT_CLI\Tunnel\CustomTunnel {
	public static function connect_tunnel( string $site_url, string $env_id ): string {
		// When the environment is destroyed, we will try to kill the process with this PID.
		$pid_file = sys_get_temp_dir() . "/qit_env_tunnel_{$env_id}.pid";

		$cloudflare_tunnel_name = 'your-tunnel-name';
		$cloudflare_tunnel_url  = 'https://your-tunnel-name.your-domain.com';

		$command_parts = [
			'nohup',
			'cloudflared',
			'tunnel',
			'--no-autoupdate',
			'--pidfile',
			escapeshellarg( $pid_file ),
			'--url',
			escapeshellarg( $site_url ),
			'run',
			$cloudflare_tunnel_name,
		];

		$command = implode( ' ', $command_parts ) . ' > /dev/null 2>&1 &';

		exec( $command, $output, $return_var );

		$start_time = time();
		$timeout    = 10; // seconds.

		// Wait for the PID file to be created.
		while ( ! file_exists( $pid_file ) && ( time() - $start_time ) < $timeout ) {
			usleep( 100000 ); // 0.1 seconds.
		}

		if ( ! file_exists( $pid_file ) ) {
			// Optionally log the output for debugging
			if ( ! empty( $output ) ) {
				echo implode( "\n", $output );
			}

			throw new \RuntimeException( 'Timed out waiting for PID file creation.' );
		}

		static::test_connection( $cloudflare_tunnel_url );

		return $cloudflare_tunnel_url;
	}
}
```

## Jurassic Tunnel

Automatticians can also use Jurassic Tunnel in a similar way.

Requirements:

- Follow the installation/setup instructions of the Jurassic Tube Field Guied
  - Download and install Jurassic Tube
  - Register a key, and add a subdomain in Jurassic Tube

Now, you can use the following script to start a Jurassic Tube tunnel:

Just replace `your-username` and `your-subdomain` with your actual username and subdomain.

Usage:
- `qit env:up --tunnel custom --require JurassicTubeTunnel.php`
- Or in a test: `qit run:e2e example-extension --tunnel custom --require JurassicTubeTunnel.php`

```php
<?php

class JurassicTubeTunnel extends \QIT_CLI\Tunnel\CustomTunnel {
	public static function connect_tunnel( string $site_url, string $env_id ): string {
		// When the environment is destroyed, we will try to kill the process with this PID.
		$pid_file = sys_get_temp_dir() . "/qit_env_tunnel_{$env_id}.pid";

		$jurassic_tube_user      = 'your-username';
		$jurassic_tube_subdomain = 'your-subdomain';

		// Extract host and port from $site_url
		$parsed_url = parse_url( $site_url );

		if ( ! isset( $parsed_url['host'] ) ) {
			throw new \InvalidArgumentException( "Invalid site URL provided." );
		}

		$host = $parsed_url['host'];
		$port = isset( $parsed_url['port'] ) ? ':' . $parsed_url['port'] : '';

		$host_and_port = $host . $port;

		// Construct the JurassicTube command
		$command_parts = [
			'nohup',
			'jurassictube',
			'-u',
			escapeshellarg( $jurassic_tube_user ), // Replace with your username if necessary
			'-s',
			escapeshellarg( $jurassic_tube_subdomain ), // Replace with your subdomain if necessary
			'-h',
			escapeshellarg( $host_and_port ),
		];

		$command = implode( ' ', $command_parts ) . ' > /dev/null 2>&1 & echo $!';

		// Start the process and capture the PID
		$output = [];
		exec( $command, $output );

		if ( empty( $output ) ) {
			throw new \RuntimeException( 'Failed to start JurassicTube process.' );
		}

		$pid = (int) $output[0];

		// Save the PID to the pid file
		file_put_contents( $pid_file, $pid );

		// Construct the tunnel URL
		$tunnel_url = "https://$jurassic_tube_subdomain.jurassic.tube/";

		static::test_connection( $tunnel_url );

		return $tunnel_url;
	}
}
```