---
description: "Reference for test result collection and reporting. Covers the CTRF (Common Test Results Format) JSON standard used by QIT, how to configure result paths in qit-test.json (ctrf-json, blob-dir, allure-dir), Playwright integration for CTRF output, blob directory structure (screenshots, videos, traces), result collection behavior (collected even on failure, missing results = failure), orchestrator CTRF for lifecycle phases, viewing results with `qit report`, Allure report integration, and troubleshooting common result issues."
---

# Test Results and Artifacts

Test Packages produce standardized results for consistent reporting across different test frameworks.

## Result Types

### CTRF (Common Test Results Format)

Standardized JSON format for test results:

```json
{
  "results": {
    "tool": {
      "name": "playwright"
    },
    "summary": {
      "tests": 10,
      "passed": 8,
      "failed": 2,
      "skipped": 0,
      "pending": 0,
      "other": 0,
      "suites": 3,
      "start": 1704900000000,
      "stop": 1704900060000
    },
    "tests": [
      {
        "name": "Checkout > Guest checkout completes successfully",
        "status": "passed",
        "duration": 3456,
        "suite": "Checkout"
      },
      {
        "name": "Checkout > Payment fails with invalid card",
        "status": "failed",
        "duration": 2100,
        "suite": "Checkout",
        "message": "Expected payment to fail",
        "trace": "at checkout.spec.js:45:10"
      }
    ]
  }
}
```

### Blob Artifacts

Binary files and assets:
- Screenshots
- Videos
- Logs
- HTML reports
- Network traces

### Allure Results

Advanced reporting format (optional):
- Test history
- Categories
- Attachments
- Steps
- Links

## Configuring Results

### In Manifest

```json
{
  "test": {
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts",
      "allure-dir": "./allure-results"
    }
  }
}
```

### Path Requirements

- Paths relative to package directory
- Directories created automatically
- Files must exist after run phase

## Playwright Integration

Test Packages primarily use Playwright for E2E testing. Here's how to configure Playwright to generate the required CTRF output:

### Basic Configuration

`playwright.config.js`:
```javascript
module.exports = {
  reporter: [
    ['ctrf-json', {
      outputFile: './test-results/ctrf.json'
    }],
    ['html', {
      outputFolder: './test-results/artifacts/html'
    }]
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  outputDir: './test-results/artifacts'
};
```

### Installing CTRF Reporter

```bash
npm install --save-dev ctrf-playwright-reporter
```

### Multiple Reporter Configuration

```javascript
module.exports = {
  reporter: [
    ['ctrf-json', {
      outputFile: './test-results/ctrf.json'
    }],
    ['junit', {
      outputFile: './test-results/junit.xml'
    }],
    ['html', {
      outputFolder: './test-results/html'
    }],
    ['line']  // Console output
  ]
};
```

## Blob Directory Structure

Recommended organization:

```
blob-dir/
├── screenshots/
│   ├── test-1-failed.png
│   └── test-2-failed.png
├── videos/
│   ├── checkout-flow.webm
│   └── payment-flow.webm
├── traces/
│   └── trace-12345.zip
├── logs/
│   ├── console.log
│   └── network.har
└── reports/
    └── html/
        └── index.html
```

## Result Collection

### How It Works

1. Test framework generates results
2. QIT validates paths exist
3. Copies CTRF JSON
4. Copies blob directory
5. Merges with orchestrator CTRF
6. Generates final report

### Validation

Results are validated after run phase:
- CTRF file must exist
- Must be valid JSON
- Blob directory must exist
- Missing results = test failure

## Orchestrator CTRF

### Lifecycle Commands

QIT generates CTRF for non-test phases:

```json
{
  "name": "[globalSetup] utilities/setup: wp plugin install",
  "status": "passed",
  "duration": 1234,
  "suite": "lifecycle"
}
```

### Merged Output

Final CTRF contains:
- Orchestrator lifecycle results
- Test package results
- Combined summary statistics

## Viewing Results

### Local Execution

Results saved to:
```
./qit-results/
├── ctrf.json           # Merged CTRF
├── artifacts/          # All blob artifacts
├── reports/
│   └── index.html      # HTML report
└── logs/
    └── execution.log   # Execution details
```

### CI Systems

Results typically uploaded as artifacts:

#### GitHub Actions
```yaml
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: qit-results/
```

#### GitLab CI
```yaml
artifacts:
  when: always
  paths:
    - qit-results/
  reports:
    junit: qit-results/junit.xml
```

## Allure Integration

### Configuration

`qit-test.json`:
```json
{
  "test": {
    "results": {
      "ctrf-json": "./test-results/ctrf.json",
      "blob-dir": "./test-results/artifacts",
      "allure-dir": "./allure-results"
    }
  }
}
```

### Generation

With Playwright:
```javascript
module.exports = {
  reporter: [
    ['allure-playwright', {
      outputFolder: './allure-results'
    }]
  ]
};
```

### Upload Behavior

- Uploaded only when tests fail
- Requires Allure server configured
- Provides detailed failure analysis

## Custom Result Processing

### Post-Processing Hook

`qit-test.json`:
```json
{
  "test": {
    "phases": {
      "run": ["npm test"],
      "teardown": [
        "node ./scripts/process-results.js"
      ]
    }
  }
}
```

`process-results.js`:
```javascript
const fs = require('fs');
const ctrf = JSON.parse(
  fs.readFileSync('./test-results/ctrf.json')
);

// Custom processing
console.log(`Tests run: ${ctrf.results.summary.tests}`);
console.log(`Pass rate: ${
  (ctrf.results.summary.passed / ctrf.results.summary.tests * 100).toFixed(1)
}%`);
```

## Result Formats

### CTRF Structure

Required fields:
```json
{
  "results": {
    "summary": {
      "tests": 10,
      "passed": 8,
      "failed": 2
    },
    "tests": []
  }
}
```

Optional fields:
```json
{
  "results": {
    "tool": {
      "name": "playwright",
      "version": "1.40.0"
    },
    "summary": {
      "skipped": 0,
      "pending": 0,
      "other": 0,
      "suites": 3,
      "start": 1704900000000,
      "stop": 1704900060000
    },
    "tests": [
      {
        "suite": "Checkout",
        "message": "Assertion failed",
        "trace": "Stack trace",
        "tags": ["smoke", "critical"],
        "type": "e2e",
        "filepath": "checkout.spec.js",
        "retries": 1,
        "flaky": false
      }
    ],
    "environment": {
      "browser": "chromium",
      "os": "linux"
    }
  }
}
```

### Test Status Values

- `passed`: Test succeeded
- `failed`: Test failed
- `skipped`: Test was skipped
- `pending`: Test is pending implementation
- `other`: Other status

## Troubleshooting Results

### CTRF Not Generated

Check:
- Reporter configured correctly
- Output path matches manifest
- Test framework supports CTRF

Solution for unsupported frameworks:
```javascript
// Convert native format to CTRF
const results = convertToCtrf(nativeResults);
fs.writeFileSync('./test-results/ctrf.json', 
  JSON.stringify(results, null, 2)
);
```

### Artifacts Not Collected

Verify:
- Blob directory path correct
- Files generated before collection
- Directory exists

### Results Missing After Success

Ensure:
- Results generated even on success
- Not cleaning results in teardown
- Paths are relative to package

## Best Practices

### 1. Consistent Paths

Always use same structure:
```json
{
  "results": {
    "ctrf-json": "./test-results/ctrf.json",
    "blob-dir": "./test-results/artifacts"
  }
}
```

### 2. Create Directories

In setup phase:
```json
{
  "setup": [
    "mkdir -p test-results/artifacts"
  ]
}
```

### 3. Capture on Failure

Configure frameworks to capture artifacts on failure:
```javascript
screenshot: 'only-on-failure',
video: 'retain-on-failure'
```

### 4. Meaningful Test Names

Good:
```json
{
  "name": "Checkout > Guest user > Completes purchase with credit card",
  "suite": "Checkout"
}
```

Bad:
```json
{
  "name": "test1",
  "suite": "tests"
}
```

### 5. Include Context

Add helpful information:
```json
{
  "tests": [{
    "name": "Payment processing",
    "tags": ["payment", "stripe", "critical"],
    "type": "integration",
    "filepath": "payment/stripe.spec.js"
  }]
}
```

### 6. Compress Large Artifacts

```json
{
  "teardown": [
    "tar -czf test-results/artifacts/traces.tar.gz test-results/traces/",
    "rm -rf test-results/traces/"
  ]
}
```

## Advanced Patterns

### Multiple Report Formats

```javascript
module.exports = {
  reporter: [
    ['ctrf-json', { outputFile: './test-results/ctrf.json' }],
    ['junit', { outputFile: './test-results/junit.xml' }],
    ['html', { outputFolder: './test-results/html' }]
  ]
};
```

### Conditional Artifacts

```javascript
const shouldRecordVideo = process.env.CI === 'true';

module.exports = {
  use: {
    video: shouldRecordVideo ? 'on' : 'off'
  }
};
```

### Result Aggregation

```javascript
// Aggregate results from multiple test runs
const results = [];
for (const file of resultFiles) {
  const ctrf = JSON.parse(fs.readFileSync(file));
  results.push(...ctrf.results.tests);
}

const aggregated = {
  results: {
    summary: calculateSummary(results),
    tests: results
  }
};
```

### Custom CTRF Generation

If you need to generate CTRF from Playwright test results programmatically:
```javascript
class CtrfReporter {
  onTestEnd(test, result) {
    this.tests.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
      suite: test.parent.title
    });
  }
  
  onEnd() {
    const ctrf = {
      results: {
        summary: this.calculateSummary(),
        tests: this.tests
      }
    };
    fs.writeFileSync('./test-results/ctrf.json', 
      JSON.stringify(ctrf, null, 2)
    );
  }
}
```