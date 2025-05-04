# Introduction

**QIT Custom Tests** is a developer-friendly testing solution that lets WordPress plugin and theme authors ship their own end-to-end test suites. It eliminates environment setup hassles so you can focus on writing meaningful tests.

## Key Features

- **Write tests, not infrastructure code**: QIT handles Docker setup, WordPress configuration, and environment teardown
- **Playwright by default, flexible by design**: Built for Playwright but supports any test framework that outputs CTRF results
- **Multi-plugin orchestration**: Test multiple plugins in one environment with shared setup and isolated test cycles
- **Standardized Test Definition**: Each plugin includes a `qit-e2e.json` manifest file, defining how its tests integrate with and are executed by the QIT CLI. This file acts as the key configuration, ensuring compatibility with QIT Custom Tests.
- **Disposable Docker environments:** QIT builds a fresh WordPress instance for every run, then cleans up automatically.
- **Standardised reporting:** CTRF results are merged and surfaced consistently in local runs, CI pipelines, and marketplace checks.

## Compatibility Testing

QIT's orchestration system helps plugin and theme developers identify cross-plugin compatibility issues before they affect users. During the shared setup phase, each participating plugin performs its own initialization steps (e.g., a payment gateway plugin connects to its sandbox, another plugin dismisses the onboarding wizard they add, etc). QIT then captures a database snapshot of this fully prepared environment before systematically running each plugin's test suite in isolation. This approach reveals how plugins interact in real-world conditions while maintaining test isolation and separation of concerns.

- Validate your plugin against popular extensions your users likely have installed
- Test compatibility with different versions of companion plugins
- Ensure consistent functionality when multiple plugins modify the same WordPress areas

> **Industry adoption**  
> Leading plugin marketplaces—such as [WooCommerce.com](https://woocommerce.com)—use QIT to run **quality checks** on extensions submitted to their platforms. Making your E2E tests **compliant with the QIT Custom Test Specification** signals that your plugin is serious about quality and reliability, helps you pass automated reviews, and makes your product stand out in a crowded marketplace.