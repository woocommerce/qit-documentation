# Introduction to Custom Tests

Custom Tests in QIT provide a powerful, package-based system for running E2E tests against WordPress and WooCommerce environments. This system ensures consistent, isolated, and reproducible test execution across different environments.

## What are Custom Tests?

Custom Tests are self-contained packages that define:
- Test execution commands
- Environment setup and teardown procedures
- Result collection specifications
- Secret requirements
- Dependencies and constraints

## Why Custom Tests?

- **Isolation**: Each test package runs in an isolated environment with database snapshots
- **Reproducibility**: Deterministic execution ensures consistent results
- **Flexibility**: Support for both test packages and utility packages
- **Security**: Built-in secret management with automatic redaction
- **Orchestration**: Comprehensive lifecycle management with automatic CTRF generation
- **CI/CD Ready**: Optimized output for continuous integration environments

## Package Types

### Test Packages
Packages that execute actual tests. They must include:
- A `run` phase for test execution
- Result specifications (CTRF and blob artifacts)

### Utility Packages
Packages that provide setup/teardown functionality without running tests. They:
- Do NOT have a `run` phase
- Do NOT have result specifications
- Are used for environment preparation and cleanup

## Key Concepts

### Phases
Each package can define execution phases:
- **globalSetup**: Runs once before all packages
- **setup**: Runs before this package's tests
- **run**: Executes the tests (test packages only)
- **teardown**: Cleanup after this package
- **globalTeardown**: Runs once after all packages

### Manifest
Every package requires a `manifest.json` file that defines its configuration, phases, and requirements.

### Orchestration
The orchestrator manages the entire test execution flow, providing:
- Visual feedback through a CLI UI
- Automatic CTRF generation for lifecycle phases
- Output management for CI environments
- Secret redaction from all outputs

## Getting Started

1. **Create a test package** with a manifest.json
2. **Define your phases** (setup, run, teardown)
3. **Specify result paths** for CTRF and artifacts
4. **Run your tests** using `qit run:e2e`

## Next Steps

- [Understanding Package Structure](./package-structure.md) - Learn how to structure your test packages
- [Writing Manifests](./manifest-schema.md) - Detailed manifest.json documentation
- [Running Tests](./running-tests.md) - How to execute your test packages
- [Lifecycle Management](./understanding-lifecycle.md) - Deep dive into execution phases
- [Secret Management](./secret-management.md) - Handling sensitive data securely
- [CI/CD Integration](./ci-integration.md) - Optimizing for continuous integration