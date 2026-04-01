---
description: "Guide to setting up a persistent Cloudflare Tunnel for a stable, reusable URL that doesn't change between sessions. Unlike temporary tunnels, persistent tunnels use a pre-configured Cloudflare Tunnel with your own domain. Covers requirements (Cloudflare account, cloudflared binary), step-by-step tunnel creation, DNS configuration, and registering the tunnel with QIT via `qit tunnel:setup cloudflared-persistent --name=my-tunnel --url=https://my-tunnel.example.com`."
---

# Using a persistent tunnel

When testing plugins that rely on a stable, publicly accessible URL (such as payment gateways, API callbacks, or SaaS integrations), a persistent tunnel provides a permanent, predictable address. Unlike temporary tunnels, which may suffer from DNS propagation delays and variable URLs, persistent tunnels rely on a pre-configured Cloudflare Tunnel that you set up once and reuse indefinitely.

## Requirements

- **Cloudflare account:** You must have a Cloudflare account and access to a domain managed by Cloudflare.
- **Cloudflared binary installed:** Ensure you have the `cloudflared` binary on your system.
- **Tunnel configuration:** Follow the steps below to create and configure your persistent tunnel.

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
```qitbash
qit tunnel:setup
```

Follow the prompts to select `cloudflared-persistent` and provide your tunnel name and URL (e.g., `tunnel.example.com`).

If asked, set it as the default tunneling method:
```qitbash
qit tunnel:set-default cloudflared-persistent
```

Now, whenever you run:
```qitbash
qit env:up --tunnel
```
QIT uses the persistent tunnel you configured, ensuring immediate DNS resolution and a stable public URL.

## Why use a persistent tunnel?

- **No DNS propagation delays:** Stable, pre-configured subdomain ensures external integrations can reach your test site immediately.
- **Consistent URL:** No need to share a new URL each time you run `qit env:up`.
- **Ideal for CI and teams:** Developers, QA, or CI pipelines can rely on the same URL, streamlining integration tests and demonstrations.

## Combining persistent tunnels with other features

- Use persistent tunnels in conjunction with environment configuration files (`qit.json`) for a fully automated and reproducible setup.
- Perfect for testing payment gateways, webhooks, and other features that require a publicly accessible endpoint.

## Troubleshooting

- Ensure your Cloudflare DNS and tunnel configurations are correct. If something fails, check the Cloudflare dashboard or run `cloudflared tunnel run <tunnel-name>` directly to diagnose issues.
- If you encounter permission or authentication errors, re-run `cloudflared tunnel login` or verify your Cloudflare account permissions.
