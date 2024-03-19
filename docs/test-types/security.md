# Security Tests (Beta)

This test runs an experimental security scanner against a given extension.

- Success: No security issues errors or warnings.
- Warning: Only security issues warnings.
- Failure: One or more security issues errors.

### What Tools Are Used?
The tools used in the Security Scanner are, currently, [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) and [SemGrep](https://semgrep.dev/).

### Can I run it Locally?
Ideally, you should delegate all the testing execution to QIT. We don't support running the tests outside of QIT, but you can mimick at least the PHPCS rules. The SemGrep rules are not available to be run locally.

### Which PHPCS Rules Are Enabled?
Currently, the only rules enabled in the Security Scanner is `WordPress.Security.EscapeOutput`, and `WordPress.Security.ValidatedSanitizedInput`, with some custom sanitizing and escaping functions whitelisted.

These two rules were chosen as a basic level of security to enforce on all extensions, as they are very accurate and will hardly flag false positives. In the near future, we plan to allow the developer to opt-in to stricter levels of security scans, to show off the good work they do, such as nonce checks, or other security programs, such as generational AI-based scanners that can understand flow of logic, or other third party software other than PHPCS and SemGrep. If you'd like to be a part of the process to define the rules ran against your extensions, feel free to [contact us](https://woocommerce.github.io/qit-documentation/#/contact-us) with your suggestions. 

For a more detailed look on our PHPCS rulesets, please see the sample below.

```xml
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
</ruleset>
```

## What to do When Encountering a Discouraged Function?

We identify functions that may lead to potential security vulnerabilities and mark them with a Warning using the `Generic.PHP.ForbiddenFunctions.Discouraged` rule.

While these functions are not inherently unsafe, they frequently contribute to critical vulnerabilities. We flag them to encourage you to review the code for security. If you've confirmed that the code is secure, you can suppress the warning by adding the following comment on the same line as the function: `// phpcs:ignore Generic.PHP.ForbiddenFunctions.Discouraged`

## What to do if it Fails

If your security test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log any security issues that our scanner identifies
- Fix the issue and re-run the test

### Handling False Positives

False positives, or alerts for security issues that do not exist in actuality, may occasionally arise during security testing. Though we've chosen PHPCS and SemGrep rules to minimize such occurrences, it's important to address these false positives in a systematic way.

- **Verification:** The first step is to understand and confirm if it's indeed a false positive. Review the flagged code section and the warning or error raised by the tool. It's always good to revisit the code and the associated rule to understand the potential security implications, if any.
- **Report:** If after careful review, the flag still appears to be a false positive, report it to us. Send an email to qit@woocommerce.com explaining the situation, with the specific test result and the corresponding part of your code. Please make sure to include any additional information that can help us understand why you believe it's a false positive.
- **Suppression (temporarily):** In the meantime, while we investigate the issue, you might want to suppress the false positive to continue your work without disruption. To do so, add a comment line right before the flagged line in your code.
    - For PHPCS errors, add `// phpcs:ignore Rule.Name` on the line where the error is reported. Replace `Rule.Name` with the rule that has caused the false positive, eg: `// phpcs:ignore WordPress.Security.ValidatedSanitizedInput`
    - For SemGrep errors, add `// nosemgrep: rule-id` in a similar manner, replacing rule-id with the SemGrep rule identifier, eg: `// nosemgrep: audit.php.wp.security.xss.query-arg`

Only suppress the error if you are certain that it is a false positive.

- **Resolution:** We'll review your report and communicate our findings. If we confirm it's a false positive, we will work towards fine-tuning our rules to prevent such instances in the future. Your cooperation in reporting these instances is invaluable to improve the quality and accuracy of our security testing.

Please note, suppressing warnings or errors should be done judiciously and is only recommended as a temporary solution. We strongly advise against using it as a permanent solution to avoid security tests. Our goal is to ensure that your extensions are as secure as possible, and ignoring genuine warnings or errors can lead to security vulnerabilities.
