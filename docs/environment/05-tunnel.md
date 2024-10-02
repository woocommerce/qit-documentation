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

On Mac, you need to install `cloudflared` to use the tunnel:

```qitbash
brew install cloudflared
```

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

The tunnel stops automatically when you shut down the environment, or when the test ends: