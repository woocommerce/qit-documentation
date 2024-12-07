=======================
File: ./docs/intro.md
=======================

---
sidebar_position: 1
slug: /
---

import QITIntro from '@site/src/video/qit_intro.mp4';
import TestTypes from '@site/src/components/TestTypes';
import QITImageURL from '@site/static/img/qit-right.webp';

# What is QIT?

QIT is a testing platform, developed by WooCommerce, for WordPress plugins and themes, that allows developers to run a series of managed tests out-of-the-box, and also supports custom E2E tests.

The custom E2E tests is a superset of Playwright that defines a minimal structured format for E2E tests, that makes it possible to do compatibility testing between extensions.

QIT is currently in closed beta operating only in the [WooCommerce Marketplace](https://woocommerce.com/products/) .

<video controls style={{ width:"100%", height:"100%" }}>
<source src={QITIntro} type="video/mp4"/>
Your browser does not support the video tag.
</video>

## Requirements

Currently, to use QIT you need to have at least one extension listed on the WooCommerce.com Marketplace.

## Quick Start Guide

1. `composer require woocommerce/qit-cli --dev`
2. `./vendor/bin/qit connect` to generate a QIT Token and [authenticate](/docs/support/authenticating) using your WooCommerce.com developer account.
4. `./vendor/bin/qit run:activation your-extension`, where "your-extension" is the slug of a WooCommerce.com extension you own.

## What types of tests are available?

<TestTypes />

## QIT and the WooCommerce.com Marketplace
QIT automatically runs tests for every new release on the WooCommerce Marketplace. Additionally, Partner Developers can
run tests on-demand using our CLI tool.

## Can I use QIT if I'm not a Developer on WooCommerce.com?
While the full QIT is exclusive to WooCommerce.com Partner Developers, non-partners can use the local test environment. Full access is planned for the public in the future.

## Ways to Use QIT
- **CLI**: For running and viewing tests, including development builds. [Getting Started with CLI](cli/01-installation.md).
- **Dashboard**: UI-based test runner and results viewer in your WooCommerce.com dashboard. [Dashboard Guide](woo-com/getting-started).
- **GitHub Workflows**: To integrate QIT tests in GitHub development workflows. [Setting Up Workflows](cli/05-github-workflows.md).


=======================
File: ./docs/cli/01-installation.md
=======================

# Installation

The QIT CLI is a command line interface tool that allows you to run automated tests in the cloud against extensions available in the WooCommerce Marketplace, powered by the QIT Test Runner.

![run-e2e](_media/run-e2e.png)

## Requirements

- PHP 7.2.5 or higher
- Unix environment (Linux, macOS, Windows WSL)
- Composer

## Installing QIT

You can install QIT in three different ways:

### Per project

1. Run `composer require woocommerce/qit-cli --dev`
2. Execute `./vendor/bin/qit` to authenticate with your WooCommerce.com Partner Developer account.

### Globally using Composer

1. Run `composer global require woocommerce/qit-cli`
2. Execute `qit` to authenticate with your WooCommerce.com Partner Developer account. Ensure that the Composer bin folder is in your PATH. [Example](https://stackoverflow.com/a/64545124).

### Globally using `wget`

_(Pro Tip: Opting for the Composer installation method simplifies the process of updating QIT in the future 😉)_

1. Run `wget https://github.com/woocommerce/qit-cli/releases/latest/download/qit`
2. Execute `chmod +x qit`
3. Move the file to a directory in your PATH, such as `sudo mv qit /usr/local/bin/qit`
4. Run `qit` to authenticate with your WooCommerce.com Partner Developer account.

## Updating QIT

Updating QIT will depend on how you installed it.

### If you installed it per-project:

1. Run `composer update woocommerce/qit-cli`

### If you installed it globally using Composer:

1. Go to your global composer directory `cd $(composer global config bin-dir --absolute)`
2. Run `composer update woocommerce/qit-cli`

#### If you installed it with `wget`:

1. Delete the old binary `which qit` then `rm` it.
2. Repeat the installation steps.


=======================
File: ./docs/cli/02-running-tests.md
=======================

import TestTypes from '@site/src/components/TestTypes';

# Running tests

The QIT CLI allows running tests against both extensions that are published and available for sale in the WooCommerce Extension Store as well as against development builds of an extension.

## Choosing the type of test to run

The commands to run tests are formatted as `run:<test-type>`. The CLI supports all of the current test types using the following commands:

<TestTypes includeCode="true" />

For example, to run end-to-end tests, you'd run the following command: `./vendor/bin/qit run:woo-e2e my-plugin-slug`.

## Testing a published extension

For running any kind of tests, you'll need the slug for the given extension you want to run the tests against. For example, to run end-to-end tests against an extension with the slug `my-extension`, you'd run the following command:

```shell
qit run:woo-e2e my-extension
```

This will run the [WooCommerce Core E2E Test Suite](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw) against the WooCommerce extension with slug `my-extension` using the latest stable versions of WordPress and WooCommerce.

Since the tests are executed in the cloud, you can even close the terminal if you wish. You can see the result of this test after a while running `qit list-tests`, or `qit get 123`, where `123` is the test run ID. When the test finishes, the status will be updated to `Success`, `Warning`, or `Failed`. For more details on these commands, please see [Useful Commands](cli/03-useful-commands.md).

## Testing development builds

The QIT CLI supports testing development builds of extensions, so you can run any of the [test types](/docs/managed-tests/introduction) against an unpublished version of your extension in the same QIT environment before publishing it to the WooCommerce Store.

:::warning
Make sure the zipped version is a valid plugin. As this is installed on a test WordPress site, an invalid plugin will fail to install and cause the tests to fail.
:::

Once you have a zipped up version of your extension you'd like to test with, use the `--zip` argument to pass in a path to the zip file containing your extension.

For example, to run end-to-end tests against your local build, you'd run the following command:

```shell
qit run:woo-e2e my-extension --zip=my-extension.zip
```

## Seeing test runs and their results

Since the tests are executed in the cloud, you can even close the terminal. You can see the result of this test after a while by running one of the two commands below:

- Run `qit list-tests` to see a list of test runs.
- Run `qit get 123` to get more details about a specific test run, where `123` is the test run ID.
- Run `qit open 123` to open the report for test run `123` in the browser.

When the test finishes, the status will be updated to `Success`, `Warning`, or `Failed`. For more details on what these commands show, please see [Useful Commands](cli/03-useful-commands.md).

## Specifying WooCommerce and WordPress versions

The QIT CLI supports testing against different versions of WooCommerce and WordPress. There are two arguments available to use, depending on your needs:

- `--woocommerce_version`
- `--wordpress_version`

For example, to run activation tests against the RC version of WooCommerce and WordPress, you can run the following command:

`qit run:activation my-extension --woocommerce_version=rc --wordpress_version=rc`

:::info
If either these arguments are not supplied, then the tests will just run against the current stable versions of WooCommerce and WordPress.
:::

QIT supports the last 4 stable and the latest release-candidate of WooCommerce. You can also run `qit run:woo-e2e --help` to see the available WooCommerce versions available to run tests against.

## Using optional features

You can also enable option features in your test environment by using the `--optional_features` flag. For example, to run an activation test with the High Performance Order Storage feature enabled, you can run the following command:

`qit run:activation my-extension --optional_features=hpos`

Currently, QIT supports enabling the following optional features:

- `hpos`: [High Performance Order Storage (HPOS)](https://developer.woocommerce.com/roadmap/high-performance-order-storage/)


=======================
File: ./docs/cli/03-useful-commands.md
=======================

# Useful commands

To see the commands that the QIT CLI provides, you can simply run `./qit` to see the full list.

Some helpful commands to get started include:

## List extensions

Lists the WooExtensions you have access to test. The list includes the ID of the extension and the
slug:

### Command usage

```shell
qit extensions
```

### Example

```
qit extensions

+----------------+--------------+
| ID             | Slug         |
+----------------+--------------+
| 123            | my-extension |
+----------------+--------------+
```

## List tests

Lists the test runs, including details around the results, the versions tested and the test type:

### Command usage

```shell
qit list-tests
```

### Example

```
qit list-tests

+--------+------------+-------+------------+---------+-----------+----------------------+
| Run Id | Test       | WP    | WC         | Status  | Report    | Name/Version         |
+--------+------------+-------+------------+---------+-----------+----------------------+
| 344745 | security   | 6.1.1 | 7.2.2      | warning |           | My Extension (Zip)   |
| 344759 | woo-e2e    | 6.1.1 | 7.2.0-rc.2 | failed  | Available | My Extension (1.0.0) |
+--------+------------+-------+------------+---------+-----------+----------------------+
```

:::tip
`Zip` for the version denotes that the test was ran against
a [development version](cli/02-running-tests.md#testing-development-builds) of the plugin.
:::

## View a single test

Get a single test run using the run ID from the `list-tests` command:

### Command usage

```shell
qit get <run ID>
```

### Examples

```shell
qit get 344745

Run Id              344745
Test Type           security
Wordpress Version   6.1.1
Woocommerce Version 7.2.2
Status              warning
Is Development      Yes
Woo Extension       My Extension
```

:::tip
If a report is available, you can go into
the [QIT Dashboard to view the report](woo-com/viewing-test-results.md#viewing-test-logs) or view the link by
running `get` and the test run ID:
:::

```shell
qit get 344745

Run Id              361745
Test Type           woo-e2e
Wordpress Version   6.1.1
Woocommerce Version 7.2.2
Status              failed
Result Url          https://testreport.url
Woo Extension       My Extension
```

## Validating ZIP Files

The `woo:validate-zip` command ensures the contents of a local ZIP file meet specific criteria.

### Command usage

```shell
qit woo:validate-zip <path-to-zip-file>
```

### Example

```shell
qit woo:validate-zip /path/to/my-extension.zip
```

### Validation criteria

`woo:validate-zip` command checks the following:

- Ensures no invalid files (e.g., system files) are present. The list of invalid files includes:
	- `Thumbs.db`, `Thumbs.db:encryptable`
	- `Desktop.ini`, `desktop.ini`
	- `ehthumbs.db`, `ehthumbs_vista.db`
	- `$RECYCLE.BIN/`
	- `~`, `.directory`
	- .`DS_Store`, `.AppleDouble`, `.LSOverride`, `.Spotlight-V100`, `.Trashes`, `.fseventsd`
- Ensures that the ZIP file is not corrupted or generated incorrectly (e.g., by macOS Archive Utility).

### Example folder structure

Here is an example of a valid folder structure for a ZIP file:

```perl
my-extension.zip
├── my-extension/
│   ├── my-extension.php
│   ├── includes/
│   │   └── class-my-extension.php
│   └── assets/
│       └── css/
│           └── style.css
```


=======================
File: ./docs/cli/04-scripting.md
=======================

# Scripting

QIT CLI allows you to create robust scripts that can optimize your development workflow. Here is an example of a bash script used for authentication and running tests against a development build.

### Directory structure

For this example, we will assume the following directory structure. This can be in the same folder where you develop your plugin or in its own directory:

- .env
- bin/qit.sh
- vendor/bin/qit
- build/extension.zip _(Assuming this is created by `npm run build`)_

### Environment variables (.env)

Create a `.env` file in the root directory of your project and add your QIT user and application password:

```bash
QIT_USER=foo
QIT_APP_PASS=bar
```

### Bash script (bin/qit.sh)

This script authenticates the QIT_USER and then runs security tests against the extension build. If the 'partner:remove' command is not available, it adds a partner using `QIT_USER` and `QIT_APP_PASSWORD`. For more information on how authentication works with QIT, see our [documentation around authentication](https://woocommerce.github.io/qit-documentation/#/authenticating).

```bash
#!/bin/bash
set -x # Verbose mode.

# Check if QIT_USER and QIT_APP_PASSWORD are set and not empty
if [[ -z "${QIT_USER}" ]] || [[ -z "${QIT_APP_PASSWORD}" ]]; then
    echo "QIT_USER or QIT_APP_PASSWORD environment variables are not set or empty. Please set them before running the script."
    exit 1
fi

# When QIT is run for the first time, it will prompt for onboarding. This will disable that prompt.
export QIT_DISABLE_ONBOARDING=yes

# If QIT_BINARY is not set, default to ./vendor/bin/qit
QIT_BINARY=${QIT_BINARY:-./vendor/bin/qit}

# Check if 'partner:remove' command is in the list of available commands
if ! $QIT_BINARY list | grep -q 'partner:remove'; then
    echo "Adding partner with QIT_USER and QIT_APP_PASSWORD..."
    $QIT_BINARY partner:add --user="${QIT_USER}" --application_password="${QIT_APP_PASSWORD}"
    if [ $? -ne 0 ]; then
        echo "Failed to add partner. Exiting with status 1."
        exit 1
    fi
fi

# Run the security command
echo "Running security command..."
$QIT_BINARY run:security my-extension --zip=./../build/extension.zip --wait
if [ $? -ne 0 ]; then
    echo "Failed to run security command. Exiting with status 1."
    exit 1
fi
```

### Script runner (Choose between NPM, Composer, Make)

Script runners can be used to execute our bash script `qit.sh`. You can choose the script runner that best suits your needs. Below you can find some examples we've put together for NPM, Composer, and Make.

<p class="warn">The <strong>build</strong> command in this script is just an example, and should be modified to fit your actual build process that generates the plugin zip that can be installed in a WordPress site.</p>

### NPM

Usage: `npm run qit-security`

<details>
<summary>package.json</summary>

```json
{
  "name": "Project",
  "version": "1.0.0",
  "scripts": {
    "qit-security": "npm run build && dotenv -e .env -- bash ./bin/qit.sh",
    "build": "zip -r build/extension.zip my-extension"
  },
  "devDependencies": {
    "dotenv-cli": "^7.2.1"
  }
}
```

</details>

### Composer

Usage: `composer run qit-security`

<details>
<summary>composer.json</summary>

```json
{
  "scripts": {
    "build": "zip -r build/extension.zip my-extension",
    "qit-security": "export $(cat .env | xargs) && composer run-script build && ./bin/qit.sh"
  }
}
```
</details>

### Makefile

Usage: `make qit-security`

<details>
<summary>Makefile</summary>

```makefile
include ./.env
export

build:
        zip -r build/extension.zip my-extension

qit-security: build
        bash ./bin/qit.sh
```
</details>


=======================
File: ./docs/cli/05-github-workflows.md
=======================

# GitHub Workflows

The QIT GitHub Workflows are examples of integrating the Quality Insights Toolkit into GitHub. You can delegate tests to the QIT and integrate it as part of your PR approval process, when a release is created, and more.

For more information on how [GitHub Actions](https://docs.github.com/en/actions) work, please see the official GitHub documentation.

The examples below can be tweaked based on your needs, and use a fictional `woocommerce-product-feeds` extension to run the tests against. There's a few [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) that need to be configured for this flow (feel free to rename these to whatever makes the most sense for you and your team):

- `PARTNER_USER`: Your WooCommerce.com username.
- `PARTNER_SECRET`: Your [WordPress Application Password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).

## Activation test example

```yaml
name: QIT Activation Test
on:
  workflow_dispatch:
  pull_request:
permissions:
  pull-requests: write
jobs:
  qit_activation:
    name: QIT Activation
    runs-on: ubuntu-20.04
    env:
      NO_COLOR: 1
      QIT_DISABLE_ONBOARDING: yes
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Build your plugin zip (Example)
        run: zip -r my-extension.zip my-extension
      - name: Install QIT via composer
        run: composer require woocommerce/qit-cli
      - name: Add Partner
        run: ./vendor/bin/qit partner:add --user='${{ secrets.PARTNER_USER }}' --application_password='${{ secrets.PARTNER_SECRET }}'
      - name: Run Activation Test
        id: run-activation-test
        run: ./vendor/bin/qit run:activation my-extension --zip=my-extension.zip --wait > result.txt
      - uses: marocchino/sticky-pull-request-comment@v2
        if: failure()
        with:
          header: QIT Activation Result
          recreate: true
          path: result.txt
```

## Security test example

```yaml
name: QIT Security Test
on:
  workflow_dispatch:
  pull_request:
permissions:
  pull-requests: write
jobs:
  qit_security:
    name: QIT Security Test
    runs-on: ubuntu-20.04
    env:
      NO_COLOR: 1
      QIT_DISABLE_ONBOARDING: yes
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Build your plugin zip (Example)
        run: zip -r my-extension.zip my-extension
      - name: Install QIT via composer
        run: composer require woocommerce/qit-cli
      - name: Add Partner
        run: ./vendor/bin/qit partner:add --user='${{ secrets.PARTNER_USER }}' --application_password='${{ secrets.PARTNER_SECRET }}'
      - name: Run Activation Test
        id: run-activation-test
        run: ./vendor/bin/qit run:security my-extension --zip=my-extension.zip --wait > result.txt
      - uses: marocchino/sticky-pull-request-comment@v2
        if: failure()
        with:
          header: QIT Security Result
          recreate: true
          path: result.txt
```

## Notes

### Required permissions

Depending on how your repository is set up, you may need to adjust the permissions step to the following:

```yaml
permissions:
  contents: read
  pull-requests: write
```

### Verify the zip is built correctly

If you see any failures in the pipeline, such as an activation test that fails without a result, it could be due to the way that the GitHub action is building the zip file. Double check that the zip file created by the workflow doesn't add in an extra folder to the file structure. To verify that the zip is valid to be used by QIT, you can test uploading it in the WordPress admin screen under `Plugins > Add new` and test uploading and activating the zip file. If it works, then it will work with QIT.


=======================
File: ./docs/custom-tests/00-introduction.md
=======================

# Introduction

:::info
The custom E2E tests feature is available as early access.
:::

Custom E2E tests allow you to generate, write, and run end-to-end tests for WordPress plugins and themes. They aim to eliminate barriers to writing and running E2E tests by providing:

- A simple CLI tool that generates test scaffolding.
- A managed test environment for executing your tests.
- A platform to share your tests with other developers and to run tests from other plugins and themes.

## Getting Started

1. **Install the QIT CLI Tool:** See [Installation](cli/01-installation.md).
2. **Connect Your Account:** Follow the CLI instructions to connect _(you must have at least one extension listed on WooCommerce.com)._
3. **List Available Extensions:** Check which extensions you have access to test using `qit extensions`.
4. **Generate Test Scaffolding:** Run `qit scaffold:e2e my-test` to create a basic E2E test structure.
5. **Run Your First Test:** Execute `qit run:e2e your-extension-slug my-test` (replace "your-extension-slug" with the slug of an extension you own).
6. **Generate Custom Tests:** See [Generating Tests](01-generating-tests.md) to create your own tests.

### Additional Features of Custom E2E Tests

- **Environment Configuration**: Choose different PHP, WordPress, and WooCommerce versions.
- **Plugin and Theme Compatibility**: Install plugins and themes to check for compatibility issues.
- **Visual Test Execution**: Use the `--ui` flag to view your tests running in a browser.
- **Test Generation with Playwright Codegen**: Refer to [Generating Tests](01-generating-tests.md).
- **Cross-Plugin Testing**: Run tests from other plugins and themes for compatibility.
- **Test Publishing**: Publish your tests to QIT and run specific tests from a plugin or theme.
- **Complex Configurations**: Use a config file to run tests with complex setups.
- **Detailed Test Reports**: After each test, access a shareable URL with results, including screenshots, videos, and failure traces.
- **Flexible Execution Environments**: Run tests locally or integrate them into your CI pipeline.
- **Tunnel**: Use our built-in [tunnel](/docs/environment/tunnel) to expose your local environment to the internet.

=======================
File: ./docs/custom-tests/01-generating-tests.md
=======================

# Generating tests

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

You can scaffold a basic E2E test with:

```qitbash
qit scaffold:e2e ./e2e
```

This will create a basic E2E test in the `e2e` directory with essentially a `example.spec.js` file and a `bootstrap` directory:

```
bootstrap (Optional)
    setup.js
    setup.sh
    dependencies.json
    mu-plugin.php
example.spec.js
```

:::tip
Bootstrap files are optional and can be removed if not needed. [Learn more about bootstrapping](/docs/custom-tests/understanding-lifecycle) and its use cases.
:::

You can run your first test locally with:

```qitbash
qit run:e2e <your-plugin> ./e2e

(Optionally add `--ui` to see the browser while it runs)
```

You can then expand it with more tests, or even generate tests with Playwright Codegen.

## Advanced Scaffolding

When scaffolding, you can also include shared setups and teardowns. Refer to the [Understanding Lifecycle](/docs/custom-tests/understanding-lifecycle) documentation for more information.

```qitbash
qit scaffold:e2e ./e2e --with-shared --with-teardown
```

This will give you the following structure:

```
bootstrap
    setup.js (Playwright file that runs in isolation before your tests)
    setup.sh (Bash file that runs in isolation before your tests)
    shared-setup.js (Playwright file that runs before all tests in a compatibility test)
    shared-setup.sh (Bash file that runs before all tests in a compatibility test)
    shared-teardown.js (Playwright file that runs after all tests in a compatibility test)
    shared-teardown.sh (Bash file that runs after all tests in a compatibility test)
    teardown.js (Playwright file that runs in isolation after your tests)
    teardown.sh (Bash file that runs in isolation after your tests)
example.spec.js
```

When you run a compatibility test (eg: `qit run:e2e example-plugin --plugin example-plugin:test`), a database snapshot is taken after the shared setup, and restored for each plugin test. The shared teardown is run after all tests are done.

Anything you do in your isolated setup and teardown files will only affect your plugin's test environment. Anything you do in the shared setup and teardown files will affect all tests in the compatibility test.

## Codegen

Codegen is a helpful Playwright feature for generating most of the E2E test code for you.

It's a semi automated process, it's not meant to be 100% copy and paste, but it will save you a lot of time.

```qitbash
qit run:e2e <your-plugin> --codegen
```

This command will start the test environment and open a browser window. You can interact with the browser and perform the actions you want to test. When you're done, you can copy and paste the test code in your test directory.

It essentially records your interactions with the browser and generates the code for you, which you then copy and paste into a test file.

### Adjusting Codegen URLs

When you generate tests with `--codegen`, they will be generated with the URLs you visited during the recording, eg:

#### How Codegen generates it:

```js
await page.goto('http://localhost:32456');
await page.goto('http://localhost:32456?action=foo');
await page.goto('http://localhost:32456/my-page');
await page.goto('http://localhost:32456/wp-admin');
```

After pasting it in a test file, remove the URLs, as the test run uses a `baseURL`.

#### How it should look in your test file:

```js
await page.goto('/');
await page.goto('/?action=foo');
await page.goto('/my-page');
await page.goto('/wp-admin');
```

## Using QIT helpers

We have a set of helpers that you can use in your tests to make your life easier. You can find them in the [QIT Helpers](qit-helpers). documentation.

```js
// Add this to the top of a test file.
import qit from '/qitHelpers';

// Example: Login as an admin and navigate to /wp-admin.
await qit.loginAsAdmin();

// Example: Login as the "customer" user.
await qit.loginAs('customer', 'password');
```


=======================
File: ./docs/custom-tests/02-tagging-tests.md
=======================

# Tagging tests

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

You can publish your tests to QIT so that other developers can use it to run compatibility tests with their own extensions.

Similarly, you can run other developers' tests to ensure that your extension is compatible with theirs.

One plugin can have multiple test tags, which can be used to run different sets of tests.

## Listing available test tags

To list all the available test tags you can use:

```qitbash
qit tag:list
```

To list the test tags for a specific plugin/theme:

```qitbash
qit tag:list example-plugin
```

## Uploading tests

You can upload your tests and make them available as a tag with the command:

```qitbash
qit tag:upload example-plugin /path/to/tests
```

By default, the test will be uploaded as the `default` tag.

If you want to specify a test tag, you can add the tag in this format: `extension:tag`:

```qitbash
qit tag:upload example-plugin:my-tag /path/to/tests
```

## Running test tags

Now you can run your test both locally and in CI using the `default` tag:

```qitbash
qit run:e2e example-plugin
```

Or, if it's a specific tag:

```qitbash
qit run:e2e example-plugin my-tag
```

## Running test tags from other plugins

Other developers that have access to your extension can also use your tests for compatibility testing.

Let's suppose that `example-plugin-2` has published their tests. You can run your tests and theirs with:

```qitbash
qit run:e2e example-plugin --plugin example-plugin-2:test
```

## Running multiple tags

You can also compose multiple tags by passing a comma-separated list of test tags:

```qitbash
qit run:e2e example-plugin default,rc --plugin example-plugin-2:test:some-feature
```

## Deleting test tags

You can delete test tags that you have previously published:

```qitbash
qit tag:delete example-plugin:my-tag
```


=======================
File: ./docs/custom-tests/03-running-tests.md
=======================

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Running tests

:::info
The custom E2E tests feature is available as early-access.
:::

## Running a basic test

Assuming you have generated and uploaded a E2E test, the basic syntax for running a test is:

```qitbash
qit run:e2e example-plugin
```

If you haven't uploaded a test to QIT, you can run a local test:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests
```

:::tip
Replace "example-plugin" with the slug of an extension you own.
:::

## Using a config file

Place a `qit.json` or `qit.yml` file in the directory you run `qit run:e2e example-plugin` from.

Here's an example of a complex config file:

<Tabs
defaultValue="json"
values={[
{ label: 'JSON', value: 'json'},
{ label: 'YML', value: 'yml'},
]}>

<TabItem value="json">
```json
{
  "wordpress_version": "nightly",
  "php_version": "8.3",
  "object_cache": true,
  "plugins": {
    "example-plugin": {
      "action": "test",
      "source": "~/my-plugins/example-plugin",
      "test_tags": [
        "~/my-plugins/example-plugin/tests"
      ]
    },
    "woocommerce": {
      "action": "bootstrap",
      "test_tags": [
        "default"
      ]
    },
    "foo-plugin": {
      "action": "install"
    },
    "example-plugin-2": {
      "action": "test",
      "source": "https://github.com/qit-plugins/example-plugin-2/releases/tag/nightly.zip",
      "test_tags": [
        "nightly",
        "some-feature"
      ]
    }
  }
}
```
</TabItem>

<TabItem value="yml">
```yml
wordpress_version: nightly
php_version: 8.3
object_cache: true
plugins:
  example-plugin:
    action: test
    source: ~/.qit/plugins/example-plugin
    test_tags:
      - ~/my-plugins/example-plugin/tests
  woocommerce:
    action: bootstrap
    test_tags:
      - default
  foo-plugin:
    action: install
  example-plugin-2:
    action: test
    source: https://github.com/qit-plugins/example-plugin-2/releases/tag/nightly.zip
    test_tags:
      - nightly
      - some-feature
```
</TabItem>

</Tabs>

## Using parameters

You can also mimick this entire config file using only runtime parameters.

Suppose you are scripting a test run and want to pass everything as parameters:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests --source ~/.qit/plugins/example-plugin \
  --wp nightly \
  --php-version 8.3 \
  --object-cache \
  --plugin woocommerce:bootstrap \
  --plugin foo-plugin:activate \
  --plugin https://github.com/qit-plugins/example-plugin-2/releases/tag/nightly.zip:test:nightly,some-feature:example-plugin-2
```

## The plugin syntax

As you can see, defining how a plugin should be used in our test can be complex, as we need to account for different ways to use it.

To simplify this, we have a short syntax for defining plugins, which is `source:action:test-tags:slug`.

```qitbash
qit run:e2e <main-extension> --plugin <plugin-syntax>
```

Where:

- `source` can be a slug, a Zip URL, a local path, or a WooCommerce.com ID.
- `action` can be `activate`, `bootstrap` or `test` (default is `bootstrap`. They are cumulative, so if you pass `test`, it will also activate and bootstrap the plugin)
- `test-tags` is a comma-separated list of test tags to run, or a local directory (default is `default`)
- `slug` is the plugin slug. This is only needed if using a `source` other than a slug, and the slug can't be inferred.

### Inferring `slug` from `source`

If you are using a local path, a Zip URL, or a WooCommerce.com ID, we will try to infer the `slug` from the basename of the file or directory.

Examples:

```
# Scenarios wehere inferred `slug` is `extension2`:

qit run:e2e example-plugin --plugin extension2
qit run:e2e example-plugin --plugin ~/my-plugins/example-plugin/extension2.zip
qit run:e2e example-plugin --plugin https://github.com/woocommerce/example-plugin/releases/tag/extension2.zip
```

## Examples:

### Using a local plugin:

Directory as `source`:

```qitbash
qit run:e2e example-plugin --source ~/my-plugins/example-plugin
```

Zip file as `source`:

```qitbash
qit run:e2e example-plugin --source ~/my-plugins/example-plugin/example-plugin.zip
```

URL as `source`:

```qitbash
qit run:e2e example-plugin --source https://github.com/woocommerce/example-plugin/releases/tag/example-plugin.zip
```


## Using a local plugin with a local test

If you have a test that you haven't uploaded yet, you can run it directly:

Slug as `source`, directory as `test-tags`:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests
```

Directory as `source`, directory as `test-tags`:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests --source ~/my-plugins/example-plugin
```

Zip file as `source`, directory as `test-tags`:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests --source ~/my-plugins/example-plugin/build.zip
```

URL as `source`, directory as `test-tags`:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests --source https://github.com/woocommerce/example-plugin/releases/tag/nightly.zip
```

## Using test tags

If you have uploaded a test with a tag different than the default one, you can run it with:

```qitbash
qit run:e2e example-plugin nightly
```

You can also run multiple tags:

```qitbash
qit run:e2e example-plugin nightly,foo-feature
```

And you can run a test with a tag from a local directory, file, or URL:

```qitbash
qit run:e2e example-plugin nightly,foo-feature --source ~/my-plugins/example-plugin
```

```qitbash
qit run:e2e example-plugin nightly,foo-feature --source ~/my-plugins/example-plugin/example-plugin.zip
```

```qitbash
qit run:e2e example-plugin nightly,foo-feature --source https://github.com/woocommerce/example-plugin/releases/tag/example-plugin.zip
```

And even run a local test in the mix:

```qitbash
qit run:e2e example-plugin ~/my-plugins/example-plugin/tests,nightly,foo-feature --source ~/my-plugins/example-plugin
```

## Testing plugins that require a live site

Some plugins require a live site to work properly, such as payment gateways or SaaS.

To test these plugins, you can use our [built-in tunnel feature](/docs/environment/tunnel).

=======================
File: ./docs/custom-tests/04-understanding-lifecycle.md
=======================

import CustomTestsDiagram from '@site/src/img/custom-tests-diagram.png';

# Understanding the Lifecycle

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

The lifecycle of a custom E2E test consists of several phases that ensure the environment is set up correctly, tests are run, and the environment is cleaned up afterward. Understanding the lifecycle is crucial for writing effective tests and ensuring that your plugin is compatible with other plugins.

## Phases of the Lifecycle

The lifecycle of a custom E2E test can be broken down into several phases:

1. **Starting the Environment**
2. **Installing Additional Dependencies**
3. **Shared Setup**
4. **DB Export** 
5. **DB Import (foreach plugin)** 
6. **Isolated Setup (foreach plugin)**
7. **Test Phase (foreach plugin)**
8. **Teardown Phase (foreach plugin)**
9. **Shared Teardown**
10. **Post-Processing, reports, etc**

Any change a plugin does in the shared setup persists for the whole test suite. Any change a plugin does in the isolated setup persists only for the plugin's test suite.

This progressive structure allows for a systematic approach to testing, especially compatibility tests between plugins. The diagram below illustrates the lifecycle of a custom E2E test:

<img src={CustomTestsDiagram}/>

## Files of the Lifecycle

The lifecycle is managed through the files inside the `bootstrap` directory. Refer to [Generating Tests](generating-tests) for more information on scaffolding tests.

## 1. Starting the Environment

Before diving into the setup phases, the system prepares the testing environment:

- **Start Environment**: Spins up a docker-based WordPress environment with the necessary PHP version, etc.
- **Download Plugins and Themes**: All necessary plugins and themes are downloaded.
- **Install WordPress**: WordPress is installed within the Docker environment.
- **Activate Plugins**: Plugins are activated.
- **Move Must-Use Plugins**: Any must-use plugins of the plugins under test are moved to the appropriate directory.

2. Installing Additional Dependencies

If your tests require additional NPM packages, you can declare them in the `dependencies.json` file. These dependencies are installed before running the tests. This is a JSON array of strings, eg:

```json
[
  "uuid",
  "lodash"
]
```

It's preferable to avoid adding dependencies if possible, as they can conflict with other plugins dependencies.

## 2. Shared Setup Phase

The **Shared Setup Phase** involves setting up shared resources or configurations that are common across all plugins. This phase ensures that all plugins have access to the same environment and data before running their tests.

### What to Include in the Shared Setup Phase

- **Get rid of onboarding wizards**: If your plugin has an onboarding wizard, configure it to prevent it from appearing during tests.
- **Disable Data Consent Forms**: Remove any data consent prompts or initial setup screens.
- **Configure or Mock External Services**: If your plugin integrates with external services, enable a development mode or mock external requests.

## 3. DB Export and Import

The DB export and import is handled automatically for you.

## 4. Isolated Setup Phase

The **Isolated Setup Phase** is responsible for setting up the environment specific to each plugin before running its tests. This phase ensures that each plugin has a clean slate to work with and doesn't interfere with other plugins' tests.

### What to Include in the Isolated Setup Phase

- **Install Themes**: If your tests require a specific theme, **install** it during this phase so it’s available during the Test Phase.
- **Activate Plugins**: Activate the plugin you are testing.
- **Customize WordPress Settings**: Configure WordPress settings specific to your plugin's tests.
- **Add Test Data**: Insert any test data or configurations required for your plugin's tests.

## 5. Test Phase

The **Test Phase** is where the actual testing happens. This is where you interact with the browser, verify your plugin's functionality, and check for any compatibility issues with other plugins.

## 6. Teardown Phase

The **Teardown Phase** runs after your tests are completed. You can use it to clean up any resources or configurations set during the setup phase.

### What to Include in the Teardown Phase

- **Reset Mock Services**: Reset any mocks or stubs used for external services.

## 7. Shared Teardown
After all plugin tests are completed, the **Shared Teardown** phase cleans up any shared resources or configurations set during the Shared Setup phase.

## Environment Variables
You can use environment variables in your tests to pass secrets or configurations without hardcoding them.Refer to the [Environment Variables](https://chatgpt.com/docs/environment/environment-variables) documentation for more information.

By structuring your documentation in this progressive manner, readers can build their understanding step by step. Starting with the basic setup and teardown processes, and then introducing shared setup and teardown concepts, allows users to grasp the foundational elements before moving on to more complex configurations.If you need further assistance or have any questions about implementing these phases, feel free to ask!

=======================
File: ./docs/custom-tests/06-themes.md
=======================

# Themes

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

You can use the custom E2E tests to test both plugins and themes.

## Using a specific theme on your tests

If you are developing a plugin, and you write E2E tests that interact with the front-end, you will want to make sure that a specific theme is active when the tests run.

On your Bootstrap Phase, you can install the theme:

`bootstrap.sh`
```
wp install theme deli
```

And on your Entrypoint, you can activate it.

Here's an example where we activate a child theme of Storefront, by installing Storefront and then activating the child theme:

`entrypoint.qit.js`
```js
import { test, expect } from '@playwright/test';
import qit from '/qitHelpers';

test('I can activate my theme', async ({ page }) => {
    await qit.loginAsAdmin(page);
    await page.getByRole('link', { name: 'Appearance' }).click();
    await expect(page.getByRole('cell', { name: 'Deli' })).toBeVisible();
    await page.getByRole('link', { name: 'Install Parent Theme' }).click();
    await page.getByRole('link', { name: 'Activate "Storefront"' }).click();
    await page.getByLabel('Activate Deli').click();
    await page.goto('/');
});
```

This entrypoint was generated with Codegen. The easiest way is to start a codegen session, activate the theme, and use the generated code on your entrypoint.

## Testing a theme

If you are developing a theme, the previous section applies as well. And when you run it, be sure to add the `--testing_theme` flag:

```qitbash
qit run:e2e example-plugin-theme --testing_theme
```


=======================
File: ./docs/custom-tests/07-architecture.md
=======================

import ArchitectureImageURL from '@site/static/img/architecture.png';

# Architecture

This is a basic overview of the custom E2E tests architecture. It focus on the big building blocks that composes the feature.

<img src={ArchitectureImageURL} alt="QIT Custom E2E Tests Architecture"/>

=======================
File: ./docs/custom-tests/08-security.md
=======================

# The security architecture of the custom E2E tests

:::info
The custom E2E tests feature is available as early-access.
:::

## Containerized test environments

All test code runs only on containerized Docker environments meticulously designed for maximum isolation. This advanced engineering at both high and low levels guarantees that the test code execution remains completely segregated from the rest of the system.

Every volume mount was carefully considered, and by default, only the directories within the disposable test directory are mounted into the Docker environments. The only exception is if you choose to mount additional volumes with the `--volumes` parameter or config file, in which case the volumes will be mounted in read-only mode.

The tests are executed as a non-root user, defaulting to UID/GID of your currently logged-in user.

For the main PHP service we use our own custom-built Docker images based on Alpine.

This setup provides an intrinsic layer for executing code in a secure and sandboxed environment.


=======================
File: ./docs/custom-tests/09-qit-helpers.md
=======================

# QIT Helpers

:::info
The custom E2E tests feature is available as early-access.
:::

## Introduction

The QIT Helpers is available in the context of Custom E2E tests and provides a set of helper functions.

```js
import qit from '/qitHelpers';
```

## Functions

### loginAsAdmin

Logs in as an admin user. Requires the "page" object.

```js
await qit.loginAsAdmin(page);
```

### loginAs

Logs in as a specific user. Requires the "page" object, username, and password.

```js
await qit.loginAs(page, 'username', 'password');
```

### wp

Executes a WP-CLI command in the PHP container that is executing the test.

```js
await qit.wp('plugin list');
```

### attachScreenshot

Attaches a screenshot to the test context. Requires the "page" object and the "testInfo" object.

```js
const context = {
    "Some optional context to embed": ["Some Value"]
};

await qit.attachScreenshot('example-screenshot', context, page, testInfo);
```

### getEnv

Gets an environment variable. Requires the key of the environment variable.

```js
const value = qit.getEnv('MY_ENV_VAR');
```

### setEnv

Sets an environment variable. Requires the key and value of the environment variable.

```js
    qit.setEnv('MY_ENV_VAR', 'my-value');
```

=======================
File: ./docs/environment/01-getting-started.md
=======================

---
sidebar_position: 1
---

# Local test environment

:::info
The local test environment is available as early-access.
:::

## Introduction

The QIT local test environment was engineered to do one thing, and one thing well: running automated tests.

It allows you to create a local WordPress environment with a single command. These environments are disposable, meaning that whatever changes you do in it do not persist across runs. So if you do `qit env:up`, and you delete the database of that site entirely, and then do `qit env:up` again, you will get a fresh new site with no trace of the previous one.

## Prerequisites

Before you begin, ensure that you have the following prerequisites installed:

- **QIT CLI**: If you haven't already installed the QIT CLI tool, follow the instructions in the [Installation Guide](cli/01-installation.md).
- **Docker**: QIT relies on Docker for creating isolated environments. Make sure Docker is installed and running on your system. [Download Docker here](https://www.docker.com/get-started).

### Getting started - Mac

Assuming you have [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) or [OrbStack](https://orbstack.dev/) installed, you can start using the QIT Local Test Environment right away. For the best experience, we recommend OrbStack, as it can be **much faster** than Docker Desktop.

### Getting started - Linux

Assuming you have Docker, preferably the most up-to-date version, with Composer V2, you can start using the QIT Local Test Environment right away.

### Getting started - Windows

The QIT local test environment works on Mac and Linux natively, but for Windows, **you have to use Windows WSL**. 

- Use WSL 2, as it is faster and easier to install than WSL 1.
- On the latest version of Windows, simply open PowerShell and run `wsl --install`
- For older versions like Windows 10, refer to [YouTube installation videos](https://www.youtube.com/results?search_query=windows+wsl+install) or Microsoft's [official guide](https://learn.microsoft.com/en-us/windows/wsl/install). 

Ensure that Windows Features such as Virtual Machine Platform, Windows Subsystem for Linux, and Hyper-V are enabled, and that Virtualization is enabled in the BIOS. 

## Starting your first environment

Creating a local test environment with QIT is straightforward:

1. `qit env:up` to start a basic WordPress environment.
2. Access your site at the URL provided.
3. `qit env:down` and the environment is gone.

## Customizing your environment

Now let's spin up a customized local test environment with a few options:

```qitbash
qit env:up \
    --php_version=8.3 \
    --plugin gutenberg \
    --plugin contact-form-7 \
    --wordpress_version=rc
```

This will create an environment with PHP 8.3 on WordPress RC version, with Gutenberg, and Contact Form 7.

## Using configuration files

Create a `qit.yml` file in your project directory with the following content:

```yaml
wordpress_version: rc
php_version: 8.3
plugins:
  - gutenberg
  - contact-form-7
```

Now you just do `qit env:up`, without any additional parameters, and you get the same environment as before, as well as anyone on your team.

## Managing environments

- **env:up**: Creates a Local Test Environment
- **env:down**: Stops a running local test environment.
- **env:list**: Lists all running environments.
- **env:enter**: Enters the PHP container of a running test environment.
- **env:exec**: Execute a command inside the PHP container.

## `env:up` options

- **--wordpress_version**: Choose the specific version of WordPress for your test environment.
- **--php_version**: Test your project with different PHP versions to ensure compatibility.
- **--plugin**: Easily include plugins in your test environment.
- **--themes**: Specify themes to be used.
- **--volumes**: Map local directories to your test environment, useful for plugin/theme development.
- **--php_extensions**: Customize the PHP environment with necessary extensions.
- **--object_cache**: Enable Redis Object Cache for advanced testing scenarios.


=======================
File: ./docs/environment/02-creating-config-files.md
=======================

# Creating configuration files

:::info
The local test environment is available as early-access.
:::

## Introduction

In the QIT Local Test Environment, configuration files are a powerful way to predefine and standardize environment settings. This guide explains how to create and use JSON or YAML configuration files for your testing environments.

## Creating a configuration file

### 1. File format

- **JSON or YAML**: You can create configuration files in either JSON or YAML format.
- **Naming**: Name your file `qit.json` or `qit.yml`. For overrides, use `qit.override.json` or `qit.override.yml`.

### 2. Configuration options

Include any of the following options in your configuration file:
- `wordpress_version`: Specify the version of WordPress.
- `php_version`: Set the PHP version.
- `plugins`: List plugins to be included.
- `themes`: Specify themes to be used.
- `volumes`: Define any volume mappings.
- `php_extensions`: List any PHP extensions needed.
- `object_cache`: Enable or disable Redis Object Cache.

### 3. Example configurations

**JSON Example**:
```json
{
  "wordpress_version": "rc",
  "php_version": "7.4",
  "plugins": [
    "woocommerce",
    "akismet"
  ],
  "themes": [
    "storefront"
  ],
  "volumes": [
    "/local/path:/container/path"
  ],
  "php_extensions": [
    "gd",
    "imagick"
  ],
  "object_cache": true
}
```

**YAML Example**:
```yaml
wordpress_version: rc
php_version: 7.4
plugins:
  - woocommerce
  - akismet
themes:
  - storefront
volumes:
  - "/local/path:/container/path"
php_extensions:
  - gd
  - imagick
object_cache: true
```

## Using configuration files

1. **Place the File**: Put your configuration file in the root of your project directory, or in the directory where you run QIT commands.
2. **Run QIT**: When you start QIT (`qit env:up`), it automatically detects the config file in the current directory and applies settings from your configuration file.
3. **Overriding Configurations**: Command line flags will override settings in the configuration file. For example, `qit env:up --php_version=8.0` will use PHP 8.0 regardless of what's set in the config file.

## Tips

- Use override files for temporary or environment-specific settings.
- Keep your main config file under version control to maintain consistency across your team.

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).


=======================
File: ./docs/environment/03-installing-plugins-and-themes.md
=======================

# Installing plugins and themes

:::info
The local test environment is available as early-access.
:::

## Introduction

When starting an environment you can choose to install different plugins and themes with `--plugin`, `--themes` or through the config files.

You can install any plugins from WordPress.org, and any plugins from WooCommerce.com that you have access to.

If you are running a custom E2E test with `qit run:e2e`, it will also download their custom E2E tests, if they have any registered in QIT.


## Testing premium plugins

Authentication to download premium plugins listed on WooCommerce.com is automatically handled for you based on your Partner Developer credentials.

Currently, you can download premium plugins and tests from plugins you own on WooCommerce.com, and we are exploring ways of allowing
plugin developers to optionally allow other Partner Developers access to their plugins and tests to encourage compatibility testing.

While QIT is a WooCommerce.com exclusive for now, you can only download custom E2E tests for plugins that are listed in the WooCommerce.com Marketplace.

## Installing premium plugins from other sources

While you cannot download custom E2E tests from other sources, you can download the plugins and install them in your environment.

You can do this by implementing a custom handler, which gives you total control over where to fetch your plugin files from.

Read more about it on the next section.


=======================
File: ./docs/environment/04-installing-plugins-other-sources.md
=======================

# Installing plugins and themes from other sources

:::info
The local test environment is available as early-access.
:::

## Introduction

The QIT local test environment offers the flexibility to install plugins and themes from various sources, including private repositories. This guide outlines the process for extending your environment with these external resources.

## Implementing custom handlers

### Understanding custom handlers

Custom handlers allow QIT to integrate with external sources for plugin and theme installation. They are particularly useful for fetching extensions from premium marketplaces or private repositories that QIT does not support natively.

### Creating a custom handler

- **Extend the CustomHandler Class**: Create a new class that extends the `CustomHandler` abstract class provided by QIT.
- **Implement Required Methods**: Your custom handler must implement methods like `should_handle`, `populate_extension_versions`, and `maybe_download_extensions`.
- **Use the Custom Handler**: Include your custom handler file using the `--require` flag when starting QIT. For example, `qit env:up --require=my-custom-handler.php`.

### Example custom handlers

You can get really creative with this, and essentially do anything you want. Here are a few examples to get you started:

#### Example 1: fetching from a public GitHub repository

This example assumes that you have a public GitHub repository and want to use it as a plugin in your environment.

We assume for the purposes of simplicity that the GitHub pepository is a WordPress plugin, and that it has a `main` branch.

Example command: `qit env:up --requires=public-handler.php --plugins=my-public-plugin`

Or just `qit env:up` if you have this `qit.yml` file:

```yaml
plugins:
  - my-public-plugin
requires:
  - public-handler.php
```

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class PublicHandlerExample extends CustomHandler {
	public function should_handle( Extension $extension ): bool {
		return strpos( $extension->extension_identifier, 'my-public-plugin' ) !== false;
	}

	public function populate_extension_versions( array $extensions ): void {
		// No need to do anything here if we don't plan to cache it.
	}

	/**
	 * @param array<Extension> $extensions
	 */
	public function maybe_download_extensions( array $extensions, string $cache_dir ): void {
		foreach ( $extensions as $extension ) {
			if ( $this->should_handle( $extension ) ) {
				// The URL of the GitHub repository ZIP file.
				$zip_url = 'https://github.com/your-username/your-repo/archive/refs/heads/main.zip';

				// Creates a unique file name for the ZIP file.
				$zip_file = sys_get_temp_dir() . '/' . uniqid( 'my-custom-plugin-' ) . '.zip';

				if ( file_put_contents( $zip_file, file_get_contents( $zip_url ) ) === false ) {
					throw new \Exception( "Could not download ZIP file" );
				}

				if ( file_exists( $zip_file ) ) {
					$extension->path = $zip_file;
				} else {
					throw new \Exception( "ZIP file not found after download" );
				}
			}
		}
	}
}
```

In this example, we will clone our public repo to a temp directory, create a zip of it and use the zip as a plugin in our environment.

#### Example 2: fetching from a private GitHub repository

This example is similar to the previous one, but it assumes that the GitHub repository is private and requires authentication.

Example command: `qit env:up --requires=private-handler.php --plugins=my-private-plugin`

Or just `qit env:up` if you have this `qit.yml` file:

```yaml
plugins:
  - my-private-plugin
requires:
  - private-handler.php
```

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class PrivateGitHubHandler extends CustomHandler {
	public function should_handle( Extension $extension ): bool {
		return strpos( $extension->extension_identifier, 'my-private-plugin' ) !== false;
	}

	public function populate_extension_versions( array $extensions ): void {
		// No need to do anything here if we don't plan to cache it.
	}

    /**
    * @param array<Extension> $extensions
    */
    public function maybe_download_extensions(array $extensions, string $cache_dir): void {
        foreach ($extensions as $extension) {
            if ($this->should_handle($extension)) {
                // Define the GitHub repository URL.
                $repo_url = 'git@github.com:your-github-username/my-custom-plugin.git';
                $branch = 'main';
    
                // Create a unique directory and file name for the repository clone and ZIP file.
                $repo_dir = sys_get_temp_dir() . '/' . uniqid('my-custom-plugin-');
                $zip_file = $repo_dir . '.zip';
    
                // Git commands to clone the repository and create a ZIP archive of the specified branch.
                $git_clone_cmd = "git clone --branch $branch $repo_url $repo_dir";
                $git_archive_cmd = "git -C $repo_dir archive --format=zip --output $zip_file HEAD";
    
                // Execute the Git clone command.
                exec( $git_clone_cmd, $output, $result_code );
    
                // Check if the clone was successful.
                if ( $result_code !== 0 ) {
                    throw new \Exception("Could not clone the repository: " . implode("\n", $output));
                }
    
                // Execute the Git archive command.
                exec( $git_archive_cmd, $output, $result_code );
    
                // Check if the archive command was successful.
                if ( $result_code !== 0 ) {
                    throw new \Exception("Could not create ZIP file: " . implode("\n", $output));
                }
    
                if ( file_exists( $zip_file ) ) {
                    $extension->path = $zip_file;
                } else {
                    throw new \Exception("ZIP file not found after creation");
                }
            }
        }
    }
}
```

#### Example 3: Fetching from a private GitHub repository, building it, and caching the build file

You can get really creative with custom handlers. In this example, we will:

- Clone a remote GitHub repository locally
- Run a build script
- Use the resulting zip file in our environment
- Cache the build file for future use
- Whenever the remote repository changes, we will clone it again, re-build, and re-cache the zip file.

Example command: `qit env:up --requires=advanced-handler.php --plugins=my-advanced-plugin`

Or just `qit env:up` if you have this `qit.yml` file:

```yaml
plugins:
  - my-advanced-plugin
requires:
  - advanced-handler.php
```

```php
<?php

use QIT_CLI\Environment\ExtensionDownload\Handlers\CustomHandler;
use QIT_CLI\Environment\ExtensionDownload\Extension;

class AdvancedGitHubHandler extends CustomHandler {
	public function should_handle( Extension $extension ): bool {
		// If the plugin slug is "my-custom-plugin", we handle it here.
		return strpos( $extension->extension_identifier, 'my-advanced-plugin' ) !== false;
	}

	/**
	 * The only purpose of this method is to set "$extension->version" on the extensions
	 * that it handles. It's fine to ignore this method completely if you don't plan to
	 * support caching (eg: you will download it every time the environment runs).
	 *
	 * @param array<Extension> $extensions An array with all extensions to install in the environment.
	 *
	 * @return void
	 */
	public function populate_extension_versions( array $extensions ): void {
		foreach ( $extensions as $extension ) {
			if ( $this->should_handle( $extension ) ) {
				/*
				 * In this example, we are installing a plugin that exists in a remote GitHub Repository,
				 * so we will set $extension->version to the last commit ID on remote.
				 */

				// Here we set an example GitHub repository that we will be reading from. This could be a private repo, for instance.
				$repo_url = 'git@github.com:your-username/your-repo.git';

				/*
				 * We will hardcode the branch to keep the example simple, but we could
				 * get creative and use a format like this "my-custom-plugin#my-branch":
				 *
				 * [ $repo, $branch ] = explode( '#', $extension->extension_identifier );
				 */
				$branch = 'main';

				// Example output: "cde7540d569b29772f95161513835e1a596c419c        refs/heads/trunk"
				exec( "git ls-remote $repo_url $branch", $output, $result_code );

				if ( $result_code !== 0 || ! isset( $output[0] ) ) {
					throw new \Exception( "Could not fetch the latest commit ID" );
				}

				/*
				 * Here we explode the first line of the output ($output[0]),
				 * using the tab character as the delimiter, and we get the first element,
				 * which will be the commit ID.
				 */
				$latest_commit_id = explode( "\t", $output[0] )[0];

				// Set the version to the latest commit ID.
				// This way, we will always use a local cache, and only download it again when the remote ID changes.
				$extension->version = $latest_commit_id;
			}
		}
	}

	public function maybe_download_extensions( array $extensions, string $cache_dir ): void {
		foreach ( $extensions as $extension ) {
			if ( $this->should_handle( $extension ) ) {
				$cache_path = $this->make_cache_path( $cache_dir, $extension->type, $extension->extension_identifier, $extension->version, '-' );

				// Cache hit?
				if ( file_exists( $cache_path ) ) {
					if ( $this->output->isVeryVerbose() ) {
						$this->output->writeln( "Using cached {$extension->type} {$extension->extension_identifier}." );
					}
					$extension->path = $cache_path;
					continue;
				} else {
					if ( $this->output->isVeryVerbose() ) {
						$this->output->writeln( "Cache miss on {$extension->type} {$extension->extension_identifier}." );
					}

					// Creates a temporary directory to clone the GitHub repository.
					$repo_dir = sys_get_temp_dir() . '/' . uniqid( 'my-custom-plugin-' );

					// Clones it using `git`, which has authentication already.
					exec( "git clone git@github.com:your-username/your-repo.git $repo_dir 2>&1", $output, $result_code );

					if ( $result_code !== 0 ) {
						throw new \Exception( "Could not clone repository" );
					}

					if ( $this->output->isVerbose() ) {
						foreach ( $output as $line ) {
							$this->output->writeln( $line );
						}
					}

					// Changes the current directory to the cloned repository.
					chdir( $repo_dir );

					// Assuming your extension has a build script, we can run it here.
					exec( "npm run build", $output, $result_code );

					if ( $result_code !== 0 ) {
						throw new \Exception( "Build failed" );
					}

					if ( $this->output->isVerbose() ) {
						foreach ( $output as $line ) {
							$this->output->writeln( $line );
						}
					}

					// Assuming 'npm run build' creates a zip file named 'my-build.zip'
					$build_zip = "$repo_dir/my-build.zip";

					// Save to cache.
					if ( ! rename( $build_zip, $cache_path ) ) {
						throw new \Exception( "Could not move the build zip to the cache path" );
					}

					if ( file_exists( $cache_path ) ) {
						// This is ultimately what this method should do: set the path to the zip file on $extension.
						$extension->path = $cache_path;
					} else {
						throw new \Exception( "Build failed" );
					}
				}
			}
		}
	}
}
```

## Using the custom handler

Once you have implemented your custom handler, you can use it by including it with the `--requires` option in the QIT command. Your handler will then be invoked for any plugins or themes that meet its handling criteria, eg:

```shell
qit env:up --requires=my-custom-handler.php --plugins=my-custom-plugin
```

Or add to the config File:

JSON:
    
```json
{
    "requires": [
      "my-custom-handler.php"
    ]
}
```

In this example we are using the main branch of the repo, but we could get creative here and use a convention like this: `my-advanced-plugin#fix/my-branch`

Then, we could explode the string using `#`, and use the right side as our branch.

The possibilities are limitless, so these examples are not meant to be exhaustive, but to give you an idea of what you can do.

YML:

```yaml
requires:
  - my-custom-handler.php
```

### Using multiple custom handlers

You can use multiple custom handlers by including them in your config files, or at runtime with the `--requires` option in the QIT command. For example:

`qit.yml`

```yaml
plugins:
    - my-public-plugin
    - my-private-plugin
    - my-plugin-that-needs-build
requires:
  - public-handler.php
  - private-handler.php
  - advanced-handler.php
```

When you run `qit:up`, QIT will use the custom handlers to fetch the plugins and themes from the specified sources.

## Tips and best practices

- **Test your handler**: Ensure your custom handler works as expected in various scenarios.
- **Handle dependencies**: If your plugin or theme has dependencies, ensure your handler can resolve them.
- **Security**: Always consider security implications when fetching from external sources.

## Support

For support open an issue on the [QIT GitHub repository](https://github.com/woocommerce/qit-cli/issues).


=======================
File: ./docs/environment/05-tunnel.md
=======================

# Tunneling

Tunneling allows your local development environment to be accessible over the internet. This is useful for testing plugins that requires a live URL with valid HTTPS, such as payment gateways, SaaS, webhooks, integrations, etc. QIT CLI supports multiple tunneling methods, and the optimal choice depends on your operating system and requirements.

## Requirements

### Tunneling on Mac

To use tunneling on macOS, you need to have the `cloudflared` binary installed. You can install it using Homebrew:

```qitbash
brew install cloudflared
```

### Tunneling on Linux

No additional requirements are needed for tunneling on Linux.

### Tunneling on WSL

Tunneling on WSL is currently not supported. Let us know if you need this feature by [opening an issue](https://github.com/woocommerce/qit-cli/issues).

## Using Tunneling with QIT CLI Commands

You can use tunneling in the commands that utilize the QIT CLI environment capabilities. Currently, the following commands support tunneling:

- **env:up**: Start up the environment.
- **test:e2e**: Run end-to-end tests that require an environment.
- **test:activation**: Run activation tests that require an environment.

## Basic Example

```qitbash
qit env:up --tunnel
```

This command starts your environment with tunneling enabled, using the default method for your OS.

## Available Tunneling Methods

- **cloudflared-docker**: Cloudflare Tunnel via Docker container.
- **cloudflared-binary**: Cloudflare Tunnel using the local binary.
- **cloudflared-persistent**: Pre-configured persistent Cloudflare Tunnel.
- **custom**: Custom tunneling method via a user-implemented class.

If you are an Automattician, there might be an additional tunneling method available for you.

# Comparison Table

| Feature*                         | cloudflared-docker | cloudflared-binary | cloudflared-persistent |
|----------------------------------|--------------------|--------------------|------------------------|
| **Linux/CI**                     | ✅                  | ✅                  | ✅                      |
| **macOS**                        | ❌                  | ✅                  | ✅                      |
| **WSL****                        | ❌                  | ❌                  | ❌                      |
| **Uses Temporary Subdomains**    | ✅                  | ✅                  | ❌                      |
| **Supports Parallel Tunnelling** | ✅    | ✅                  | ❌                      |
| **Requires Cloudflare Account**  | ❌                | ❌                  | ✅                      |
| **Requires Additional Setup**    | ❌                  | ❌                  | ✅                      |
| **Requires Binary Installation** | ❌    | ✅                  | ✅                      |

\* If you implement a Custom tunnel, the capabilities will depend on your implementation.

\*\* WSL support is not available at the moment due to priorities. Let us know if you need this feature by [opening an issue](https://github.com/woocommerce/qit-cli/issues).

### Using Different Tunnels

By default, QIT CLI will use the best tunneling method for your operating system.

- **`--tunnel` without a value**: Uses the default tunneling method. If a default is set via `tunnel:set-default`, it will use that. Otherwise, it selects a tunneling method based on your operating system.
- **`--tunnel <method>`**: Specify a tunneling method to use. Available methods are:

  - `cloudflared-docker`
  - `cloudflared-binary`
  - `cloudflared-persistent`
  - `custom`

## Detailed explanation of each Tunnel Method

### cloudflared-docker

- **Description**: Uses Cloudflare Tunnel via a Docker container.
- **Best For**: Linux systems and CI environments.
- **Advantages**:
  - Works out of the box without additional setup.
- **Considerations**:
  - Deals with temporary subdomains.
  - May experience delays due to DNS propagation times when starting the tunnel.
  - You can use Cloudflare DNS (1.1.1.1) to speed up the DNS resolution process. 

### cloudflared-binary

- **Description**: Uses the Cloudflare Tunnel local binary installed on your system.
- **Best For**: macOS systems (default on macOS) and Linux.
- **Advantages**:
  - Works out of the box if the `cloudflared` binary is installed.
- **Considerations**:
  - Similar to `cloudflared-docker`, it uses temporary subdomains.
  - May experience DNS propagation delays when initiating the tunnel.
  - You can use Cloudflare DNS (1.1.1.1) to speed up the DNS resolution process.

### cloudflared-persistent

- **Description**: Uses a pre-configured persistent Cloudflare Tunnel.
- **Best For**: Situations where immediate DNS resolution is required and you have a Cloudflare account.
- **Advantages**:
  - Does not have DNS propagation issues since it uses a persistent subdomain.
- **Considerations**:
  - Requires a Cloudflare account and a site registered on Cloudflare.
  - Requires additional setup steps, which can be found in the [Persistent Tunnel](./persistent-tunnel) page.

### custom

- **Description**: Allows you to use a custom tunneling method by implementing a `CustomTunnel` class.
- **Best For**: Advanced users who need a custom tunneling solution.
- **Considerations**:
  - Requires custom implementation and configuration.

### Examples

#### Start Environment with a Specific Tunneling Method

```qitbash
qit env:up --tunnel cloudflared-docker
```

This will use the `cloudflared-docker` tunneling method.

#### Run E2E Tests with Tunneling

```qitbash
qit run:e2e my-plugin --tunnel
```

Enables tunneling while running end-to-end tests. Useful when tests require external access to the local environment.

#### Run Activation Tests with a Specific Tunneling Method

```qitbash
qit run:activation my-plugin --tunnel cloudflared-binary
```

Runs activation tests with tunneling enabled using the `cloudflared-binary` method.

## Setting Up Tunneling Methods

Most tunneling methods work out-of-the-box and do not require additional setup. If you don't call `tunnel:setup`, QIT CLI will use the default tunneling method based on your operating system when you enable tunneling.

### When to Use `tunnel:setup`

You only need to run `tunnel:setup` if:

- You want to use a tunneling method that requires authentication or additional configuration, such as `cloudflared-persistent` or a custom tunnel.
- You want to configure multiple tunneling methods and switch between them.
- You want to set a specific tunneling method as your default.

### Configuring a Tunneling Method

To configure a tunneling method that requires setup, run:

```qitbash
qit tunnel:setup
```


You will be prompted to select a tunneling method to configure.

Check the [Persistent Tunnel](./persistent-tunnel) page for additional setup steps if you choose `cloudflared-persistent`.

Follow the on-screen instructions to complete the setup.

#### Example:

```qitbash
$ qit tunnel

Select the tunneling method you wish to configure:

[cloudflared-docker] Cloudflare Tunnel via Docker container
[cloudflared-binary] Cloudflare Tunnel using the local binary
[cloudflared-persistent] Persistent Cloudflared Tunnel

    cloudflared-persistent

Enter your Cloudflare Tunnel name: my-tunnel
Enter your Cloudflare Tunnel URL: https://my-tunnel.example.com

Do you want to set this tunneling method as your default? (yes/no) [yes]: Yes

Default tunneling method set to: cloudflared-persistent Configuration successful! Your cloudflared-persistent tunnel is now set up.
```

### Configuring Multiple Tunnels

You can configure multiple tunneling methods, especially if you need to switch between them. Simply run `qit tunnel:setup` again and select another method to configure.

### Setting a Default Tunneling Method

After configuring tunneling methods, you can set one as your default using the `tunnel:set-default` command.

#### Example:

```qitbash
$ qit tunnel:set-default

Select the tunneling method you wish to set as default: 

[cloudflared-docker] Cloudflare Tunnel via Docker container
[cloudflared-binary] Cloudflare Tunnel using the local binary
[cloudflared-persistent] cloudflared-persistent

    cloudflared-persistent

Default tunneling method set to: cloudflared-persistent
```


### Resetting Tunneling Configurations

To reset all tunneling configurations to defaults:

```qitbash
qit tunnel:setup --reset
```

This will remove all configured tunneling methods and unset the default tunnel.

## Implementing a Custom Tunnel

If you need to use a custom tunneling method, refer to the [Custom Tunneling Methods](./custom-tunnel) section for instructions on how to create and use a custom tunneling method.

## Additional Tips

- **No Setup Needed for Default Tunnels**: For `cloudflared-docker` and `cloudflared-binary`, you don't need to run `tunnel:setup` unless you want to set one as your default or configure multiple tunnels.
- **Checking Tunnel Usability**: Before using a tunneling method, ensure it is usable on your system. Some tunnels may not be compatible with certain operating systems or environments (e.g., WSL).
- **Configuration Persistence**: Tunneling configurations are stored persistently. You only need to configure a tunneling method once unless you need to change it.
- **Verbose Output**: Use the `-v` or `-vv` option with commands to get more detailed output. This can be helpful for troubleshooting.

## Troubleshooting

- **DNS Propagation Issues**: If you experience delays accessing your tunnel, it may be due to DNS propagation. Consider using a persistent tunnel, using Cloudflare DNS, or waiting a few moments.
- **Tunnel Not Usable**: If you receive an error stating that a tunneling method is not usable, verify that all prerequisites for that method are met (e.g., required binaries are installed).
- **Tunnel Not Configured**: If you receive an error stating that a tunneling method is not configured, it means the method requires setup (e.g., `cloudflared-persistent`). Run `qit tunnel:setup [method]` to configure it.
- **Custom Tunnel Issues**: Ensure your custom tunnel class correctly implements all required methods and handles configuration appropriately.
- **Default Tunnel Fallback**: If you haven't configured a default tunnel and use `--tunnel` without specifying a method, QIT CLI will automatically select the default tunneling method based on your operating system.

## Conclusion

Tunneling in QIT CLI is a powerful feature that enhances your development workflow by making your local environment accessible externally. By default, QIT CLI provides tunneling methods that work without additional setup, allowing you to start using tunneling immediately. If you need to use a tunneling method that requires authentication or additional configuration, you can easily set it up using the provided commands.


=======================
File: ./docs/environment/06-persistent-tunnel.md
=======================

# Using a Persistent Tunnel

The default disposable temporary tunnels are great for most use cases, but sometimes you need a persistent tunnel that does not require immediate DNS resolution.

A persistent tunnel is a tunnel that have a predictable URL, so it doesn't needs immediate DNS propagation.

You can use `cloudflared-persistent`, or a custom tunnel. This guide will go through how to set-up a persistent tunnel using Clouflared binary.

## Requirements

You must have a Cloudflare account, the `cloudflared` binary installed on your system, and access to a domain that is managed by Cloudflare, such as a regular website that is proxied by Cloudflare.

1. **Install the `cloudflared` binary on your system.**
2. **Authenticate with**: `cloudflared tunnel login`.
3. **Create a tunnel with**: `cloudflared tunnel create <tunnel-name>`
4. **Route DNS with:** `cloudflared tunnel route dns <tunnel-uuid> <tunnel-name>`

   Replace `<tunnel-uuid>` with the UUID generated from the previous step.
5. **Test the tunnel with:** `cloudflared tunnel run <tunnel-name> --hello-world`

6. **Configure in QIT CLI:** `qit tunnel:setup`

   Provide the tunnel name and URL when prompted.

=======================
File: ./docs/environment/07-custom-tunnel.md
=======================

# Using a Custom Tunnel

If you need to use a custom tunneling method, you need to:
- Create a PHP file with a class that extends `\QIT_CLI\Tunnel\CustomTunnel`
- Require this file at runtime with `--require myCustomTunnel.php`
- Run the command with `--tunnel`

Example:

```qitbash
qit env:up --tunnel --require myCustomTunnel.php
```

Your class should implement the following methods:

```php
/**
 * Connects the tunnel.
 * 
 * Takes as input the local URL, and should return the tunnelled URL.
 *
 * Example: $local_url = 'http://localhost:1234'
 * 		    $env_id = '1234'
 * 
 * Returns: 'https://mytunnel.example.com'
 *
 * @param string $local_url
 * @param string $env_id
 *
 * @return string The public URL of the tunnel.
 */
abstract public static function connect_tunnel( string $local_url, string $env_id ): string;

/**
 * Determines whether this tunnel can be used.
 *
 * @throws \RuntimeException If the tunnel is not supported.
 */
abstract public static function check_is_installed(): void;

/**
 * Checks if the tunnel is properly configured.
 *
 * @return bool
 */
abstract public static function is_configured(): bool;
```


Example of a custom tunneling method:

```php
<?php

class MyCustomTunnel extends \QIT_CLI\Tunnel\CustomTunnel {
    public static function connect_tunnel( string $local_url, string $env_id ): string {
        /*
         * If we save the PID of the tunnel process in this pattern,
         * this will allow us to stop the tunnel when the environment is stopped.
         * This PID is killed when the environment is stopped.
         */
        $pid_file = sys_get_temp_dir() . "/qit_env_tunnel_{$env_id}.pid";
        
        /*
         * Connect to the tunnel and return the public URL.
         * For example purposes, let's assume that "mytunnel"
         * has a "--pidfile" option to save the PID of the tunnel process. 
         */
        exec("mytunnel connect $local_url --pidfile $pid_file" , $output);
        
        // Let's assume the public URL is the first line of the output.
        return $output[0];
    }

    public static function check_is_installed(): void {
        // Check if the tunnel binary is installed.
        exec("mytunnel --version", $output, $return_code);
        
        if ($return_code !== 0) {
            throw new \Exception("MyTunnel is not installed.");
        }
    }

    public static function is_configured(): bool {
        // Let's assume this tunnel doesn't need configuration/auth.
        // You could use getenv() to check for configuration variables and use it when connecting.
        return true;
    }
}
```

You can always refer to QIT CLI own tunnel implementations for inspiration:

https://github.com/woocommerce/qit-cli/tree/trunk/src/src/Tunnel/Tunnels

=======================
File: ./docs/environment/08-environment-variables.md
=======================

# Environment Variables

You can pass environment variables to your test context using the `--env` or `--env_file` options.

Passing a single env value:

```qitbash
qit run:e2e your-plugin --env FOO=FOO_VALUE
```

Passing multiple env values:

```qitbash
qit run:e2e your-plugin --env FOO=FOO_VALUE --env BAR=BAR_VALUE
```

Using a file:

```qitbash
qit run:e2e your-plugin --env_file .env
```

## Reading the environment variables

You can read the environment variables in your tests bootstrap, example:

bootstrap.sh

```bash
echo $FOO
echo $BAR
```

some-test.spec.js

```js
console.log(process.env.FOO);
console.log(process.env.BAR);
```

And in your plugin's code:

```php
echo getenv('FOO');
echo getenv('BAR');
```

=======================
File: ./docs/managed-tests/00-introduction.md
=======================

import TestTypes from '@site/src/components/TestTypes';

# Managed tests

Managed tests are a series of tests written and maintained by QIT.

All of these tests are available for you out-of-the-box, and they work with any WordPress plugin or theme.

<TestTypes />

## Managed tests vs. custom E2E tests

While the managed tests are written and maintained by us, the custom E2E tests are written and maintained by you.

The managed tests are designed to cover the most common use cases and scenarios, but they may not cover all the specific use cases of your plugin or theme.

If you have specific use cases that are not covered by the managed tests, you can write your own custom E2E tests and run them using QIT.


=======================
File: ./docs/managed-tests/01-woo-e2e.md
=======================

# Woo E2E tests

The Woo end-to-end (e2e) test creates a temporary WordPress installation with WooCommerce and the extension under test installed, and uses a browser that is scripted to perform certain automated tasks, such as completing the WooCommerce onboarding wizard, creating a product, making a purchase as a customer, verifying the order details as an admin, tweaking tax settings, etc.

Then, it runs the [WooCommerce Core end-to-end tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/e2e-pw) against a store with your extension activated. These tests cover the [WooCommerce Core Critical Flows](https://github.com/woocommerce/woocommerce/wiki/Critical-Flows) to verify that a given extension does not break the default WooCommerce behaviors. Once the tests complete, the dashboard will show a Success or Failure test result. In the case of a failed test, a link to an Allure test report will be provided that allows you to dig into the details and see what failed and why.

:::info
Currently, QIT can only run the WooCommerce Core E2E test suite. Future support for running your own E2E tests is planned.
:::

### Example

This GIF is an example of the end-to-end test running. It performs a series of automated actions in a browser, such as creating a product, making a purchase, and verifying the order details as an admin, as fast as possible. The test is run against a store with the extension under test activated.

<details>
<summary>Click to view GIF</summary>
<span>
![](_media/e2e.gif)
</span>
</details>

## What to do if it fails

If your end-to-end test is failing, please take the following steps:

- Check the Allure test report to see what failed and why. If you're unable to reproduce the issue manually, try re-running the test to see if it passes.
- If the test continues to fail, it can be either because of a bug that should be fixed, or because your extension modifies the default WooCommerce behavior in a way that is unexpected by the automated tests. 
- We expect a certain amount of extensions to fail the end-to-end tests because they modify WooCommerce behaviors in ways that the tests are not designed to account for, such as modifying HTML selectors, etc. If you believe that is the case with your extension, please email us at qit@woocommerce.com and we can help you determine the best way to proceed, by either adapting the tests, suggesting some tweaks to your plugin, or by ignoring some tests especifically for your plugin.

## Understanding Allure reports

For end-to-end test failures, an Allure test report will be generated and is available on the [All Test page](../woo-com/viewing-test-results.md). Allure reports provide a lot of great information to help troubleshoot and diagnose any test failures. For failures, screenshots and a stacktrace is provided. This section provides an overview of a report and where to go to view results. For a more detailed overview, see the official Allure documentation under [Report Structure](https://docs.qameta.io/allure-report/#_report_structure).

## Viewing a report

An Allure report is generated for end-to-end test failures and can be viewed by clicking the `View Report` button on the `Quality Insights > All Tests` page in the QIT Dashboard:

Following this link will open the Allure test results in a modal:

![allure-report-home](_media/allure-report-home.png)

The `Suites` section shows what browser the tests were ran on, and the results of the tests (currently the tests are only ran in Chrome):

![allure-suites](_media/allure-suites.png)

This page will provide a quick view into what percentage of tests passed, failed, or were skipped. Any failures will be reported in the `Categories` section under `Product defects`:

![allure-categories](_media/allure-categories.png)

## Digging into the details

### Successful results

For successful tests, you can view the details by going into the `Suites` section, either from the `Overview` page or by clicking the `Suites` menu option on the left-hand side. There, you can click into individual tests that passed and view the steps that were taken, the HTML selectors that were used, and what assertions were made:

![allure-success-results](_media/allure-success-results.png)

### Failed cases

When tests fail, Allure will provide the stack trace, the error that it encountered, and a screenshot of where it failed:

![allure-failure-results](_media/allure-failure-results.png)

This allows you to dig through the steps that were taken by the test, download the stack trace, and see if it's possible to replicate the issue for any potential bugs that may need to be addressed.

:::tip
We've done our best to stamp out as much flakiness as possible in our end-to-end tests, but it can still occur. If you're unable to reproduce the issue manually, try re-running the test to see if it passes.
:::


=======================
File: ./docs/managed-tests/02-woo-api.md
=======================

# Woo API tests

API Testing is a crucial part of ensuring the smooth functioning of an application. With Woo API testing, we execute a set of operations using the [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/) and verify that the API responds in an expected, consistent, way. These operations include creating products, customers, and orders through the REST API and then validating the data that we have created.

The test suite that we use for this process is the [WooCommerce Core API tests](https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/tests/api-core-tests). These tests are ran against a store where your extension has been installed and activated. Upon completion of the test, you can check the results either in the Dashboard, or retrieving the test using the QIT CLI, to see if the test has passed or failed. If it fails, you can access an Allure test report that will provide you with a detailed analysis of the reasons for the failure.

## What to do if it fails

In the event of a failed Woo API test, you must take the following steps:
- Review the test report.
- Analyze the causes of the failure and attempt to recreate the issue on your local setup.
- Resolve the issue and run the test again.
- If you believe that the result is incorrect, please do not hesitate to contact us at qit@woocommerce.com.


=======================
File: ./docs/managed-tests/03-activation.md
=======================

# Activation tests

The Activation test type performs basic operations on a test site with your plugin activated.

### The operations are:

- Log-in as admin
- Activate any dependencies that your plugin has (e.g. WooCommerce)
- Activate your plugin
- Visit and take screenshots of any pages added by your plugin to the wp-admin menu
- Enable Cash on Delivery payment method
- Enable Local Pickup shipping method
- Create a product
- Create an order
- Add a product to cart
- Place an order as a guest
- Deactivate your plugin

### The status of the test is determined by the following:

- Success: All flows were completed, and no PHP notices, warnings, or errors were triggered.
- Warning: All flows were completed, but a non-fatal PHP error was triggered.
- Failed: One of the flows failed, or a fatal PHP error was triggered.

### Configurable Options:

You can tweak several parameters in the Activation Test, such as Woo, WP, and PHP versions, etc. You can see all options by running `qit run:activation --help` in the QIT CLI.

### Skipping Visited Pages

If you want the Activation test to skip specific pages added by your plugin, you can add a `qit.json` file to your plugin's root directory (the same directory as your plugin entrypoint) with the following content:

```json
{
  "activation": {
    "skipVisitPages": [
      "wp-admin/admin.php?page=skip-visiting-this"
    ]
  }
}
```
  - **Automatic Page Discovery:** By default, the test suite will visit all pages accessible from the WordPress admin sidebar menu that are added by your plugin.
  - **skipVisitPages Array:** The `skipVisitPages` array in the `qit.json` file specifies the URLs of pages you want to exclude from being visited during the tests.
  - **Substring Matching:** The skipping mechanism works based on substring matching. This means that if any part of a page's URL contains a string listed in the skipVisitPages array, that page will be skipped during the tests.
    
    For example, if you include "wp-admin/admin.php?page=skip-visiting-this" in the `skipVisitPages` array, any admin page URL containing that substring will not be visited during the E2E tests.

### Visiting a specific page

You can also define specific pages to be visited, that might not be visible from the sidebar menu.

It **uses a slightly different syntax**, as it takes a page title and a URL. It only accepts relative URLs.

```json
{
  "activation": {
    "visitPages": {
      "Visit This": "wp-admin/admin.php?page=do-visit-this"
    }
  }
}
```

### How to run the test

You can run the activation test with the following command:

```qitbash
qit run:activation <your-plugin>
```

### Tunnel

Some plugins might need an actual live site URL to work properly, such as payment gateways and SaaS. For those, you can use our [built-in tunnel feature]To test these plugins, you can use our [built-in tunnel feature](/docs/environment/tunnel). to expose the test site to the web.

## What to do if it fails

If your activation test is failing, please take the following steps:
- Open the test report
- Identify the causes of failure. The test will log PHP notices, warnings, and errors that happens when activating your plugin
- Try to reproduce it locally and fix the issue
- If you think the result is incorrect, please email us at qit@woocommerce.com

=======================
File: ./docs/managed-tests/04-security.md
=======================

# Security tests

This test runs an experimental security scanner against a given extension.

- Success: No security issues, errors or warnings.
- Warning: Only security warnings.
- Failure: One or more security errors.

### What tools are used?
The tools used in the security test currently are [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer), [SemGrep](https://semgrep.dev/), 3rd-party package audit tools (i.e. [composer audit](https://getcomposer.org/doc/03-cli.md#audit)), and the [WPScan vulnerability database](https://wpscan.com).

### Can I run it locally?
Ideally, you should delegate all the test execution to QIT. We don't support running the tests outside of QIT, but you can mimick at least the PHPCS rules. The SemGrep rules are not available to be run locally. Auditing your 3rd-party packages can be done locally via your package manager commands. Checking WPScan for your extension can also be done manually.

### Which PHPCS rules are enabled?
We use the WordPress Coding Style Standards project. Apart from SemGrep, the security test runs all rules of the `WordPress.Security` and `WordPress.DB` namespaces.

### What do the audit results mean?
If your extension uses 3rd-party packages (for example, PHP packages via composer), the security test will use the built-in tools from that package manager to audit them for known vulnerabilities. This is done by checking the versions of installed packages against a database of known vulnerabilities. Remediation typically involves either upgrading the version of the package in use, or in some cases switching to an actively maintained alternative. Running the relevant command on your extension locally should produce more detailed output that can guide you in next steps.

The test will also check the WPScan database for any unfixed vulnerabilities for your extension; if any are present, the test will flag them as an error. If you believe the data that WPScan has is incorrect (i.e. you have already released a fix, but this is not reflected in the vulnerabiltiy entry), please [contact](https://wpscan.com/contact/) them directly; if you need further guidance reproducing or fixing a vulnerability, please reach out to the original researcher, who should be listed in the vulnerability information.

## What to do when encountering a discouraged function?

We identify functions that may lead to potential security vulnerabilities and mark them with a warning using the `Generic.PHP.ForbiddenFunctions.Discouraged` rule.

While these functions are not inherently unsafe, they frequently contribute to critical vulnerabilities. We flag them to encourage you to review the code for security. If you've confirmed that the code is secure, you can suppress the warning by adding the following comment on the same line as the function: `// phpcs:ignore Generic.PHP.ForbiddenFunctions.Discouraged`

## What to do if it fails

If your security test is failing, please take the following steps:
- Open the test report.
- Identify the causes of failure. The test will log any security issues that our scanner identifies.
- Fix the issue and re-run the test.

### Request AI-assisted recommendations

Below the list of the found issues from the security audit, there is the option to generate a list of AI-assisted recommendations on how to fix the issues:

![request-ai-recommendations](_media/request-ai-recommendations.png)

After a few minutes, this will generate a report of suggested fixes for the results from the security audit to help provide guidance on how to fix them.

:::info
Our AI-assisted recommendations are still in the early stages of training, so it is expected that it produces some invalid suggestions. **Please use these suggestions carefully.** We trained this model on a large dataset of insecure and secure code, specializing it to convert insecure code into secure code. Your help to train this AI is paramount. Please provide feedback about the suggestions, your feedback is used to constantly improve the models.
:::

### Handling false positives

False positives, or alerts for security issues that do not exist in actuality, may occasionally arise during security testing. Though we've chosen PHPCS and SemGrep rules to minimize such occurrences, it's important to address these false positives in a systematic way.

- **Verification:** The first step is to understand and confirm if it's indeed a false positive. Review the flagged code section and the warning or error raised by the tool. It's always good to revisit the code and the associated rule to understand the potential security implications, if any.
- **Report:** If after careful review, the flag still appears to be a false positive, report it to us. Send an email to qit@woocommerce.com explaining the situation, with the specific test result and the corresponding part of your code. Please make sure to include any additional information that can help us understand why you believe it's a false positive.
- **Suppression (temporarily):** In the meantime, while we investigate the issue, you might want to suppress the false positive to continue your work without disruption. To do so, add a comment line right before the flagged line in your code.
    - For PHPCS errors, add `// phpcs:ignore Rule.Name` on the line where the error is reported. Replace `Rule.Name` with the rule that has caused the false positive, eg: `// phpcs:ignore WordPress.Security.ValidatedSanitizedInput`
    - For SemGrep errors, add `// nosemgrep: rule-id` in a similar manner, replacing rule-id with the SemGrep rule identifier, eg: `// nosemgrep: audit.php.wp.security.xss.query-arg`

Only suppress the error if you are certain that it is a false positive.

- **Resolution:** We'll review your report and communicate our findings. If we confirm it's a false positive, we will work towards fine-tuning our rules to prevent such instances in the future. Your cooperation in reporting these instances is invaluable to improve the quality and accuracy of our security testing.

Please note, suppressing warnings or errors should be done judiciously and is only recommended as a temporary solution. We strongly advise against using it as a permanent solution to avoid security tests. Our goal is to ensure that your extensions are as secure as possible, and ignoring genuine warnings or errors can lead to security vulnerabilities.


=======================
File: ./docs/managed-tests/05-phpcompatibility.md
=======================

# PHPCompatibility tests

The PHPCompatibility test is a tool that helps developers assess the compatibility of their extension with different PHP versions. It checks the codebase of a plugin against a set of coding standards and best practices to ensure that it can run on a wide range of PHP versions, ensuring better compatibility and security. The following status will be returned from this test:
- Success: No WordPress/PHP compatibility warning or errors.
- Warning: Issues or potential problems in your code that may affect compatibility with the target PHP version(s). Warnings are typically related to deprecated or risky code practices.
- Failure: Critical issues in your code that prevent it from being compatible with the target PHP version(s). Failures often result from the use of code that is incompatible with the specified PHP version(s).

## What to do if it fails
If your phpcompatibility test is failing, please take the following steps:

- Open the test report
- Identify the causes of failure. The test will log any security issues that our scanner identifies
- Fix the issue and re-run the test

### Handling false positives

We have chosen to utilize the `develop` branch of the PHPCompatibility project rather than version `9`. The reason for this choice is that the develop branch offers partial support for PHP 8+ syntax, which is essential for maintaining compatibility with modern PHP versions. However, it's important to note that this partial support may occasionally lead to false positives in the test results against codebases using 8+ syntax. 

If you are confident that an error is a false positive, we recommend that you report the issue to the [PHPCompatibility repository](https://github.com/PHPCompatibility/PHPCompatibility) so it can be reviewed. Additionally, developers can temporarily suppress these errors using PHP CodeSniffer (PHPCS) ignore comments until further updates are available.


=======================
File: ./docs/managed-tests/06-phpstan.md
=======================

# PHPStan tests

The PHPStan test type runs level 0 PHPStan checks against your extension. More details on what the rule levels cover can be found in the official PHPStan documentation: [Rule Levels](https://phpstan.org/user-guide/rule-levels).

## What to do if it fails

Due to the very nature of WordPress and WooCommerce of not being typed codebases, static code analysis such as PHPStan have a high failure rate when testing WordPress plugins in general.

This doesn't mean that there are issues with the quality of the code, it's only that the code is not friendly to static code analysis, such as code with extensive usage of getters and setters, which is very common when integrating with WooCommerce Core.

The PHPStan tests still provide a lot of value for the developers that want to pursue the highest levels of quality. By default, we run PHPStan tests with level 0.

If your PHPStan test is failing, please take the following steps:

- You can ignore this test, as we don't use it internally to measure an extensions quality
- But if you wish to address the feedback that the static code analsysis provide, open the test report
- Identify the causes of failure
- Fix the issue and re-run the test
- If you think the result is incorrect, please email us at qit@woocommerce.com

=======================
File: ./docs/managed-tests/07-malware.md
=======================

# Malware tests

Our malware scanner is designed to detect and identify potentially malicious or suspicious PHP code in web applications and files. It is primarily used for identifying PHP-based malware, backdoors, and other security threats that may have been injected into PHP files. The following status will be returned from this test:

- Success: No malicious or suspicious code detected.
- Falure: Something in the plugin under test has been flagged as potentially dangerous.

## Types of issues flagged
- `NonPrintableChars`: Obfuscated or malicious PHP code that includes non-printable characters.
PasswordProtection: It may indicate a weak or insecure password validation method.
- `ObfuscatedPhp`: Functions like eval, preg_replace, and various evasion techniques used by obfuscation tools.
- `DodgyPhp`: Suspicious PHP code patterns that may be used in malicious scripts, such as bypassing safe mode, shell execution, and other potentially dangerous functions.
- `DangerousPhp`: Potentially dangerous PHP functions and system calls that can be used for malicious purposes. It focuses on functions like exec, system, and shell_exec.
- `HiddenInAFile`: Identifies suspicious files that may hide malicious PHP code, such as GIF, PNG, or JPEG files that include obfuscated PHP code.
- `CloudFlareBypass`: Detects potential indicators of an attempt to bypass CloudFlare's security measures. It checks for specific parameters related to CloudFlare challenges.
- `SuspiciousEncoding`: Identifies various forms of encoding often used to obfuscate or hide malicious PHP code. It looks for base64 encoding, hexadecimal encoding, string reversal, and other encoding techniques.
- `DodgyStrings`: Detects suspicious strings often associated with malicious activities, such as filenames, system commands, and shell-related operations. It may indicate attempts to perform unauthorized actions.
- `Websites`: Identifies references to various websites and domains that are commonly associated with hacking, exploits, or security vulnerabilities. It may indicate potential malicious intent or resource use.

## What to do if it fails

If your malware test is failing, please review the following steps:
- Open the test report.
- Identify the causes of the failure and confirm whether or not the error is a false positive.
  - For false positives, you can rerun the test and pass the offending path as part of the `whitelist_paths` param
  - For true positives, the offending code should be immediately addressed.
- If you identify a false positive that you believe would benefit the community if excluded for all malwate tests, please email us at qit@woocommerce.com so we can review and make the necessary adjustments.


=======================
File: ./docs/managed-tests/08-validation.md
=======================

# Validation tests

Our validation test is designed to inform you of any issues with plugin and theme metadata. Right now it is purely informative, but in the future it may block submissions or updates.

## Types of issues flagged

### Plugin headers

The presence or absence of certain headers will be checked; both the main plugin or theme file as well as the `readme.txt` will be checked, with priority given to the main file.

The following headers should be present, and will result in a warning if not:

- `Requires PHP` - so that users know if your extension requires a specific version of PHP.
- `Requires at least` - so that users know if your extension requires a specific version of WordPress.
- `Tested up to` - so users can be sure that your extension works correctly with recent WordPress versions.
- `WC requires at least` - so that users know if your extension requires a specific version of WooCommerce.
- `WC tested up to` - so users can be sure that your extension works correctly with recent WooCommerce versions.

The following headers should not be present when submitted, and will result in a warning if they are:

- `Woo` - as discussed [here](https://woocommerce.com/document/create-a-plugin/#section-14), this header will be added automatically during the deployment process; in order to avoid issues with incorrect headers or when distributing the same plugin outside the Marketplace, we recommend not including it manually.

### Woo feature compatibility

The plugin will be loaded along with WooCommerce and the WooCommerce features API will be used to check for declared incompatibility with the following features:

- `custom_order_tables` - also known as High Performance Order Storage (HPOS); this is now the default for new WooCommerce stores, and all extensions [should be compatible with it](https://developer.woocommerce.com/docs/hpos-extension-recipe-book/#2-supporting-high-performance-order-storage-in-your-extension).
- `cart_checkout_blocks` - extensions that modify the cart or checkout experience [should be compatible with this feature](https://developer.woocommerce.com/2023/11/06/faq-extending-cart-and-checkout-blocks/).

Because not all extensions are required to declare explicit compatibility for all features (i.e. an extension that does not modify the cart or checkout experience doesn't need to declare compatibility with the blocks feature), only an explicit declaration of incompatibility will be flagged as a warning.

### Outdated theme templates

Themes will be checked for outdated templates, as determined by WooCommerce itself. If any are found, this will result in a warning; to resolve it, follow the [guide in the WooCommerce developer documentation](https://developer.woocommerce.com/docs/how-to-fix-outdated-woocommerce-templates/).

## What to do if it fails

If your validation test is failing, please review the following steps:
- Open the test report.
- Identify the causes of the failure (typically a missing or misspelled header) and remedy it.
- If you believe you've run across a bug in the test, please email us at qit@woocommerce.com so we can review and make the necessary adjustments.


=======================
File: ./docs/managed-tests/09-plugin-check.md
=======================

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


=======================
File: ./docs/support/authenticating.md
=======================

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


=======================
File: ./docs/support/contact-us.md
=======================

# Contact us

We're here to help! If you have any questions, comments, or concerns, please don't hesitate to reach out to us. You can contact us by sending an email to [qit@woocommerce.com](mailto:qit@woocommerce.com).

## Report issues

If you encounter any issues with our QIT CLI tool, please let us know by opening an issue on our GitHub repository. You can access the repository here: https://github.com/woocommerce/qit-cli/issues

## Provide feedback

We value your feedback and suggestions. Please take a moment to let us know how we're doing by filling out [this feedback form](#). Your input will help us continue to improve.


=======================
File: ./docs/support/test-options.md
=======================

---
sidebar_position: 1
---

# Test options

The table below shows what options are available for each test type. For example, for Activation tests you can supply a WordPress version but for the security tests it isn't supported.

|                              | Activation | Woo E2E | Woo API | Security | PHPStan | Validation | Plugin Check |
| ---------------------------- | ---------- |---------|---------| -------- | ------- | ---------- | ------------ |
| WordPress Versions           | ✅         | ✅       | ✅       | ❌       | ❌      | ❌        | ❌           |
| WooCommerce Versions         | ✅         | ✅       | ✅       | ❌       | ❌      | ❌        | ❌           |
| WooCommerce Features         | ✅         | ✅       | ✅       | ❌       | ❌      | ❌        | ❌           |
| PHP Version                  | ✅         | ✅       | ✅       | ❌       | ❌      | ❌        | ❌           |
| Additional Extensions        | ✅         | ✅       | ✅       | ❌       | ❌      | ❌        | ❌           |
| Additional WordPress Plugins | ✅         | ✅       | ✅       | ❌       | ❌      | ❌        | ❌           |

## WordPress and WooCommerce versions

You can specify the last 5 stable releases along with the most recent beta/release candidate to be used in the test environment.

:::info
Please note that for API and end-to-end tests, the WooCommerce version is currently restricted to specific versions as we work to make the tests backwards and forwards compatible. For the most up to date versions that we currently support, you can select the test type in the Viewer under `Run a Test` or, using the QIT CLI, check the help for each test type: `./qit run:api --help` and `./qit run:woo-e2e --help`.
:::

## WooCommerce features

QIT currently supports the following option WooCommerce features:

- [High Performance Order Storage (HPOS)](https://developer.woocommerce.com/roadmap/high-performance-order-storage/)

For more information on using optional features in your tests, check out [Testing WooCommerce Optional Features](../cli/running-tests#using-optional-features).

## PHP versions

You can specify a PHP version from 7.4 to 8.3 to be used in the test environment.


=======================
File: ./docs/woo-com/getting-started.md
=======================

# QIT in WooCommerce.com

The QIT Dashboard is a tool available to extension developers in the WooCommerce administrative interface. This tool allows developers to run a variety of tests with their extension installed in a test environment, configured with the latest version of WordPress and either the release candidate or latest version of WooCommerce. If you have multiple extensions, you can select the extension you’d like to run the tests against.

To get started, you'll need to log in to your account on WooCommerce.com. Once you log in to your account, click on "Vendor Dashboard" to go to your dashboard:

![go-to-dashboard](_media/go-to-dashboard.png)

In the menu on the left-hand side, you'll see a new `Quality Insights` menu item:

![qi-menu-option](_media/qi-menu-option.png)

Hovering over the menu will give you the three sections that make up the QIT Dashboard:

- All Tests
- Create a Test
- Notification Settings

More details on each of these options is provided below.

## All tests

![all-tests-menu](_media/all-tests-menu.png)

The All Test page gives you insight into the extension the tests were ran against, the version of the extension, and what test type was ran. In addition, you can see what the results of the test runs were (such as failed, success, or pending if they’re currently running) and, in the case of end-to-end tests, view the Allure test report if the tests fail.

For more insight into the test results, please see [Viewing test results](woo-com/viewing-test-results.md).

## Run a test

![run-a-test-menu](_media/run-a-test-menu.png)

On this page, you can select [the type of test](/docs/managed-tests/introduction) you'd like to run, which extension to test, and choose the versions of WooCommerce and WordPress to run the tests against.

For more details around creating a test, please see [Run a test](woo-com/run-a-test.md).

## Notification settings

![notification-settings-menu](_media/notification-settings-menu.png)

If any of the tests result in a failed test result, we will send out an email that contains details on the test type that failed and the versions of the extension, WooCommerce, and WordPress that the test failed for. Email notifications can be enabled or disabled for each test type. By default, emails will be sent to your account email address.

For more information around configuring notifications, see [Configure notifications](woo-com/notifications.md).


=======================
File: ./docs/woo-com/notifications.md
=======================

# Configure notifications

To update the way notifications are sent for failed tests, navigate to the `Notification Settings` page under the `Quality Insights` menu:

![notification-settings-menu](_media/notification-settings-menu.png)

After making changes, click the `Update Settings` button at the bottom of the page:

![update-settings-button](_media/update-settings-button.png)

## Notifications by product

Notifications can be enabled and disabled both on a per-product basis as well as for all products that you sell in the store. To update these settings, select the specific product or select `All Products` to update notification settings for all of your products at once:

![notification-product-updates](_media/notification-product-updates.png)

## Notifications by test type

You can enable and disable notifications for each test types that is available by clicking on the toggle:

![test-notification-settings](_media/test-notification-settings.png)

## Customize email recipients

By default we'll send test result emails to your account email address. If you'd like to override and send these emails to other recipients, please add an optional comma-separated list of email addresses to send the tests results to.

![custom-email-list](_media/custom-email-list.png)

=======================
File: ./docs/woo-com/run-a-test.md
=======================

import TestTypes from '@site/src/components/TestTypes';

# Run a test

To start a new test, navigate to the `Run a Test` page under the `Quality Insights` menu:

![run-a-test-menu](_media/run-a-test-menu.png
On this page, you can configure the type of test to run, the product to run the tests against, and which release version:

![run-a-test-page](_media/run-a-test-page.png)

Once you've selected the type of test you'd like to run, the product to run it against, and the release version, click the `Confirm and run test` button at the bottom to queue up the test to be ran:

![run-a-test-start](_media/run-a-test-start.png)

Once the test has been queued up, you'll be redirected to the All Tests page and will see a success notification that the test has been created:

![test-created-notification](_media/test-created-notification.png)

:::tip
Note that it may take a moment before the test shows in the table. You can refresh the page or wait for the table to automatically refresh.
:::

The test will then be displayed in the table, showing the version of the extension, the selected test type, the selected WooCommerce Release version with a `Pending` status:

![pending-test-run](_media/pending-test-run.png)

Once the test has been picked up and the tests are running, the status will change to `Running`:

![running-test-run](_media/running-test-run.png)

---

More details on each the options available on the `Create a Test` page can be found below:

## Test type

Select the [type of test](/docs/managed-tests/introduction) you'd like to run. The current options are available:

<TestTypes />

## Product

Select the product you'd like to run the tests against. All products that you have submitted and are available on the WooCommerce Store will be listed in the dropdown.

## Release

Select the release versions of WooCommerce and WordPress you'd like to execute the tests against. Currently there are two options available:

- The most recent releases of WordPress and WooCommerce.
- The most recent release of WordPress and the latest release candidate version of WooCommerce.


=======================
File: ./docs/woo-com/viewing-test-results.md
=======================

import ViewIcon from '@site/src/img/view-icon.png';
import ShareIcon from '@site/src/img/share-icon.png';

# Viewing test results

To view the tests that were created and their results, navigate to the `All Tests` page under the `Quality Insights` menu:

![all-tests-menu](_media/all-tests-menu.png)

In the table on this page, all of the tests that you created will be shown in the list, starting with the most recent:

![all-tests-list](_media/all-tests-list.png)

## Filtering results

You can filter the test results shown in the table by selecting one of the three available filters at the top of the page:

![view-test-filters](_media/view-test-filters.png)

- Product: Filter by the product the tests were ran against.
- WooCommerce Release: Filter by the WooCommerce release version the tests were ran against.
- Test Types: Filter by the test type that was ran, such as woo-e2e or activation.

You can also search the tests by providing keywords such as the product, the version, the test type, status or release:

![search-tests](_media/search-tests.png)

## Viewing test logs

After a test run completes, you'll be able to view a variety of reports depending on the test type, and you can also share the link to the test results:

> <img src={ViewIcon} width="18"/> Click this icon to view the test results report.

> <img src={ShareIcon} width="16"/> Click this icon to copy a link to the test results to your clipboard to share with others.

### End-to-end tests

#### Successful runs

When an end-to-end test passes, you'll be able to view the report and see the tests that were ran by clicking on the view icon:

![e2e-success-log](_media/e2e-success-log.png)

This will open a modal that you can scroll through and see the results of each test that was ran:

![e2e-results-modal](_media/e2e-results-modal.png)

#### Failed test runs

If an end-to-end test run fails, an Allure test report will be generated. Click on the view icon to see the full details of the Allure test report:

![failed-e2e-test](_media/failed-e2e.png)

For more information on what the Allure test report contains, see [Understanding Allure test results](../managed-tests/woo-e2e#understanding-allure-reports)

### Security, Activation, and PHPStan tests

To view the test logs for these test types, click on view icon in the table for the extension test results you'd like to view:

![non-e2e-report-link](_media/non-e2e-report-link.png)

This will open a modal where you can view the test results. For example, a failed Security test would show the following in the modal:

![security-test-result](_media/security-test-result.png)

You'll also be able to view a log and share the result for successful tests as well:

![success-phpstan](_media/success-phpshan.png)

![success-phpstan-modal](_media/success-phpshan-modal.png)
