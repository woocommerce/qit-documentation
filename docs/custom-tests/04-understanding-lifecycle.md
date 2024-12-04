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