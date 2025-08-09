# How‑to: Scaffold a test package (`package:scaffold`)

Spin up a **ready‑to‑run Playwright test package** in minutes. The scaffold command lays down a working manifest, Playwright config, bootstrap scripts, and an example test that already emits **CTRF JSON** and **blob artifacts**—so it integrates with QIT immediately.

---

## What this gives you

* A valid **`manifest.json`** wired for QIT (CTRF + blobs)
* Playwright configured to output CTRF to `./results/ctrf.json`
* Bootstrap scripts for **globalSetup**, **setup**, and **globalTeardown**
* A minimal example test
* Optional NPM scaffolding with the right dev dependencies

> It **does not** publish anything (that's `package:publish`), and it won't download browsers during scaffolding.

---

## Prerequisites

* **QIT CLI** installed and working
* **npm** on your PATH (the command checks this)
* You are a **maintainer of the namespace** (your extension slug)
* An empty target directory path (the command will create it)

---

## Command synopsis

```bash
php qit-cli.php package:scaffold [options] <target_dir>
```

**Required argument**

* `<target_dir>` — new directory to create (must not exist)

**Useful options**

* `--namespace=<slug>` — your extension slug; becomes `"namespace"` in `manifest.json`
* `--package=<name>` — package name; becomes `"package"` (default: `e2e`)
* `--framework=playwright` — only Playwright is supported right now
* `--test-type=e2e` — only `e2e` is supported
* `--only-manifest` — skip npm scaffolding; create just the manifest and bootstrap files
* `--config=<path>` — (optional) path to a `qit.json` you want to reference while creating

If you omit `--namespace` or leave `--package` as the default, the command will **prompt** you interactively.

---

## Typical workflows

### 1) Quick, non‑interactive scaffold

```bash
php qit-cli.php package:scaffold \
  --namespace=woocommerce \
  --package=checkout-smoke \
  packages/checkout-smoke
```

### 2) Manifest‑only (no npm files)

```bash
php qit-cli.php package:scaffold \
  --namespace=my-ext \
  --only-manifest \
  packages/utilities/dev-setup
```

Use this when you want to wire your own repo layout, but still want a validated manifest and bootstrap scripts.

### 3) Keep it simple (prompt me)

```bash
php qit-cli.php package:scaffold packages/e2e
# You'll be asked for the namespace (and optionally a package name).
```

---

## What gets generated

```
<target_dir>/
├─ manifest.json
├─ bootstrap/
│  ├─ global-setup.sh
│  ├─ setup.sh
│  └─ global-teardown.sh
├─ results/                 # output root used by the manifest
├─ package.json             # (unless --only-manifest)
├─ playwright.config.js     # (unless --only-manifest)
└─ tests/
   └─ example.spec.js       # (unless --only-manifest)
```

### manifest.json (wired for CTRF + blobs)

```json
{
  "$schema": "https://qit.woo.com/json-schema/test-package",
  "namespace": "your-namespace",
  "package": "your-package",
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": ["./bootstrap/global-setup.sh"],
      "setup": ["./bootstrap/setup.sh"],
      "run": ["npx playwright test"],
      "teardown": [],
      "globalTeardown": ["./bootstrap/global-teardown.sh"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "allure-dir": "./results/allure",
      "blob-dir": "./results/blob"
    }
  }
}
```

**Notes**

* `ctrf-json` and `blob-dir` are **required** for test packages.
* The scaffolded shell scripts are **pre‑intended to run in the container** (good place for WP‑CLI).
* `npx playwright test` runs on the **host** (good place for Node tooling).

### Playwright config (pre‑wired CTRF output)

The scaffold writes a `playwright.config.js` that:

* emits CTRF to `./results/ctrf.json` using `playwright-ctrf-json-reporter`
* writes blobs (HTML report, traces, etc.) under `./results/blob`
* includes Allure results under `./results/allure` (optional)

It also uses `process.env.QIT_SITE_URL` as the base URL so your tests automatically point to the environment QIT starts.

### Bootstrap scripts

* `bootstrap/global-setup.sh` — **container**: run once before all packages (good for disabling onboarding, seeding minimal data).
* `bootstrap/setup.sh` — **container**: runs before this package only (good for per‑package data).
* `bootstrap/global-teardown.sh` — **container**: clean up global changes.

Scripts are created with executable permissions. If your VCS strips exec bits, set them:

```bash
chmod +x bootstrap/*.sh
# and in Git:
git update-index --chmod=+x bootstrap/*.sh
```

---

## Verify the scaffold (2‑minute check)

1. **Validate**

```bash
php qit-cli.php validate:e2e <target_dir>
```

2. **Local dry run (single package)**

```bash
php qit-cli.php run:e2e woocommerce \
  --test-package "<absolute-or-relative-path-to-target_dir>"
```

3. **Open the report**

* Use your CLI shortcut (e.g., `qit report`) or open `qit-results/reports/index.html`.
* Confirm `qit-results/ctrf.json` exists and includes your example test and lifecycle steps.

---

## Run it end‑to‑end (with another package)

Create a second package (e.g., `packages/payment-smoke`) the same way, then:

```bash
php qit-cli.php run:e2e woocommerce \
  --test-package "$(pwd)/packages/checkout-smoke" \
  --test-package "$(pwd)/packages/payment-smoke"
```

You'll see:

* **Global setup** runs once
* **DB snapshot** taken
* Package 1 runs → Package 2 runs (with DB restore in between)
* QIT merges both packages' **CTRF** and **artifacts** into `qit-results/`

---

## Customize next

* Add Playwright projects (browsers/devices) to `playwright.config.js`
* Tune capture policy (screenshots/videos/traces) to control artifact size
* Add **secrets** your tests need and declare them in `manifest.json` → `requires.secrets`
* Move setup work between `globalSetup` (shared across packages) and `setup` (isolated per package)

> Remember: you can **use a standard test package as a "utility"** by running only its `globalSetup` with `env:up --global-setup`. Dedicated Utility Packages are an advanced edge case.

---

## Troubleshooting

**"Directory already exists"**
Pick a new `<target_dir>` or remove the existing folder.

**"You are not a maintainer of `<namespace>`."**
Use the extension slug you actually maintain (QIT checks this) or switch accounts.

**"npm must be installed and in $PATH"**
Install Node.js/npm; the scaffold installs dev dependencies unless you pass `--only-manifest`.

**Manifest validation failed**
Open `manifest.json`, fix the error, or re‑run the command. Keep `ctrf-json` and `blob-dir` paths as generated.

**No browsers downloaded**
By design, scaffolding doesn't download Playwright browsers. During a real run, QIT's environment handles execution; for local manual runs you can install browsers with `npx playwright install`.

**Scripts aren't executable in CI**
Ensure `bootstrap/*.sh` are executable in your repo: `git update-index --chmod=+x bootstrap/*.sh`.

**"Results not found" after a run**
Verify your Playwright reporter writes to `./results/ctrf.json` and that the path matches `manifest.json`.

---

## FAQ

**Can I rename folders?**
Yes, but make sure `manifest.json` and your Playwright reporter **paths match**.

**Do I need Allure?**
No. Allure is optional. CTRF + blobs are the required path for QIT.

**Can I skip the example test?**
Sure—replace `tests/example.spec.js` with your own.

**How do I publish the package?**
Use `php qit-cli.php package:publish <target_dir>` when ready.

---

## See also

* **[Quickstart: Scaffold, run, verify CTRF](../start-here/quickstart-scaffold-run-verify.md)** — end‑to‑end in one page
* **[What are Test Packages?](../start-here/what-are-test-packages.md)** — core concepts and guarantees
* **[Orchestration & execution order](../concepts/orchestration-and-execution-order.md)** — how QIT sequences packages and snapshots the DB
* **[Venues: Host vs container](../concepts/venues-host-vs-container.md)** — where your scripts run and why
* **[Configure Playwright & CTRF output](./configure-playwright-ctrf.md)** — reporter details and tuning
* **[Results & artifacts](../concepts/results-and-artifacts/)** — merge model, required files, and best practices

---

**Last updated:** 2025-08-09