# Development Workflow

This guide covers the recommended workflow for developing Test Packages, including manual testing, debugging, and AI-assisted development.

## Manual Testing Workflow

### Starting an Environment

The most efficient way to develop Test Packages is to start an environment and test manually:

```bash
# Start environment with specific version
php qit-cli.php env:up --woo nightly

# Or with multiple options
php qit-cli.php env:up --php=8.2 --wordpress=6.4 --woo=8.5
```

Output:
```
Removing dangling test environments...
Downloading plugins and themes... (WooCommerce: nightly)
Starting Docker Environment...
Installing WordPress...
Activating plugins...

✅ Environment ready: qitenv35a3979857a7a672

  URL:         http://localhost:32820
  Credentials: admin/password
  Stack:       WordPress stable, PHP 8.2
  Plugins:     WooCommerce nightly

To run manual tests:
  1. Navigate to your test directory
  2. Load environment variables in this terminal:
     source "$(qit env:source qitenv35a3979857a7a672)"
  3. Run your tests:
     npx playwright test
```

### Loading Environment Variables

After starting an environment, load its variables into your terminal:

```bash
source "$(qit env:source qitenv35a3979857a7a672)"
```

This provides:
```
✓ QIT environment variables loaded
  Environment: qitenv35a3979857a7a672
  Site URL: http://localhost:32820
  DB Port: 0
```

Now your terminal has access to:
- `QIT_SITE_URL` - The WordPress site URL
- `QIT_WP_ADMIN` - Admin panel URL
- `QIT_DB_NAME` - Database name
- `QIT_DB_USER` - Database username
- `QIT_DB_PASS` - Database password
- `QIT_DB_HOST` - Database host

### Running Tests Manually

Navigate to your test package and run tests:

```bash
cd packages/checkout-tests/
npx playwright test

# Or run specific test
npx playwright test checkout.spec.js

# Or with debugging
npx playwright test --debug

# Or with UI mode
npx playwright test --ui
```

### Development Cycle

1. **Start environment once**
   ```bash
   php qit-cli.php env:up --woo nightly
   source "$(qit env:source qitenv...)"
   ```

2. **Develop tests iteratively**
   ```bash
   # Edit test file
   vim tests/checkout.spec.js
   
   # Run test
   npx playwright test checkout.spec.js
   
   # See it fail, fix, repeat
   ```

3. **Test with full orchestration**
   ```bash
   # When ready, test with full lifecycle
   php qit-cli.php run:e2e woocommerce --config=test.json
   ```

4. **Clean up when done**
   ```bash
   php qit-cli.php env:down
   ```

## Utility Packages with env:up

### Using Utility Packages for Setup

Utility packages work perfectly with `env:up --global-setup`:

```bash
# Start environment with utility packages only
php qit-cli.php env:up woocommerce --global-setup --config=utilities.json
```

`utilities.json`:
```json
{
  "test_types": {
    "e2e": {
      "default": {
        "test_packages": [
          "./utilities/disable-onboarding",
          "./utilities/create-test-data",
          "./utilities/configure-stripe"
        ]
      }
    }
  }
}
```

This will:
1. Start the environment
2. Run globalSetup from all utility packages
3. Leave environment running for manual testing
4. NO test execution (utility packages have no run phase)

### Why This Works

- `env:up --global-setup` doesn't require test packages
- Utility packages are perfect for environment preparation
- Database changes persist (no snapshots with env:up)
- Environment stays running for development

### Example Utility Package for Development

`utilities/dev-setup/manifest.json`:
```json
{
  "package": "dev-setup",
  "namespace": "utilities",
  "test_type": "e2e",
  "description": "Development environment setup",
  "test": {
    "phases": {
      "globalSetup": [
        "wp plugin install woocommerce-gateway-stripe --activate",
        "wp plugin install wordpress-importer --activate",
        "wp import /app/sample-data.xml --authors=create",
        "wp option set woocommerce_task_list_hidden yes",
        "wp user create testcustomer test@test.com --role=customer --user_pass=test123",
        "wp wc product create --name='Test Product' --regular_price=9.99 --user=1",
        "echo 'Development environment ready!'"
      ]
    }
  }
}
```

## Debugging Failed Tests

### Getting Context from Failed Tests

When tests fail, get AI-friendly context:

```bash
php qit-cli.php ai-context failed-e2e
```

This generates a comprehensive report including:
- Error messages and stack traces
- Test output and logs
- Environment configuration
- Screenshots (if available)
- Relevant code snippets

### Understanding Test Packages

Get complete context about Test Packages:

```bash
php qit-cli.php ai-context understanding-test-packages
```

This provides:
- Test Package architecture
- Lifecycle explanation
- Manifest schema
- Command execution context
- Database isolation details

## Test Package Development Best Practices

### 1. Start Simple

Begin with a minimal test:

```javascript
test('can access site', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/WooCommerce/);
});
```

### 2. Use Manual Testing First

Before orchestration, test manually:

```bash
# Start environment
php qit-cli.php env:up --woo nightly
source "$(qit env:source ...)"

# Test your commands work
cd my-package/
npm install
npx playwright test
```

### 3. Add to Manifest Incrementally

Start with minimal manifest:
```json
{
  "package": "my-test",
  "namespace": "dev",
  "test_type": "e2e",
  "test": {
    "phases": {
      "run": ["npx playwright test"]
    },
    "results": {
      "ctrf-json": "./results/ctrf.json",
      "blob-dir": "./results/artifacts"
    }
  }
}
```

Then add phases as needed:
- Add `setup` when you need dependencies
- Add `globalSetup` for shared configuration
- Add `teardown` for cleanup
- Add `requires.secrets` for API keys

### 4. Test Isolation

Verify your tests work in isolation:

```bash
# Run just your package
php qit-cli.php run:e2e woocommerce --config=single-package.json
```

### 5. Use Verbose Mode for Debugging

```bash
php qit-cli.php run:e2e woocommerce --config=test.json --verbose
```

## Interactive Development

### Using Playwright UI Mode

For interactive test development:

```bash
# After loading environment
npx playwright test --ui
```

This provides:
- Visual test execution
- Step-by-step debugging
- Time travel debugging
- Element picker

### Using Playwright Inspector

```bash
# Run with inspector
PWDEBUG=1 npx playwright test
```

### Recording New Tests

Use Playwright codegen with QIT environment:

```bash
# Load environment first
source "$(qit env:source ...)"

# Record new test
npx playwright codegen $QIT_SITE_URL
```

## File System and Database Persistence

### Understanding Persistence in Manual Testing

When using `env:up` for manual testing:

#### File System
- Changes to WordPress files persist
- Uploaded media persists
- Plugin/theme installations persist
- Test artifacts accumulate

Example test showing filesystem persistence:
```javascript
test('create filesystem marker', async ({ page }) => {
  const fs = require('fs');
  const markerFile = '/tmp/test-marker.txt';
  
  fs.writeFileSync(markerFile, 'Test was here');
  console.log(`Created marker at ${markerFile}`);
  
  // This file persists between test runs
  expect(fs.existsSync(markerFile)).toBeTruthy();
});
```

#### Database
- All changes persist
- No automatic cleanup
- No snapshots/restore
- Perfect for iterative development

Example test showing database persistence:
```javascript
test('create test post', async ({ page }) => {
  await page.goto('/wp-admin');
  await page.fill('#user_login', 'admin');
  await page.fill('#user_pass', 'password');
  await page.click('#wp-submit');
  
  // Create post
  await page.goto('/wp-admin/post-new.php');
  await page.fill('[aria-label="Add title"]', 'Test Post');
  await page.click('button:has-text("Publish")');
  
  // This post persists between test runs
  console.log('Created test post - will persist');
});
```

### Understanding Isolation in Orchestrated Tests

When using `run:e2e` with orchestration:

#### Database Isolation
- Snapshot taken after globalSetup
- Each package starts from snapshot
- Changes don't persist between packages

#### Filesystem Sharing
- Filesystem is shared between packages
- Files created by one package visible to others
- Useful for passing data between packages

Example showing the difference:
```javascript
// Package 1
test('package 1 modifications', async () => {
  // Database change - won't be seen by Package 2
  await createWordPressPost('Package 1 was here');
  
  // Filesystem change - WILL be seen by Package 2
  fs.writeFileSync('/tmp/shared-data.txt', 'Package 1 data');
});

// Package 2
test('package 2 checks', async () => {
  // Won't see the post (database isolated)
  const posts = await getWordPressPosts();
  expect(posts).not.toContain('Package 1 was here');
  
  // WILL see the file (filesystem shared)
  const data = fs.readFileSync('/tmp/shared-data.txt', 'utf8');
  expect(data).toBe('Package 1 data');
});
```

## Performance Optimization

### Faster Development Cycles

1. **Keep environment running**
   ```bash
   # Start once at beginning of day
   php qit-cli.php env:up --woo nightly
   source "$(qit env:source ...)"
   ```

2. **Use watch mode**
   ```json
   {
     "scripts": {
       "test:watch": "playwright test --watch"
     }
   }
   ```

3. **Run specific tests**
   ```bash
   npx playwright test checkout.spec.js:10
   ```

4. **Skip unnecessary setup**
   ```bash
   # During development, skip npm install if already done
   [ -d node_modules ] || npm ci
   ```

### Parallel Development

Run multiple environments:

```bash
# Terminal 1: Stable testing
php qit-cli.php env:up --woo stable
source "$(qit env:source ...)"

# Terminal 2: Nightly testing  
php qit-cli.php env:up --woo nightly
source "$(qit env:source ...)"
```

## Common Development Patterns

### Pattern 1: TDD Workflow

```bash
# 1. Start environment
php qit-cli.php env:up --woo nightly
source "$(qit env:source ...)"

# 2. Write failing test
cat > test.spec.js << 'EOF'
test('checkout with coupon', async ({ page }) => {
  // Test that will fail initially
});
EOF

# 3. Run test, see it fail
npx playwright test test.spec.js

# 4. Implement feature/fix
# 5. Run test, see it pass
# 6. Refactor if needed
```

### Pattern 2: Debugging Production Issues

```bash
# 1. Reproduce issue manually
php qit-cli.php env:up --woo=8.5.1 --php=7.4
# Navigate to site, reproduce issue

# 2. Write test that captures issue
npx playwright codegen $QIT_SITE_URL

# 3. Add to test suite
# 4. Fix issue
# 5. Verify test passes
```

### Pattern 3: Cross-Version Testing

```bash
# Test against multiple versions
for version in "8.4" "8.5" "nightly"; do
  echo "Testing WooCommerce $version"
  php qit-cli.php env:up --woo=$version
  source "$(qit env:source ...)"
  npx playwright test
  php qit-cli.php env:down
done
```

## Troubleshooting Development Issues

### Environment Variables Not Set

```bash
# Check if variables loaded
echo $QIT_SITE_URL

# If empty, reload
source "$(qit env:source qitenv...)"
```

### Port Conflicts

```bash
# Check what's using the port
lsof -i :32820

# Or use a different environment
php qit-cli.php env:down
php qit-cli.php env:up --woo nightly
```

### Stale Environment

```bash
# Clean up and start fresh
php qit-cli.php env:down
docker system prune -f
php qit-cli.php env:up --woo nightly
```