# How‑to: Configure Playwright & CTRF output

Make Playwright produce **exactly** what QIT needs: a CTRF JSON file and a directory of artifacts (screenshots, videos, traces, HTML, logs). This guide shows the recommended Playwright config, how it maps to your `manifest.json`, and the knobs to tune capture and performance.

---

## TL;DR (copy/paste setup)

### 1) Align your package manifest

```json
{
  "test": {
    "phases": {
      "setup": [
        "npm ci",
        "npx playwright install",      // or 'install chromium'
        "mkdir -p results/blob results/allure"  // make sure paths exist
      ],
      "run": ["npx playwright test"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob",
      "allure-dir": "./results/allure"
    }
  }
}
```

### 2) Pick ONE CTRF reporter and wire Playwright

#### Option A — `playwright-ctrf-json-reporter` (recommended if you used the scaffold)

```bash
npm i -D @playwright/test playwright-ctrf-json-reporter allure-playwright
```

```js
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './results/blob/html' }],
    ['playwright-ctrf-json-reporter', {
      outputDir: './results',
      outputFile: 'ctrf.json'
    }],
    ['allure-playwright', { resultsDir: './results/allure' }]
  ],
  outputDir: './results/blob/run',     // raw screenshots/videos/traces
  use: {
    baseURL: process.env.QIT_SITE_URL,
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: 'on-first-retry'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
```

#### Option B — `ctrf-playwright-reporter` (alternate)

```bash
npm i -D @playwright/test ctrf-playwright-reporter allure-playwright
```

```js
// playwright.config.js
module.exports = {
  testDir: './tests',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './results/blob/html' }],
    ['ctrf-playwright-reporter', { outputFile: './results/ctrf.json' }],
    ['allure-playwright', { resultsDir: './results/allure' }]
  ],
  outputDir: './results/blob/run',
  use: {
    baseURL: process.env.QIT_SITE_URL,
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    trace: 'on-first-retry'
  }
};
```

> Use **A or B**, not both. The only thing that matters to QIT is that **`./results/ctrf.json`** exists and **`./results/blob/`** contains artifacts.

---

## Path alignment checklist

QIT collects results based on the paths in your manifest. The **paths must match** what Playwright writes.

| Purpose             | In `manifest.json`                   | In Playwright config                                                |
| ------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| CTRF JSON           | `"ctrf-json": "./results/ctrf.json"` | Reporter writes `./results/ctrf.json`                               |
| Blob artifacts root | `"blob-dir": "./results/blob"`       | `outputDir: './results/blob/run'` and HTML to `./results/blob/html` |
| Allure (optional)   | `"allure-dir": "./results/allure"`   | `['allure-playwright', { resultsDir: './results/allure' }]`         |

**Tip:** Create missing directories in your `setup` phase (`mkdir -p …`) so Playwright and QIT never race on first run.

---

## Capture policy (screenshots, videos, traces)

Tune fidelity vs speed/size:

* **Screenshots**: `'only-on-failure'` is a good default.
* **Video**: Use `'retain-on-failure'` in CI and `'off'` locally to keep runs small.
* **Trace**: `'on-first-retry'` captures rich debugging only when needed.
* **Output Dir**: Point `outputDir` somewhere **inside** your blob dir (e.g., `./results/blob/run`) so QIT picks it up.

Example CI‑aware defaults:

```js
use: {
  screenshot: 'only-on-failure',
  video: process.env.CI ? 'retain-on-failure' : 'off',
  trace: 'on-first-retry'
}
```

---

## Multiple reporters (CTRF + HTML + JUnit)

You can emit extra formats without impacting QIT:

```js
reporter: [
  ['line'],
  // CTRF (required for QIT)
  ['playwright-ctrf-json-reporter', { outputDir: './results', outputFile: 'ctrf.json' }],
  // Optional: HTML under the blob tree
  ['html', { outputFolder: './results/blob/html', open: 'never' }],
  // Optional: JUnit for CI dashboards
  ['junit', { outputFile: './results/blob/junit.xml' }]
]
```

---

## Base URL, projects, and pass‑through args

* **Base URL**: Always use `process.env.QIT_SITE_URL` so tests run against the QIT environment automatically.
* **Projects**: Fine to use multi‑browser/device projects. Artifacts from all projects end up under your blob dir.
* **Pass options to Playwright**: Put QIT flags **before** `--` and Playwright flags **after** it:

  ```bash
  php qit-cli.php run:e2e woocommerce -- --grep="@smoke" --workers=2 --headed
  ```
* **Sharding**: Not supported under `run:e2e`. If you need shards, use `env:up` and run Playwright directly, or split across CI jobs.

---

## Verifying your setup

1. **Run locally with your package**

```bash
php qit-cli.php run:e2e woocommerce --test-package "$(pwd)/packages/checkout-tests"
```

2. **Check files**

* `qit-results/ctrf.json` (merged orchestrator + your CTRF)
* `qit-results/artifacts/…` (contains your `./results/blob` content)
* Your package folder contains `./results/ctrf.json` and `./results/blob/**` after the run

3. **Open report**

```bash
php qit-cli.php report
```

---

## Common pitfalls (and quick fixes)

**"Results not found: ./results/ctrf.json"**

* The reporter path doesn't match the manifest. Fix either side so both say `./results/ctrf.json`.
* Ensure you created the `results/` directory in `setup` (or let the reporter create it).

**Artifacts missing in QIT report**

* Your `outputDir` or HTML output folder is **outside** the blob dir. Keep them **under** `./results/blob`.

**Giant artifacts in CI**

* Turn video **off** locally and **retain-on-failure** in CI.
* Consider `trace: 'on-first-retry'` and clean up bulky reports in `teardown` (e.g., zip traces, remove intermediate logs).

**No console logs**

* Use Playwright's HTML report or `trace` viewer to see console output per step.
* Emit logs to files in your tests and save them under `./results/blob/logs`.

**Multiple CTRF reporters**

* Use **one** CTRF reporter. Duplicates can overwrite or conflict.

---

## Recommended Playwright skeleton

```js
import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './results/blob/html' }],
    ['playwright-ctrf-json-reporter', { outputDir: './results', outputFile: 'ctrf.json' }],
    ['allure-playwright', { resultsDir: './results/allure' }]
  ],

  outputDir: './results/blob/run',

  use: {
    baseURL: process.env.QIT_SITE_URL,
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
    trace: 'on-first-retry'
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
```

---

## Tips for multi‑package runs

* Put **shared** data seeding in **`globalSetup`** so it's captured in the snapshot.
* Put **package‑specific** data seeding in **`setup`**; it won't leak to other packages.
* Don't clean your `./results/**` inside `teardown`—QIT needs those files to collect.

---

## Frequently asked

**Do I need Allure?**
No. CTRF + blob artifacts are sufficient. Allure is optional and useful for rich historical dashboards.

**Can I change `ctrf.json` name or folder?**
Yes, but then change `manifest.test.results["ctrf-json"]` to match exactly.

**Where should the Playwright HTML report go?**
Under your blob dir (e.g., `./results/blob/html`), so QIT captures it.

**Can I write multiple CTRF files?**
Avoid it—emit a single CTRF file per package run.

---

## See also

* **[Results & artifacts](../concepts/results-and-artifacts.md)** — merge model, file expectations, best practices
* **[Scaffold a test package](./scaffold-test-package.md)** — get a ready‑to‑run package in minutes
* **[Pass Playwright options with `--`](./pass-playwright-options.md)** — CLI pass‑through patterns
* **[Orchestration & execution order](../concepts/orchestration-and-execution-order.md)** — why snapshot timing matters for your setup steps

---

**Last updated:** 2025-08-09