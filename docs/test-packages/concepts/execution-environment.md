# Test Package Execution Environment

This document describes how test package commands are executed, where they run, and how to handle file operations correctly.

## Execution Venues

Test package commands can run in two different locations:

- **Host Machine**: Where Node.js, npm, and test frameworks are installed
- **Docker Container**: Where WordPress, MySQL, and PHP are running

### Automatic Venue Detection

QIT automatically determines where each command should run based on these rules:

| Command Type | Execution Venue | Reason |
|--------------|-----------------|---------|
| `npm ...` | Host | Node.js package manager is on host |
| `npx ...` | Host | Node.js package runner is on host |
| Everything else | Container | WordPress environment and tools are in container |

### Examples

```json
{
  "phases": {
    "setup": [
      "wp plugin activate woocommerce",     // → Runs in container
      "wp user create test test@test.com",  // → Runs in container
      "php initialize-data.php",            // → Runs in container
      "mysql -e 'SELECT * FROM wp_posts'",  // → Runs in container
      "npm install",                         // → Runs on host
      "npx playwright install"              // → Runs on host
    ],
    "run": [
      "npx playwright test",                 // → Runs on host
      "./run-tests.sh"                      // → Runs in container
    ]
  }
}
```

### Explicit Venue Control

When you need to override the automatic detection, use the object format:

```json
{
  "phases": {
    "run": [
      {
        "command": "php generate-report.php",
        "runs_on": "host"  // Force this PHP script to run on host
      },
      {
        "command": "node analyze.js",
        "runs_on": "docker"  // Force this Node script to run in container
      }
    ]
  }
}
```

## Working Directories

Commands run in different working directories depending on the execution venue:

### Host Working Directory
- **Location**: The test package directory
- **Example**: `/path/to/test-package/`
- **Use for**: Reading test files, configuration, specs

### Container Working Directory
- **Location**: `/qit/packages/{package-name}/`
- **Example**: `/qit/packages/checkout-tests/`
- **Use for**: Accessing test package files from within container

## File Operations and Output

### Important: Test Package Directories are Read-Only

Test packages are mounted as **read-only** in the container. This is by design:
- Ensures test reproducibility
- Prevents test pollution
- Maintains package integrity

**This means commands running in the container CANNOT write to the test package directory.**

### Where to Write Output Files

For any output files (test results, reports, artifacts, logs), use:

**`/var/www/html/wp-content/uploads/`**

This directory is:
- Writable from the container
- Accessible via WordPress URLs
- Persistent for the test duration
- The standard WordPress uploads directory

### Examples

❌ **Wrong** - Trying to write to test package directory:
```json
{
  "run": [
    "wp eval 'file_put_contents(\"./results.txt\", \"test\");'"  // FAILS: Read-only
  ]
}
```

✅ **Correct** - Writing to uploads directory:
```json
{
  "run": [
    "wp eval 'file_put_contents(\"/var/www/html/wp-content/uploads/results.txt\", \"test\");'"
  ]
}
```

### Handling Results in Different Venues

When your test needs to write results that will be collected:

1. **For container commands**: Write directly to `/var/www/html/wp-content/uploads/`
2. **For host commands**: Write to the test package directory (host has write access)

Example handling both cases:
```json
{
  "phases": {
    "run": [
      "npx playwright test --reporter=json --reporter-output=./results.json",  // Host: writes to package dir
      "wp eval 'file_put_contents(\"/var/www/html/wp-content/uploads/wp-test.log\", get_option(\"test_log\"));'"  // Container: writes to uploads
    ]
  }
}
```

## Environment Variables

These environment variables are available to help with path resolution:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `QIT_SITE_URL` | WordPress site URL | `http://localhost:32821` |
| `QIT_ADMIN_USERNAME` | Admin username | `admin` |
| `QIT_ADMIN_PASSWORD` | Admin password | `password` |

## Best Practices

1. **Be explicit when it matters**: If your command must run in a specific venue, use the object format with `runs_on`
2. **Use appropriate output directories**: Never assume you can write to the test package directory
3. **Consider the execution venue when writing commands**: Remember that `wp` commands won't work on host, and `npm` commands won't work in container
4. **Test locally first**: Verify your commands work in both local and CI environments

## Common Pitfalls

### Pitfall 1: Assuming write access
```json
// This works locally but fails in CI:
"mkdir ./results"  // Fails if run in container due to read-only mount
```

### Pitfall 2: Wrong venue for command
```json
// These will fail:
"wp plugin list"   // If somehow forced to run on host
"npm test"         // If somehow forced to run in container
```

### Pitfall 3: Path confusion
```json
// Container path won't exist on host:
"npx process-file /qit/packages/my-test/data.json"  // Fails: path doesn't exist on host
```

## Summary

- **npm/npx** commands run on the **host**
- **Everything else** runs in the **container**
- Test packages are **read-only** in the container
- Write output to **`/var/www/html/wp-content/uploads/`** from container commands
- Use explicit `runs_on` when the automatic detection isn't suitable