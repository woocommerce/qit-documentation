# Downloading extensions and tests

QIT automatically downloads the extension you are testing **(SUT)** and any additional plugins, dependencies, and test tags. By default, QIT fetches the latest stable versions from WooCommerce.com for paid extensions and WordPress.org for free plugins.

## The extension under test

The main extension you are testing must be a product in the WooCommerce.com marketplace and associated with your account. The account used during `qit connect` **must be the maintainer of this extension**. This can be a product submission or a published product.

For more details, see [Authenticating with QIT](../installation-setup/authenticating.md).

## Downloading paid extensions

Paid extensions require authentication. Similar to the SUT, you **must be the maintainer of the paid extension** you want to include in your test. If you do not maintain it, you must provide a local source (for example, a ZIP file containing the extension).

Below you’ll find examples of providing local sources.

## Downloading free extensions

Free extensions are sourced directly from WordPress.org without requiring authentication or ownership. You can still provide a local source if you want to test a modified or development version.

## Additional plugins, dependencies, and test tags

- **Paid (WooCommerce.com):** You must be the maintainer or provide a local source.
- **Free (WordPress.org):** No authentication is required.
- **Not listed in either marketplace:** A local source is required.
- **Custom test tags**: You must own the associated extension or provide a local source.

## Providing local sources

In `qit.yml`:

```yaml
plugins:
  my-plugin:
    source: ./my-plugin.zip
    test_tags:
      - ./local-tests/my-plugin-tests
```

## Installing from other sources

To fetch extensions from unsupported locations (such as private Git repositories), implement **custom handlers**. For details, see [Advanced Config Handlers](./../advanced-usage/advanced-config-handlers.md).

## Example scenario – step by step

Below is an example scenario where we run a custom E2E test to demonstrate how QIT applies its downloading rules.

**Scenario:** You are the developer of `my-extension` (your SUT), and you want to include `automatewoo-birthdays` in your test. However, you don’t maintain `automatewoo-birthdays` or its dependency `automatewoo`, both of which are paid extensions.

At first, you run this command:

```bash
qit run:e2e my-extension -p automatewoo-birthdays
```

This will fail because you don’t have access to `automatewoo-birthdays` or `automatewoo`.

Let’s see how QIT processes each step and how you can resolve this by providing local ZIP files for the paid plugins you don’t own.

### What happens step-by-step:

- **`my-extension` (SUT)**:
  - QIT checks WooCommerce.com to confirm that you maintain `my-extension`.
  - Since you do, it downloads the latest stable release of `my-extension` and the `default` custom test tag.
  - No local source is required. If you wanted to test a development build, you could provide a local ZIP instead.

- **`automatewoo-birthdays` (additional plugin)**:
  - This is a paid extension that you do not maintain.
  - QIT cannot download it from WooCommerce.com, so it checks `qit.yml` for a local source.
  - If no local source is provided, QIT cannot proceed.

- **`automatewoo` (dependency)**:
  - `automatewoo-birthdays` depends on `automatewoo`, another paid extension you don’t maintain.
  - QIT checks WooCommerce.com for `automatewoo`. Since you don’t own it, QIT expects a local source.
  - You must provide something like `./automatewoo.zip`.

- **`woocommerce` (dependency)**:
  - Suppose `automatewoo` depends on `woocommerce`.
  - `woocommerce` is free and available on WordPress.org.
  - QIT automatically fetches it without needing a local source or authentication.

**Example `qit.yml` configuration:**

```yaml
plugins:
  my-extension:
    # Paid extension that you maintain, automatically fetched from WooCommerce.com.
    # Optionally override with a local zip if desired:
    # source: ./my-extension.zip

  automatewoo-birthdays:
    # Paid, not maintained by you → must provide a local source
    source: ./automatewoo-birthdays.zip

  automatewoo:
    # Paid, not maintained by you → must provide a local source
    source: ./automatewoo.zip

  # woocommerce:
  #   Free, automatically fetched from WordPress.org if no source is provided.
  #   Listing it here is optional.
```

With this configuration, running:

```bash
qit run:e2e my-extension -p automatewoo-birthdays
```

now succeeds. QIT sets up the environment by fetching what you own and using local sources for what you don’t.

---

## Future improvements

We recognize that managing paid extension access between vendors, collaborators, or specific developer accounts is a complex challenge, especially when aiming to conduct [compatibility tests](./compatibility-tests.md).

**Planned enhancements** include more flexible **Access Control**, enabling you to grant selected marketplace vendors or accounts the ability to access your paid extensions and test tags without everyone having to rely on local sources.

We encourage you to share your feedback and use cases, which will guide us in refining these upcoming features.