# Isolation semantics: DB snapshot vs shared filesystem

**Why this matters:** Predictable isolation prevents test flakiness. In Test Packages, **database state resets between packages** while the **filesystem is shared**. Designing with that mental model is the difference between stable suites and spooky action at a distance.

**Who this is for:** Anyone orchestrating more than one package, or deciding where to place setup work.

**Time to read:** ~7 minutes

---

## TL;DR

* After **globalSetup**, QIT takes a **database snapshot** (when 2+ packages will run).
* Before each package (except the first), QIT **restores** that snapshot → every package starts from the same DB baseline.
* The **filesystem is shared across packages** within a single run (files created by one package are visible to others).
* Within a single package, changes persist across its phases (`setup` → `run` → `teardown`).
* With `env:up` (persistent environment) there is **no snapshot/restore** at all—DB and filesystem simply persist.

---

## The model at a glance

```
Run start
┌──────────────────────────────────────────────────┐
│ globalSetup (all packages) – shared, one time    │
└──────────────────────────────────────────────────┘
           │
           ├──► DB Snapshot created (if 2+ packages)
           │
     For each package in order:
           │
      (first package)      (subsequent packages)
   ┌──────────────────┐    ┌──────────────────┐
   │ No DB restore    │    │ DB restore to    │
   │ (already at base)│    │ baseline snapshot│
   └──────────────────┘    └──────────────────┘
           │                         │
      setup → run → teardown    setup → run → teardown
           │                         │
           ▼                         ▼
          Filesystem is shared across all packages in this run
```

---

## What resets vs what persists

| Scope                           | Database                        | Filesystem (package workspace, `/app`, `/tmp`) |
| ------------------------------- | ------------------------------- | ---------------------------------------------- |
| **Between packages (run:e2e)** | **Resets** to baseline snapshot | **Persists** (shared across packages)          |
| **Within a package**            | Persists across its phases      | Persists across its phases                     |
| **Between separate runs**       | Fresh environment               | Fresh environment                              |
| **`env:up` persistent session** | **Persists** (no snapshots)     | **Persists**                                   |

> **Rule of thumb:**
>
> * Put **shared, cross‑package DB configuration** into **globalSetup** (so it's captured in the snapshot).
> * Put **package‑specific DB mutations** into the **package's setup** (so they don't leak to other packages).
> * Use the **filesystem** to pass hand‑off artifacts between packages in the same run.

---

## Designing your phases with isolation in mind

### Use **globalSetup** for…

* One‑time WordPress/Woo configuration (e.g., activate plugins, disable onboarding).
* Seed data that **every package** should see.
* Payment gateway configuration using WP‑CLI.

> These DB changes will be **snapshotted** and available to all packages.

### Use **package `setup`** for…

* Data that must be **unique** to this package (test users, products for a specific flow).
* Temporary state you **don't** want to leak to other packages.

> These changes will be **rolled back** for the next package.

### Use the **filesystem** for…

* Cross‑package hand‑offs that shouldn't modify the DB (e.g., a JSON plan, a marker file, token caches, exported reports).
* Output that a later package validates or consumes.

> Files live under your package workspace (mounted at **`/app`** in the container) or `/tmp`. They remain visible to later packages within **this** run.

---

## Practical patterns

### 1) Cross‑package handshake via files

**Package A (setup/run):**

```bash
echo '{"coupon":"TEST10"}' > ./handoff/coupon.json   # host
```

**Package B (setup/globalSetup in container):**

```bash
wp wc coupon create --code="$(jq -r .coupon /app/handoff/coupon.json)" --amount=10
```

### 2) Shared config captured in the snapshot

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

All packages see Stripe enabled without reconfiguring it.

### 3) Per‑package test data that shouldn't leak

```json
{
  "test": {
    "phases": {
      "setup": [
        { "command": "wp user create pkg2_user pkg2@test.com --role=customer --user_pass=pass", "runs_on": "docker" }
      ]
    }
  }
}
```

This user exists only during **this** package. Next package starts from the snapshot (user gone).

---

## Common pitfalls (and fixes)

| Pitfall                                                  | Why it happens                    | Fix                                                                                          |
| -------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| Package B can't see data created by Package A            | DB was restored before B          | Move shared DB changes to **globalSetup** or persist via **filesystem** instead              |
| "It passed locally with `env:up`, fails in `run:e2e`"    | `env:up` never snapshots/restores | Replicate with `run:e2e`. If you need persistence, redesign around **globalSetup** or files  |
| Playwright asserts on a post created by previous package | DB isolation removes it           | Create that post in B's `setup`, or pass a **file artifact** from A for B to act upon        |
| Large globalSetup makes snapshot slow                    | Snapshot captures all DB changes  | Keep globalSetup lean; seed only what **every** package needs                                |
| Relying on `/tmp` between separate **runs**              | Filesystem resets between runs    | Use artifacts/reports saved under package paths for later retrieval, not cross‑run hand‑offs |

---

## Choosing between DB vs filesystem for cross‑package data

Use **DB** when:

* The next package must interact with the site through standard flows (admin/UI/API).
* The data is part of the site's canonical state for every package.

Use **filesystem** when:

* You only need to **signal** or **transfer** metadata (e.g., IDs, tokens, reports).
* You want to avoid DB coupling and speed up runs.

> Tip: For filesystem hand‑offs, prefer a small, structured file (JSON) in a known relative path under your package. Reference it as `/app/...` from container commands.

---

## How `env:up` changes the semantics

* **No snapshot/restore**: both DB and filesystem persist until you tear the env down.
* Perfect for **manual dev** and **iterative Playwright debugging**.
* Beware: sensitive state can accumulate. Before verifying with orchestration, always run `run:e2e` to validate isolation‑safe assumptions.

**Rule of thumb:**
Develop with `env:up`, **prove** with `run:e2e`.

---

## Checklist: make your suite isolation‑safe

* [ ] Anything **every** package needs lives in **globalSetup**.
* [ ] Package‑specific data created in package **setup** (not globalSetup).
* [ ] Cross‑package signals via **filesystem**, not DB (unless everyone truly needs that state).
* [ ] Results/outputs written to **Host** paths under your package (`./results/...`) so QIT can collect them.
* [ ] Fast globalSetup → small, deterministic snapshot.

---

## FAQ

**Why doesn't the first package get a DB restore?**
It already starts from the fresh environment immediately after the snapshot was taken.

**Can I force a restore before the first package?**
Not needed; the first package is already at baseline.

**Does the filesystem ever "snapshot"?**
No. It's shared during the **current run** only—fresh on the next run.

**We rarely need "Utility packages", right?**
Correct—most setups should be built as **regular test packages**. You can still run only their **globalSetup** when needed (`env:up --global-setup`). Reserve true Utility packages for rare, specialized cases.

---

## See also

* **[Orchestration & execution order](./orchestration-and-execution-order.md)** — when snapshot/restore happens in the sequence
* **[Venues: Host vs container](./venues-host-vs-container.md)** — where to run WP‑CLI vs npm/Playwright
* **[Environment models](./environment-models.md)** — ephemeral vs persistent runs

---

**Last updated:** 2025-08-09