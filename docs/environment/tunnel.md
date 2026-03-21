---
description: "Guide to exposing your local QIT environment to the internet via tunneling. Required for testing payment gateways, webhooks, SaaS integrations, and external API callbacks that need a live HTTPS URL. Covers platform-specific setup (Mac: install cloudflared via Homebrew; Linux: works out of the box; WSL: not supported), available tunnel methods (cloudflared-docker, cloudflared-binary), how to use with `qit env:up --tunnel=cloudflare` and `qit run:e2e --tunnel=cloudflare`, and troubleshooting tunnel connectivity."
---

# Tunneling

Tunneling allows your local development environment to be accessible over the internet. This is useful for testing plugins that require a live URL with valid HTTPS, such as payment gateways, SaaS integrations, webhooks, or external API callbacks. QIT supports multiple tunneling methods, and the optimal choice depends on your operating system and requirements.

## Requirements

### Tunneling on mac

To use tunneling on macOS, you need to have the `cloudflared` binary installed. For example, using Homebrew:
```bash
brew install cloudflared
```

### Tunneling on linux

No additional requirements are needed. QIT can use `cloudflared` if installed, or you can choose other methods that fit your distribution.

### Tunneling on WSL

Tunneling on WSL is currently not supported. Let us know if you need this feature by opening an issue on the QIT GitHub repository.

## Using tunneling with QIT CLI

You can use tunneling in commands that utilize the QIT CLI environment capabilities. Currently, the following commands support tunneling:
- `env:up`
- `run:e2e`
- `run:activation`

For example, to start your environment with tunneling enabled:
```qitbash
qit env:up --tunnel
```

This exposes your local environment to a temporary public URL, allowing external services to connect.

## Available tunneling methods

- `cloudflared-docker`: Uses Cloudflare Tunnel via a Docker container.
- `cloudflared-binary`: Uses the local `cloudflared` binary on your system.
- `cloudflared-persistent`: Uses a pre-configured persistent Cloudflare Tunnel.
- `custom`: Allows you to implement your own tunneling method by creating a class that extends `CustomTunnel`.

If you are an Automattician, an internal tunneling method might be available.

## Comparison of methods

| Feature*                           | cloudflared-docker | cloudflared-binary | cloudflared-persistent |
|------------------------------------|--------------------|--------------------|------------------------|
| Linux/CI                           | ✅                 | ✅                 | ✅                     |
| macOS                              | ❌                 | ✅                 | ✅                     |
| WSL**                              | ❌                 | ❌                 | ❌                     |
| Uses Temporary Subdomains          | ✅                 | ✅                 | ❌                     |
| Supports Parallel Tunnelling       | ✅                 | ✅                 | ❌                     |
| Requires Cloudflare Account        | ❌                 | ❌                 | ✅                     |
| Requires Additional Setup          | ❌                 | ❌                 | ✅                     |
| Requires Binary Installation       | ❌                 | ✅                 | ✅                     |

* For a custom tunnel, capabilities depend on your implementation.

** WSL support is not available at the moment.

## Selecting a tunneling method

- `qit env:up --tunnel`: Uses the default tunneling method. If none is configured, QIT chooses the best method for your OS.
- `qit env:up --tunnel cloudflared-docker`: Forces a specific method.

## Persistent tunnels

Persistent tunnels require additional setup and a Cloudflare account. They provide a stable URL without DNS propagation delays. See [Persistent Tunnel](./persistent-tunnel.md) for detailed instructions.

## Custom tunnels

If none of the built-in methods suit your needs, implement a custom tunnel class extending `CustomTunnel`. Set it up with `qit tunnel:setup` and specify it with `--tunnel custom` when running tests.

## Setup and configuration

For most tunnels, no extra setup is needed. Just run with `--tunnel`. For methods requiring configuration (like `cloudflared-persistent`), run:
```qitbash
qit tunnel:setup
```

Follow prompts to configure and authenticate with Cloudflare or other services.

## Troubleshooting

- If you experience DNS propagation delays with temporary subdomains, try persistent tunnels or switch DNS to Cloudflare (1.1.1.1).
- For installation issues or unsupported methods on your OS, consider using a custom tunnel or requesting new features on the QIT GitHub repository.
