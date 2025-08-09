# Environment models: ephemeral (`run:e2e`) vs persistent (`env:up`)

**Why this matters:** You'll switch between *ephemeral, fully‑orchestrated* test runs and a *persistent, debuggable* WordPress stack all the time. Picking the right model saves minutes per loop and avoids heisenbugs.

**Time to read:** ~6 minutes

---

## TL;DR

* **Ephemeral (default):** `qit run:e2e …`
  Spins up a clean environment, runs your packages in order with **DB snapshot/restore** between them, merges results, then **tears everything down**.

* **Persistent (local debugging):** `qit env:up`
  Starts a reusable environment you can enter/exec into. Use for **manual exploration, developing tests**, and running **only global setup**. Reset with `qit env:reload`. Stop with `qit env:down`.

> Most CI runs should be **ephemeral**. Use **persistent** locally while iterating on tests or plugin behavior.

---

## What "ephemeral" actually does (under the hood)

When you run:

```bash
qit run:e2e woocommerce \
  --test-package woocommerce/e2e:stable \
  --test-package my-co/checkout:beta
```

The orchestrator will:

1. **Provision** a fresh Dockerized WP + PHP stack and install the SUT (plugin under test).
2. **Run `globalSetup` once** across all packages.

   * If ≥2 packages, a **database snapshot** is taken after this step.
3. For **each package in order**:

   * Run `setup` → `run` → `teardown`.
   * **Restore the DB snapshot** before the next package (filesystem stays shared).
4. **Run `globalTeardown` once** after all packages.
5. **Post‑process results** (merge CTRF, collect blobs, optional Allure).
6. **Destroy** the environment.

**Best for:** CI, clean reproducibility, comparing packages in isolation, guaranteed orchestration.

---

## What "persistent" actually does

When you run:

```bash
qit env:up
```

QIT will:

* Start a **named local environment** (URL, creds, stack printed).
* Keep it **running** until you `env:down`.
* Let you **enter/exec** into the PHP container, and **source** helper env vars for manual testing.

Useful commands:

```bash
# See running envs
qit env:list

# Enter the PHP container shell
qit env:enter

# Exec a one-off command inside the container
qit env:exec -- wp plugin list

# Reset to the baseline created at env:up time
qit env:reload   # "post‑SUT setup state"

# Export shell-able env vars (URL, creds, etc.)
qit env:source   # prints a file path; `source $(qit env:source)` in your shell

# Stop and remove the running environment
qit env:down     # alias: env:stop
```

**Best for:** Local development, reproducing a flaky step interactively, iterating on Playwright code, or running **only `globalSetup`** to establish a baseline for manual flows.

> Want just the baseline toggles and seed data? See **[How‑to: Run only globalSetup locally](../how-to-guides/run-only-global-setup.md)**.

---

## Side‑by‑side comparison

| Dimension            | Ephemeral (`run:e2e`)                                  | Persistent (`env:up`)                                   |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| Lifecycle            | Create → run packages → post‑process → destroy         | Create → reuse → reload as needed → down                |
| Orchestration        | **Yes** (multi‑package, ordered)                       | **No** (you drive commands manually)                    |
| DB behavior          | Snapshot after `globalSetup`; restore between packages | `env:reload` returns to the **post‑SUT setup** baseline |
| Filesystem           | Shared for the whole run; discarded at the end         | Shared while env is up; persists until `env:down`       |
| Results (CTRF/blobs) | **Collected and merged automatically**                 | Not collected by `env:up` (you're not running packages) |
| Global phases        | `globalSetup` and `globalTeardown` run automatically   | Optional: run **only** `globalSetup` for a baseline     |
| Speed                | Fast overall, but full spin‑up each run                | Very fast iteration once up; occasional `reload` needed |
| CI readiness         | Designed for CI                                        | Local/dev only                                          |
| Typical use          | PR CI, nightly, partner feeds                          | Reproduce bug, step‑through admin UI, develop tests     |

---

## Common workflows

### 1) CI / Clean repro: ephemeral run of multiple packages

```bash
qit run:e2e woocommerce \
  --test-package my-co/smoke:stable \
  --test-package my-co/checkout:beta \
  --woo rc --wp rc

# After: view the merged report
qit report
```

* Guarantees **order** and **DB isolation** between packages.
* Produces CTRF + blobs; optional Allure directory if configured.

### 2) Local debugging loop: persistent env + manual steps

```bash
# Start and print URL/creds
qit env:up

# Open site, poke around, run admin steps

# Enter the container to run WP-CLI
qit env:enter
wp option get blogname
wp user create buyer buyer@example.com --role=customer --user_pass=pass

# Broke something? Back to baseline:
qit env:reload

# Done
qit env:down
```

### 3) Establish a local baseline via `globalSetup` only

Use this when you want the environment toggled like CI, but no packages executed.

* See **[How‑to: Run only globalSetup locally](../how-to-guides/run-only-global-setup.md)**.

---

## Choosing the right model

Use **ephemeral** when you need:

* Reproducibility and clean state
* Multi‑package **orchestration**
* **Results** automatically merged (CTRF, blobs, Allure)

Use **persistent** when you need:

* Fast, iterative **debugging**
* Manual inspection or data setup
* Trying Playwright selectors against a live admin

---

## Gotchas & tips

* **State leaks in persistent envs:** If something seems "haunted," run `qit env:reload` to reset to the baseline created at `env:up` time.
* **Results expectations:** Only **test packages** run via `run:e2e` must emit results. `env:up` by itself does **not** produce CTRF.
* **Speed:** Keep `globalSetup` light—big global seeds slow **both** snapshotting and per‑package DB restores in ephemeral runs.
* **Secrets:** Persistent envs are great for validating secret injection and local plugin keys before you push to CI.
* **Venues:** In persistent mode you'll often mix venues—`wp` inside the container, Playwright on the host. Be explicit via `"runs_on"` to avoid surprises.

---

## See also

* **[Architecture & lifecycle](./architecture-and-lifecycle.md)** — the full graph of phases and environment boundaries
* **[Orchestration & execution order](./orchestration-and-execution-order.md)** — how DB snapshot/restore interacts with packages
* **[Venues: Host vs container](./venues-host-vs-container.md)** — choosing where each command runs
* **[How‑to: Run only globalSetup locally](../how-to-guides/run-only-global-setup.md)**
* **How‑to: Debug missing test output** (coming soon)
* **Reference: CLI commands** (coming soon)

---

**Last updated:** 2025-08-09