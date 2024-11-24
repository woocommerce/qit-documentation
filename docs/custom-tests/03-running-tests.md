import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Running tests

:::info
The custom E2E tests feature is available as early-access.
:::

## Running a basic test

Assuming you have generated and uploaded a E2E test, the basic syntax for running a test is:

```qitbash
qit run:e2e example-plugin
```

If you haven't uploaded a test to QIT, you can run a local test:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests
```

:::tip
Replace "example-plugin" with the slug of an extension you own.
:::

## Using a config file

Place a `qit-env.json` or `qit-env.yml` file in the directory you run `qit run:e2e` from.

Here's an example of a complex config file:

<Tabs
defaultValue="json"
values={[
{ label: 'JSON', value: 'json'},
{ label: 'YML', value: 'yml'},
]}>

<TabItem value="json">
```json
{
  "wordpress_version": "nightly",
  "php_version": "8.3",
  "object_cache": true,
  "plugins": {
    "example-plugin": {
      "action": "test",
      "source": "~/my-plugins/example-plugin",
      "test_tags": [
        "~/my-plugins/example-plugin/tests"
      ]
    },
    "woocommerce": {
      "action": "bootstrap",
      "test_tags": [
        "default"
      ]
    },
    "foo-plugin": {
      "action": "install"
    },
    "example-plugin-2": {
      "action": "test",
      "source": "https://github.com/qit-plugins/example-plugin-2/releases/tag/nightly.zip",
      "test_tags": [
        "nightly",
        "some-feature"
      ]
    }
  }
}
```
</TabItem>

<TabItem value="yml">
```yml
wordpress_version: nightly
php_version: 8.3
object_cache: true
plugins:
  example-plugin:
    action: test
    source: ~/.qit/plugins/example-plugin
    test_tags:
      - ~/my-plugins/example-plugin/tests
  woocommerce:
    action: bootstrap
    test_tags:
      - default
  foo-plugin:
    action: install
  example-plugin-2:
    action: test
    source: https://github.com/qit-plugins/example-plugin-2/releases/tag/nightly.zip
    test_tags:
      - nightly
      - some-feature
```
</TabItem>

</Tabs>

## Using parameters

You can also mimick this entire config file using only runtime parameters.

Suppose you are scripting a test run and want to pass everything as parameters:

```qitbash
qit run:e2e qit-the-beaver ~/my-plugins/example-plugin/tests --source ~/.qit/plugins/example-plugin \
  --wp nightly \
  --php-version 8.3 \
  --object-cache \
  --plugin woocommerce:bootstrap \
  --plugin foo-plugin:activate \
  --plugin https://github.com/qit-plugins/example-plugin-2/releases/tag/nightly.zip:test:nightly,some-feature:example-plugin-2
```

## The plugin syntax

As you can see, defining how a plugin should be used in our test can be complex, as we need to account for different ways to use it.

To simplify this, we have a short syntax for defining plugins, which is `source:action:test-tags:slug`.

```qitbash
qit run:e2e <main-extension> --plugin <plugin-syntax>
```

Where:

- `source` can be a slug, a Zip URL, a local path, or a WooCommerce.com ID.
- `action` can be `activate`, `bootstrap` or `test` (default is `bootstrap`. They are cumulative, so if you pass `test`, it will also activate and bootstrap the plugin)
- `test-tags` is a comma-separated list of test tags to run, or a local directory (default is `default`)
- `slug` is the plugin slug. This is only needed if using a `source` other than a slug, and the slug can't be inferred.

### Inferring `slug` from `source`

If you are using a local path, a Zip URL, or a WooCommerce.com ID, we will try to infer the `slug` from the basename of the file or directory.

Examples:

```
# Scenarios wehere inferred `slug` is `extension2`:

qit run:e2e example-plugin --plugin extension2
qit run:e2e example-plugin --plugin ~/my-plugins/example-plugin/extension2.zip
qit run:e2e example-plugin --plugin https://github.com/woocommerce/example-plugin/releases/tag/extension2.zip
```

## Examples:

### Using a local plugin:

Directory as `source`:

```qitbash
qit run:e2e qit-the-beaver --source ~/my-plugins/example-plugin
```

Zip file as `source`:

```qitbash
qit run:e2e qit-the-beaver --source ~/my-plugins/example-plugin/example-plugin.zip
```

URL as `source`:

```qitbash
qit run:e2e qit-the-beaver --source https://github.com/woocommerce/example-plugin/releases/tag/example-plugin.zip
```


## Using a local plugin with a local test

If you have a test that you haven't uploaded yet, you can run it directly:

Slug as `source`, directory as `test-tags`:

```qitbash
qit run:e2e qit-the-beaver ~/my-plugins/example-plugin/tests
```

Directory as `source`, directory as `test-tags`:

```qitbash
qit run:e2e qit-the-beaver ~/my-plugins/example-plugin/tests --source ~/my-plugins/example-plugin
```

Zip file as `source`, directory as `test-tags`:

```qitbash
qit run:e2e qit-the-beaver ~/my-plugins/example-plugin/tests --source ~/my-plugins/example-plugin/build.zip
```

URL as `source`, directory as `test-tags`:

```qitbash
qit run:e2e qit-the-beaver ~/my-plugins/example-plugin/tests --source https://github.com/woocommerce/example-plugin/releases/tag/nightly.zip
```

## Using test tags

If you have uploaded a test with a tag different than the default one, you can run it with:

```qitbash
qit run:e2e example-plugin nightly
```

You can also run multiple tags:

```qitbash
qit run:e2e example-plugin nightly,foo-feature
```

And you can run a test with a tag from a local directory, file, or URL:

```qitbash
qit run:e2e qit-the-beaver nightly,foo-feature --source ~/my-plugins/example-plugin
```

```qitbash
qit run:e2e qit-the-beaver nightly,foo-feature --source ~/my-plugins/example-plugin/example-plugin.zip
```

```qitbash
qit run:e2e qit-the-beaver nightly,foo-feature --source https://github.com/woocommerce/example-plugin/releases/tag/example-plugin.zip
```

And even run a local test in the mix:

```qitbash
qit run:e2e qit-the-beaver ~/my-plugins/example-plugin/tests,nightly,foo-feature --source ~/my-plugins/example-plugin
```

## Testing plugins that require a live site

Some plugins require a live site to work properly, such as payment gateways or SaaS.

To test these plugins, you can use our [built-in tunnel feature](/docs/environment/tunnel).