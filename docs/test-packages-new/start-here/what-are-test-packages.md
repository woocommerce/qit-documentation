# What are Test Packages?

**Test Packages** are the unit of execution in QIT for end-to-end (E2E) testing of WordPress/WooCommerce extensions. Each package is a **self-contained folder** with a manifest and commands for setup, running tests, and collecting results. QIT orchestrates these packages **deterministically** so you get repeatable, isolated runs with standardized output.

> **Key idea:** In Test Packages 2.0, you typically need **only one package type**—a *test package*. If you want to run only its setup logic (no tests), you can execute its **globalSetup** with `env:up --global-setup`. "Utility packages" exist but are an **advanced, rarely needed** escape hatch.

---

## Who is this for?

* Extension maintainers and QA engineers writing or running E2E tests
* CI/CD owners integrating tests into pipelines

**Prerequisites:** QIT CLI installed; Node/npm available; basic Playwright knowledge.

**Time to read:** ~5 minutes

---

## Why Test Packages?

* **Deterministic orchestration** – Known order, predictable lifecycle.
* **Built-in isolation** – Database snapshotting prevents cross-package contamination.
* **Standardized results** – CTRF JSON plus artifacts (screenshots, videos, traces).
* **CI-friendly output** – Clean logs by default, verbose on demand.
* **Security aware** – Required secrets validated up front and redacted automatically.

---

## What's in a Test Package?

A package directory typically contains:

* `manifest.json` – The contract: phases, results, requirements.
* Tests and config (e.g., Playwright files).
* Optional scripts (shell/JS) invoked by phases.

**Minimal manifest (test package):**

```json
{
  "$schema": "https://qit.woo.com/json-schema/test-package",
  "namespace": "your-extension-slug",
  "package": "e2e",
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": ["./bootstrap/global-setup.sh"],
      "setup": ["./bootstrap/setup.sh"],
      "run": ["npx playwright test"],
      "teardown": [],
      "globalTeardown": ["./bootstrap/global-teardown.sh"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob",
      "allure-dir": "./results/allure"
    }
  }
}
```

**Notes**

1. This page follows the **scaffold defaults** (e.g., `playwright-ctrf-json-reporter`, `./results/…` paths).
2. Test packages **must** define `run` and `results`.

---

## Core capabilities (at a glance)

* **Phases you can implement**

  * **globalSetup**: Runs once for the whole run (all packages). Sets the baseline.
  * **setup**: Runs before *this* package's tests.
  * **run**: Executes the tests (Playwright by default).
  * **teardown**: Cleanup for *this* package.
  * **globalTeardown**: Runs once at the very end.

* **Results you must produce (for test packages)**

  * **CTRF JSON** (required): machine-readable test summary/details.
  * **Blob artifacts** (recommended): screenshots, videos, traces, HTML reports.
  * **Allure results** (optional): advanced reporting.

* **Secrets (if needed)**

  * Declare in `manifest.json`; QIT validates before running and redacts values in output.

* **Venues (execution context)**

  * Commands can run on **host** (e.g., Node/npm) or **container** (e.g., WP-CLI).
  * QIT auto-detects by default; you can force a venue in advanced command objects.
  * See: *Venues: Host vs container execution*.

---

## How packages run (high-level)

1. **Environment setup** – WordPress, WooCommerce, PHP chosen versions; SUT installed.
2. **Secret & package validation** – Fail fast if anything's missing.
3. **globalSetup (all packages)** – Shared configuration for the entire run.
4. **Database snapshot** – Taken **after globalSetup** if there are **2+ packages**.
5. **For each package in order**
   a. **Restore DB** snapshot (packages 2..N) → clean slate.
   b. **setup → run → results → teardown** for that package.
6. **globalTeardown (all packages)** – Final cleanup.
7. **Post-processing** – CTRF merge, artifact collation, report generation.

> **Isolation model:** The **database** is restored before packages 2..N, so DB changes don't leak between packages. The **filesystem** is shared across packages (useful for passing files).

See: *Architecture & lifecycle* and *Orchestration & execution order*.

---

## Utility packages (rare; advanced)

A **utility package** has **no `run`** and **no `results`**—it exists only for setup/teardown. Prefer **test packages** instead and, when you want setup-only behavior, run **`env:up --global-setup`** to execute their globalSetup without running tests. Keep utility packages for the few cases where you must ship a setup-only artifact.

See: *Advanced → Utility packages (when—and only when—to use them)*.

---

## How do results look?

By convention (and scaffold defaults):

* CTRF JSON → `./results/ctrf.json`
* Blob artifacts → `./results/blob/` (screens, videos, traces, HTML)
* Optional Allure → `./results/allure/`

QIT merges per-package CTRF with lifecycle entries (globalSetup/setup/teardown) into a final report for the run.

See: *Results & artifacts → CTRF / Blob / Allure*.

---

## Typical workflows

* **Full orchestration** (ephemeral, isolated):
  `qit run:e2e <extension> [--config qit.json] [--profile ...] [--verbose] -- [playwright options]`

* **Manual development** (persistent environment):

  1. `qit env:up <extension> --global-setup`
  2. `source "$(qit env:source <env-id>)"`
  3. `npx playwright test --ui` (run tests interactively)

See: *Environment models: ephemeral (run:e2e) vs persistent (env:up)*.

---

## Quick checklist

* [ ] My package has a **manifest** with **`run`** and **`results`**.
* [ ] My Playwright config writes **CTRF** to `./results/ctrf.json`.
* [ ] Any required **secrets** are declared (and exported in CI).
* [ ] I understand the **order** of packages affects shared filesystem visibility, but **DB is reset** between packages after the first.

---

## What to read next

* **Quickstart:** Scaffold, run, and verify your first package.
* **Architecture & lifecycle:** The lifecycle map and what happens in each phase.
* **Orchestration & execution order:** How globalSetup, snapshots, and per-package restores work.
* **Package registry & versioning:** Publish and consume `namespace/package:version`.
* **Scaffold a test package:** Use `package:scaffold` and adopt the default structure.

---

**Last updated:** 2025-08-09