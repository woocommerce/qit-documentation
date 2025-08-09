# Test Packages 2.0 Documentation

This is the new documentation structure for Test Packages 2.0, reflecting the actual implementation and addressing the gaps identified in the orchestration model, venues, and registry system.

## Documentation Structure

```
test-packages-new/
├── start-here/
│   ├── what-are-test-packages.md ✅
│   ├── package-registry-and-versioning.md
│   ├── quickstart-scaffold-run-verify.md
│   └── tutorial-first-multipackage-run.md
│
├── concepts/
│   ├── architecture-and-lifecycle.md
│   ├── orchestration-and-execution-order.md
│   ├── venues-host-vs-container.md
│   ├── isolation-semantics.md
│   ├── package-capabilities.md
│   ├── environment-models.md
│   └── results-and-artifacts/
│       ├── ctrf-reports.md
│       ├── blob-artifacts.md
│       └── allure-integration.md
│
├── how-to-guides/
│   ├── scaffold-test-package.md
│   ├── configure-playwright-ctrf.md
│   ├── run-only-global-setup.md
│   ├── pass-playwright-options.md
│   ├── capture-screenshots-videos.md
│   ├── add-validate-secrets.md
│   ├── tune-timeouts-parallelism.md
│   ├── run-packages-from-config.md
│   ├── debug-missing-test-output.md
│   ├── parse-use-ctrf-results.md
│   ├── handle-test-failures.md
│   ├── ci-github-actions.md
│   └── ci-other-platforms.md
│
├── reference/
│   ├── cli-commands/
│   │   ├── run-e2e.md
│   │   ├── env-commands.md
│   │   ├── package-commands.md
│   │   ├── validate-e2e.md
│   │   └── report-commands.md
│   ├── manifest-schema.md
│   ├── qit-json-schema.md
│   ├── environment-variables.md
│   ├── results-file-structures.md
│   └── limits-and-behaviors.md
│
├── operations/
│   ├── ci-mode-output-management.md
│   ├── performance-playbook.md
│   └── debugging-failures.md
│
├── advanced/
│   ├── utility-packages.md
│   └── matrix-profile-strategies.md
│
├── examples/
│   ├── multi-package-orchestration.md
│   ├── orchestration-verification.md
│   ├── checkout-flow-playwright.md
│   ├── payment-gateway-secrets.md
│   ├── rest-api-tests.md
│   ├── visual-regression.md
│   ├── mobile-projects.md
│   └── performance-k6-ctrf.md
│
├── release-notes-and-compatibility/
│   ├── changelog.md
│   ├── deprecations-migrations.md
│   └── compatibility-matrix.md
│
└── glossary-and-faq/
    ├── glossary.md
    └── faq.md
```

## Status

✅ = Complete
🚧 = In Progress
📝 = Planned

### Completed
- ✅ `start-here/what-are-test-packages.md` - Core introduction to Test Packages 2.0
- ✅ `start-here/quickstart-scaffold-run-verify.md` - Zero to working test package in minutes
- ✅ `start-here/package-registry-and-versioning.md` - Publishing and consuming packages

### Priority Items (Based on Gap Analysis)
1. 📝 `concepts/orchestration-and-execution-order.md` - Critical for understanding multi-package runs
2. 📝 `concepts/venues-host-vs-container.md` - Essential for debugging and command placement
3. 📝 `start-here/package-registry-and-versioning.md` - Core infrastructure understanding
4. 📝 `how-to-guides/debug-missing-test-output.md` - Common pain point
5. 📝 `how-to-guides/parse-use-ctrf-results.md` - Programmatic result handling

## Key Changes from Original Structure

### Elevated Topics
- **Orchestration** moved to prominent position in Concepts
- **Venues** added as first-class concept
- **Package Registry** promoted to Start Here section

### New Critical How-Tos
- Debug missing test output (addresses console.log confusion)
- Parse and use CTRF results programmatically
- Run packages from qit.json config
- Handle test failures (stop/continue rules)

### Expanded Results Section
- Separate pages for CTRF, Blob, and Allure
- Clear path diagrams and merge rules
- Canonical locations (`./results/...`)

## Canonical Choices (Per Scaffold)

- **Reporter:** `playwright-ctrf-json-reporter`
- **CTRF Path:** `./results/ctrf.json`
- **Blob Path:** `./results/blob/`
- **Allure Path:** `./results/allure/`
- **Pass-through:** Everything after `--` goes to run phase only
- **Venues:** WP-CLI in container, Node/npm on host (unless overridden)
- **Sharding:** Not supported under `run:e2e`

## Migration Notes

For teams moving from earlier test package examples:
- Replace `ctrf-playwright-reporter` with `playwright-ctrf-json-reporter`
- Move from `test-results/` to `results/` directory structure
- Update manifest to match Test Packages 2.0 schema

---

**Documentation Lead:** Lucas
**Last Updated:** 2025-08-09
**Version:** Test Packages 2.0