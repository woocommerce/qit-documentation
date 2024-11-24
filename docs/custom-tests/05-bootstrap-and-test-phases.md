import CustomTestsDiagram from '@site/src/img/custom-tests-diagram.png';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
# Bootstrap and Test Phases
The custom E2E tests feature is available as early-access.
## Introduction
The E2E Tests are structured to ensure that each plugin is tested in a clean environment while efficiently managing shared resources. The key phases are:
1. **Preparation Phase**
2. **Setup Phase**
3. **Teardown Phase**
4. **Shared Setup**
5. **Shared Teardown**
6. **Post-Processing**This progressive structure allows for a systematic approach to testing, starting from individual plugin setups to shared configurations.Here's the flow of execution:<img src={CustomTestsDiagram}/>
## The Preparation Phase
Before diving into the setup phases, the system prepares the testing environment:
- **Start Environment**: The Tester initiates the process.
- **Download Plugins and Themes**: All necessary plugins and themes are downloaded.
- **Start Docker Environment**: A Docker environment is initialized to ensure isolation.
- **Install WordPress**: WordPress is installed within the Docker environment.
- **Activate Plugins**: Plugins are activated.
- **Move Must-Use Plugins**: Any must-use plugins are moved to the appropriate directory.


## 1. Setup Phase
In the **Setup Phase**, you prepare everything your tests need and perform the initial setup of your plugin. This phase is specific to each plugin and ensures that any plugin-specific configurations are in place before the tests run.
### What to Include in the Setup Phase

- **Configure Onboarding Wizards**: If your plugin has an onboarding wizard, configure it to prevent it from appearing during tests.
- **Disable Data Consent Forms**: Remove any data consent prompts or initial setup screens.
- **Mock External Services**: If your plugin integrates with external services, set up mock responses or enable a development mode.
- **Install Themes**: If your tests require a specific theme, **install** it during this phase so it’s available during the Test Phase.
### Setup Files
You can use the following files in your setup phase:
#### `bootstrap.sh`

- A bash script that, if present, will be executed.
- Use `wp` (WP-CLI) commands and bash scripting to set up your environment.**Example:**
#### `bootstrap.php`

- A PHP file that, if present, will be executed.
- Note: WordPress is **not loaded** in the context of this file.
#### `mu-plugin.php`

- A must-use plugin file that, if present, will be copied to the `wp-content/mu-plugins` directory.
- This file runs on **all requests** during the E2E test.
- WordPress **is loaded** in the context of this file.
- For logic that should run only once, set a flag to prevent multiple executions.
### Where to Place the Setup Files
Place your setup files in the `bootstrap` directory within your E2E test suite:**Note:** You can organize your tests in any way that suits your project structure.


## 2. Teardown Phase
After your tests have run, the **Teardown Phase** is responsible for cleaning up any changes made during the Setup and Test Phases. This ensures that the environment is reset and ready for the next set of tests.
### What to Include in the Teardown Phase

- **Deactivate Plugins**: Deactivate any plugins activated during setup.
- **Remove Test Data**: Delete any test data or configurations added during testing.
- **Reset Mock Services**: Reset any mocks or stubs used for external services.
### Teardown Files
You can use the following files in your teardown phase:
#### `teardown.sh`

- A bash script that, if present, will be executed.
- Use `wp` (WP-CLI) commands and bash scripting to clean up your environment.
#### `teardown.php`

- A PHP file that, if present, will be executed.
- Note: WordPress is **not loaded** in the context of this file.
#### `mu-plugin.php`

- A must-use plugin file for teardown, if needed.
- Place any teardown logic that needs to run on all requests here.
- Remember to set flags to prevent multiple executions if necessary.
### Where to Place the Teardown Files
Place your teardown files in a `teardown` directory within your E2E test suite:


## 3. Shared Setup
The **Shared Setup** phase involves running setup scripts that are common across all plugins. This phase is useful for setting up shared dependencies or configurations that multiple plugins might require.
### What to Include in the Shared Setup Phase

- **Install Shared Themes or Plugins**: Install any themes or plugins that are required by multiple plugins.
- **Configure Global Settings**: Set up WordPress settings that are common across tests.
- **Prepare Shared Data**: Import or generate data that will be used by multiple plugins.
### Shared Setup Files
Place your shared setup scripts in the `shared-setup` directory:
#### `bootstrap.sh`

- Contains shared bash scripts for setting up the environment.
#### `bootstrap.php`

- Contains shared PHP scripts for setup.
#### `mu-plugin.php`

- Shared must-use plugin that runs during all requests.
### Where to Place the Shared Setup Files



## 4. Shared Teardown
After all plugin tests are completed, the **Shared Teardown** phase cleans up any shared resources or configurations set during the Shared Setup phase.
### What to Include in the Shared Teardown Phase

- **Deactivate Shared Plugins/Themes**: Remove any shared plugins or themes installed.
- **Reset Global Settings**: Revert any global settings to their defaults.
- **Clean Up Shared Data**: Delete any shared data that was created.
### Shared Teardown Files
Place your shared teardown scripts in the `shared-teardown` directory:
#### `teardown.sh`

- Contains shared bash scripts for cleaning up the environment.
#### `teardown.php`

- Contains shared PHP scripts for teardown.
#### `mu-plugin.php`

- Shared must-use plugin for teardown logic.
### Where to Place the Shared Teardown Files



## 5. The Entry Point
The `entrypoint.js` is a file that, if present, will be executed when your **Test Phase** starts. This is an ideal place to perform plugin-specific initializations, such as activating a theme that you have previously installed during the Setup Phase.
### Where to Place the Entry Point
Place the `entrypoint.js` in the root of your E2E test suite:


## 6. The Test Phase
This is where the actual testing happens. We utilize Playwright to interact with the browser and verify your plugin's functionality.
### Running Your Tests
By default, only the test phase of the plugin you're running tests from will be executed.
#### E2E Test Command
To run the E2E tests for your plugin without testing others, use:This command will:
- Run the **Setup Phase** and **Teardown Phase** of your plugin.
- Skip the test phases of other plugins.
#### Compatibility Test Command
To run a full compatibility test including other plugins, use:This command will:
- Run the **Shared Setup** and **Shared Teardown** phases.
- Execute the **Setup**, **Test**, and **Teardown** phases for all plugins that have tests published to QIT.


## Environment Variables
You can use environment variables in your tests to pass secrets or configurations without hardcoding them.Refer to the [Environment Variables](https://chatgpt.com/docs/environment/environment-variables) documentation for more information.

By structuring your documentation in this progressive manner, readers can build their understanding step by step. Starting with the basic setup and teardown processes, and then introducing shared setup and teardown concepts, allows users to grasp the foundational elements before moving on to more complex configurations.If you need further assistance or have any questions about implementing these phases, feel free to ask!