# Quickstart: Scaffold, run, verify CTRF

This guide gets you from zero to a passing Test Package run—**with CTRF results you can trust**—in a few minutes.

**You will:**

1. Scaffold a Playwright-based test package
2. Run it under QIT orchestration
3. Verify CTRF + artifacts were produced
4. (Optional) Run only `globalSetup` in a persistent environment

> **Good to know:** You rarely need "utility packages." Use a **test package** for everything; when you only want setup, run its `globalSetup` with `env:up --global-setup`.

---

## Prerequisites

* **QIT CLI** installed and on your PATH
  (If you're running from source, replace `qit …` with `php qit-cli.php …`.)
* **Docker** running
* **Node & npm** available
* **Your extension slug** (namespace), e.g. `woocommerce`

---

## 1) Scaffold a package

Create an empty target directory (the command will create it) and run:

```bash
qit package:scaffold ./packages/e2e \
  --namespace=<your-extension-slug> \
  --package=e2e
```

What you get (key files):

```
packages/e2e/
├─ manifest.json
├─ bootstrap/
│  ├─ global-setup.sh
│  ├─ setup.sh
│  └─ global-teardown.sh
├─ tests/
│  └─ example.spec.js
├─ playwright.config.js
└─ results/            # will be populated on run
```

**Defaults baked into the scaffold**

* Playwright configured with **`playwright-ctrf-json-reporter`**
* CTRF → `./results/ctrf.json`
* Blob artifacts (screens, videos, traces, HTML) → `./results/blob/`
* Allure (optional) → `./results/allure/`

---

## 2) Run it (ephemeral, fully orchestrated)

Choose the extension you're testing (System Under Test), e.g. `woocommerce`, and run:

```bash
qit run:e2e woocommerce \
  --test-package "$(pwd)/packages/e2e" \
  --verbose \
  -- --project=chromium
```

**What happens**

1. QIT starts a clean WP/Woo environment
2. Validates your package & any required secrets
3. Runs **globalSetup** across all packages (you have one)
4. (If you had 2+ packages) takes a DB snapshot
5. Runs your package: **setup → run → results → teardown**
6. Merges results and generates the final report

> **Pass-through options:** Everything **after `--`** goes to your test framework's **run phase only** (here, Playwright).

---

## 3) Verify results

After the run:

* **Per-package outputs (inside your package)**

  * CTRF JSON: `packages/e2e/results/ctrf.json`
  * Artifacts: `packages/e2e/results/blob/` (screens, videos, traces, HTML)

* **Orchestrator outputs (root of your project)**

  ```
  qit-results/
  ├─ ctrf.json           # merged CTRF (lifecycle + tests)
  ├─ artifacts/          # merged blobs (from all packages)
  └─ logs/
     ├─ execution.log
     └─ debug.log
  ```

Open the report:

```bash
qit report
# or:
qit open
```

> **CI note:** In CI mode, output is concise by default. Use `--verbose` to see framework logs.

---

## 4) (Optional) Setup-only: persistent environment for dev

When developing tests, run only `globalSetup` and keep the environment alive:

1. Create a minimal config (e.g., `setup-only.json`):

```json
{
  "test_packages": [
    "./packages/e2e"
  ]
}
```

2. Start and run global setup:

```bash
qit env:up woocommerce --global-setup --config=setup-only.json
source "$(qit env:source <printed-env-id>)"
```

3. Iterate locally with Playwright:

```bash
npx playwright test --ui
```

4. When done:

```bash
qit env:down
```

**Behavior differences (quick):**

| Aspect                     | `run:e2e` (ephemeral) | `env:up --global-setup` (persistent) |
| -------------------------- | --------------------- | ------------------------------------ |
| DB snapshot                | Yes (if ≥2 packages)  | No                                   |
| Isolation between packages | Yes                   | N/A (no packages loop)               |
| Lifecycle                  | Full                  | globalSetup only                     |
| Best for                   | CI and full runs      | Local dev & debugging                |

---

## Common hiccups (fast fixes)

* **"Docker not found / cannot connect to daemon"**
  Start Docker and re-run. On CI, ensure `runs-on: ubuntu-latest` or install Docker.

* **Missing secrets**
  Declare under `"requires.secrets"` in `manifest.json` and export them before running:

  ```bash
  export STRIPE_TEST_KEY="sk_test_..."
  ```

* **No CTRF found**
  Ensure your Playwright config writes to `./results/ctrf.json` and the directory exists (the scaffold already does this). Don't delete results in teardown.

* **No logs in CI**
  Add `--verbose` to `qit run:e2e …`. Check `qit-results/logs/execution.log`.

* **Playwright sharding**
  `--shard` is **not supported** under `run:e2e`. You can use it when calling Playwright directly in a persistent env (`env:up`).

---

## What's next

* **Architecture & lifecycle:** The full sequence and guarantees
* **Orchestration & execution order:** globalSetup timing, DB snapshot/restore, FS vs DB
* **Results & artifacts:** CTRF format, blob layout, merged reports
* **Package registry & versioning:** Publish & consume `namespace/package:version`

**Tip:** Keep using the scaffold defaults (paths, reporter) across all examples so your team's mental model—and CI parsing—stay consistent.

---

**Last updated:** 2025-08-09