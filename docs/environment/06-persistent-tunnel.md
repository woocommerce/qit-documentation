# Using a Persistent Tunnel

The default disposable temporary tunnels are great for most use cases, but sometimes you need a persistent tunnel that does not require immediate DNS resolution.

A persistent tunnel is a tunnel that have a predictable URL, so it doesn't needs immediate DNS propagation.

You can use `cloudflared-persistent`, or a custom tunnel. This guide will go through how to set-up a persistent tunnel using Clouflared binary.

## Requirements

You must have a Cloudflare account, the `cloudflared` binary installed on your system, and access to a domain that is managed by Cloudflare, such as a regular website that is proxied by Cloudflare.

1. **Install the `cloudflared` binary on your system.**
2. **Authenticate with**: `cloudflared tunnel login`.
3. **Create a tunnel with**: `cloudflared tunnel create <tunnel-name>`
4. **Route DNS with:** `cloudflared tunnel route dns <tunnel-uuid> <tunnel-name>`

   Replace `<tunnel-uuid>` with the UUID generated from the previous step.
5. **Test the tunnel with:** `cloudflared tunnel run <tunnel-name> --hello-world`

6. **Configure in QIT CLI:** `qit tunnel:setup`

   Provide the tunnel name and URL when prompted.