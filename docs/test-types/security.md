### Security tests (beta)

This test runs an experimental security scanner against a given extension. It uses a set of PHPCS WordPress Security rules. The following statuses will be returned from this test:

- Success: No PHPCS security issues errors or warnings.
- Warning: Only PHPCS security issues warnings.
- Failure: One or more PHPCS security issues errors.

### What rules do have been enabled?
Currently, the only rules enabled in the Security Scanner is WordPress.Security.EscapeOutput WordPress.Security.ValidatedSanitizedInput. These two rules were chosen as a basic level of security to enforce on all extensions, as they are very accurate and will hardly flag false positives. In the near future, we plan to allow the developer to opt-in to stricter levels of security scans, to show off the good work they do, such as nonce checks, or other security programs, such as generational AI-based scanners that can understand flow of logic, or other third party softwares other than PHPCS. If you'd like to be apart of the process to define the rules ran against your extensions, feel free to [contact us](https://woocommerce.github.io/qit-documentation/#/contact-us) with your suggestions. 

For a more detailed look on our rulesets, please see the sample below.

```
<?xml version="1.0"?>
<ruleset name="Woo Marketplace PHPCS Security Checks">
    <description>Woo Marketplace PHPCS Security Checks.</description>

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
	
    <!-- Warn about usage of potentially dangerous functions. -->
    <rule ref="Generic.PHP.ForbiddenFunctions">
      <properties>
        <property name="error" value="false" />
        <property name="forbiddenFunctions" type="array" value="wp_set_auth_cookie=>null,wp_set_current_user=>null"/>
      </properties>
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
	
	<rule ref="QITStandard"/>
</ruleset>
```

## What to do when encountering a discouraged function?

We identify functions that may lead to potential security vulnerabilities and mark them with a Warning using the `Generic.PHP.ForbiddenFunctions.Discouraged` rule.

While these functions are not inherently unsafe, they frequently contribute to critical vulnerabilities. We flag them to encourage you to review the code for security. If you've confirmed that the code is secure, you can suppress the warning by adding the following comment on the same line as the function: `// phpcs:ignore Generic.PHP.ForbiddenFunctions.Discouraged`

## What to do if it fails

If your security test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log any security issues that our scanner identifies
- Fix the issue and re-run the test
- If you think the result is incorrect, please email us at qit@woocommerce.com
