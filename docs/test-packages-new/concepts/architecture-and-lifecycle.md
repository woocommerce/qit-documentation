# Architecture & lifecycle

This page explains how the QIT orchestrator is built, the exact order of operations during a run, and what guarantees you can rely on. If you understand this page, you understand the system.

---

## Design goals (what QIT optimizes for)

* **Determinism.** Same inputs → same execution plan → same results.
* **Isolation where it matters.** Database state is reset between packages; filesystem is shared for hand‑offs.
* **Framework‑agnostic.** Your tests run under your framework (Playwright by default), QIT only orchestrates.
* **Fast feedback.** Fail fast on configuration/secrets. Collect artifacts even when tests fail.
* **Security.** Secrets validated up‑front, injected as env vars, redacted in logs.

---

## High‑level architecture (components)

* **Orchestrator**
  Plans and executes the run: validates input, orders packages, runs phases, merges results, sets exit code.

* **Environment manager**
  Brings up/down WordPress+WooCommerce+PHP (Docker), installs SUT, applies environment options.

* **Package runner**
  Executes each package's phases (globalSetup, setup, run, teardown, globalTeardown) with venue selection (host vs container).

* **Secret manager**
  Aggregates required secrets across all packages, validates presence, injects into env, redacts in output.

* **Results aggregator**
  Collects package CTRF + artifacts, generates lifecycle CTRF entries, merges into a single `qit-results/ctrf.json` and an HTML report.

> Details on venue decisions are in **[Venues: Host vs container execution](./venues-host-vs-container.md)**.
> Isolation behavior is deep‑dived in **[Isolation semantics: DB snapshot vs shared filesystem](./isolation-semantics.md)**.

---

## Lifecycle - end-to-end timeline

```
┌────────────────────────────────────────────────────────────┐
│ 0) Run start: parse inputs & plan                          │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│ 1) Environment setup                                       │
│    • Start Docker stack (PHP, DB, WP, Woo)                 │
│    • Install SUT (local/wporg/url)                         │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│ 2) Validation gates (fail fast)                            │
│    • Secret validation (across ALL packages)               │
│    • Manifest validation (schema, phases, results rules)   │
│    • Package set validation (≥ 1 test package for run:e2e) │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│ 3) GLOBAL SETUP (once, all packages, in declared order)    │
│    • Mutations here create the shared baseline             │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│ 4) Snapshot baseline (only if ≥ 2 test packages)           │
│    • DB exported; used for fast restore per‑package        │
└──────────────┬─────────────────────────────────────────────┘
               ▼
        ┌──────┴─────────────────────────────────────────┐
        │ 5) PACKAGE LOOP (for each package in order)    │
        └─────────────────────────────────────────────┬──┘
                                                      ▼
   ┌───────────────────────────────────────────────────────────────────┐
   │ 5.1) Restore DB (skip for first package)                          │
   ├───────────────────────────────────────────────────────────────────┤
   │ 5.2) Setup (package‑scoped preparation)                           │
   ├───────────────────────────────────────────────────────────────────┤
   │ 5.3) Run (test packages only)                                     │
   ├───────────────────────────────────────────────────────────────────┤
   │ 5.4) Results collection (test packages only)                      │
   │      • Copy CTRF JSON and blob artifacts                          │
   ├───────────────────────────────────────────────────────────────────┤
   │ 5.5) Teardown (best‑effort cleanup; errors don't stop the run)    │
   └───────────────────────────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│ 6) GLOBAL TEARDOWN (once, all packages, in declared order) │
└──────────────┬─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│ 7) Post‑processing                                         │
│    • Merge lifecycle + package CTRF                        │
│    • Generate HTML report + finalize artifacts             │
│    • Compute exit code                                     │
└────────────────────────────────────────────────────────────┘
```

**Key timing notes**

* The snapshot is taken **after all globalSetup** steps finish, and **only** when there are 2+ test packages.
* The **first package** runs on the "live" baseline; subsequent packages start from the snapshot via restore.

---

## Phase semantics (what each phase is for)

* **globalSetup (once for the whole run)**

  * Purpose: establish the common baseline (e.g., install helper plugins, create users, set options).
  * Scope: changes **persist** to all packages via the snapshot.
  * Venue: typically **container** (WP‑CLI), though you can run host tasks too.

* **setup (per package)**

  * Purpose: prep work needed just before this package's tests (seed data, cache warmup, framework install).
  * Scope: DB changes are **isolated** to this package (next package restores the baseline).
  * Venue: mixed; npm on host, WP‑CLI in container.

* **run (test packages only)**

  * Purpose: execute tests (e.g., `npx playwright test`).
  * Must produce CTRF at the path declared in `test.results["ctrf-json"]`.
  * Artifacts (screenshots/videos/traces) should be under `test.results["blob-dir"]`.

* **teardown (per package)**

  * Purpose: cleanup for this package only (delete temp files, stop tools).
  * Failures are logged but don't abort the rest of the run.

* **globalTeardown (once for the whole run)**

  * Purpose: reverse globalSetup effects that shouldn't persist beyond the run.
  * Best‑effort; errors are reported but run completion proceeds.

> You rarely need a dedicated "utility package." Most "setup‑only" jobs can be implemented as **test packages** whose `globalSetup` does the work, and then you invoke them with `env:up --global-setup` when needed.

---

## Orchestration guarantees (contract you can build on)

* **Order is explicit and preserved.**
  Packages execute in the **exact order** you list in `qit.json` (or via `--test-package` flags).

* **Global baseline is consistent.**
  Everything done in globalSetup forms a single, coherent baseline snapshot shared by all packages.

* **Per‑package DB isolation.**
  Before each package (except the first), the DB is restored to the baseline snapshot. No DB leakage across packages.

* **Filesystem is shared.**
  The container filesystem is shared for the duration of the run. Files written by one package are visible to later packages (good for hand‑offs). Clean them up in teardown/globalTeardown if needed.

* **Secrets are available everywhere, safely.**
  Declared secrets are validated up‑front, injected for every phase, and redacted in output.

* **Results are always merged.**
  QIT merges lifecycle events + all package CTRF into a single report, even if some packages fail.

---

## Where commands run (venue model)

* QIT chooses a default venue per command; you can override with `runs_on`:

  * **Container (Docker)** for WordPress work (WP‑CLI, PHP scripts).
  * **Host** for local tooling (npm, Playwright CLI, file ops).
* Mixed sequences are common within the same phase.
* See the dedicated page **[Venues: Host vs container execution](./venues-host-vs-container.md)** for defaults, overrides, and gotchas (paths, tools, permissions).

---

## Data model & isolation

* **Database**

  * GlobalSetup ➜ snapshot (if 2+ test packages) ➜ per‑package restore.
  * Guarantees test reproducibility regardless of package order.
  * DB restores are fast (seconds).

* **Filesystem**

  * Shared across the full run.
  * Use it to pass large assets or cache between packages.
  * Remember to remove sensitive files in teardown/globalTeardown.

* **Environment variables**

  * Include QIT variables (e.g., `QIT_SITE_URL`) + your declared secrets.
  * Available to both host and container commands.

---

## Validation & failure semantics

**Early gates (stop the whole run on failure):**

* Environment bring‑up (Docker, SUT install)
* **Secret validation** (missing/empty secrets)
* **Manifest validation** (schema; test packages must declare results; utility packages must not)
* Snapshot creation

**Per‑package failures (continue to next package):**

* `setup`, `run`, `results collection`
  The failing package is marked failed; orchestrator moves on.

**Best‑effort (log, continue):**

* `teardown`, `globalTeardown`, some post‑processing steps

**Exit codes**

* `0` - All test packages passed
* `1` - Test failures or configuration errors
* `3` - Infrastructure failure (e.g., DB restore, Docker outage)

---

## Output & reporting

* **Lifecycle CTRF** - QIT emits test-like entries for each lifecycle command (`[globalSetup]`, `[setup]`, etc.), aiding traceability.
* **Package CTRF** - Your framework's CTRF file is collected from the path you declared.
* **Merged output** - Final artifacts live under:

  ```
  qit-results/
  ├─ ctrf.json               # merged
  ├─ artifacts/              # merged blobs (screens, videos, traces, html)
  ├─ logs/
  │  └─ execution.log
  └─ reports/
     └─ index.html
  ```
* **CI mode** - When `CI` is truthy, console noise is reduced; `--verbose` restores full logs.

---

## Performance & timeouts (defaults)

* Phase timeouts: **run** up to ~30 min, other phases ~5 min (typical defaults).
  You can tune your framework's own timeouts (e.g., Playwright `timeout`, `expect.timeout`).

* Parallelism:
  QIT orchestrates packages **sequentially**; test concurrency is inside your framework (e.g., `--workers` for Playwright). Sharding via `--shard` is **not supported** under `run:e2e`.

* Tips:

  * Cache dependencies (`npm ci` only if `node_modules` missing).
  * Use globalSetup for heavy one‑time work; keep per‑package setup lean.
  * Prefer traces/screenshots **on failure** to reduce artifact volume.

---

## Determinism checklist

To keep runs predictable:

* Put **shared configuration** in `globalSetup`.
* Keep **package‑specific data seeding** in `setup`.
* Always declare **results** for test packages:

  ```json
  "results": {
    "ctrf-json": "./results/ctrf.json",
    "blob-dir": "./results/blob"
  }
  ```
* Pin environment versions when reproducibility matters:

  ```json
  "environment": { "php": "8.2.13", "wordpress": "6.4.2", "woocommerce": "8.5.1" }
  ```
* Prefer **idempotent** commands (safe to re‑run).

---

## Minimal example (concepts in practice)

`qit.json`

```json
{
  "test_packages": [
    "./packages/setup-and-smoke",
    "./packages/checkout"
  ],
  "environment": { "php": "8.2", "wordpress": "latest", "woocommerce": "latest" }
}
```

* `setup-and-smoke/globalSetup`: install helper plugin + create test user
* Snapshot taken
* `checkout/setup`: create order fixtures
* `checkout/run`: run Playwright; CTRF at `./results/ctrf.json`
* Merge + report

---

## See also

* **[Orchestration & execution order](./orchestration-and-execution-order.md)** - concrete guarantees, ordering rules, and examples
* **[Venues: Host vs container execution](./venues-host-vs-container.md)** - how QIT decides where each command runs
* **[Isolation semantics](./isolation-semantics.md)** - DB snapshot vs shared filesystem details
* **[Environment models](./environment-models.md)** - `run:e2e` (ephemeral) vs `env:up` (persistent)

---

**Last updated:** 2025-08-09