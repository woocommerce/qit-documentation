# Package capabilities (globalSetup / setup / run / teardown / globalTeardown)

**Why this matters:** Picking the *right* phase makes your suites fast, isolated, and debuggable. This page is your map.

**Time to read:** ~7 minutes

---

## TL;DR

* **globalSetup** — runs **once** before all packages; its DB changes are **snapshotted** (when 2+ packages), so every package starts from that baseline.
* **setup** — runs **before this package only**; DB changes are **rolled back** before the next package.
* **run** — executes your tests (Playwright, etc.). Only **test packages** have a `run` phase and **must** produce results (CTRF + blob dir).
* **teardown** — cleanup **after this package**; do light, local cleanup only.
* **globalTeardown** — runs **once** after all packages; final system-wide cleanup.

> Most teams can use **regular test packages** for everything, including environment prep (via `globalSetup`). "Utility packages" are advanced—and rarely needed.

---

## Phase-by-phase guide

### 1) globalSetup (one time, before all packages)

**Use for**

* Install/activate plugins, disable onboarding, set options
* Seed data that **every** package needs
* Configure gateways and global flags

**Isolation semantics**

* DB changes here are **captured in the snapshot** (when 2+ packages), so every package sees them
* Filesystem changes persist for the whole run

**Typical commands**

* `wp …` (container), quick scripts, small seeders

**Avoid**

* Heavy data loads that slow snapshotting
* Package-specific test data

**Example**

```json
{
  "test": {
    "phases": {
      "globalSetup": [
        { "command": "wp plugin install woocommerce-gateway-stripe --activate", "runs_on": "docker" },
        { "command": "wp option set my_plugin_testmode yes", "runs_on": "docker" }
      ]
    }
  }
}
```

---

### 2) setup (per-package, before run)

**Use for**

* Creating **package-specific** users/products/orders
* Toggling feature flags just for this package
* Preparing files/artifacts needed by this package

**Isolation semantics**

* DB changes are **rolled back** before the **next** package (thanks to restore)
* Filesystem changes persist for this run (shared across packages)

**Avoid**

* Global configuration that later packages depend on (put that in `globalSetup`)

**Example**

```json
{
  "test": {
    "phases": {
      "setup": [
        { "command": "wp user create testbuyer buyer@test.com --role=customer --user_pass=pass", "runs_on": "docker" },
        { "command": "node ./scripts/prepare-data.js", "runs_on": "host" }
      ]
    }
  }
}
```

---

### 3) run (per-package, tests execute here)

**Use for**

* Executing your test framework (e.g., `npx playwright test`)

**Requirements (test packages only)**

* `test.results.ctrf-json` and `test.results.blob-dir` **must** exist after the run
* Arguments after `--` on the CLI are passed to `run` commands

**Avoid**

* Doing setup here—keep setup in `setup` to make retries and isolation predictable

**Example**

```json
{
  "test": {
    "phases": {
      "run": [
        { "command": "npx playwright test", "runs_on": "host" }
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob",
      "allure-dir": "./results/allure"
    }
  }
}
```

---

### 4) teardown (per-package, after run)

**Use for**

* Cleaning **this** package's temp files
* Compressing artifacts, final transformations

**Isolation semantics**

* DB cleanup is usually unnecessary (the next package will restore)
* Filesystem cleanup is optional; prefer to keep artifacts for post‑processing

**Avoid**

* Deleting shared tools or global state other packages might need

**Example**

```json
{
  "test": {
    "phases": {
      "teardown": [
        { "command": "tar -czf results/blob/traces.tar.gz results/traces", "runs_on": "host" }
      ]
    }
  }
}
```

---

### 5) globalTeardown (one time, after all packages)

**Use for**

* Reverting flags set in `globalSetup`
* Final cleanup of data/files you *don't* want to keep in artifacts

**Isolation semantics**

* Runs after everything; no snapshot afterward

**Avoid**

* Deleting the artifacts/results the report needs

**Example**

```json
{
  "test": {
    "phases": {
      "globalTeardown": [
        { "command": "wp option delete my_plugin_testmode", "runs_on": "docker" }
      ]
    }
  }
}
```

---

## Compare phases at a glance

| Phase          | When it runs             | DB visibility                    | FS visibility (this run) | Typical commands                        |
| -------------- | ------------------------ | -------------------------------- | ------------------------ | --------------------------------------- |
| globalSetup    | Once before all packages | **Snapshotted** for all packages | Shared                   | `wp …`, light seed scripts              |
| setup          | Before *this* package    | Only this package (rolled back)  | Shared                   | `wp …`, gen test data, small host tools |
| run            | Tests for *this* package | Same as setup outcome            | Shared                   | `npx playwright test`                   |
| teardown       | After *this* package     | N/A (next package restores)      | Shared                   | compress/organize artifacts             |
| globalTeardown | Once after all packages  | N/A                              | Shared                   | final cleanup of global toggles         |

> **Timeouts & failures:** non‑`run` phases typically have shorter timeouts; `run` has the largest. If a phase fails, the package fails; orchestrator continues to the next package when appropriate.

---

## Decision guide — "Which phase should this go in?"

* **Does every package need this DB change?**
  → **globalSetup**
* **Only my package needs it?**
  → **setup**
* **This is executing tests / framework**
  → **run**
* **Local cleanup or artifact packing for my package**
  → **teardown**
* **Undo a global toggle or finalize shared setup**
  → **globalTeardown**

---

## Venues (where commands run)

Use `"runs_on"` for clarity:

* `"docker"` — inside the WP container (best for `wp`/PHP/CLI touching WordPress)
* `"host"` — your runner/CI host (best for `npm`, Node, Playwright, file ops)

If omitted, QIT uses **smart detection** (tries to run `wp` in container, `npm` on host). Being explicit is safer for portability.

```json
{ "command": "wp option set foo yes", "runs_on": "docker" }
{ "command": "npm ci", "runs_on": "host" }
```

---

## Patterns that scale

### A) "Global baseline + isolated data"

1. Put core configuration (plugins, options, testmode) in **globalSetup**
2. In each package `setup`, create only what that package needs
3. Keep `run` focused on tests; write CTRF and artifacts under `./results/…`

### B) "File hand‑off between packages"

* Produce a small JSON or text file in Package A (`./handoff/*.json`)
* Read it in Package B via `/app/handoff/*.json` from container commands
  (filesystem is shared within the run)

---

## Anti‑patterns (and better options)

| Anti‑pattern                                      | Why it hurts                              | Do instead                                                |
| ------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Creating package‑specific data in **globalSetup** | Leaks or slows every run                  | Move to **setup**                                         |
| Heavy seeding in **globalSetup**                  | Bloats snapshot, slow restores            | Seed only shared essentials; defer specifics to **setup** |
| Doing setup work in **run**                       | Conflates concerns; harder to retry/debug | Move prep to **setup**                                    |
| Calling `wp` on the host                          | May fail; context mismatch                | Use `"runs_on": "docker"`                                 |
| Cleaning DB in **teardown**                       | Wasted time; next package restores anyway | Skip DB cleanup; pack artifacts only                      |

---

## Results obligations (test packages)

If a package has a `run` phase, it **must** declare:

```json
"results": {
  "ctrf-json": "./results/ctrf.json",
  "blob-dir": "./results/blob"
}
```

Utility packages (no `run`) **must not** declare results.

---

## FAQ

**Can a package have only globalSetup and no run?**
Yes—use a regular test package and omit `run` when you only need global setup behavior for local development (e.g., `env:up --global-setup`). True "utility packages" are for rare, specialized cases.

**Why didn't my data persist to the next package?**
You likely created it in `setup` for Package A. The DB is restored before Package B. Move shared data to `globalSetup`, or pass a file via the shared filesystem.

**Where should I put long‑running data imports?**
Usually in `setup` of the specific package that needs them. Keep globalSetup lean to speed snapshotting and restores.

---

## See also

* **[Orchestration & execution order](./orchestration-and-execution-order.md)** — when snapshot/restore happens
* **[Venues: Host vs container](./venues-host-vs-container.md)** — choosing where to run each command
* **[Isolation semantics](./isolation-semantics.md)** — DB snapshot vs shared filesystem
* **[Environment models](./environment-models.md)** — ephemeral (`run:e2e`) vs persistent (`env:up`)
* **[Results & artifacts](./results-and-artifacts/)** — CTRF, blob artifacts, Allure

---

**Last updated:** 2025-08-09