# Network Requirements for Test Packages

## Overview

QIT runs tests in **offline mode by default** to ensure maximum reliability and performance. However, test packages can declare that they require network access, and QIT will automatically enable it when needed.

## How It Works

The system is simple and automatic:

1. **Tests run offline by default** - External network requests are blocked
2. **Packages declare their needs** - If a test requires network, it says so in the manifest
3. **QIT handles it automatically** - When a test needs network, QIT enables it

No manual configuration needed - it just works!

## Declaring Network Requirements

Test packages can include an optional `requires_network` field in their manifest:

```json
{
  "package": "vendor/test-package",
  "requires_network": false,
  "test": {
    // test configuration
  }
}
```

### Values

- **`false`** (default) - Test runs completely offline (no external HTTP requests)
- **`true`** - Test requires external network access (e.g., payment gateway APIs)
- **Not specified** - Defaults to `false` (offline)

💡 **Tip**: Most tests don't need network, so the default works perfectly!

## Scope of Network Restriction

**The network restriction only applies to WordPress HTTP API requests** (e.g., `wp_remote_get()`, `wp_remote_post()`, etc.). 

### What IS Blocked (in offline mode)
- WordPress HTTP API calls (`wp_remote_*` functions)
- WordPress update checks
- Plugin/theme external API calls using WordPress functions

### What is NOT Blocked
- **Playwright tests** - Browser automation runs on the host
- **Bash scripts** - Commands like `curl`, `wget` work normally
- **Direct PHP** - Functions like `file_get_contents()`, `curl_*` work
- **Docker networking** - Container-to-container communication
- **Database connections** - MySQL/MariaDB connections

This is a **measured compromise** that balances:
- **Reliability**: Preventing unpredictable WordPress external calls
- **Functionality**: Allowing test tools to work properly  
- **Practicality**: Focusing on the main source of test flakiness

## Automatic Network Management

### The Magic of Auto Mode (Default)

When you run tests, QIT automatically provides what they need:

```bash
qit run:e2e woocommerce --test-package=my-test
```

**What happens behind the scenes:**

1. **QIT reads all test manifests** - Checks each package's `requires_network` value
2. **Smart decision** - If ANY package needs network → enables it for all
3. **Execution** - Tests run with appropriate network access

**The result:**
- ✅ Offline tests get speed and reliability
- ✅ Online tests get the network access they need  
- ✅ You don't have to think about it

### Override Modes

For debugging or special cases, you can override the automatic behavior:

#### Force Offline Mode

```bash
qit run:e2e woocommerce --test-package=my-test --offline
```

- Forces all tests to run without network
- **Will error** if any test package requires network
- Useful for ensuring tests work offline

#### Force Online Mode  

```bash
qit run:e2e woocommerce --test-package=my-test --online
```

- Enables network for all tests
- Even packages that don't require network will have access
- Useful for debugging network-related issues