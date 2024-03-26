# Running Tests from Other Plugins

:::info
The Custom Tests feature is coming soon.
:::

## Introduction

As we've seen in the Introduction guide, it's possible to install additional plugins when running a test.

If these additional plugins have uploaded custom tests, their bootstrap phases will run before the test starts,
which asserts that all plugins are fully configured as in a real-world scenario. This means that any guide,
initial overlay, tutorial, or external connections are handled by each plugin.

Each plugin, in it's own bootstrap process, will take care of bootstrapping itself.

## Running Tests from Different Plugins

By default, you can only run the tests from the plugins that you own. 

TODO.