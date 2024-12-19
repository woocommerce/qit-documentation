# Downloading Extensions and Tests

QIT automatically downloads the extension you are testing (SUT), as well as any additional plugins, dependencies, and their respective custom test tags, if needed.

By default, it fetches stable versions from WooCommerce.com (for premium extensions) or WordPress.org (for free plugins).

## Downloading Premium Extensions

Access to premium extensions on WooCommerce.com is tied to the WooCommerce.com account associated with the QIT Token you obtained during the `qit connect` process. If your account owns and can manage the extension, QIT can download it remotely. Otherwise, you must provide a local source.

For detailed steps on authenticating with QIT, see Authenticating with QIT.

## Understanding Permissions and Ownership

- **Premium Extensions (WooCommerce.com):**  
  You must own the extension in your WooCommerce.com account to download it remotely. If you do not have access, QIT will fail to fetch it. In that case, providing a local source (e.g., a development build) ensures the test run can continue.

- **Free Extensions (WordPress.org):**  
  No special permissions are required. QIT downloads them automatically. You can still provide a local source if you want to test a modified or private version.

- **Not Listed on WooCommerce.com:**  
  If the extension isn’t available in the marketplace, you must provide a local source.

## The System Under Test (SUT)

- **Premium SUT:** You must own it on WooCommerce.com or provide a local source.
- **Free SUT:** Automatically fetched; local source optional for testing custom builds.
- **SUT Not Listed:** Must provide a local source directly.

## Additional Plugins and Dependencies

- **Free (WPORG):** Downloaded automatically.
- **Premium (WCCOM):** Requires ownership; otherwise provide a local source.
- **Not Listed:** Provide a local source.

This unified approach ensures that if you lack remote access, you can always fall back on a local source.

## Custom Tests (Test Tags)

- **Remote Tests:** QIT fetches them if you have the required access.
- **Local Tests:** If remote tags aren’t accessible or don’t exist, provide a local directory or zip.
- **Conflicts:** If the same tag exists both remotely and locally, QIT warns you and uses the remote version by default.

## Providing Local Sources

To supply a local source, add a `source` attribute in `qit.yml`:

```yaml
plugins:
  my-premium-sut:
    source: ./my-premium-sut.zip
```

For tests:

```yaml
plugins:
  my-plugin:
    test_tags:
      - ./local-tests/my-plugin-tests
```

## Error Handling

- **No Ownership:** QIT reports that it can’t fetch the extension. Provide proper credentials or a local source.
- **Not Found Remotely:** Check the slug or add a local source.
- **Local vs Remote (Tests):** QIT warns on conflict; remote is used unless you adjust your setup.

## Installing Plugins and Themes from Other Sources

While QIT works seamlessly with WordPress.org and WooCommerce.com listings—plus local sources—you may need to fetch extensions from other locations like private GitHub repositories or premium marketplaces not directly supported by QIT. In these cases, you can implement **custom handlers** that define how QIT should retrieve and prepare these plugins or themes. For more details and examples, refer to the [Advanced Config Handlers documentation](./../advanced-usage/advanced-config-handlers.md).