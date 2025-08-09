# Orchestration & execution order

**Why this matters:** Test Packages 2.0 isn't just "run some tests." It's a deterministic **orchestrator** that coordinates multiple packages with strict rules about **order**, **state isolation**, and **result collection**. Understanding this model is the key to writing reliable suites.

**Who this is for:** Anyone composing more than one package (local paths or registry packages) in a single run.

**Time to read:** ~7 minutes

---

## TL;DR — Execution guarantees

* **Order is explicit**: Packages run **top-to-bottom** in the order you provide (via `--test-package` flags or `qit.json` lists).
* **Global phases**: `globalSetup` for *all* packages runs **once, first**. `globalTeardown` for *all* packages runs **once, last**.
* **Snapshot isolation** *(only if ≥ 2 packages)*:

  * QIT takes **one DB snapshot after all globalSetup** commands complete.
  * **Package #1** runs without a restore (it already starts from the snapshot baseline).
  * **Packages #2..N**: QIT **restores the DB** to that snapshot **before** each package.
* **Filesystem is shared** across packages; the **database is isolated** between packages (except anything created during `globalSetup`, which persists by design).
* **Result collection is merged**: Per-package CTRF is collected and merged with lifecycle results into `qit-results/ctrf.json`.

---

## The timeline (one run, N packages)

```
RUN START
│
├─ GlobalSetup (ALL packages, in declared order)
│    ⮑ Do cross-package, shared configuration here
│
├─ Take DB snapshot (only if ≥ 2 packages)
│
├─ Package 1
│    ├─ (no restore; already at baseline)
│    ├─ setup
│    ├─ run         (test packages only)
│    ├─ collect     (CTRF, blobs)
│    └─ teardown
│
├─ Package 2
│    ├─ restore DB snapshot   ← isolation begins here
│    ├─ setup
│    ├─ run
│    ├─ collect
│    └─ teardown
│
├─ … repeat for Packages 3..N (each begins with a restore)
│
└─ GlobalTeardown (ALL packages, in declared order)
    ⮑ Perform final cleanup that must run once
```

---

## What persists, what resets

| Surface                    | globalSetup → next phases | Between packages (#1→#2→…) | Notes                                                                                                                                                                              |
| -------------------------- | ------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Database**               | **Persists**              | **Resets** (restore)       | The snapshot is taken **after** all globalSetup steps finish. Everything created during globalSetup persists to all packages. Changes made in package #1 **do not** leak to #2..N. |
| **Filesystem (workspace)** | **Persists**              | **Persists**               | Use this to pass files between packages (e.g., `./packages/pkg-1/shared/…`).                                                                                                       |
| **Environment variables**  | **Persist**               | **Persist**                | QIT_* envs (e.g., `QIT_SITE_URL`) and exported variables remain available.                                                                                                       |
| **Secrets**                | **Available**             | **Available**              | Declared in manifests; validated once before execution; values are redacted in output.                                                                                             |

> **Rule of thumb:**
>
> * Put **shared, persistent setup** in **globalSetup**.
> * Put **package-local, disposable state** in **setup**/**run**.

---

## Choosing the right phase

* **globalSetup** (all packages, once):

  * Install/activate helper plugins
  * Create common users or base data visible to **every** package
  * Disable onboarding, banners, etc.
  * Keep it **fast** and **idempotent**—it gates the snapshot and the entire run
* **setup** (per package, after restore):

  * Seed data *only this package* should see
  * Prepare fixtures that must not leak to other packages
* **run** (per package; test packages only):

  * Execute your framework (e.g., Playwright) and produce CTRF + artifacts
* **teardown** (per package):

  * Clean **package-local** temporary files (the DB will be restored anyway)
* **globalTeardown** (all packages, once at the end):

  * Final cleanup that must run even if some packages failed

---

## Ordering & composition

You can compose with **local paths** and/or **registry packages**. Order is exactly what you declare.

* **CLI**:

  ```bash
  qit run:e2e woocommerce \
    --test-package ./packages/setup \
    --test-package ./packages/checkout \
    --test-package ./packages/payments
  ```
* **Config (`qit.json`)**:

  ```json
  {
    "test_packages": [
      "./packages/setup",
      "./packages/checkout",
      "./packages/payments"
    ]
  }
  ```

> **Tip:** Group **foundational setup** packages first (that only use globalSetup), followed by feature packages.

---

## Single-package runs vs multi-package runs

* **Single package**: No snapshot is taken; DB isolation between packages is irrelevant.
* **Two or more**: Snapshot is taken **once**; package #1 runs from that baseline; #2..N restore before their setup.

---

## Failure behavior (stop/continue rules)

| Phase                                                | Behavior on failure                                 |
| ---------------------------------------------------- | --------------------------------------------------- |
| Environment / Secret validation / Package validation | **Stop the entire run** immediately                 |
| **globalSetup** or **Snapshot**                      | **Stop the entire run** immediately                 |
| **setup / run / collect / teardown** (per package)   | **Stop that package**, continue to the next package |
| **globalTeardown**                                   | Log failure and continue finishing the run          |

* Final exit codes:

  * **0** — All test packages passed
  * **1** — Test failures or configuration errors
  * **3** — Infrastructure failures

> **Design your suites to tolerate per-package failure**: later packages still run, results are merged, and you can diagnose across the whole orchestration.

---

## Data exchange between packages (safe patterns)

* **Preferred**: Files in the **shared workspace** (e.g., `./packages/pkg-1/shared/…`)
  Use for handing off small artifacts or flags.
* **Avoid**: Relying on DB changes in package #1 to be visible to package #2—**they won't be** (by design).
* **Okay**: Use **globalSetup** for DB state that should be common to *all* packages.

---

## Arguments & pass-through

* Everything **before** `--` is handled by **QIT** (orchestration).
* Everything **after** `--` is passed **only to the run phase** (your test framework).

  ```bash
  qit run:e2e woocommerce \
    --test-package ./packages/checkout \
    -- --headed --grep='@smoke' --workers=2
  ```
* The pass-through **does not** affect globalSetup/setup/teardown phases.

---

## Parallelism & sharding

* **Package execution is sequential** in a single `run:e2e`. This keeps isolation guarantees simple and reliable.
* If you need concurrency:

  * Split packages across **multiple CI jobs** (matrix builds).
  * Use **framework-level parallelism** *inside a package* (e.g., Playwright workers).
* **Sharding** (`--shard`) is **not supported** under `run:e2e` orchestration.

---

## Anti-patterns to avoid

* **Heavy work in globalSetup**: it slows **every** run and delays the snapshot.
* **Relying on prior package DB state**: isolation will erase it.
* **Cleaning package DB state in teardown**: wasted effort; QIT restores anyway.
* **Multiple packages that each "half-configure" a feature**: prefer a single, clear setup in globalSetup or a dedicated base package.

---

## Checklists

**When adding a new package to a suite**

* [ ] Does it *need* cross-package state? If yes, move that to **globalSetup**.
* [ ] Does it rely on prior package DB changes? If yes, refactor; use FS or globalSetup.
* [ ] Are CTRF and artifact paths consistent with the standard scaffold?
* [ ] Are required **secrets** declared in the manifest?

**When debugging order/isolation issues**

* [ ] Confirm there are **≥ 2 packages** (snapshot only then).
* [ ] Verify the change was made **after** the snapshot point (i.e., not in globalSetup).
* [ ] Check shared FS paths are correct and accessible from both packages.
* [ ] Inspect `qit-results/logs/execution.log` for phase timing and restores.

---

## See also

* **[Architecture & lifecycle](./architecture-and-lifecycle.md)** — end-to-end flow and phase definitions
* **[Venues: Host vs container execution](./venues-host-vs-container.md)** — where commands run and why
* **[Isolation semantics](./isolation-semantics.md)** — Deep dive into DB vs filesystem behavior
* **[Results & artifacts](./results-and-artifacts.md)** — CTRF merge behavior and artifact collation
* **How-to: Run packages from qit.json** (coming soon) — composing larger suites cleanly

---

**Last updated:** 2025-08-09