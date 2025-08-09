# How‑to: Pass Playwright options with `--`

Use `--` to pass flags **straight to Playwright** while QIT handles orchestration. Everything **before** `--` is a QIT option; everything **after** `--` goes to the `run` phase commands (e.g., `npx playwright test`) of **every test package** that runs.

---

## TL;DR

```bash
# QIT options      ↓↓↓↓↓                  ↓↓↓↓↓ Playwright options
qit run:e2e woocommerce --config=qit.json -- --grep="@checkout" --workers=2 --headed
```

* QIT reads: `run:e2e`, `--config=qit.json`
* Playwright reads: `--grep="@checkout" --workers=2 --headed`

> The pass‑through args are appended to **each** `run` command in every **test package**. They are **not** applied to `setup`, `teardown`, or utility packages (which have no `run` phase).

---

## Common recipes

Filter tests by name/tag:

```bash
qit run:e2e woocommerce -- --grep="checkout"
```

Run headed (useful locally):

```bash
qit run:e2e woocommerce -- --headed
```

Change concurrency/workers:

```bash
qit run:e2e woocommerce -- --workers=4
```

Pick a specific project (from your Playwright config):

```bash
qit run:e2e woocommerce -- --project=chromium
```

Debug mode (inspector):

```bash
PWDEBUG=1 qit run:e2e woocommerce -- --project=chromium
```

Update snapshots:

```bash
qit run:e2e woocommerce -- --update-snapshots
```

Open the Playwright UI:

```bash
qit run:e2e woocommerce -- --ui
```

Run a single file (use your repo's paths):

```bash
qit run:e2e woocommerce -- tests/checkout.spec.ts
```

---

## Combining QIT and Playwright options

QIT options **must** come first; Playwright options **must** follow `--`.

```bash
qit run:e2e woocommerce \
  --config=qit.json \
  --php=8.2 --wordpress=6.4 --verbose \
  -- \
  --grep="@critical" --workers=2 --project=chromium
```

* The version flags (`--php`, `--wordpress`) affect the environment.
* The grep/workers/project flags affect how Playwright runs inside the package.

---

## How it works under the hood

* QIT splits arguments at the first `--`.
* Everything after `--` is passed to the **`run` phase** commands exactly as typed.
* If a package defines multiple `run` commands, QIT appends the pass‑through **to each** in order.
* Utility packages are unaffected (no `run` phase).
* If you forget `--`, QIT will try to parse Playwright flags as its own options → likely an error.

---

## Shell & quoting tips

* Prefer quotes for patterns with spaces:

  ```bash
  qit run:e2e woocommerce -- --grep="guest checkout"
  ```
* POSIX shells: either `'pattern'` or `"pattern"` is fine; Windows PowerShell may require double quotes.
* Place `--` **once**, after all QIT flags.

---

## What's **not** supported (important)

* **Sharding** under QIT orchestration:

  ```bash
  # Will be ignored with a warning under run:e2e
  qit run:e2e woocommerce -- --shard=1/3
  ```

  If you want to shard for local development, use a persistent env and run Playwright directly:

  ```bash
  php qit-cli.php env:up woocommerce --global-setup --config=dev-setup.json
  source "$(qit env:source qitenv...)"
  npx playwright test --shard=1/3
  ```

* **Non‑run phases**: your pass‑through flags do **not** apply to `setup`/`teardown`/`globalSetup`/`globalTeardown`.

---

## CI examples

GitHub Actions (filter to a fast subset):

```yaml
- name: Run critical subset
  run: |
    qit run:e2e woocommerce --config=qit.ci.json \
      -- --grep="@critical" --workers=4
```

Matrix by browser project:

```yaml
strategy:
  matrix:
    project: [chromium, firefox, webkit]

steps:
  - run: |
      qit run:e2e woocommerce --config=qit.ci.json \
        -- --project=${{ matrix.project }} --workers=2
```

---

## Troubleshooting

**"Unrecognized option: --headed"**
You probably forgot the splitter. Add `--`:

```bash
qit run:e2e woocommerce -- --headed
```

**"My grep did nothing."**

* Ensure your tests or suites contain the string you're grepping.
* Quote the pattern if it includes spaces or special characters.

**"I passed `--ui` in CI and the job hung."**
Playwright UI opens an interactive window; it's great locally, not for CI. Remove `--ui` in CI or run locally.

**"I want to shard for speed."**
QIT's `run:e2e` filters sharding flags for determinism. Use a CI matrix to split **packages** or run with `env:up` and call Playwright directly.

---

## Quick reference (Playwright flags you'll use most)

* `--grep="<pattern>"` Run tests whose titles match the pattern
* `--project=<name>` Use a specific project from `playwright.config`
* `--workers=<n>` Override worker count
* `--headed` Run browsers in headed mode
* `--debug` / `PWDEBUG=1` Open inspector for debugging
* `--update-snapshots` Regenerate visual/snapshot baselines
* `--ui` Interactive UI runner (local use)

---

## Pro tips

* Keep pass‑through flags **minimal and portable** so they work across all packages in the run.
* If you routinely need specific flags, consider adding **npm scripts** or per‑package defaults in `playwright.config` and use `--` just for ad‑hoc tweaks.
* For long filters, prefer **tags** in test names and grep those (e.g., `@checkout`, `@critical`).

---

## See also

* **[Configure Playwright & CTRF output](./configure-playwright-ctrf.md)** — reporter configuration
* **[Orchestration & execution order](../concepts/orchestration-and-execution-order.md)** — understanding phases
* **[Environment models](../concepts/environment-models.md)** — ephemeral vs persistent runs
* **[Tutorial: First multi-package run](../start-here/tutorial-first-multipackage-run.md)** — complete example

---

**Last updated:** 2025-08-09