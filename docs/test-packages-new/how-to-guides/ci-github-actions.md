# How‑to: CI pipelines with GitHub Actions

Get your Test Packages running on GitHub Actions with fast feedback, reliable artifacts, and clear logs. This guide gives you **copy‑paste workflows**, explains **why** each step exists, and shows **safe ways to scale**.

---

## Prerequisites

* A repository with at least one QIT Test Package and a working `qit.json`.
* Each **test** package's `manifest.json` declares results:

  ```json
  {
    "test": {
      "results": {
        "ctrf-json": "./results/ctrf.json",
        "blob-dir": "./results/blob"
      }
    }
  }
  ```
* Any required **secrets** exist in your repo/org settings (e.g. `STRIPE_TEST_KEY`).
* You can install QIT CLI non‑interactively:

  ```bash
  curl -sSL https://qit.io/install | bash
  ```

> Heads‑up: GitHub sets `CI=true` by default. QIT will auto‑enter CI mode (quieter output). Add `--verbose` to see everything.

---

## Minimal, copy‑paste workflow

**.github/workflows/qit-e2e.yml**

```yaml
name: QIT E2E

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch: {}

permissions:
  contents: read

concurrency:
  group: qit-e2e-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 45

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install QIT CLI
        run: |
          curl -sSL https://qit.io/install | bash
          qit --version

      - name: Run E2E (default profile)
        env:
          # Example secrets; add whatever your packages require
          STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
        run: |
          qit run:e2e woocommerce --config=qit.json --verbose

      - name: Upload QIT results (always)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: qit-results
          path: qit-results/
```

**What you get**

* Deterministic orchestration, CI‑friendly output.
* All artifacts (screens, videos, traces, HTML report) in `qit-results/`.

---

## Recommended caching (faster builds)

If your packages run `npm ci` in **setup**, cache npm & Playwright browser downloads:

```yaml
      - name: Cache npm
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
          key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-ms-playwright-${{ hashFiles('**/package-lock.json') }}
```

> If your package explicitly runs `npx playwright install`, this cache prevents re‑downloading browsers each run.

---

## Scale out: strategies that actually work

### 1) Version matrix (PHP / WordPress / WooCommerce)

```yaml
strategy:
  fail-fast: false
  matrix:
    php: ['7.4', '8.0', '8.2']
    wp: ['6.3', '6.4', 'latest']

steps:
  - name: Run matrix job
    run: |
      qit run:e2e woocommerce \
        --php=${{ matrix.php }} \
        --wordpress=${{ matrix.wp }} \
        --config=qit.json
```

### 2) Package matrix (run packages in parallel jobs)

This is the **safe** way to parallelize across packages.

```yaml
strategy:
  fail-fast: false
  matrix:
    package:
      - packages/checkout
      - packages/payment
      - packages/account

steps:
  - name: Run package
    run: |
      qit run:e2e woocommerce --config=${{ matrix.package }}/qit.json
```

**Why this and not sharding?**
Under `qit run:e2e`, test‑runner sharding is not supported. Use a matrix to get **true isolation** (each job has its own environment) and stable results.

### 3) Within a package: dial workers (careful)

Run more Playwright workers **inside** a single job:

```yaml
- name: Run with 4 workers
  run: qit run:e2e woocommerce --config=qit.json -- --workers=4
```

Use unique data per test or serialize suites that modify global state.

---

## Pass Playwright flags the right way

Everything after `--` goes to Playwright:

```yaml
- run: qit run:e2e woocommerce -- --grep="@smoke" --workers=2 --headed
```

Common flags:

* `--grep`, `--project`, `--workers`, `--update-snapshots`, `--ui`

> Remember: `--shard` is ignored under `run:e2e`.

---

## Secrets & environment

Declare in `manifest.json` → set in Actions:

```yaml
env:
  STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
  STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
```

Tips:

* Keep names descriptive (`STRIPE_TEST_SECRET`, not `SECRET`).
* Validate formats in setup (`node scripts/validate-secrets.js`).
* Use org‑level secrets for reuse across repos.

---

## Artifacts & reports

Always upload `qit-results/`:

```yaml
- name: Upload QIT results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: qit-results-${{ github.job }}-${{ github.run_attempt }}
    path: qit-results/
    retention-days: 14
```

Optional: also upload JUnit if your packages emit it (handy for annotations):

```yaml
- name: Upload JUnit (optional)
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: junit
    path: qit-results/junit.xml
```

---

## Debugging failures fast

### Turn up verbosity

```yaml
- run: qit run:e2e woocommerce --config=qit.json --verbose
```

### Open a live SSH session on failure (tmate)

```yaml
- name: Start tmate session (on failure)
  if: failure()
  uses: mxschmitt/action-tmate@v3
```

Connect per the step logs; inspect `/home/runner/work/.../qit-results/logs`.

### Download artifacts locally

```bash
gh run download --name qit-results
open qit-results/reports/index.html
```

**Hotspots to check**

* `qit-results/logs/execution.log` (orchestration)
* `qit-results/artifacts/html/` (Playwright HTML report)
* Screens, videos, traces under `artifacts/`

---

## Resource sizing & limits

* Set job cap to avoid hangers:

  ```yaml
  timeout-minutes: 45
  ```
* Start with **workers=2** on `ubuntu-latest`. Increase only if CPU/RAM allows.
* Recording **video/trace** increases disk/CPU. Keep "retain‑on‑failure" for CI.

---

## Reusable workflow (DRY across repos)

**.github/workflows/_qit-e2e-reusable.yml**

```yaml
name: QIT E2E (reusable)

on:
  workflow_call:
    inputs:
      config:
        required: true
        type: string
      php:
        required: false
        type: string
        default: '8.2'
      wp:
        required: false
        type: string
        default: 'latest'
      workers:
        required: false
        type: string
        default: '2'
    secrets:
      STRIPE_TEST_KEY:
        required: false
      STRIPE_TEST_SECRET:
        required: false

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install QIT
        run: curl -sSL https://qit.io/install | bash

      - name: Run
        env:
          STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
        run: |
          qit run:e2e woocommerce \
            --php=${{ inputs.php }} \
            --wordpress=${{ inputs.wp }} \
            --config='${{ inputs.config }}' \
            -- --workers=${{ inputs.workers }}

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: qit-results
          path: qit-results/
```

**Caller workflow**

```yaml
name: QIT E2E Matrix

on: [push, pull_request]

jobs:
  matrix:
    strategy:
      fail-fast: false
      matrix:
        php: ['8.1', '8.2']
        wp: ['6.4', 'latest']
        config:
          - qit.json
          - packages/checkout/qit.json
    uses: ./.github/workflows/_qit-e2e-reusable.yml
    with:
      php: ${{ matrix.php }}
      wp: ${{ matrix.wp }}
      config: ${{ matrix.config }}
      workers: '2'
    secrets:
      STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
      STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
```

---

## Common pitfalls & fixes

* **"Results not found …/ctrf.json"**
  Your `manifest.json` path doesn't match Playwright reporter output. Align paths or add a setup step to create the directory.

* **No console/test output in CI**
  QIT suppresses noisy logs when `CI=true`. Use `--verbose` for deep dives.

* **Parallel flakiness with `--workers>1`**
  Shared state collisions. Serialize mutating suites (`test.describe.configure({ mode: 'serial' })`) or generate unique data per test.

* **Large artifacts**
  Keep `video: retain-on-failure`, `trace: on-first-retry`. Optionally compress in `teardown`.

---

## Checklist

* [ ] Secrets added in repo/org settings and referenced in workflow.
* [ ] `qit.json` committed and points at real packages.
* [ ] Each test package writes CTRF + blob artifacts where the manifest says.
* [ ] Artifacts uploaded with `if: always()`.
* [ ] Concurrency cancel‑in‑progress enabled to save minutes.
* [ ] Matrix chosen (versions or packages) instead of sharding.
* [ ] Workers tuned for runner capacity; traces/videos trimmed for CI.
* [ ] `--` pass‑through used for Playwright flags.

With this setup, your GitHub Actions runs are **deterministic**, **fast**, and **well‑instrumented**—everything you need to trust the signal.

---

## See also

* **[Pass Playwright options](./pass-playwright-options.md)** — Using `--` for pass-through
* **[Orchestration & execution order](../concepts/orchestration-and-execution-order.md)** — Understanding multi-package runs
* **[Environment models](../concepts/environment-models.md)** — Ephemeral vs persistent
* **[Scaffold test package](./scaffold-test-package.md)** — Getting started

---

**Last updated:** 2025-08-09