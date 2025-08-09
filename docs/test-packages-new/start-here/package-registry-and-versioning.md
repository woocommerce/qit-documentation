# Package registry & versioning

The **Package Registry** is how you **publish** and **consume** Test Packages across teams and CI systems. Each package is identified by:

```
namespace/package:version
```

* **namespace** — your extension slug (e.g., `woocommerce`)
* **package** — the package name you chose (e.g., `e2e`)
* **version** — a label or tag you assign on publish (e.g., `stable`, `rc`, `nightly`, or a semver-like string)

> **Guiding principle:** In Test Packages 2.0, the registry is **first-class**. Treat it as the single source of truth for distributing your tests.

---

## Who this page is for

* Maintainers who will **publish** packages
* CI owners who will **pull** packages into pipelines
* Developers who want to **pin** a specific package version

**Time to read:** ~5 minutes

---

## What the registry gives you

* **Distribution**: One canonical place to host your test packages.
* **Reproducibility**: Pin exact versions in CI (e.g., `namespace/e2e:stable`).
* **Separation of concerns**: Test authors publish once; consumers just reference.
* **Security**: Only maintainers can publish under their namespace (enforced by CLI).

---

## Identifier anatomy

```
woocommerce/e2e:stable
└─────────┬──────── └───┬───
   namespace            version (channel or tag)
             package name
```

Common patterns for `:version`:

* Channels: `stable`, `rc`, `nightly`
* Tags: `2025-08-09.1`, `wcpay-8.5.0`
* Semver-like: `1.2.3` (if you maintain versioned test suites)

> **Tip:** Use **channels** for workflows and **tags** for immutable snapshots.

---

## Publish a package

You can only publish under a namespace you maintain.

```bash
# From your package directory
qit package:publish ./packages/e2e
```

What happens:

1. The CLI validates your manifest and files.
2. It prompts you to **choose a version** (e.g., `stable`, `rc`, or a tag).
3. The package is uploaded and becomes available via the registry ID you just created.

**Best practices when publishing**

* Keep **paths and reporters** consistent with the scaffold:

  * CTRF → `./results/ctrf.json`
  * Blob artifacts → `./results/blob/`
  * Allure → `./results/allure/`
* Include a short **description** in `manifest.json` so consumers know what they're pulling.
* Declare **required secrets** in the manifest so missing credentials fail early.

---

## Discover and download packages

List available packages you can access:

```bash
qit package:list
# or
qit package:list --namespace=<your-namespace>
```

Download one:

```bash
qit package:download namespace/package:stable
# The CLI prints where it stored the package locally (copy that path)
```

Run it (pass the printed path to `--test-package`):

```bash
qit run:e2e woocommerce \
  --test-package "<downloaded-path>" \
  -- --project=chromium
```

> You can pass **multiple** `--test-package` flags to compose multi-package runs. QIT preserves the order you specify.

---

## Using the registry in CI

Two common patterns:

### 1) Explicit download, then run

```bash
# Step 1: download
qit package:download namespace/e2e:stable

# Step 2: run with the downloaded path
qit run:e2e woocommerce \
  --test-package "<downloaded-path>" \
  --verbose
```

### 2) Vendor into your repo (periodically)

* Mirror the package into `./packages/vendor/<namespace>/<package>/`.
* Reference it in `qit.json`:

  ```json
  {
    "test_packages": [
      "./packages/vendor/woocommerce/e2e"
    ]
  }
  ```
* Pros: faster builds, deterministic changes via PRs.
* Cons: you must keep the mirror fresh.

> **Pin versions**: Always pull a **specific version/tag** (e.g., `stable` or a dated tag) in CI for reproducibility.

---

## Versioning strategy (recommended)

* **stable** — Your default, well-tested package; CI for main branches should use this.
* **rc** — Release candidate; QA and pre-release checks run here.
* **nightly** — Latest changes; use for early validation jobs (non-blocking).
* **Tagged snapshots** — Immutable checkpoints tied to product releases (e.g., `8.5.0`).

**Promotion flow**

1. Publish to `nightly`
2. Soak/validate
3. Promote to `rc`
4. If green, promote to `stable`
5. Optionally tag with the product version (`8.5.0`)

---

## Replace or remove versions

* **Update (republish)**: Publish a new artifact to the same channel (e.g., re-publish `rc`) when iterating quickly.
* **Lock down**: Use immutable tags for anything that must never change (e.g., audits).
* **Delete** (admins/maintainers only):

  ```bash
  qit package:delete namespace/package:old-tag
  ```

> Prefer **deprecation** (stop referencing) over deletion in active pipelines.

---

## Compose multi-package runs from the registry

You can mix and match local and downloaded packages:

```bash
qit package:download yourns/base-setup:stable
qit package:download yourns/checkout:stable
qit package:download yourns/payments:rc

qit run:e2e woocommerce \
  --test-package "<path-to>/base-setup" \
  --test-package "<path-to>/checkout" \
  --test-package "<path-to>/payments" \
  -- --workers=1
```

**Execution guarantees**

* **Order matters** (top to bottom).
* **globalSetup runs across all packages first**, then a **DB snapshot** is taken (if ≥ 2 packages).
* For packages **2..N**, QIT **restores the DB** before each, ensuring isolation.
* The **filesystem is shared** across packages (useful for passing files).

---

## Security & provenance

* Only maintainers can publish under a namespace.
* Secrets are **declared** in the manifest and **validated** at run time.
* Secret **values are redacted** from output automatically.

---

## FAQ

**Can I run a registry package without downloading it first?**
Use `qit package:download` to materialize it locally, then pass the path to `--test-package`. (This keeps runs explicit and debuggable.)

**Do I still need "utility packages"?**
Rarely. Prefer a **test package** and, when you only want setup, run **`env:up --global-setup`** to execute its `globalSetup` without tests. Keep utility packages for edge cases only.

**How do I pick a version in CI?**
Pin to `stable` (or an immutable tag). Avoid floating to `nightly` unless the job is explicitly non-blocking.

**What if I have internal helpers shared by many packages?**
Publish a **base package** (e.g., `namespace/base-setup:stable`) that sets common config in `globalSetup`. Compose it first in your runs.

---

## Checklist

* [ ] I can publish under my **namespace**.
* [ ] I chose a **versioning strategy** (stable/rc/nightly + tags).
* [ ] CI **pins** to a specific version/channel.
* [ ] I know how to **download** and **compose** multiple packages.
* [ ] My package uses scaffold defaults for **results paths** and reporter.

---

## What to read next

* **Architecture & lifecycle** — What runs when (globalSetup, snapshot, per-package restore)
* **Orchestration & execution order** — Order guarantees; DB vs FS behavior
* **Quickstart** — Scaffold, run, verify CTRF
* **Results & artifacts** — CTRF, blobs, and Allure outputs

---

**Last updated:** 2025-08-09