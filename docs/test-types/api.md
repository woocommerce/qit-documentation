### API Tests

API Testing is a crucial part of ensuring the smooth functioning of an application. In this testing procedure, we execute a set of operations using the [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/) and verify that the expected outcomes are achieved. These operations might include creating products, customers, and orders through the REST API and then validating the data that we have created.

The test suite that we use for this process is called the [WooCommerce Core API tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/api-core-tests). It is run against a store where your extension has been activated. Upon completion of the test, you can check the dashboard to see if the test has passed or failed. If it fails, you can access an Allure test report that will provide you with a detailed analysis of the reasons for the failure.

## What to do if it fails

In the event of a failed API test, you must take the following steps:
- Review the test report.
- Analyze the causes of the failure and attempt to recreate the issue on your local setup.
- Resolve the issue and run the test again.
- If you believe that the result is incorrect, please do not hesitate to contact us at qit@woocommerce.com.
