# Using a persistent tunnel

`The local test environment is available as early-access.`

When testing plugins that rely on a stable, publicly accessible URL—such as payment gateways, API callbacks, or SaaS integrations—a persistent tunnel provides a permanent, predictable address. Unlike temporary tunnels, which may suffer from DNS propagation delays and variable URLs, persistent tunnels rely on a pre-configured Cloudflare Tunnel that you set up once and reuse indefinitely.

## Requirements

- **Cloudflare Account:** You must have a Cloudflare account and access to a domain managed by Cloudflare.
- **cloudflared Binary Installed:** Ensure you have the `cloudflared` binary on your system.
- **Tunnel Configuration:** Follow the steps below to create and configure your persistent tunnel.

## Steps to create a persistent tunnel

1. **Install cloudflared:**
   On macOS, for example:
   ```bash
   brew install cloudflared
   ```

   Refer to the official Cloudflare documentation for other platforms.

2. **Authenticate with Cloudflare:**
   Run:
   ```bash
   cloudflared tunnel login
   ```

   This command guides you through authenticating with your Cloudflare account in the browser.

3. **Create a Tunnel:**
   ```bash
   cloudflared tunnel create <tunnel-name>
   ```

   Replace `<tunnel-name>` with a friendly name for your tunnel. This command registers a new tunnel with Cloudflare.

4. **Route DNS:**
   ```bash
   cloudflared tunnel route dns <tunnel-uuid> <tunnel-name>
   ```

   Replace `<tunnel-uuid>` with the UUID from the previous step. This associates your tunnel with a DNS record on your domain, e.g., `tunnel.example.com`.

5. **Test the Tunnel:**
   ```bash
   cloudflared tunnel run <tunnel-name> --hello-world
   ```

   Visit the URL provided to confirm the tunnel is working.

## Configuring QIT for a persistent tunnel

Once the persistent tunnel is set up, run:
```bash
qit tunnel:setup
```

Follow the prompts to select `cloudflared-persistent` and provide your tunnel name and URL (e.g., `tunnel.example.com`).

If asked, set it as the default tunneling method:
```bash
qit tunnel:set-default cloudflared-persistent
```

Now, whenever you run:
```bash
qit env:up --tunnel
```
QIT uses the persistent tunnel you configured, ensuring immediate DNS resolution and a stable public URL.

## Why use a persistent tunnel?

- **No DNS Propagation Delays:** Stable, pre-configured subdomain ensures external integrations can reach your test site immediately.
- **Consistent URL:** No need to share a new URL each time you run `qit env:up`.
- **Ideal for CI and Teams:** Developers, QA, or CI pipelines can rely on the same URL, streamlining integration tests and demonstrations.

## Combining persistent tunnels with other features

- Use persistent tunnels in conjunction with environment configuration files (qit.yml) and custom handlers for a fully automated and reproducible setup.
- Perfect for testing payment gateways, webhooks, and other features that require a publicly accessible endpoint.

## Troubleshooting

- Ensure your Cloudflare DNS and tunnel configurations are correct. If something fails, check the Cloudflare dashboard or run `cloudflared tunnel run <tunnel-name>` directly to diagnose issues.
- If you encounter permission or authentication errors, re-run `cloudflared tunnel login` or verify your Cloudflare account permissions.

## Next steps

- [Custom Tunnel](./custom-tunnel.md): If persistent tunnels do not meet your needs, consider implementing a custom tunneling solution.
- [Environment & Configuration](../environment/introduction.md): Explore more advanced environment customizations to match your development workflow.
- [Tunneling](./tunnel.md): Review other tunneling methods and their trade-offs.