# Authenticating

A vendor admin user is required to be able to view and execute tests using QIT.

## Dashboard

Vendor admins will have access to the Vendor Dashboard where they can view and run tests. This can be found on the My Account page after logging in to WooCommerce.com:

![go-to-dashboard](dashboard/_media/go-to-dashboard.png ":size=50%")

!> If you don't see this option after logging in, you may not be the vendor admin on the account. Reach out to someone else in the organization (usually the person that handles uploading the extension for publishing) to see if they have access.

?> Even if you don't have access in the UI, you'll still be able to leverage the CLI. Please see the section below for a guide on how to do this.

## CLI

In order to be able to use the CLI tool, you'll need to be a vendor admin that can create a [WordPress application password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/) in order to authenticate.

!> Please note that the application passwords seen on the WooCommerce.com My Account page after logging into your account won't work for the QIT CLI. You need to be have access to the Vendor Dashboard to be able to create these application passwords that can be used instead.

If you work in an organization where you have engineers on your team that aren't vendor admins, and thus don't have access to the Vendor Dashboard, they can still make use of the CLI tool to be able to run tests locally and see the results. To do this, create an application password following the steps when authenticating with the CLI tool (using the `partner:add` workflow) and securely share it with folks on the team.

**Rest assured that, the application passwords generated to be used with QIT are limited to only QIT-specific endpoints, such as running and viewing test results. This means, in the event of a breach, the provisioned credentials will not compromise the vendor admin account to which they belong.**

?> Our roadmap includes plans to add the ability to create and revoke QIT-specific access tokens to make this particular workflow and use-case more manageable.
