# Themes

:::info
The custom E2E tests feature is available as early access.
:::

When writing custom E2E tests that interact with the front-end, the active theme can influence the layout, markup, and behavior of your store. Testing under different themes helps ensure your extension works smoothly in various visual and structural environments. For example, a checkout customization might look great on Storefront but fail on another theme with different template overrides.

## Why test with different themes?

- **Front-end consistency:** Confirm that front-end features, such as custom product displays or specialized cart interactions, remain functional under diverse themes.
- **Prevent CSS or layout breakage:** Some themes reorder elements, use different selectors, or apply unique CSS rules. By testing under multiple themes, you catch visual and structural issues early.
- **Wider compatibility:** If you recommend certain themes or know that merchants often use popular third-party themes, ensuring compatibility can boost merchant confidence and reduce support overhead.

## Activating a theme

You can enforce a specific theme during your test’s setup phases. For example, in your `bootstrap.sh` script:
- Install a theme:  
  `wp theme install storefront --activate`
- If you need a specific child theme, install and activate it similarly:
  `wp theme install path-to-child-theme.zip --activate`

After this setup, your tests run against the chosen theme’s front-end. If you need to switch themes between tests, use shared or isolated setup scripts to adjust which theme is active.

## Example scenario

Imagine you have a custom checkout field. Under Storefront, the field appears correctly, but under a different theme, the CSS selector changes, causing the test to fail. By adding a test scenario that runs with another theme:
1. Use shared setup or isolated setup to activate the alternate theme.
2. Re-run your tests and observe if the custom checkout field is still visible and functional.
3. If not, adjust your plugin’s code or test selectors accordingly.

## Using codegen with different themes

When running `qit run:e2e your-extension --codegen`, consider switching themes between sessions. Generate tests for the Storefront baseline first, then re-run codegen after activating a different theme. This approach helps you quickly identify UI differences and update selectors or assertions in your tests.

## Tips for managing themes

- **Keep themes in version control:** If using custom themes or child themes, maintain them in a repository. This ensures consistent installations and updates during the test lifecycle.
- **Use config files:** Leverage qit.json or qit.yml to specify which themes to install and activate for certain test runs, making it easy to toggle between themes without rewriting scripts.
- **Focus on selectors and markup:** Keep an eye on HTML selectors and markup differences. Write tests that rely on stable identifiers when possible, such as `data-test` attributes, to minimize theme-related flakiness.

## Next steps

- [Understanding the Lifecycle](./understanding-lifecycle.md): Review how and when to activate themes within shared or isolated setups.
- [Architecture & Security](./security-architecture.md): Learn about the underlying architecture that ensures clean environments and prevents cross-test interference, even when switching themes.
- [QIT Helpers](./qit-helpers.md): Explore QIT’s helpers for simplifying test scripting, including actions like logging in as admin or running WP-CLI commands to switch themes.