# Sharding

## Sharding is Not Supported

**Important:** Playwright's `--shard` option is **not supported** when using `qit run:e2e` with Test Packages.

### What Happens if You Try

```bash
# This will show a warning
qit run:e2e woocommerce -- --shard=1/3

# Output:
# Warning: --shard is not supported with Test Packages orchestration.
#          Tests will run without sharding.
```

The `--shard` argument is filtered out and all tests run normally.

### Why?

Test Packages require:
- Complete test results from each package
- Database snapshots between packages
- Full lifecycle execution

Sharding would break this model by producing incomplete results and compromising the isolation between packages.

## Current Status

Sharding is not currently supported with Test Packages. We may add support for package-level distribution in the future, but for now all tests run in a single execution.

## Manual Testing Note

If you're using `env:up` for manual testing (without orchestration), you can run Playwright directly with whatever options you want:

```bash
# Start environment
qit env:up woocommerce

# Load environment variables
source "$(qit env:source qitenv...)"

# Run tests however you want
npx playwright test --shard=1/3
```

**Note:** This isn't really "sharding" in the traditional sense - you'd need to run this command 3 times with different shard numbers (1/3, 2/3, 3/3) to cover all tests. Playwright doesn't automatically distribute tests across multiple terminals or processes for you.

