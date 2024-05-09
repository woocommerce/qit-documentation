import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Running Tests

:::info
The Custom Tests feature is available as early-access.
:::

## Running a Basic Test

Assuming you have generated and uploaded a E2E test, the basic syntax for running a test is:

```qitbash
qit run:e2e qit-beaver
```

If you haven't uploaded a test to QIT, you can run a local test:

```qitbash
qit run:e2e qit-beaver ~/my-plugins/qit-beaver/tests
```

:::tip
Replace "qit-beaver" with the slug of an extension you own.
:::

## Using a Config File

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
    "qit-beaver": {
      "action": "test",
      "source": "~/my-plugins/qit-beaver",
      "test_tags": [
        "~/my-plugins/qit-beaver/tests"
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
    "qit-dog": {
      "action": "test",
      "source": "https://github.com/qit-plugins/qit-dog/releases/tag/nightly.zip",
      "test_tags": [
        "nightly",
        "feature-dog-pictures"
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
  qit-beaver:
    action: test
    source: ~/.qit/plugins/qit-beaver
    test_tags:
      - ~/my-plugins/qit-beaver/tests
  woocommerce:
    action: bootstrap
    test_tags:
      - default
  foo-plugin:
    action: install
  qit-dog:
    action: test
    source: https://github.com/qit-plugins/qit-dog/releases/tag/nightly.zip
    test_tags:
      - nightly
      - feature-dog-pictures
```
</TabItem>

</Tabs>

## Using Parameters

You can also mimick this entire config file using only runtime parameters.

Suppose you are scripting a test run and want to pass everything as parameters:

```qitbash
qit run:e2e ~/.qit/plugins/qit-beaver:test:~/my-plugins/qit-beaver/tests \
  --wp nightly \
  --php-version 8.3 \
  --object-cache \
  --plugin woocommerce:bootstrap \
  --plugin foo-plugin:activate \
  --plugin https://github.com/qit-plugins/qit-dog/releases/tag/nightly.zip:test:nightly,feature-dog-pictures:qit-dog
```

## The Plugin Syntax

As you can see, defining how a plugin should be used in our test can be complex, as we need to account for different ways to use it.

To simplify this, we have a short syntax for defining plugins, which is `source:action:test-tags:slug`.

```qitbash
qit run:e2e <plugin-syntax> --plugin <plugin-syntax>
```

Where:

- `source` can be a slug, a Zip URL, a local path, or a Woo.com ID.
- `action` can be `activate`, `bootstrap` or `test` (default is `bootstrap`. They are cumulative, so if you pass `test`, it will also activate and bootstrap the plugin)
- `test-tags` is a comma-separated list of test tags to run, or a local directory (default is `default`)
- `slug` is the plugin slug. This is only needed if using a `source` other than a slug, and the slug can't be inferred.

### Inferring `slug` from `source`

If you are using a local path, a Zip URL, or a Woo.com ID, we will try to infer the `slug` from the basename of the file or directory.

Examples:

```
# Scenarios wehere inferred `slug` is `qit-beaver`:

qit run:e2e ~/my-plugins/qit-beaver
qit run:e2e ~/my-plugins/qit-beaver/qit-beaver.zip
qit run:e2e https://github.com/woocommerce/qit-beaver/releases/tag/qit-beaver.zip

# Scenarios where `slug` won't be inferred correctly, and needs to be explicitly defined:
qit run:e2e ~/my-plugins/qit-beaver/foo-bar:test:default:qit-beaver
qit run:e2e ~/my-plugins/qit-beaver/build.zip:test:default:qit-beaver
qit run:e2e https://github.com/woocommerce/qit-beaver/releases/tag/nightly.zip:test:default:qit-beaver
```

## Examples:

### Using a local plugin:

Directory as `source`:

```qitbash
qit run:e2e ~/my-plugins/qit-beaver
```

Zip file as `source`:

```qitbash
qit run:e2e ~/my-plugins/qit-beaver/qit-beaver.zip
```

URL as `source`:

```qitbash
qit run:e2e https://github.com/woocommerce/qit-beaver/releases/tag/qit-beaver.zip
```


## Using a local plugin with a local test

If you have a test that you haven't uploaded yet, you can run it directly:

Slug as `source`, directory as `test-tags`:

```qitbash
qit run:e2e qit-beaver ~/my-plugins/qit-beaver/tests
```

Directory as `source`, directory as `test-tags`:

```qitbash
qit run:e2e ~/my-plugins/qit-beaver ~/my-plugins/qit-beaver/tests
```

Zip file as `source`, directory as `test-tags`:

```qitbash
qit run:e2e ~/my-plugins/qit-beaver/build.zip ~/my-plugins/qit-beaver/tests
```

URL as `source`, directory as `test-tags`:

```qitbash
qit run:e2e https://github.com/woocommerce/qit-beaver/releases/tag/nightly.zip ~/my-plugins/qit-beaver/tests
```

## Using test tags

If you have uploaded a test with a tag different than the default one, you can run it with:

```qitbash
qit run:e2e qit-beaver:test:nightly
```

You can also run multiple tags:

```qitbash
qit run:e2e qit-beaver:test:nightly,foo-feature
```

And you can run a test with a tag from a local directory, file, or URL:

```qitbash
qit run:e2e ~/my-plugins/qit-beaver:test:nightly,foo-feature
```

```qitbash
qit run:e2e ~/my-plugins/qit-beaver/qit-beaver.zip:test:nightly,foo-feature
```

```qitbash
qit run:e2e https://github.com/woocommerce/qit-beaver/releases/tag/qit-beaver.zip:test:nightly,foo-feature
```

And even run a local test in the mix:

```qitbash
qit run:e2e ~/my-plugins/qit-beaver:test:~/my-plugins/qit-beaver/tests,nightly,foo-feature
```