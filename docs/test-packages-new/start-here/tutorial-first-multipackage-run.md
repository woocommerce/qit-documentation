# Tutorial: your first end‑to‑end multi‑package run

This guided walk‑through gets you from zero to a **two‑package** run that demonstrates the three most important things about Test Packages:

1. **Order** — packages run in the order you declare
2. **Isolation** — the database resets between packages, but…
3. **Sharing** — the filesystem is shared across packages

You'll create two small Playwright packages, wire them up in `qit.json`, run them with `qit run:e2e`, and open the merged CTRF report.

---

## What you'll build

* **Package 1 — `01-welcome`**

  * Seeds a tiny bit of state in `globalSetup` (becomes the DB snapshot baseline)
  * Changes a DB option **in its own setup** (won't survive to Package 2)
  * Writes a marker file to `/tmp` (shared filesystem)
* **Package 2 — `02-verify`**

  * Verifies the shared marker file exists (proves shared FS)
  * (Optional) Asserts the DB was **restored** to the baseline snapshot

---

## Prerequisites

* Docker running
* Node.js + npm
* Playwright will download browsers on demand (we'll pin to Chromium)
* QIT CLI installed and working locally
* An extension slug you maintain (use it as your **namespace** in manifests). In examples below we'll use `your-extension`.

> If you already finished the Quickstart, you're good.

---

## 1) Project layout

Create a minimal workspace:

```
your-project/
├─ qit.json
└─ packages/
   ├─ 01-welcome/
   └─ 02-verify/
```

---

## 2) Package 1 — `01-welcome`

**Manifest** — `packages/01-welcome/manifest.json`

```json
{
  "package": "01-welcome",
  "namespace": "your-extension",
  "test_type": "e2e",
  "description": "Seeds baseline (snapshot), mutates DB in setup, writes shared file",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set blogdescription 'Snapshot baseline: hello from globalSetup'"
      ],
      "setup": [
        { "command": "mkdir -p ./results/blob", "runs_on": "host" },
        { "command": "wp option set blogdescription 'CHANGED by package 1 setup'", "runs_on": "docker" }
      ],
      "run": [
        "npx playwright test"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

**package.json** — `packages/01-welcome/package.json`

```json
{
  "name": "01-welcome",
  "private": true,
  "devDependencies": {
    "@playwright/test": "^1.45.0",
    "playwright-ctrf-json-reporter": "^0.0.6"
  },
  "scripts": {
    "test": "playwright test"
  }
}
```

**Playwright config** — `packages/01-welcome/playwright.config.js`

```js
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.QIT_SITE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  reporter: [
    ['playwright-ctrf-json-reporter', { outputFile: './results/ctrf.json' }],
    ['html', { outputFolder: './results/blob/html' }],
    ['line']
  ],
  outputDir: './results/blob',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
```

**Test** — `packages/01-welcome/tests/hello.spec.js`

```js
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Package 1 writes a shared marker file', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();

  const path = '/tmp/qit-multipackage-demo.txt'; // shared across packages
  const stamp = new Date().toISOString();
  fs.writeFileSync(path, `package-1-was-here @ ${stamp}\n`);
  test.info().annotations.push({ type: 'info', description: `Wrote ${path}` });
});
```

> Why this matters
>
> * `globalSetup` runs once for **all** packages and becomes the **snapshot baseline**.
> * The `setup` change ("CHANGED by package 1…") happens **after** the snapshot — it **won't** be visible in package 2.
> * The `/tmp` write proves the **shared filesystem** behavior.

Install deps (from the package dir or run them later during `setup`):

```bash
cd packages/01-welcome
npm ci
```

---

## 3) Package 2 — `02-verify`

**Manifest** — `packages/02-verify/manifest.json`

```json
{
  "package": "02-verify",
  "namespace": "your-extension",
  "test_type": "e2e",
  "description": "Verifies FS sharing and optional DB restore to baseline",
  "test": {
    "phases": {
      "setup": [
        { "command": "mkdir -p ./results/blob", "runs_on": "host" },

        // OPTIONAL: Assert the DB was restored to the snapshot baseline
        { "command": "test \"$(wp option get blogdescription)\" = \"Snapshot baseline: hello from globalSetup\"", "runs_on": "docker" }
      ],
      "run": [
        "npx playwright test"
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob"
    }
  }
}
```

**package.json** — `packages/02-verify/package.json`

```json
{
  "name": "02-verify",
  "private": true,
  "devDependencies": {
    "@playwright/test": "^1.45.0",
    "playwright-ctrf-json-reporter": "^0.0.6"
  },
  "scripts": {
    "test": "playwright test"
  }
}
```

**Playwright config** — `packages/02-verify/playwright.config.js`

```js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.QIT_SITE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  reporter: [
    ['playwright-ctrf-json-reporter', { outputFile: './results/ctrf.json' }],
    ['html', { outputFolder: './results/blob/html' }],
    ['line']
  ],
  outputDir: './results/blob',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
```

**Test** — `packages/02-verify/tests/fs-and-homepage.spec.js`

```js
const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('Package 2 sees the shared marker file and a working site', async ({ page }) => {
  const path = '/tmp/qit-multipackage-demo.txt';
  const exists = fs.existsSync(path);
  expect(exists).toBeTruthy(); // proves shared FS across packages

  const contents = exists ? fs.readFileSync(path, 'utf8').trim() : '';
  test.info().annotations.push({ type: 'info', description: `Found ${path}: ${contents}` });

  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
```

Install deps:

```bash
cd packages/02-verify
npm ci
```

---

## 4) Wire them up — `qit.json`

**qit.json** (at repo root)

```json
{
  "test_packages": [
    "./packages/01-welcome",
    "./packages/02-verify"
  ],
  "environment": {
    "php": "8.2",
    "wordpress": "latest",
    "woocommerce": "latest"
  }
}
```

> Order matters. QIT will run **01-welcome** first, then take/restore snapshots so **02-verify** starts from the baseline (not from package 1's setup changes).

---

## 5) Run the suite

From the project root:

```bash
qit run:e2e woocommerce --config=qit.json --verbose
```

You should see phases like:

* **GLOBAL SETUP** (runs `01-welcome`'s globalSetup; snapshot taken)
* **PACKAGE [1/2]: 01-welcome** (runs setup → run; writes `/tmp/qit-multipackage-demo.txt`; changes DB option)
* **DATABASE RESTORE** (baseline restored)
* **PACKAGE [2/2]: 02-verify** (optional DB assertion passes; Playwright test sees shared file)
* **POST‑PROCESSING** (CTRF merge, HTML report)

Typical summary:

```
Status: ✓ PASSED
Packages: 2/2 executed
Tests: 2 passed, 0 failed
```

---

## 6) Inspect results

* **Open the merged report**:

  ```bash
  qit report
  ```

  (or open `qit-results/reports/index.html`)

* **Artifacts** (screenshots, videos, traces) live under:

  ```
  qit-results/artifacts/
  ```

* **Merged CTRF**:

  ```
  qit-results/ctrf.json
  ```

Each package also kept its **own** CTRF at `packages/*/results/ctrf.json` as declared in each manifest.

---

## 7) What you just proved

* **Execution order** is deterministic: `01-welcome` → `02-verify`
* **Database isolation**: the "CHANGED by package 1 setup" edit did **not** leak into package 2 (the optional `wp option get` assertion proves it)
* **Shared filesystem**: `/tmp/qit-multipackage-demo.txt` written by package 1 was visible to package 2

---

## Troubleshooting (quick hits)

* **"Results not found"**
  Ensure each manifest has:

  ```json
  "results": {
    "ctrf-json": "./results/ctrf.json",
    "blob-dir": "./results/blob"
  }
  ```

  …and that your Playwright config writes CTRF **to that exact path**.

* **Playwright not found / browsers not installed**
  Add to `setup`:

  ```json
  { "command": "npm ci", "runs_on": "host" },
  { "command": "npx playwright install chromium", "runs_on": "host" }
  ```

* **WP-CLI not found**
  Run WP-CLI commands **in the container** with `"runs_on": "docker"` (as shown above), or place them in `globalSetup`.

* **CI output too quiet**
  Use `--verbose` or set `CI=true` and keep `--verbose` for full logs:

  ```bash
  CI=true qit run:e2e woocommerce --config=qit.json --verbose
  ```

---

## Optional: run only global setup for manual dev

You can reuse these same packages as environment setup by running only `globalSetup`:

```bash
qit env:up woocommerce --global-setup --config=qit.json
# then:
source "$(qit env:source qitenv...)"   # load env vars
npx playwright test --ui               # iterate locally
```

No separate "utility package" needed.

---

## Next steps

* Add a **third** package and prove isolation still holds
* Pass Playwright flags through QIT:

  ```bash
  qit run:e2e woocommerce -- --headed --workers=2
  ```
* Capture richer artifacts (screens, videos, traces) and explore them in the merged report
* Publish your packages to the **registry** and consume them by version

---

## See also

* **[What are test packages?](./what-are-test-packages.md)** — Core concepts
* **[Quickstart: Scaffold, run, verify CTRF](./quickstart-scaffold-run-verify.md)** — Fast setup with scaffolding
* **[Package registry & versioning](./package-registry-and-versioning.md)** — Publishing and consuming packages
* **[Orchestration & execution order](../concepts/orchestration-and-execution-order.md)** — Deep dive into multi-package orchestration

---

**Last updated:** 2025-08-09