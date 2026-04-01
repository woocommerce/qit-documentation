---
description: "Complete reference for the test package execution lifecycle. Documents every phase in order: environment setup (Docker, WordPress, WooCommerce, PHP), secret validation (fail fast if missing), package validation, global setup (runs once for ALL packages), database snapshot (baseline for isolation), per-package loop (restore DB, setup, run, collect results, teardown), global teardown, post-processing (merge CTRF, generate reports). Covers CTRF generation for lifecycle phases, database isolation details (export ~3-5s, restore ~2-3s, includes DB only not filesystem), output modes (standard, CI, verbose), error handling matrix (which phases stop vs continue), and exit codes (0=pass, 1=fail, 3=infrastructure)."
---

# Lifecycle

The Test Package lifecycle is deterministic and predictable. Every execution follows the same sequence, ensuring reproducibility and isolation.

## Visual Overview

```
┌─────────────────────────────────────┐
│        Environment Setup            │
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│        Secret Validation            │ ← Fail fast if secrets missing
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│        Package Validation           │ ← Ensure valid configuration
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│       Global Setup Phase            │ ← Run once for all packages
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│       Database Snapshot             │ ← Baseline for isolation
└──────────────┬──────────────────────┘
               ▼
        ┌──────┴──────┐
        │  For each   │
        │   Package   │
        └──────┬──────┘
               ▼
┌─────────────────────────────────────┐
│      Restore Database (if not 1st)  │
├─────────────────────────────────────┤
│          Setup Phase                │
├─────────────────────────────────────┤
│       Run Phase (if test pkg)       │
├─────────────────────────────────────┤
│    Collect Results (if test pkg)    │
├─────────────────────────────────────┤
│         Teardown Phase              │
└─────────────────────────────────────┘
               ▼
┌─────────────────────────────────────┐
│      Global Teardown Phase          │ ← Run once after all packages
└──────────────┬──────────────────────┘
               ▼
┌─────────────────────────────────────┐
│         Post-Processing             │ ← Merge results, generate reports
└─────────────────────────────────────┘
```

## Phase Details

### 1. Environment Setup

QIT creates an isolated test environment:
- Spins up Docker containers
- Installs WordPress (specified version)
- Installs WooCommerce (specified version)
- Configures PHP (specified version)
- Installs the extension under test

### 2. Secret Validation

Before any code executes:
- Collects all required secrets from ALL packages
- Checks environment variables exist
- Fails immediately if any are missing
- Provides clear instructions for missing secrets

Example failure:
```
Missing required secrets:
  - STRIPE_TEST_KEY
  - WEBHOOK_SECRET

Set these environment variables:
  export STRIPE_TEST_KEY='your-key'
  export WEBHOOK_SECRET='your-secret'
```

### 3. Package Validation

Ensures configuration integrity:
- Validates all qit-test.json files
- Confirms test packages have results configuration
- Verifies utility packages don't have run phases
- Checks at least one test package exists (for run:e2e)

### 4. Global Setup Phase

Executes `globalSetup` from ALL packages:
- Commands run in package order
- Each command gets CTRF tracking
- Perfect for shared environment configuration
- Database changes persist to all packages

Common uses:
- Installing helper plugins
- Disabling onboarding wizards
- Creating test users
- Configuring payment gateways

### 5. Database Snapshot

Creates isolation checkpoint (only if multiple packages):
- Exports current database state
- Becomes the baseline for all packages
- Enables fast restoration
- Ensures reproducibility
- **Note**: Snapshot is only taken when there are 2+ packages

### 6. Package Loop

For each package in order:

#### 6.1 Database Restore
- Skipped for first package (already at baseline)
- Restores snapshot for all others
- Takes ~2-3 seconds
- Guarantees clean state

#### 6.2 Setup Phase
- Runs package's `setup` commands
- Package-specific preparation
- Each command tracked with CTRF
- Failures stop execution

#### 6.3 Run Phase
- Only for test packages
- Executes test commands
- Package generates its own CTRF
- Captures screenshots/videos

#### 6.4 Result Collection
- Only for packages with results defined
- Collected for both setup and run phases
- Copies CTRF JSON
- Copies blob artifacts
- Optional Allure collection
- Collected even on test failures
- Missing results = failure

#### 6.5 Teardown Phase
- Runs package's `teardown` commands
- Package-specific cleanup
- Each command tracked with CTRF
- Failures are logged but don't stop execution

### 7. Global Teardown Phase

Final cleanup for all packages:
- Executes `globalTeardown` from ALL packages
- Commands run in package order
- Each command gets CTRF tracking
- Last chance for cleanup

### 8. Post-Processing

Aggregates and finalizes results:
- Merges all CTRF files
- Generates HTML reports
- Creates shareable URLs
- Uploads Allure (if configured)
- Saves debug logs

## Execution Example

Given configuration:
```json
{
  "test_packages": [
    "./utilities/setup",
    "./tests/checkout",
    "./tests/payment",
    "./utilities/cleanup"
  ]
}
```

Execution sequence:

1. **Environment Setup** - Docker, WordPress, WooCommerce ready
2. **Secret Validation** - Check all 4 packages' required secrets
3. **Package Validation** - Verify checkout & payment are test packages
4. **Global Setup** - Run globalSetup from all 4 packages
5. **Database Snapshot** - Save baseline state
6. **Package: utilities/setup**
   - No restore (first package)
   - Run setup commands
   - Skip run (utility)
   - Skip results (utility)
   - Run teardown commands
7. **Package: tests/checkout**
   - Restore database
   - Run setup commands
   - Run tests
   - Collect results
   - Run teardown commands
8. **Package: tests/payment**
   - Restore database
   - Run setup commands
   - Run tests
   - Collect results
   - Run teardown commands
9. **Package: utilities/cleanup**
   - Restore database
   - Run setup commands
   - Skip run (utility)
   - Skip results (utility)
   - Run teardown commands
10. **Global Teardown** - Run globalTeardown from all 4 packages
11. **Post-Processing** - Merge results, generate reports

## CTRF Generation

The orchestrator automatically generates CTRF for lifecycle phases:

**Note**: Command execution contexts:
- `npm`/`npx` commands run on the host (where Node.js is installed)
- Everything else runs inside the Docker container (where WordPress lives)
- Override with `host:` or `docker:` prefix, or `runs_on` in object command format
- Phase timeouts: 30 minutes for run phase, 5 minutes for others

In Playwright tests, use [`@woocommerce/qit-runtime`](./concepts/runtime.md) for typed access to environment info (`qit.env.siteUrl`) and WP-CLI execution (`qit.wp()`).

### Lifecycle CTRF
Generated for:
- globalSetup commands
- setup commands
- teardown commands
- globalTeardown commands

Format:
```json
{
  "name": "[globalSetup] utilities/setup: wp plugin install helper",
  "status": "passed",
  "duration": 2341
}
```

### Test CTRF
Generated by test frameworks for:
- Individual test cases
- Test suites
- Test summaries

### Merged CTRF
Final report contains:
- All lifecycle CTRF
- All test CTRF
- Unified summary statistics

## Database Isolation Details

### Why Database Snapshots?

Without snapshots:
- Tests affect each other
- Order matters
- Debugging is hard
- Flaky tests

With snapshots:
- Complete isolation
- Order independent
- Predictable state
- Reliable tests

### Snapshot Performance

- **Export**: ~3-5 seconds
- **Restore**: ~2-3 seconds
- **Storage**: Temporary, cleaned after run

### What's Included?

Everything in the WordPress database:
- Posts, pages, products
- Options and settings
- Users and roles
- Plugin data
- Transients

### What's Not Included?

File system changes:
- Uploaded media files
- Plugin files
- Theme files
- Log files

## Output Modes

### Standard Mode
Full visibility:
```
┌─ PACKAGE [1/2]: tests/checkout:local ─────────
│ ➤ Setup phase
│ [host] npm install
│ added 234 packages in 5.2s
│ 
│ ➤ Run phase
│ [host] npx playwright test
│ Running 10 tests...
│ ✓ guest-checkout.spec.js (4.2s)
│ ✓ member-checkout.spec.js (3.8s)
└────────────────────────────────────────────────
```

### CI Mode
Suppressed output:
```
┌─ PACKAGE [1/2]: tests/checkout:local ─────────
│ [host] npm install
│ [host] npx playwright test
└────────────────────────────────────────────────
```

### Verbose Mode
Override suppression:
```bash
CI=true qit run:e2e woocommerce --config=test.json --verbose
```

## Error Handling

### Phase Failures

| Phase | Failure Behavior |
|-------|-----------------|
| Environment Setup | Stop immediately |
| Secret Validation | Stop immediately |
| Package Validation | Stop immediately |
| Global Setup | Stop immediately |
| Database Snapshot | Stop immediately |
| Setup | Stop package, continue to next |
| Run | Stop package, continue to next |
| Result Collection | Stop package, continue to next |
| Teardown | Stop package, continue to next |
| Global Teardown | Log warning, continue |
| Post-Processing | Log error, finish |

### Exit Codes

- **0**: All test packages passed
- **1**: Test failures or validation errors
- **3**: Infrastructure failures (database restore, Docker issues)

## Best Practices

### 1. Global Setup Strategy
Put shared configuration in globalSetup:
- Environment settings
- Common plugins
- Test users
- Base data

### 2. Package Independence
Design packages to be independent:
- Don't rely on other packages' changes
- Use globalSetup for shared needs
- Test in isolation

### 3. Efficient Commands
Optimize command execution:
- Use `npm ci` instead of `npm install`
- Cache dependencies when possible
- Minimize network calls

### 4. Result Generation
Ensure reliable results:
- Always output CTRF to exact path
- Create directories in setup
- Include meaningful test names

### 5. Cleanup Strategy
- Light cleanup in teardown (temp files)
- Heavy cleanup in globalTeardown
- Remember: database resets automatically