# Continuous Integration

Test Packages are designed for CI/CD environments with automatic output management, parallel execution, and comprehensive reporting.

## CI Mode

### Automatic Detection

QIT detects CI environments automatically:

```bash
# Any truthy CI variable enables CI mode
CI=true qit run:e2e woocommerce
CI=1 qit run:e2e woocommerce
CI=yes qit run:e2e woocommerce
```

### CI Mode Behavior

- Command output suppressed
- Only essential information shown
- Errors always visible
- Cleaner logs for CI systems
- Progress indicators adapted

### Override CI Mode

Force verbose output in CI:
```bash
CI=true qit run:e2e woocommerce --verbose
```

## GitHub Actions

### Basic Workflow

`.github/workflows/test.yml`:
```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup QIT
        run: |
          # Install QIT CLI
          curl -sSL https://qit.io/install | bash
          
      - name: Run E2E Tests
        env:
          CI: true
          STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          STRIPE_TEST_SECRET: ${{ secrets.STRIPE_TEST_SECRET }}
        run: |
          qit run:e2e my-extension --config=test-config.json
          
      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: qit-results/
```

### Matrix Testing

Test multiple versions:

```yaml
strategy:
  matrix:
    php: ['7.4', '8.0', '8.1', '8.2']
    wordpress: ['6.3', '6.4', 'latest']
    
steps:
  - name: Run Tests
    run: |
      qit run:e2e my-extension \
        --php=${{ matrix.php }} \
        --wordpress=${{ matrix.wordpress }}
```

### Parallel Execution

Run packages in parallel jobs:

```yaml
strategy:
  matrix:
    package:
      - checkout-tests
      - payment-tests
      - account-tests
      
steps:
  - name: Run Package
    run: |
      qit run:e2e my-extension \
        --config=packages/${{ matrix.package }}/config.json
```

## GitLab CI

### Basic Pipeline

`.gitlab-ci.yml`:
```yaml
stages:
  - test

variables:
  CI: "true"

e2e-tests:
  stage: test
  image: ubuntu:latest
  
  before_script:
    - apt-get update && apt-get install -y curl
    - curl -sSL https://qit.io/install | bash
    
  script:
    - qit run:e2e my-extension --config=test-config.json
    
  artifacts:
    when: always
    paths:
      - qit-results/
    reports:
      junit: qit-results/junit.xml
    expire_in: 1 week
```

### Parallel Execution

```yaml
e2e-tests:
  parallel:
    matrix:
      - PACKAGE: [checkout, payment, account]
  
  script:
    - qit run:e2e my-extension --config=packages/$PACKAGE/config.json
```

## Jenkins

### Pipeline Script

`Jenkinsfile`:
```groovy
pipeline {
    agent any
    
    environment {
        CI = 'true'
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'curl -sSL https://qit.io/install | bash'
            }
        }
        
        stage('Test') {
            steps {
                withCredentials([
                    string(credentialsId: 'stripe-key', variable: 'STRIPE_TEST_KEY'),
                    string(credentialsId: 'stripe-secret', variable: 'STRIPE_TEST_SECRET')
                ]) {
                    sh 'qit run:e2e my-extension --config=test-config.json'
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'qit-results/**/*', fingerprint: true
            junit 'qit-results/junit.xml'
        }
    }
}
```

### Parallel Stages

```groovy
stage('Tests') {
    parallel {
        stage('Checkout Tests') {
            steps {
                sh 'qit run:e2e my-extension --config=checkout.json'
            }
        }
        stage('Payment Tests') {
            steps {
                sh 'qit run:e2e my-extension --config=payment.json'
            }
        }
    }
}
```

## CircleCI

### Configuration

`.circleci/config.yml`:
```yaml
version: 2.1

jobs:
  test:
    docker:
      - image: cimg/base:stable
    
    environment:
      CI: true
    
    steps:
      - checkout
      
      - run:
          name: Install QIT
          command: |
            curl -sSL https://qit.io/install | bash
            
      - run:
          name: Run Tests
          command: |
            qit run:e2e my-extension --config=test-config.json
            
      - store_artifacts:
          path: qit-results
          
      - store_test_results:
          path: qit-results

workflows:
  test-workflow:
    jobs:
      - test
```

## Travis CI

### Configuration

`.travis.yml`:
```yaml
language: generic
dist: focal

env:
  global:
    - CI=true

before_install:
  - curl -sSL https://qit.io/install | bash

script:
  - qit run:e2e my-extension --config=test-config.json

after_script:
  - tar -czf results.tar.gz qit-results/

deploy:
  provider: releases
  file: results.tar.gz
  skip_cleanup: true
  on:
    tags: true
```

## Bitbucket Pipelines

### Configuration

`bitbucket-pipelines.yml`:
```yaml
pipelines:
  default:
    - step:
        name: E2E Tests
        image: ubuntu:latest
        script:
          - apt-get update && apt-get install -y curl
          - curl -sSL https://qit.io/install | bash
          - export CI=true
          - qit run:e2e my-extension --config=test-config.json
        artifacts:
          - qit-results/**
```

## Azure DevOps

### Pipeline

`azure-pipelines.yml`:
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  CI: 'true'

steps:
  - script: |
      curl -sSL https://qit.io/install | bash
    displayName: 'Install QIT'
    
  - script: |
      qit run:e2e my-extension --config=test-config.json
    displayName: 'Run E2E Tests'
    env:
      STRIPE_TEST_KEY: $(STRIPE_TEST_KEY)
      STRIPE_TEST_SECRET: $(STRIPE_TEST_SECRET)
    
  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: 'qit-results/junit.xml'
      
  - task: PublishBuildArtifacts@1
    condition: always()
    inputs:
      pathToPublish: 'qit-results'
      artifactName: 'test-results'
```

## Docker Integration

### Dockerfile

```dockerfile
FROM ubuntu:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install QIT
RUN curl -sSL https://qit.io/install | bash

# Copy test configuration
COPY test-config.json /app/
COPY packages/ /app/packages/

WORKDIR /app

# Run tests
CMD ["qit", "run:e2e", "my-extension", "--config=test-config.json"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  tests:
    build: .
    environment:
      - CI=true
      - STRIPE_TEST_KEY
      - STRIPE_TEST_SECRET
    volumes:
      - ./results:/app/qit-results
```

## Optimization Strategies

### 1. Caching Dependencies

#### GitHub Actions
```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ~/.cache
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

#### GitLab CI
```yaml
cache:
  paths:
    - .npm/
    - node_modules/
  key: ${CI_COMMIT_REF_SLUG}
```

### 2. Parallel Execution

Split tests across jobs:
```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
    
steps:
  - run: |
      qit run:e2e my-extension \
        --config=shard-${{ matrix.shard }}.json
```

### 3. Conditional Testing

Run only affected tests:
```yaml
- name: Determine Tests
  id: tests
  run: |
    if git diff --name-only HEAD^ | grep -q "checkout"; then
      echo "checkout=true" >> $GITHUB_OUTPUT
    fi
    
- name: Run Checkout Tests
  if: steps.tests.outputs.checkout == 'true'
  run: qit run:e2e my-extension --config=checkout.json
```

### 4. Fail Fast

Stop on first failure:
```json
{
  "test_packages": [...],
  "options": {
    "fail_fast": true
  }
}
```

## Reporting

### Test Results Format

Generate multiple formats:
```json
{
  "test": {
    "phases": {
      "run": [
        "npm test -- --reporter=ctrf-json --reporter=junit"
      ]
    }
  }
}
```

### Status Badges

#### GitHub Actions
```markdown
[![Tests](https://github.com/user/repo/actions/workflows/test.yml/badge.svg)](https://github.com/user/repo/actions/workflows/test.yml)
```

#### GitLab CI
```markdown
[![pipeline status](https://gitlab.com/user/repo/badges/main/pipeline.svg)](https://gitlab.com/user/repo/-/commits/main)
```

### Notifications

#### Slack
```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'E2E tests failed!'
```

#### Email
```yaml
- name: Send Email
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    to: team@example.com
    subject: 'E2E Test Failure'
```

## Best Practices

### 1. Use CI Mode

Always set CI environment variable:
```yaml
env:
  CI: true
```

### 2. Store Artifacts

Always upload results:
```yaml
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: qit-results/
```

### 3. Set Timeouts

Prevent hanging jobs:
```yaml
timeout-minutes: 30
```

### 4. Use Secrets Management

Never hardcode secrets:
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### 5. Version Lock

Specify exact versions for reproducibility:
```json
{
  "environment": {
    "php": "8.2.0",
    "wordpress": "6.4.2",
    "woocommerce": "8.5.1"
  }
}
```

### 6. Clean Environment

Start fresh each run:
```yaml
- run: |
    qit env:down || true
    qit run:e2e my-extension
```

## Debugging CI Failures

### Enable Verbose Mode

```yaml
- run: qit run:e2e my-extension --verbose
```

### SSH Debug Session

GitHub Actions:
```yaml
- name: Setup tmate session
  if: failure()
  uses: mxschmitt/action-tmate@v3
```

### Download Artifacts

Examine locally:
```bash
# Download artifacts from CI
gh run download <run-id>

# Extract and examine
tar -xzf test-results.tar.gz
cat qit-results/logs/execution.log
```

### Reproduce Locally

Match CI environment:
```bash
# Use same versions as CI
export CI=true
qit run:e2e my-extension \
  --php=8.2 \
  --wordpress=6.4 \
  --config=test-config.json
```