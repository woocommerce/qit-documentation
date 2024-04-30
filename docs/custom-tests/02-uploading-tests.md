# Uploading Tests

:::info
The Custom Tests feature is coming soon.
:::

To upload a test that you have previously generated:

```qitbash
qit upload:test <plugin-slug> <path-to-tests>
```

This will upload that test as the `default` test tag of `plugin-slug`.

## Using the Uploaded Tests

When you run `qit run:e2e <plugin-slug>`, it will spin up an environment and run the `default` test tag of `plugin-slug`.

Other plugins can also use it for compatibility testing:

Example: Running the "test phase" of `cat-pictures` and the "bootstrap phase" of `qit-beaver`

```qitbash
qit run:e2e cat-pictures --plugin qit-beaver
```

And if you want to run the test phase of `qit-beaver` as well:

```qitbash
qit run:e2e cat-pictures --plugin qit-beaver:test
```

## Uploading different versions of your tests:

You can also upload different versions of your tests by tagging them:

```qitbash
qit upload:test <plugin-slug> <path-to-tests> --tag <tag-name>
```

These different tags can be useful for tagging `rc` tests, or using it to compose small tests, like feature tests, or fast tests.

## Using test tags

You can run tests with different tags:

```qitbash
qit run:e2e qit-beaver:test:rc
```

Or if you want to run multiple tags:

```qitbash
qit run:e2e qit-beaver:test:rc,feature-xyz
```
