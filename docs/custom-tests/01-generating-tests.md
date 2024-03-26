# Generating Tests

:::info
The Custom Tests feature is coming soon.
:::

## Introduction

The QIT Local Test Environment allows you to generate custom end-to-end tests for your plugins. These tests are written using Playwright, a Node.js library for automating browsers.

```qitbash
qit run:e2e <your-plugin> --codegen
```

This command will start the test environment and open a browser window. You can interact with the browser and perform the actions you want to test. When you're done, you can copy and paste the test code and save it on your QIT Custom Test directory.

## QIT Custom Test Directory

The QIT Custom Test directory is where you will store your custom end-to-end tests. It can be located anywhere in your filesystem, as long as it has this expected structure:

```
.
└── <some-dir-name>
    ├── bootstrap (Optional)
    │   ├── bootstrap.php (Optional)
    │   ├── bootstrap.sh (Optional)
    │   └── must-use-plugin.php (Optional)
    └── tests
          ├── test-1.spec.js
          └── test-2.spec.js
```


Once you generate the test and save it, you can start a new test run with it:

```qitbash
qit run:e2e <your-plugin> <path-to-some-dir-name>
```