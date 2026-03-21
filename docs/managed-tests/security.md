---
description: "Reference for the `run:security` managed test. Required for all WooCommerce Marketplace submissions. Covers the five scanning tools used (PHPCS WordPress.Security rules, SemGrep, composer/npm audit, WPScan vulnerability database, gitleaks secret detection), how to interpret results, and how to suppress false positives (phpcs:ignore, nosemgrep, gitleaks:allow). Does not support version parameters — security tests are static analysis only. Includes auto-generated CLI usage."
---

# Security tests

Security tests run a suite of scanning and auditing tools against your extension’s code to identify potential vulnerabilities and ensure that it adheres to established security best practices. **All new submissions and updates to the WooCommerce Marketplace must pass these security tests.** Ensuring your extension passes helps maintain a secure and trustworthy ecosystem for merchants and customers.

## What tools are used?

The security test currently uses a combination of industry-standard tools and databases:

- **PHPCS (PHP CodeSniffer):**
  Checks your code against the WordPress Coding Standards, specifically focusing on rules in the `WordPress.Security` and `WordPress.DB` namespaces. This helps identify common security pitfalls and unsafe patterns related to database interactions and data handling.

- **SemGrep:**
  Runs targeted rules to detect insecure coding patterns, such as potential injection points or unsafe file operations.

- **Third-party package audit tools (e.g., `composer audit`, `npm audit`):**
  Scans your project’s dependencies against known vulnerability databases, identifying outdated or insecure packages.

- **WPScan vulnerability database:**
  Compares your extension against a curated list of known WordPress plugin vulnerabilities. If your extension has a known unfixed vulnerability, it will be flagged.

- **gitleaks secret check:**
  Checks your code for potential leaks of hard-coded secrets or tokens using the [gitleaks](https://github.com/gitleaks/gitleaks) tool.

## Test outcomes

- **Success:**  
  No security issues, errors, or warnings detected. Your extension is cleared for listing or updating on the WooCommerce Marketplace.

- **Warning:**  
  The scanner identified non-critical security warnings. These are discouraged functions or patterns that, while not inherently unsafe, frequently lead to vulnerabilities if misused. Consider addressing these warnings, as they may not block listing but are best remedied for overall security.

- **Failure:**  
  One or more critical security errors were identified. Your extension cannot be listed or updated until these issues are resolved.

## Interpreting the results

When the test flags issues, review the generated report for details on:

- **Specific code locations and functions:**
  Identify precisely where the vulnerability or questionable pattern occurs.

- **Relevant security rules or guidelines:**
  Reference the associated PHPCS or SemGrep rule name to understand why the code was flagged.

- **Dependency vulnerabilities:**
  If third-party packages are outdated or insecure, consider upgrading to a patched version or replacing the package altogether.

- **WPScan advisories:**
  If your extension is listed as vulnerable by WPScan, verify if you have an unfixed issue. If you believe you have already addressed the vulnerability and the listing is outdated, [contact WPScan](https://wpscan.com/contact/) to update their records.

- **Leaked secrets:**
  If gitleaks identifies anything that looks like a hard-coded secret, token, or similar, it will flag it as a warning.

## Handling failures and warnings

1. **Open the test report:**  
   Review the highlighted issues carefully.

2. **Fix the identified problems:**  
   Update code to use safer functions, sanitize and validate input, upgrade third-party packages, remove hard-coded secret values, or address vulnerabilities flagged by WPScan.

3. **Rerun the test:**  
   Confirm that your changes resolved the flagged issues. You must achieve a passing result before your extension can be listed or updated on the WooCommerce Marketplace.

## AI-assisted recommendations

For flagged issues, you can request AI-generated suggestions for remediation. While these recommendations can guide your fixes, review them critically. They may need refinement before being fully implemented. Providing feedback on these suggestions helps improve their accuracy over time.

## Handling false positives

Occasionally, a rule may flag a scenario that you believe is not genuinely insecure:

- **Verification:**  
  Double-check the code and rule details to ensure it’s truly a false positive.

- **Temporary suppression:**  
  For PHPCS errors, add:  
  ```php
  // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
  ```  
  For SemGrep errors, add:  
  ```php
  // nosemgrep
  ```
  Replace `rule-id` with the relevant SemGrep rule name.

  For gitleaks detections, add:
  ```php
  // gitleaks:allow
  ```
  to the relevant line.

- **Contact us:**  
  If you consistently encounter what you believe are false positives, email us at qit@woocommerce.com with details. We’ll review and refine our rules to minimize such occurrences.

## What to do when encountering discouraged functions?

The `Generic.PHP.ForbiddenFunctions.Discouraged` rule flags functions that are not inherently unsafe but often associated with security issues. If you’ve confirmed the code is secure, you can suppress the warning inline:

```php
// phpcs:ignore Generic.PHP.ForbiddenFunctions.Discouraged
```

Use suppression judiciously. Strive to follow recommended practices rather than routinely ignoring warnings.

## Best practices

- **Run tests regularly:**  
  Periodic security testing helps maintain a high standard of code quality and trustworthiness.

- **Keep dependencies updated:**  
  Use the latest secure versions of third-party packages to reduce the risk of known vulnerabilities.

- **Remove hard-coded secret values:**  
  Use per-installation secrets (such as product keys) to secure communcation and API access, rather than hard-coding a token.

- **Combine with other tests:**  
  Security tests complement other managed tests, end-to-end tests, and code quality checks, ensuring a holistic view of your extension’s health.

## What do the audit results mean?

Audit results like:

- Known vulnerability check passed
- Dependent packages vulnerability check passed

Means that the product has successfully passed automated security checks that scan for known risks in its code and any third-party tools it uses.

**What’s being checked?**

We use trusted auditing tools like `composer audit` and `npm audit` to:

- Check the product’s own code for any known security issues.
- Scan third-party packages and libraries the product depends on — for example, payment gateways, form handlers, or UI components — and ensure none are listed in public vulnerability databases (such as [GitHub Security Advisories](https://github.com/advisories) or the [National Vulnerability Database](https://nvd.nist.gov/)).

**What does “check passed” mean?** 

If a check is marked as passed, it means:
- No known vulnerabilities were found in the product’s code or its dependencies at the time of testing.
- All third-party packages used are either up-to-date or have no reported security issues.

These audits help ensure that the product is safe, stable, and trustworthy to install on your WooCommerce store.


<!-- BEGIN GENERATED CLI REFERENCE -->
## CLI Usage

```
Description:
  Enqueue Security tests.

Usage:
  run:security [options] [--] [<sut>]

Arguments:
  sut                                           Extension slug or WooCommerce.com ID

Options:
      --config[=CONFIG]                         Path to the qit.json configuration file
      --profile[=PROFILE]                       Test profile to use [default: "default"]
      --zip[=ZIP]                               (Optional) Local ZIP / dir / URL build to test
  -j, --json|--no-json                          (Optional) Output raw JSON response
      --async|--no-async                        (Optional) Enqueue test and return immediately without waiting
  -w, --wait|--no-wait                          (Deprecated) Wait for test completion - this is now the default behavior
      --print-report-url|--no-print-report-url  (Optional) Print the test report URL (contains sensitive data - use cautiously in public logs)
  -t, --timeout[=TIMEOUT]                       (Optional) Wait timeout in seconds
  -g, --group|--no-group                        (Optional) Register the run into a group
```

*Auto-generated from `qit run:security --help`.*
<!-- END GENERATED CLI REFERENCE -->
