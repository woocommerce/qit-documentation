import CLIAuthVideo from '@site/src/video/qit-cli-auth-flow.mp4';

# Authenticating

QIT is currently exclusive to Partner Developers that sell plugins in the WooCommerce.com Marketplace.

## Authenticating using QIT CLI

- Login to WooCommerce.com with your Partner Developer account
- [Download](https://github.com/woocommerce/qit-cli/releases/latest/) the latest version of QIT CLI and [Install it](/cli/01-installation.md)
- Depending on how you've installed the QIT CLI, run `./vendor/bin/qit partner:add`
- Follow the steps to generate a QIT Token
- Enter the QIT Token and username in the CLI

<video controls style={{ width:"100%", height:"100%" }}>
    <source src={CLIAuthVideo} />
</video>

## Authenticating in the WooCommerce.com Marketplace

We also provide a user interface to view and start test runs in the WooCommerce.com Vendor Dashboard.

To access it:

- Log in to WooCommerce.com with your Partner account.
- Click on `Vendor Dashboard` button to be taken to your vendor dashboard, which can be found on the My Account page once you've logged in:

![go-to-dashboard](../woo-com/_media/go-to-dashboard.png)

- Don't see this button? You may not be the vendor admin on the account. Reach out to someone else in the organization (usually the person that handles uploading the extension for publishing) to see if they have access.

### Giving access to other developers to use QIT

Sometimes you want to give access to other developers in your organization to run tests using the QIT, but you might not want to give them access to the WooCommerce.com account that can manage the extension in the marketplace, as it gives developers access they don't need, such as managing your extensions in the marketplace, etc.

Luckily, you can share with them the QIT Token, as they are restricted to only run and view test runs. They are special application passwords with limited access that can only run and view tests using QIT.

### What's the difference between a QIT Token and an Application Password?

Under the hood, a QIT Token is just an Application Password with a specific App ID.

The main difference between a QIT Token and a regular Application Password is that:

- The QIT CLI does not accept a generic Application Password as a valid authentication method.
- A QIT Token can only be used to interact with QIT endpoints.

This was designed to increase your security in case your QIT Token gets leaked, as an attacker would only be able to start and view test runs with it. It's essentially an Application Password whose scope works only in the context of QIT.
