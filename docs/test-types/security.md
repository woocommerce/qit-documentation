### Security tests (beta)

This test runs an experimental security scanner against a given extension. It uses a set of PHPCS WordPress Security rules. The following statuses will be returned from this test:

- Success: No PHPCS security issues errors or warnings.
- Warning: Only PHPCS security issues warnings.
- Failure: One or more PHPCS security issues errors.

### What rules do have been enabled?
Below is an example of the ruleset used to run our secutiry test in the QIT.

```
<?xml version="1.0"?>
<ruleset name="WooCommerce Marketplace PHPCS Security Checks">
    <description>WooCommerce Marketplace PHPCS Security Checks.</description>

    <arg value="sp"/>
    <arg name="colors"/>
    <arg name="extensions" value="php"/>
    <arg name="parallel" value="8"/>
    
    <exclude-pattern>tests/*</exclude-pattern>
    <exclude-pattern>vendor/*</exclude-pattern>
    <exclude-pattern>vendor-prefixed/*</exclude-pattern>


    <rule ref="WordPress.Security.EscapeOutput">
        <properties>
            <property name="customEscapingFunctions" type="array" value="WC_Payments_Utils,esc_interpolated_html,wc_help_tip,wc_sanitize_tooltip,wc_selected,wc_kses_notice,wc_esc_json,wc_query_string_form_fields,wc_make_phone_clickable" />
        </properties>
    </rule>
    
    <!-- Lack of nonces will be added at a later point to minimize noise. -->
    <rule ref="WordPress.Security.NonceVerification">
    	<severity>0</severity>
	</rule>
	
	<!-- Do not flag missing "wp_unslash()" calls to globals such as $_POST, and $_GET, etc. -->
    <rule ref="WordPress.Security.ValidatedSanitizedInput.MissingUnslash">
    	<severity>0</severity>
	</rule>
	
	<!-- Do not flag missing checks of "isset" on $_POST, $_GET, etc. -->
    <rule ref="WordPress.Security.ValidatedSanitizedInput.InputNotValidated">
    	<severity>0</severity>
	</rule>
	
	<!-- Do not flag usage of deprecated "// WPCS: XSS ok." -->
    <rule ref="WordPress.Security.EscapeOutput.DeprecatedWhitelistCommentFound">
    	<severity>0</severity>
	</rule>
    
    <rule ref="WordPress.Security.PluginMenuSlug"/>
    
	<!-- When we disable "InputNotValidated", "InputNotSanitized" also gets disabled, and this is not what we want. -->
    <rule ref="WordPress.Security.ValidatedSanitizedInput.InputNotSanitized">
    	<severity>5</severity>
	</rule>
	
	<rule ref="WordPress.Security.ValidatedSanitizedInput">	
		<properties>
			<property name="customSanitizingFunctions" type="array" value="wc_booking_sanitize_time,wc_clean,wc_sanitize_tooltip,wc_format_decimal,wc_stock_amount,wc_sanitize_permalink,wc_sanitize_textarea" />
			<property name="customUnslashingSanitizingFunctions" type="array" value="stripslashes"/>
		</properties>
	</rule>
</ruleset>
```

TLDR: Currently, the only rules we've enabled are `OutputEscaped` and `InputSanitzed`. As the QIT matures, the list of enabled rules is subject to change.

## What to do if it fails

If your security test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log any security issues that our scanner identifies
- Fix the issue and re-run the test
- If you think the result is incorrect, please email us at qit@woocommerce.com