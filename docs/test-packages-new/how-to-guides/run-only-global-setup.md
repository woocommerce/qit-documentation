# How‑to: Run only `globalSetup` locally (`env:up --global-setup`)

Use this when you want a **ready WordPress/Woo environment** with your packages' **shared setup applied**, but **no tests running**. It's ideal for manual debugging, Playwright UI/codegen, and iterating on environment prep.

---

## What this mode does (and doesn't)

**Does**

* Boots an **ephemeral local environment** (containers, WP, Woo, your SUT).
* Executes **`globalSetup` from the packages you specify, in order**.
* Leaves the environment **running** for manual exploration.
* Makes **all changes persist** until you tear the env down.

**Does not**

* Run `setup`, `run`, or `teardown` phases.
* Create/restore **DB snapshots** (no per‑package isolation here).
* Produce **CTRF** or test artifacts (no tests run).

> You don't need "utility packages." Any **test package** can serve as setup‑only in this mode (only `globalSetup` is invoked).

---

## Typical use cases

* **Interactive development**: run Playwright **UI** / **codegen** against a live site.
* **Validate configuration**: confirm your `globalSetup` created users, products, options.
* **Repro bugs**: pin PHP/WP/Woo versions, poke manually, then codify as tests.
* **Fast iteration**: avoid orchestration overhead while you perfect setup scripts.

---

## Quick start

### 1) Create a minimal config listing your packages

```json
// dev-setup.json
{
  "test_packages": [
    "./packages/setup-and-seed",     // can be a normal test package
    "./packages/e2e"                 // only its globalSetup will run here
  ]
}
```

### 2) Bring the environment up and run only `globalSetup`

```bash
php qit-cli.php env:up woocommerce \
  --global-setup \
  --config=dev-setup.json \
  --php=8.2 --wordpress=6.4 --woo=latest
```

You'll get an environment id and URL:

```
Environment ready: qitenv_abc123
URL: http://localhost:32820
Credentials: admin/password
```

### 3) Load environment variables into your shell

```bash
source "$(qit env:source qitenv_abc123)"
```

Now you have: `$QIT_SITE_URL`, `$QIT_WP_ADMIN`, DB creds, etc.

### 4) Develop & debug

```bash
# Playwright UI against the live environment
npx playwright test --ui

# Or record a test
npx playwright codegen "$QIT_SITE_URL"
```

### 5) Tear down when done

```bash
php qit-cli.php env:down
```

---

## Execution semantics (the guarantees)

* **Order**: `globalSetup` runs **in the exact order** of `test_packages` in your config.
* **Venue**: `globalSetup` commands execute **inside the WP container** (WP‑CLI is available).
* **Persistence**: With `env:up`, **no snapshot/restore** occurs. DB & filesystem changes stick around until `env:down`.
* **Idempotency**: Because you'll likely re-run this mode, write `globalSetup` to be **safe on repeat**.

---

## Patterns that work great

### A simple shared setup

```json
// packages/setup-and-seed/manifest.json (excerpt)
{
  "package": "setup-and-seed",
  "namespace": "my-ext",
  "test_type": "e2e",
  "test": {
    "phases": {
      "globalSetup": [
        "wp option set woocommerce_task_list_hidden yes",
        "wp user get testcustomer >/dev/null 2>&1 || wp user create testcustomer test@test.com --role=customer --user_pass=test123",
        "wp wc product create --name='Simple Product' --regular_price=9.99 --user=1"
      ]
    }
  }
}
```

Run `env:up --global-setup`, then visit `/shop` and log in as `testcustomer`.

### Iterate quickly on tests

Leave the env running and execute tests manually without orchestration:

```bash
cd packages/e2e
npx playwright test --debug
# or run a single spec
npx playwright test tests/checkout.spec.js
```

### Mix local and registry packages

Your config can include local paths **and** published package identifiers. Only their `globalSetup` will run in this mode.

---

## Reruns & resets

* **Re-run your setup** (idempotency required):

  ```bash
  php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
  ```
* **Fresh start**:

  ```bash
  php qit-cli.php env:down
  php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
  ```
* **Reload a running env** (return to clean post‑SUT state):

  ```bash
  php qit-cli.php env:reload
  # then reapply setup if needed:
  php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
  ```

---

## When to use `env:up --global-setup` vs `run:e2e`

| Need                                                        | Use                     |
| ----------------------------------------------------------- | ----------------------- |
| A live site for manual testing, Playwright UI, or codegen   | `env:up --global-setup` |
| Rapid iteration on `globalSetup` commands                   | `env:up --global-setup` |
| **Per‑package DB isolation** + **CTRF** results + artifacts | `run:e2e`               |
| Deterministic CI orchestration with snapshots               | `run:e2e`               |

> Reminder: `run:e2e` takes a **snapshot after globalSetup** and **restores before each package** (when 2+ packages). `env:up` never snapshots.

---

## Tips for reliable `globalSetup`

* Prefer **WP‑CLI** for speed and determinism.
* Make steps **idempotent** (guard with lookups).
* Keep it **fast** (you'll re-run this often).
* **Log clearly** (`echo` helpful messages).
* If you need secrets, **declare them** in the manifest and ensure they're exported in your shell before running.

---

## Troubleshooting

**"wp: command not found"**
You're trying to run `wp` on the **host**. `globalSetup` runs **in the container**, so put WP‑CLI calls in `globalSetup` (not in host‑only scripts).

**My changes disappeared after reload**
`env:reload` resets to a clean base. Re-run `env:up --global-setup` to reapply.

**I expected CTRF or HTML reports**
This mode never runs tests. Use `run:e2e` to collect results.

**Wrong versions of PHP/WP/Woo**
Pass version flags:

```bash
php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json \
  --php=8.3 --wordpress=6.5 --woo=rc
```

---

## Copy‑paste recipes

**One‑off local experiment**

```bash
php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
source "$(qit env:source qitenv...)"
npx playwright codegen "$QIT_SITE_URL"
```

**Daily dev loop**

```bash
php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
source "$(qit env:source qitenv...)"
npx playwright test --ui
# iterate…
php qit-cli.php env:down
```

**Reset and try again**

```bash
php qit-cli.php env:reload
php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
```

---

## See also

* **[Environment models](../concepts/environment-models.md)** — ephemeral vs persistent runs
* **[Package capabilities](../concepts/package-capabilities.md)** — understanding phases
* **[Venues: Host vs container](../concepts/venues-host-vs-container.md)** — where commands run
* **[Tutorial: First multi-package run](../start-here/tutorial-first-multipackage-run.md)** — complete example

---

**Last updated:** 2025-08-09