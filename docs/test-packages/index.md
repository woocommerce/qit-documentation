# Test Packages

Test Packages are the fundamental unit of test execution in QIT. They provide a deterministic, package-based approach to E2E testing for WordPress and WooCommerce extensions using Playwright.

## What are Test Packages?

A Test Package is a self-contained directory with:
- A `manifest.json` that declares its behavior
- Commands to execute during different lifecycle phases
- Optional requirements like secrets or dependencies
- Result specifications for test verification

## Two Types of Packages

### Test Packages
Execute actual tests and produce results. They must have:
- A `run` phase containing test commands
- Result paths for CTRF and artifacts

### Utility Packages
Provide environment setup and teardown without running tests. They:
- Have NO `run` phase
- Have NO result specifications
- Focus on environment preparation

## Why Test Packages?

**Deterministic Execution**: Every run follows the same predictable lifecycle
**Complete Isolation**: Database snapshots ensure packages can't interfere with each other (when running multiple packages)
**Comprehensive Orchestration**: Automatic lifecycle tracking and result generation
**CI-Optimized**: Smart output management for continuous integration
**Security Built-in**: Automatic secret validation and redaction

## Quick Start

1. Create a package directory with a `manifest.json`
2. Define your phases (setup, run, teardown)
3. Create a configuration file listing your packages
4. Run with `qit run:e2e`

## Core Principles

- **Packages execute in order**: The sequence in your configuration matters
- **Database isolation is automatic**: Each package gets a clean slate (with 2+ packages)
- **Secrets are validated upfront**: Fail fast if environment isn't ready
- **Results are mandatory for tests**: No results = test failure
- **Orchestration is transparent**: See exactly what's happening

## Documentation Structure

### Core Concepts
- [Concepts](./concepts.md) - Core concepts and architecture
- [Manifest Reference](./manifest.md) - Complete manifest.json specification
- [Lifecycle](./lifecycle.md) - Execution flow and phases

### Development
- [Development Workflow](./development-workflow.md) - Manual testing and iterative development
- [AI-Assisted Development](./ai-development.md) - Using AI to write and debug tests
- [Packages Guide](./packages.md) - Creating and organizing packages

### Execution
- [Commands](./commands.md) - CLI commands and options
- [Utility Packages](./utility-packages.md) - Environment setup without tests
- [Secrets](./secrets.md) - Managing sensitive data
- [Results](./results.md) - Test results and artifacts

### Deployment
- [CI/CD](./ci.md) - Continuous integration setup
- [Sharding](./sharding.md) - Parallelization strategies
- [Examples](./examples.md) - Complete working examples
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions