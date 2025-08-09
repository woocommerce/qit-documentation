# Venues: Host vs container execution

**Why this matters:** Where a command runs changes what binaries exist, what paths are valid, and how you debug problems. Getting the venue right (Host vs Docker **container**) eliminates "`wp: command not found`", broken npm installs, and flaky file paths.

**Who this is for:** Anyone writing `manifest.json` phases or debugging setup/globalSetup behavior.

**Time to read:** ~6 minutes

---

## The two venues

* **Host**
  Your local machine/CI runner. Ideal for Node/npm, Playwright, file I/O, zipping, and anything that shouldn't mutate the WordPress container directly.

* **Container**
  The WordPress/PHP+WP‑CLI container managed by QIT. Ideal for `wp` commands, PHP scripts, DB seeding through WordPress, and site configuration.

---

## How QIT decides where a command runs

QIT uses **explicit control first**, then **smart detection**.

### 1) Be explicit (recommended)

Use the object form with `runs_on`:

```json
{
  "test": {
    "phases": {
      "setup": [
        { "command": "npm ci", "runs_on": "host" },
        { "command": "npx playwright install", "runs_on": "host" }
      ],
      "globalSetup": [
        { "command": "wp plugin install woocommerce-gateway-stripe --activate", "runs_on": "docker" }
      ]
    }
  }
}
```

You can also use the **string prefix** for simple cases:

```json
{
  "setup": [
    "[host] npm ci",                  // force host
    "wp option set blogname 'Shop'"   // runs in container by detection (see below)
  ]
}
```

> **Rule:** If `runs_on` is present or `[host]` prefix is used, that **always wins**.

### 2) Smart detection (when not explicit)

If you don't specify a venue, QIT chooses:

* **Container** when:

  * The command **starts with `wp`** (WP‑CLI)
  * The command path **ends with `.sh`** (convention: bootstrap scripts run in container)
* **Host** otherwise (npm, node, tar, echo, etc.)

> **Tip:** Prefer explicit `runs_on` for clarity in team/CI contexts.

---

## What you get in each venue

| Capability / Tool           | Host                      | Container                                 |
| --------------------------- | ------------------------- | ----------------------------------------- |
| Node / npm / npx            | ✅ (your machine/CI image) | ❌ (don't rely on it)                      |
| WP‑CLI (`wp …`)             | ❌ (not installed)         | ✅ (first‑class)                           |
| PHP/WordPress runtime       | ❌                         | ✅                                         |
| Access to `$QIT_*` env vars | ✅                         | ✅                                         |
| Access to declared secrets  | ✅ (redacted in logs)      | ✅ (redacted in logs)                      |
| Working directory (package) | repository path           | `/app` (package mounted inside container) |
| Network access to the site  | via `$QIT_SITE_URL`       | local HTTP + direct DB via WP environment |

> **Paths:** Inside the container, the package directory is mounted at **`/app`**. If you create `./test-data.json` on Host, you can reference it as `/app/test-data.json` inside the container.

---

## When to choose which venue

**Use Host for:**

* `npm ci`, `npx playwright …`, bundling, zipping, file transforms
* Long‑running JS tooling and Playwright reporters
* Generating CTRF/HTML/Allure **files** (paths live in your package workspace)

**Use Container for:**

* `wp plugin/theme …`, `wp user …`, `wp option …`
* Importing sample data (`wp import /app/sample.xml`)
* PHP/WordPress operations that mutate the site's DB

---

## Observability: how to tell where a command ran

* **CLI output prefix**: Host commands are shown as `\[host] …`.
  Container commands appear **without** the `[host]` prefix.
* **Logs**: See `qit-results/logs/execution.log` for phase/venue details.
* **Interactive container shell**: `qit env:enter` then run `wp --info`, `ls /app`.

---

## Common mistakes & quick fixes

| Symptom                                            | Likely cause                               | Fix                                                                   |
| -------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `wp: command not found`                            | Tried to run `wp` on Host                  | Mark the command as container: `runs_on: "docker"` or remove `[host]` |
| `npm: command not found` (or Playwright not found) | Tried to run Node inside container         | Run Node/npm on **Host** (`runs_on: "host"` or `[host]` prefix)       |
| File not found in WP‑CLI (`/app/...`)              | Used a Host path in container              | Use `/app/...` inside container; write the file on Host first         |
| Secrets printed in logs                            | Echoing raw values                         | They'll be **redacted** automatically; avoid custom echoing           |
| Global config didn't show up in tests              | Put into package `setup` instead of global | Move shared prep to **globalSetup** (container)                       |

---

## Patterns that work well

### 1) Standard JS + WP split

```json
{
  "test": {
    "phases": {
      "globalSetup": [
        { "command": "wp option set woocommerce_task_list_hidden yes", "runs_on": "docker" },
        { "command": "wp user create testcustomer test@test.com --role=customer --user_pass=test123", "runs_on": "docker" }
      ],
      "setup": [
        { "command": "npm ci", "runs_on": "host" },
        { "command": "npx playwright install chromium", "runs_on": "host" }
      ],
      "run": [
        { "command": "npx playwright test", "runs_on": "host" }
      ]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/blob",
      "allure-dir": "./results/allure"
    }
  }
}
```

### 2) Sharing files across venues

**Host** creates a file, **container** consumes it:

```json
{
  "setup": [
    { "command": "echo '{\"coupon\":\"TEST10\"}' > seed.json", "runs_on": "host" }
  ],
  "globalSetup": [
    { "command": "wp import /app/seed.json --authors=create", "runs_on": "docker" }
  ]
}
```

### 3) Shell scripts in container (bootstrap)

Scaffolded scripts such as `./bootstrap/global-setup.sh` are executed **inside** the container:

```json
{
  "globalSetup": ["./bootstrap/global-setup.sh"],
  "setup": ["[host] npm ci"]
}
```

---

## Checklists

**Before you run**

* [ ] Node/Playwright steps are **Host**
* [ ] `wp …` steps are **Container**
* [ ] Cross‑venue files live in the package and are referenced as `/app/...` in container
* [ ] Results paths (`ctrf-json`, `blob-dir`, `allure-dir`) are **Host** paths under your package

**When debugging**

* [ ] Scan the log for `[host]` vs no prefix
* [ ] If `wp` failed, ensure `runs_on: "docker"`
* [ ] If `npx` failed, ensure `runs_on: "host"`
* [ ] Verify the file exists in both venues (`ls ./…` on Host; `ls /app/…` in container)

---

## FAQ

**Can I run Playwright inside the container?**
Technically possible, but not supported/recommended. Keep Playwright on **Host** for consistency and speed.

**Do secrets/environment variables differ by venue?**
No—QIT injects them into both; values are redacted in logs.

**Does the venue change by phase automatically?**
No. There are conventions (e.g., many globalSetup tasks are WP‑CLI) and **smart detection**, but you should **declare `runs_on`** for reliability.

---

## See also

* **[Orchestration & execution order](./orchestration-and-execution-order.md)** — how phases line up across multiple packages
* **[Isolation semantics](./isolation-semantics.md)** — DB snapshot vs shared filesystem
* **[How‑to: Configure Playwright & CTRF output](../how-to-guides/configure-playwright-ctrf.md)** — keep results on Host so QIT can collect them

---

**Last updated:** 2025-08-09