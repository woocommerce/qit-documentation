# Tunneling

Tunneling allows your local development environment to be accessible over the internet. This is useful for testing webhooks, integrations, or sharing your work with others. QIT CLI supports multiple tunneling methods, and the optimal choice depends on your operating system and requirements.

## Requirements

### Tunneling on Mac

To use tunneling on macOS, you need to have the `cloudflared` binary installed. You can install it using Homebrew:

```qitbash
brew install cloudflared
```

### Tunneling on Linux

No additional requirements are needed for tunneling on Linux.

### Tunneling on WSL

Tunneling on Windows Subsystem for Linux (WSL) is currently not supported. Let us know if you need this feature by [opening an issue](https://github.com/woocommerce/qit-cli/issues).

## Using Tunneling with QIT CLI Commands

You can use tunneling in the commands that utilize the QIT CLI environment capabilities. Currently, the following commands support tunneling:

- **env:up**: Start up the environment.
- **test:e2e**: Run end-to-end tests that require an environment.
- **test:activation**: Run activation tests that require an environment.

## Basic Example

```qitbash
qit env:up --tunnel
```

This command starts your environment with tunneling enabled, using the default method for your OS.

## Available Tunneling Methods

- **cloudflared-docker**: Cloudflare Tunnel via Docker container.
- **cloudflared-binary**: Cloudflare Tunnel using the local binary.
- **cloudflared-persistent**: Pre-configured persistent Cloudflare Tunnel.
- **jurassictube**: JurassicTube Tunnel (Automattic employees only).
- **custom**: Custom tunneling method via a user-implemented class.

# Comparison Table

| Feature                          | cloudflared-docker | cloudflared-binary | cloudflared-persistent | jurassictube | custom  |
|----------------------------------|--------------------|--------------------|------------------------|--------------|---------|
| **Linux/CI**                     | ✅                  | ✅                  | ✅                      | ✅            | Depends |
| **macOS**                        | ❌                  | ✅                  | ✅                      | ✅            | Depends |
| **WSL**                          | ❌                  | ❌                  | ❌                      | ❌            | Depends |
| **Requires Cloudflare Account**  | ❌                | ❌                  | ✅                      | ❌            | Depends |
| **Requires Additional Setup**    | ❌                  | ❌                  | ✅                      | ✅            | Depends |
| **Requires Binary Installation** | ❌    | ✅                  | ✅                      | ✅            | Depends |
| **Uses Temporary Subdomains**    | ✅                  | ✅                  | ❌                      | ❌            | Depends |
| **Supports Parallel Tunnelling** | ✅    | ✅                  | ❌                      | ❌            | Depends |
| **Automattic Only**              | ❌                  | ❌                  | ❌                      | ✅            | Depends |

### Using Different Tunnels

By default, QIT CLI will use the best tunneling method for your operating system.

- **`--tunnel` without a value**: Uses the default tunneling method. If a default is set via `tunnel:set-default`, it will use that. Otherwise, it selects a tunneling method based on your operating system.
- **`--tunnel <method>`**: Specify a tunneling method to use. Available methods are:

  - `cloudflared-docker`
  - `cloudflared-binary`
  - `cloudflared-persistent`
  - `jurassictube`
  - `custom`

## Detailed explanation of each Tunnel Method

### cloudflared-docker

- **Description**: Uses Cloudflare Tunnel via a Docker container.
- **Best For**: Linux systems and CI environments.
- **Advantages**:
  - Works out of the box without additional setup.
- **Considerations**:
  - Deals with temporary subdomains.
  - May experience delays due to DNS propagation times when starting the tunnel.
  - You can use Cloudflare DNS (1.1.1.1) to speed up the DNS resolution process. 

### cloudflared-binary

- **Description**: Uses the Cloudflare Tunnel local binary installed on your system.
- **Best For**: macOS systems (default on macOS) and Linux.
- **Advantages**:
  - Works out of the box if the `cloudflared` binary is installed.
- **Considerations**:
  - Similar to `cloudflared-docker`, it uses temporary subdomains.
  - May experience DNS propagation delays when initiating the tunnel.
  - You can use Cloudflare DNS (1.1.1.1) to speed up the DNS resolution process.

### cloudflared-persistent

- **Description**: Uses a pre-configured persistent Cloudflare Tunnel.
- **Best For**: Situations where immediate DNS resolution is required and you have a Cloudflare account.
- **Advantages**:
  - Does not have DNS propagation issues since it uses a persistent subdomain.
- **Considerations**:
  - Requires a Cloudflare account and a site registered on Cloudflare.
  - Requires additional setup steps:
    1. **Install the `cloudflared` binary on your system.**
    2. **Authenticate with `cloudflared tunnel login`.**
    3. **Create a tunnel with: `cloudflared tunnel create <tunnel-name>`
    4. **Route DNS with:** `cloudflared tunnel route dns <tunnel-uuid> <tunnel-name>`

       Replace `<tunnel-uuid>` with the UUID generated from the previous step.
    5. **Test the tunnel with:** `cloudflared tunnel run <tunnel-name> --hello-world`

    6. **Configure in QIT CLI:** `qit tunnel:setup`

       Provide the tunnel name and URL when prompted.

### jurassictube

- **Description**: Uses JurassicTube Tunnel.
- **Best For**: Automattic employees only.
- **Advantages**:
  - Integrates with existing JurassicTube configurations.
- **Considerations**:
  - Requires an existing JurassicTube connection configured outside of QIT CLI.
  - Not available for users outside of Automattic.
  - Configure in QIT CLI using `qit tunnel:setup`.

### custom

- **Description**: Allows you to use a custom tunneling method by implementing a `CustomTunnel` class.
- **Best For**: Advanced users who need a custom tunneling solution.
- **Considerations**:
  - Requires custom implementation and configuration.

### Examples

#### Start Environment with a Specific Tunneling Method

```qitbash
qit env:up --tunnel cloudflared-docker
```

This will use the `cloudflared-docker` tunneling method.

#### Run E2E Tests with Tunneling

```qitbash
qit run:e2e my-plugin --tunnel
```

Enables tunneling while running end-to-end tests. Useful when tests require external access to the local environment.

#### Run Activation Tests with a Specific Tunneling Method

```qitbash
qit run:activation my-plugin --tunnel cloudflared-binary
```

Runs activation tests with tunneling enabled using the `cloudflared-binary` method.

## Setting Up Tunneling Methods

Most tunneling methods work out-of-the-box and do not require additional setup. If you don't call `tunnel:setup`, QIT CLI will use the default tunneling method based on your operating system when you enable tunneling.

### When to Use `tunnel:setup`

You only need to run `tunnel:setup` if:

- You want to use a tunneling method that requires authentication or additional configuration, such as `cloudflared-persistent` or `jurassictube`.
- You want to configure multiple tunneling methods and switch between them.
- You want to set a specific tunneling method as your default.

### Configuring a Tunneling Method

To configure a tunneling method that requires setup, run:

```qitbash
qit tunnel:setup
```


You will be prompted to select a tunneling method to configure. Follow the on-screen instructions to complete the setup.

#### Example:

```qitbash
$ qit tunnel

Select the tunneling method you wish to configure:

[cloudflared-docker] Cloudflare Tunnel via Docker container
[cloudflared-binary] Cloudflare Tunnel using the local binary
[cloudflared-persistent] Persistent Cloudflared Tunnel
[jurassictube] JurassicTube Tunnel (Automattic employees only)

    cloudflared-persistent

Enter your Cloudflare Tunnel name: my-tunnel
Enter your Cloudflare Tunnel URL: https://my-tunnel.example.com

Do you want to set this tunneling method as your default? (yes/no) [yes]: Yes

Default tunneling method set to: cloudflared-persistent Configuration successful! Your cloudflared-persistent tunnel is now set up.
```

### Configuring Multiple Tunnels

You can configure multiple tunneling methods, especially if you need to switch between them. Simply run `qit tunnel:setup` again and select another method to configure.

### Setting a Default Tunneling Method

After configuring tunneling methods, you can set one as your default using the `tunnel:set-default` command.

#### Example:

```qitbash
$ qit tunnel:set-default

Select the tunneling method you wish to set as default: 

[cloudflared-docker] Cloudflare Tunnel via Docker container
[cloudflared-binary] Cloudflare Tunnel using the local binary
[cloudflared-persistent] cloudflared-persistent
[jurassictube] jurassictube

    cloudflared-persistent

Default tunneling method set to: cloudflared-persistent
```


### Resetting Tunneling Configurations

To reset all tunneling configurations to defaults:

```qitbash
qit tunnel:setup --reset
```

This will remove all configured tunneling methods and unset the default tunnel.

## Implementing a Custom Tunnel

If you need to use a custom tunneling method, refer to the [Custom Tunneling Methods](./custom-tunnel) section for instructions on how to create and use a custom tunneling method.

## Additional Tips

- **No Setup Needed for Default Tunnels**: For `cloudflared-docker` and `cloudflared-binary`, you don't need to run `tunnel:setup` unless you want to set one as your default or configure multiple tunnels.
- **Checking Tunnel Usability**: Before using a tunneling method, ensure it is usable on your system. Some tunnels may not be compatible with certain operating systems or environments (e.g., WSL).
- **Configuration Persistence**: Tunneling configurations are stored persistently. You only need to configure a tunneling method once unless you need to change it.
- **Verbose Output**: Use the `-v` or `-vv` option with commands to get more detailed output. This can be helpful for troubleshooting.

## Troubleshooting

- **DNS Propagation Issues**: If you experience delays accessing your tunnel, it may be due to DNS propagation. Consider using a persistent tunnel, using Cloudflare DNS, or waiting a few moments.
- **Tunnel Not Usable**: If you receive an error stating that a tunneling method is not usable, verify that all prerequisites for that method are met (e.g., required binaries are installed).
- **Tunnel Not Configured**: If you receive an error stating that a tunneling method is not configured, it means the method requires setup (e.g., `cloudflared-persistent` or `jurassictube`). Run `qit tunnel:setup [method]` to configure it.
- **Custom Tunnel Issues**: Ensure your custom tunnel class correctly implements all required methods and handles configuration appropriately.
- **Default Tunnel Fallback**: If you haven't configured a default tunnel and use `--tunnel` without specifying a method, QIT CLI will automatically select the default tunneling method based on your operating system.

## Conclusion

Tunneling in QIT CLI is a powerful feature that enhances your development workflow by making your local environment accessible externally. By default, QIT CLI provides tunneling methods that work without additional setup, allowing you to start using tunneling immediately. If you need to use a tunneling method that requires authentication or additional configuration, you can easily set it up using the provided commands.
