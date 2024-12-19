# Downloading extensions and tests

QIT automatically downloads the extension you are testing **(SUT)** and any additional plugins requested, dependencies, and test tags. By default, it fetches the latest stable versions from WooCommerce.com for paid extensions and WordPress.org for free plugins.

## The extension under test

The main extension you're testing (SUT) must be a product in the WooCommerce.com marketplace and associated with your account. The account used during `qit connect` **must be the maintainer of this extension**. It can be a product submission or a published product.

For more details, see [Authenticating with QIT](../installation-setup/authenticating.md).

## Downloading paid extensions

Paid extensions require authentication. Similar to the sut, you **must be the maintainer of the paid extension** you want to include in your test. If you do not own it, you must provide a local source (for example, a ZIP file containing the extension).

You can find examples of providing local sources below.

## Downloading free extensions

Free extensions are sourced directly from WordPress.org without requiring authentication or ownership. You can still provide a local source if you want to test a modified version rather than the publicly available one.

## Additional plugins, dependencies and test tags

- **Paid (WooCommerce.com):** You must be the maintainer of the extension or provide a local source.
- **Free (WordPress.org):** No authentication is required.
- **Not listed in either marketplace:** A local source is required.
- **Custom test tags**: You must own the extension associated with the test you want to use, or provide a local source.

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

## Example scenario - Step by Step

Below is an example scenario where we run a Custom E2E test, which explains how QIT applies its rules for downloading.

Let's suppose you are the developer of `my-extension` - you want to include `automatewoo-birthdays` in your test, but you don't own it.

So at first, you run this command:

```qitbash
qit run:e2e my-extension -p automatewoo-birthdays
```

This will fail because you don't have access to `automatewoo-birthdays` and `automatewoo` (which is a dependency).

We will see now what QIT does step-by-step, and how you can get around this by providing the zips of these paid plugins locally.

### What happens step-by-step:

- `my-extension` **(SUT)**:
  - QIT checks WooCommerce.com to see if you own `my-extension`.
  - Since you do, it downloads the latest stable release of `my-extension` from WooCommerce.com and the `default` custom test tag.
  - No local source is required. However, if you wanted to test a development build, you could specify a local ZIP file.

- `automatewoo-birthdays` **(additional plugin)**:
  - This is a paid extension that you do not maintain.
  - QIT cannot download it from WooCommerce.com, so it looks for a local source in `qit.yml` (or via CLI parameters).
  - If none is provided, QIT can’t proceed.

- `automatewoo` **(dependency)**:
  - `automatewoo-birthdays` depends on `automatewoo`, another paid extension you don’t maintain.
  - QIT checks if you own `automatewoo` on WooCommerce.com. Since you don’t, it expects a local source.
  - Similarly as above, you must define the source yourself.

- `woocommerce` **(dependency)**:
  - Suppose `automatewoo` depends on `woocommerce`.
  - `woocommerce` is free and available on WordPress.org, so QIT automatically fetches it. No local source or authentication is needed.

**Example `qit.yml` configuration:**

```yaml
plugins:
  my-extension:
    # Paid extension that you maintain, automatically fetched from WooCommerce.com.
    # Optionally override with a local zip if desired:
    # source: ./my-extension.zip

  automatewoo-birthdays:
    # Paid, not the maintainer → must provide a local source
    source: ./automatewoo-birthdays.zip

  automatewoo:
    # Paid, not the maintainer → must provide a local source
    source: ./automatewoo.zip

  # woocommerce:
  #   Free, automatically fetched from WordPress.org if no source provided.
  #   Listing it here is optional.
```

This scenario demonstrates how QIT applies a consistent set of rules based on ownership, marketplace availability, and local overrides to create the necessary test environment.

## Future improvements

We understand that managing access to paid extensions for certain vendors or accounts can be challenging, especially when aiming to leverage [Compatibility Testing](./compatibility-tests.md) between plugins.

To address this, we are planning to introduce **Access Control** in the future, allowing you to grant selected marketplace vendors or specific developer accounts access to your paid extensions and test tags.

We welcome your feedback on how you’d like to manage and share your paid extensions and tests. Please feel free to provide suggestions, use cases, or requirements.