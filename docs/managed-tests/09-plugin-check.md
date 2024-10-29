# wordpress.org Plugin Check tests

The [wordpress.org automated plugin check](https://wordpress.org/plugins/plugin-check) tool can be run in QIT as a dedicated test type. Currently this test will **not** be run automatically on any submissions, though this may change in the future. However, if you've already integrated QIT into your development pipeline and are also deploying to wordpress.org, you can now run this additional test using the same setup.

## Types of issues flagged

Only checks from the `plugin_repo` category will be run; these should flag obvious violations of the [wordpress.org plugin review guidelines](https://make.wordpress.org/plugins/handbook/performing-reviews/review-checklist/). In the future it may be possible to run other categories or specific checks on demand, depending on developer needs and internal priorities.

## What to do if it fails

If your plugin check test is failing, please review the following steps:
- Open the test report.
- Identify the causes of the failure and remedy it.
- Please note that QIT does not control the underlying rules or engine for this test; if you believe you have found an issue with the check itself, you can [open an issue](https://github.com/WordPress/plugin-check/issues) for the `plugin-check` tool.
- If instead you believe you've run across a bug in the QIT infrastructure around the test, please email us at qit@woocommerce.com so we can review and make the necessary adjustments.
