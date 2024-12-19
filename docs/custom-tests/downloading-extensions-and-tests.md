# Downloading extensions and tests

QIT (Quality Insights Toolkit) automatically downloads the extension you are testing (the **System Under Test, or SUT**) and any related plugins, dependencies, and test tags. By default, it fetches the latest stable versions from WooCommerce.com for premium extensions and WordPress.org for free plugins.

## Downloading premium extensions

Premium extensions require authentication. The account used during `qit connect` must own and maintain the premium extension you want to test. If you do not own it, you must provide a local source (for example, a ZIP file containing the extension).

For more details, see [Authenticating with QIT](../installation-setup/authenticating.md).

## Downloading free extensions

Free extensions are sourced directly from WordPress.org without requiring authentication or ownership. You can still provide a local source if you want to test a modified version rather than the publicly available one.

## SUT must exist in the marketplace

Your SUT must be recognized in the WooCommerce.com marketplace and associated with your account. Although you can override the downloaded code with a local source (such as a development build), the SUT itself must be listed in the marketplace for the test results to be recorded.

## Additional plugins and dependencies

- **Premium (WooCommerce.com):** You must own the extension or provide a local source.
- **Free (WordPress.org):** No authentication is required.
- **Not listed in either marketplace:** A local source is required.

## Custom tests (test tags)

- **Remote tests:** You must own the extension associated with the test or provide a local source.
- **Local tests:** If remote tests are not available, you can use a local directory or ZIP file.
- **Conflicts:** If a test tag exists both remotely and locally, QIT will warn you and then default to the remote version.

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

We will see now what QIT does step-by-step, and how you can get around this by providing the zips of these premium plugins locally.

### What happens step-by-step:

1`my-extension` (SUT):
  - QIT checks WooCommerce.com to see if you own `my-extension`.
  - Since you do, it downloads the latest stable release of `my-extension` from WooCommerce.com and the `default` custom test tag.
  - No local source is required here, but you could specify one if you wanted to test a development build.

2. `automatewoo-birthdays` (additional plugin):
  - This is a paid extension, and you are not it's maintainer.
  - QIT cannot download it from WooCommerce.com, so it looks for a local source in `qit.yml` or in the CLI parameters.
  - You must provide something like `source: ./automatewoo-birthdays.zip`. If you don’t, QIT can’t proceed with this plugin.

3. `automatewoo` (dependency):
  - "automatewoo-birthdays" depends on "automatewoo," another premium extension you don’t maintain.
  - QIT again checks if you own "automatewoo" on WooCommerce.com. Since in this scenario you do not, it looks for a local source.
  - You must supply `source: ./automatewoo.zip` in `qit.yml`.

5. `woocommerce` (dependency):
  - Let's suppose "automatewoo" depends on "woocommerce".
  - "woocommerce" is free and available on WordPress.org.
  - QIT downloads it automatically without needing authentication or a local source.

**Example `qit.yml` configuration:**

```yaml
plugins:
  my-extension:
    # Owned premium extension, no source needed unless overriding
    # source: ./my-extension.zip (optional if you want to test a development build)

  automatewoo-birthdays:
    # Premium, not owned → must provide local source
    source: ./automatewoo-birthdays.zip

  automatewoo:
    # Premium, not owned → must provide local source
    source: ./automatewoo.zip

  # woocommerce:
  #   Free, automatically fetched from WordPress.org if no source provided.
  #   Listing it here is optional.
```

This scenario shows how starting from the CLI command, QIT applies a consistent set of rules based on ownership, marketplace availability, and local overrides to set up the testing environment.