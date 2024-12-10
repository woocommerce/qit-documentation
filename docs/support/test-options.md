# Test options

When running tests with QIT, you can specify various options—like WordPress, WooCommerce, and PHP versions—to ensure your extension behaves correctly across multiple environments. Different tests support different sets of options, and understanding these capabilities helps you thoroughly validate your code.

## Overview of test options by test type

|                              | Activation | Woo E2E | Woo API | Security | PHPStan | Validation | Plugin Check |
| ---------------------------- | ---------- |---------|---------| -------- | ------- | ---------- | ------------ |
| WordPress Versions           | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| WooCommerce Versions         | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| WooCommerce Features         | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| PHP Version                  | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| Additional Extensions        | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |
| Additional WordPress Plugins | ✅         | ✅       | ✅       | ❌       | ❌      | ❌         | ❌           |

**Key:**
- ✅: Option supported by that test type.
- ❌: Option not supported by that test type.

For example, the Activation test allows you to specify WordPress, WooCommerce, PHP versions, and optional features like HPOS. In contrast, Security or PHPStan tests do not currently support customizing these versions.

## WordPress and WooCommerce versions

For tests like Activation, Woo E2E, and Woo API, you can choose which WordPress and WooCommerce versions to run against:
- Latest stable releases
- Release candidates (RC)
- Previous stable versions (up to the last 4)

Use CLI flags like `--wordpress_version=rc` or `--woocommerce_version=7.0` to toggle these versions. This helps you catch compatibility issues before new versions are released.

## WooCommerce features

Some tests (Activation, Woo E2E, Woo API) let you enable or disable WooCommerce features like High Performance Order Storage (HPOS):
```qitbash
qit run:activation my-extension --optional_features=hpos
```

This ensures you validate how your extension works with emerging WooCommerce features.

## PHP versions

Activation, Woo E2E, and Woo API tests also support testing against different PHP versions (e.g., 7.4, 8.0, 8.1, 8.3). Specify:
```bash
--php_version=8.0
```

This helps identify PHP-specific compatibility issues or deprecation notices.

## Additional extensions and plugins

If your extension relies on or interacts with other plugins, you can include them in supported tests. For example, to run an Activation test with WooCommerce and another plugin:
```qitbash
qit run:activation my-extension --plugin=woocommerce --plugin=my-other-plugin
```

This ensures compatibility and stable interactions within a controlled environment.

## Configuring test options in config files

Instead of passing flags every time, define options in `qit.yml` or `qit.json`:
```yaml
wordpress_version: rc
woocommerce_version: 7.2
php_version: 8.1
optional_features:
  - hpos
plugins:
  - woocommerce
  - my-other-plugin
```

Running `qit run:activation my-extension` applies these settings automatically.

## Tips

- **Start stable:** Begin testing with stable versions of WordPress and WooCommerce, then check RC or older versions for regressions.
- **Incrementally add features:** Introduce optional features (like HPOS) once you confirm basic compatibility, making debugging easier.
- **Combine with CI/CD:** Integrate version testing in your CI pipeline, running tests against multiple versions concurrently to ensure broad compatibility.
