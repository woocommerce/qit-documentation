---
description: "Reference showing which test options are supported by which test types. Includes a matrix table: Activation, Woo E2E, and Woo API support WordPress/WooCommerce/PHP version selection, additional plugins, and extension sets. Security, PHPStan, Validation, and Plugin Check do NOT support version options. Covers WordPress/WooCommerce version values (stable, rc, specific), PHP versions (7.4-8.4), WooCommerce features (HPOS), additional plugin syntax, extension sets, and how to save options in a qit.json profile."
---

# Test options

When running tests with QIT, you can specify various options (like WordPress, WooCommerce, and PHP versions) to ensure your extension behaves correctly across multiple environments. Different tests support different sets of options, and understanding these capabilities helps you thoroughly validate your code.

## Overview of test options by test type

|                              | Activation | Woo E2E | Woo API | Security | PHPStan | Validation | Plugin Check |
| ---------------------------- | ---------- |---------|---------| -------- | ------- | ---------- | ------------ |
| WordPress Versions           | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| WooCommerce Versions         | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| WooCommerce Features         | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| PHP Version                  | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| Additional Extensions        | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| Additional WordPress Plugins | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| [Extension sets](../configuration/extension-sets.md) | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |

**Key:**
- ✅: Option supported by that test type.
- ❌: Option not supported by that test type.

For example, the Activation test allows you to specify WordPress, WooCommerce, PHP versions, and optional features like HPOS. In contrast, Security or PHPStan tests do not currently support customizing these versions.

## WordPress and WooCommerce versions

For tests like Activation, Woo E2E, and Woo API, you can choose which WordPress and WooCommerce versions to run against:
- Latest stable releases
- Release candidates (RC)
- Previous stable versions (up to the last 4)

Use CLI flags like `--wp=rc` or `--woo=7.0` to toggle these versions. This helps you catch compatibility issues before new versions are released.

## WooCommerce features

Some tests (Activation, Woo E2E, Woo API) let you enable or disable WooCommerce features like High Performance Order Storage (HPOS):
```qitbash
qit run:activation my-extension --optional_features=hpos
```

This ensures you validate how your extension works with emerging WooCommerce features.

## PHP versions

Activation, Woo E2E, and Woo API tests also support testing against different PHP versions (e.g., 7.4, 8.0, 8.1, 8.3). Specify:
```bash
--php=8.0
```

This helps identify PHP-specific compatibility issues or deprecation notices.

## Additional extensions and plugins

If your extension relies on or interacts with other plugins, you can include them in supported tests. For example, to run an Activation test with WooCommerce and another plugin:
```qitbash
qit run:activation my-extension --plugin=woocommerce --plugin=my-other-plugin
```

This ensures compatibility and stable interactions within a controlled environment.

## Extension sets

```qitbash
qit run:woo-api my-extension --extension_set=compatibility
```
Extension sets provide a way to run certain managed test types with a predefined set of other extensions included in the environment. For more information see [their documentation page](../configuration/extension-sets.md).

## Configuring test options in config files

Instead of passing flags every time, save your settings in a `qit.json` [profile](../configuration/profiles.md):

```json
{
  "test_types": {
    "activation": {
      "default": {
        "wp": "rc",
        "woo": "7.2",
        "php": "8.1"
      }
    }
  }
}
```

Then run `qit run:activation my-extension` and it applies these settings automatically.

## Tips

- **Start stable:** Begin testing with stable versions of WordPress and WooCommerce, then check RC or older versions for regressions.
- **Incrementally add features:** Introduce optional features (like HPOS) once you confirm basic compatibility, making debugging easier.
- **Combine with CI/CD:** Integrate version testing in your CI pipeline, running tests against multiple versions concurrently to ensure broad compatibility.
