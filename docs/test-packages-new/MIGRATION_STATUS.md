# Documentation Migration Status

Tracking migration from `/home/lucas/Downloads/anthropic-quickstarts/docs/` to `/home/lucas/automattic/docs-qit/test-packages-new/`

## Migration Status Table

| Source File | Target Location | Status | Notes |
|------------|-----------------|--------|-------|
| **Start Here Section** |
| 01-start-here-tutorial-first-end-to-end-multi-package-run.md | start-here/tutorial-first-multipackage-run.md | ✅ DONE | Tutorial for multi-package runs |
| start-here--package-registry-e-versioning.txt | start-here/package-registry-and-versioning.md | ✅ DONE | Already created manually |
| **Concepts Section** |
| 02-concepts-architecture-lifecycle.md | concepts/architecture-and-lifecycle.md | ✅ DONE | Core lifecycle documentation |
| orchestration-execution-order.txt | concepts/orchestration-and-execution-order.md | ✅ DONE | CRITICAL - Orchestration model |
| concepts-orchestration-execution-order-deep-dive.txt | concepts/orchestration-and-execution-order.md | 📝 TODO | Merge with above |
| venues-host-vs-container-execution.txt | concepts/venues-host-vs-container.md | ✅ DONE | CRITICAL - Execution venues |
| concepts-venues-host-vs-container-execution-comprehensive.txt | concepts/venues-host-vs-container.md | 📝 TODO | Merge with above |
| isolation-semantics-db-snapshot-vs-shared-filesystem.txt | concepts/isolation-semantics.md | ✅ DONE | DB vs filesystem isolation |
| package-capabilities-globalsetup-setup-run-teardown-globalteardown.txt | concepts/package-capabilities.md | ✅ DONE | Phase capabilities |
| environment-models-ephemeral-run-e2e-vs-persistent-env-up.txt | concepts/environment-models.md | ✅ DONE | Env models comparison |
| 03-concepts-results-artifacts.md | concepts/results-and-artifacts.md | ✅ DONE | Results overview |
| **How-To Section** |
| 04-how-to-scaffold-test-package.md | how-to-guides/scaffold-test-package.md | ✅ DONE | Detailed scaffolding guide |
| 05-how-to-configure-playwright-ctrf-output.md | how-to-guides/configure-playwright-ctrf.md | ✅ DONE | QIT-specific Playwright config |
| 06-how-to-run-only-globalsetup-locally.md | how-to-guides/run-only-global-setup.md | ✅ DONE | env:up --global-setup guide |
| 07-how-to-pass-playwright-options.md | how-to-guides/pass-playwright-options.md | ✅ DONE | Pass-through semantics |
| 08-how-to-capture-screenshots-videos-traces.md | how-to-guides/capture-screenshots-videos.md | ⚠️ REVIEW | May overlap with Playwright docs |
| 09-how-to-tune-timeouts-parallelism.md | how-to-guides/tune-timeouts-parallelism.md | ⚠️ REVIEW | Focus on QIT timeouts only |
| 10-how-to-ci-pipelines-github-actions.md | how-to-guides/ci-github-actions.md | ✅ DONE | GitHub Actions integration |
| **Meta** |
| 00-documentation-checklist.md | _internal/checklist.md | 📝 TODO | Documentation tracking |

## Priority Order

### CRITICAL (Do First)
1. ✅ orchestration-execution-order.txt → concepts/orchestration-and-execution-order.md
2. ✅ venues-host-vs-container-execution.txt → concepts/venues-host-vs-container.md
3. ✅ isolation-semantics-db-snapshot-vs-shared-filesystem.txt → concepts/isolation-semantics.md

### HIGH (Core Concepts)
4. ✅ 02-concepts-architecture-lifecycle.md → concepts/architecture-and-lifecycle.md
5. ✅ environment-models-ephemeral-run-e2e-vs-persistent-env-up.txt → concepts/environment-models.md
6. ✅ package-capabilities-globalsetup-setup-run-teardown-globalteardown.txt → concepts/package-capabilities.md

### MEDIUM (How-To Guides)
7. ✅ 01-start-here-tutorial-first-end-to-end-multi-package-run.md → start-here/tutorial-first-multipackage-run.md
8. ✅ 04-how-to-scaffold-test-package.md → how-to-guides/scaffold-test-package.md
9. ✅ 06-how-to-run-only-globalsetup-locally.md → how-to-guides/run-only-global-setup.md
10. ✅ 07-how-to-pass-playwright-options.md → how-to-guides/pass-playwright-options.md

### LOW (Review for overlap)
11. ⚠️ 05-how-to-configure-playwright-ctrf-output.md
12. ⚠️ 08-how-to-capture-screenshots-videos-traces.md
13. ⚠️ 09-how-to-tune-timeouts-parallelism.md
14. ✅ 10-how-to-ci-pipelines-github-actions.md
15. ✅ 03-concepts-results-artifacts.md

## Migration Guidelines

1. **Preserve original content** - Keep as much of the AI-generated text as possible
2. **Add cross-references** - Link to related concepts we've already created
3. **Ensure canonical paths** - Use `./results/ctrf.json`, `./results/blob/`, etc.
4. **Check for QIT-specific content** - Avoid Playwright documentation overlap
5. **Update formatting** - Ensure consistent markdown formatting

## Notes

- Files with `.txt` extension need markdown formatting
- Some files may need to be merged (e.g., two orchestration files)
- Review items marked ⚠️ for potential Playwright overlap

Last Updated: 2025-08-09