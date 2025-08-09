# Results & artifacts

This page explains **what QIT collects from your packages**, how it **merges** everything into a single report, and the **guarantees** you can depend on. If you only remember one thing, make it this: **every test package must emit CTRF JSON and a blob artifact directory**, and QIT will do the rest.

---

## The three output channels

QIT recognizes three complementary outputs from a package:

1. **CTRF report (required for test packages)**
   The single source of truth for pass/fail, durations, suite/test names, messages, tags, etc.

2. **Blob artifacts (required for test packages)**
   Screenshots, videos, traces, HTML reports, logs—binary/non‑JSON assets linked from results.

3. **Allure results (optional)**
   Rich model for advanced triage timelines. Collected if provided; uploaded only when configured.

Utility‑only packages (no `run` phase) **must not** declare results.

---

## CTRF reports (required)

CTRF (Common Test Results Format) is how QIT understands your test outcomes across frameworks.

### What your package must produce

In its `manifest.json`:

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

**Rules**

* Paths are **relative to the package directory**.
* `ctrf-json` must exist and be **valid JSON** when the run phase finishes.
* `blob-dir` must exist (it can be empty, but QIT will warn if it is unexpectedly empty).

### Minimal CTRF shape (what QIT reads)

```json
{
  "results": {
    "summary": {
      "tests": 10,
      "passed": 9,
      "failed": 1,
      "skipped": 0,
      "start": 1704900000000,
      "stop": 1704900060000
    },
    "tests": [
      {
        "name": "Checkout > guest can purchase",
        "status": "passed",
        "duration": 3456,
        "suite": "Checkout",
        "message": "",
        "trace": ""
      }
    ],
    "tool": {
      "name": "playwright"
    }
  }
}
```

**Status values:** `passed`, `failed`, `skipped`, `pending`, `other`
**Nice‑to‑have:** `tags`, `filepath`, `retries`, `flaky`, `environment` (browser/os), `attachments` metadata

### Lifecycle CTRF (what QIT adds)

QIT emits additional "tests" for orchestration steps (setup/teardown, global phases) so timelines are complete:

```
[name]: "[globalSetup] utilities/setup: wp plugin install helper"
[status]: "passed" | "failed"
[suite]: "lifecycle"
```

These entries appear alongside your framework tests in the **merged** report.

---

## Blob artifacts (required)

Artifacts are the "evidence" behind CTRF. Common types:

* **Screenshots** (failures, baselines)
* **Videos** (test run recordings)
* **Traces/har** (network/DOM tracing)
* **HTML reports** (framework‑specific)
* **Logs** (console, network, custom)

**Conventions**

* Put everything under the directory you declared as `blob-dir` (e.g., `./results/blob`).
* Structured subfolders help: `screenshots/`, `videos/`, `traces/`, `logs/`, `html/`.
* Use **"only‑on‑failure"** or "on‑first‑retry" capture modes to control size.
* QIT will merge these into `qit-results/artifacts/…` and de‑duplicate by package and filename.

**Security note**
QIT redacts secret *values* in logs, but **screenshots and videos can still reveal secrets** in the UI. Mask sensitive UI elements in tests or disable capture for those pages.

---

## Allure integration (optional)

If your package also produces Allure data, declare:

```json
{
  "test": {
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob",
      "allure-dir": "./results/allure"
    }
  }
}
```

**Behavior**

* QIT collects `allure-dir` and bundles it with the run results.
* If an Allure uploader is configured, QIT uploads **on failure** (and can skip on all‑green runs to save time).
* Allure is **supplemental**; CTRF remains the authoritative pass/fail source for exit codes.

---

## Merge model (how QIT produces one report)

1. **Per‑package collection**
   After a package's `run` phase, QIT copies:

   * CTRF JSON → temporary staging
   * Blob artifacts → staging (package‑scoped folder)
   * (Optional) Allure results → staging

2. **Lifecycle CTRF synthesis**
   QIT generates CTRF entries for lifecycle commands (`globalSetup`, `setup`, `teardown`, etc.).

3. **Single merged output**
   QIT writes **one** final tree:

```
qit-results/
├─ ctrf.json                 # merged lifecycle + all packages
├─ artifacts/                # merged blobs (per-package subfolders)
│  ├─ woocommerce/checkout-tests/
│  └─ woocommerce/payment-tests/
├─ logs/
│  └─ execution.log
└─ reports/
   └─ index.html             # merged HTML report
```

4. **Deduplication & namespacing**
   When filenames clash, QIT namespaces by package (and may add counters) to avoid overwrites.

5. **Ordering**
   The final CTRF is time‑ordered by the real execution timeline, so graphs and durations are meaningful across packages.

---

## Guarantees & failure semantics

* **Missing or invalid CTRF → package failure.**
  QIT marks the package failed and continues to the next package (the overall run may still continue).

* **Artifacts are collected even on failure.**
  If tests crash, whatever exists under `blob-dir` is still copied.

* **Utility packages never expect results.**
  If a package has no `run` phase, QIT **must not** see a `results` section.

* **Exit codes come from the merged CTRF + lifecycle status.**

  * `0` — All test packages passed
  * `1` — Test failures or results validation errors
  * `3` — Infrastructure issues (e.g., DB restore or Docker failed)

---

## Where to view results

* **Local HTML report**
  Generated under `qit-results/reports/index.html`.
  (If your CLI exposes a shortcut, e.g. `qit report`, use it to open.)

* **Programmatic consumption**
  Parse `qit-results/ctrf.json` to power dashboards, alerts, or to gate CI steps.
  The `summary` block gives totals; the `tests[]` array has per‑test details.

---

## Best practices

**1) Keep paths consistent and relative**

```json
"ctrf-json": "./results/ctrf.json",
"blob-dir": "./results/blob"
```

**2) Capture smartly**

* Screenshots: `only-on-failure`
* Videos: `retain-on-failure`
* Traces: `on-first-retry`

**3) Name tests meaningfully**

* Prefer `Suite > Scenario > Detail` naming; it improves triage and search.
* Add `tags` like `["smoke","critical","payments"]` for filtering.

**4) Create directories in setup**

```json
"phases": { "setup": [ "mkdir -p ./results/blob" ] }
```

**5) Don't clean too early**

* Avoid deleting artifacts in `teardown`. Let QIT collect first; compress later if needed.

**6) Control artifact size**

* Zip heavy traces in `teardown` *after* QIT collects, or instruct your framework to produce compressed outputs.

**7) Mask secrets in UI**

* Add CSS masks or blur for tokens, emails, or card data during screenshots.

---

## Troubleshooting

**"Results not found: ./results/ctrf.json"**

* Reporter not installed or wrong path.
* Path is absolute or not relative to the package directory.
* The test command wrote to another filename—align the manifest with your framework config.

**"Blob directory exists but is empty"**

* Expected if no failures and you capture on failure only. Otherwise, verify your framework's artifact settings and output directory.

**Corrupted JSON**

* Ensure your reporter flushes before process exit.
* Don't post‑process CTRF in place during teardown.

**Huge artifacts in CI**

* Switch to "only‑on‑failure".
* Prune traces to failing tests.
* Compress large folders post‑collection.

---

## How this interacts with orchestration

* **Lifecycle CTRF** makes globalSetup/setup/teardown visible in the final report (you can correlate setup work with test outcomes).
* **Isolation vs sharing** is reflected in artifacts:

  * DB is isolated per package run; CTRF from separate packages won't contaminate each other's counts.
  * Filesystem is shared—later packages can read files written by earlier ones; you'll see those artifacts across packages under `qit-results/artifacts/…`.

---

## Quick checklists

**For a new package**

* [ ] `ctrf-json` path exists and contains valid JSON
* [ ] `blob-dir` exists; screenshots/videos/traces configured
* [ ] `mkdir -p ./results/blob` in setup
* [ ] Meaningful test names + tags
* [ ] Secrets masked in UI artifacts

**For CI**

* [ ] Use CI mode (clean logs), `--verbose` when debugging
* [ ] Always upload `qit-results/` as artifact
* [ ] Alert on `failed > 0` in merged CTRF `summary`

---

## See also

* **[Orchestration & execution order](./orchestration-and-execution-order.md)** — where in the lifecycle QIT collects results
* **[Isolation semantics](./isolation-semantics.md)** — why blobs are shared while database is reset
* **[How‑to: Configure Playwright & CTRF output](../how-to-guides/configure-playwright-ctrf.md)** — reporter setup specifics
* **[How‑to: CI pipelines with GitHub Actions](../how-to-guides/ci-github-actions.md)** — CI integration

---

**Last updated:** 2025-08-09