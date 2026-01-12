# Integrating QIT with GitHub workflows

By integrating QIT into your GitHub Actions workflows, you can automatically test your extension whenever changes are pushed, pull requests are opened, or releases are created. This tight integration helps you detect issues earlier, streamline your CI/CD pipeline, and maintain consistent code quality over time.

## Prerequisites

- **GitHub repository:** Your extension should be in a GitHub repository where you can configure workflows.


## Example GitHub workflow

Below is a simplified GitHub Actions workflow example. Adapt it to your extension's requirements.

`.github/workflows/qit-tests.yml`

```yaml
name: QIT Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  qit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install PHP & Composer
        run: sudo apt-get update && sudo apt-get install -y php-cli php-zip unzip

      - name: Install QIT CLI
        run: composer global require woocommerce/qit-cli

      - name: Add Composer global bin to PATH
        run: echo "$(composer global config bin-dir --absolute 2>/dev/null)" >> $GITHUB_PATH

      - name: Authenticate QIT
        run: qit partner:add --user='${{ secrets.QIT_USER }}' --application_password='${{ secrets.QIT_APP_PASS }}'

      - name: Run Activation Test
        run: qit run:activation your-extension --wait

      - name: Run Security Test
        run: qit run:security your-extension --wait
```

**Key Points in this Example:**
- **Authenticate QIT:** Use secrets to store QIT credentials (QIT_USER and QIT_APP_PASS) securely.
- **Trigger on PR & push:** The workflow runs on pull requests and pushes to the main branch.
- **Wait for completion:** The `--wait` flag ensures the workflow waits for test completion before proceeding.

## Storing credentials securely

Store your QIT credentials as GitHub Secrets to avoid exposing them in the repository. For example, go to your repository settings, add `QIT_USER` and `QIT_APP_PASS` as secrets, and reference them in the workflow.

## Benefits of CI integration

- **Early detection:** Catch regressions, security issues, or compatibility problems before merging changes.
- **Automated validation:** Ensure that all commits passing through your main branch are tested and meet quality standards.
- **Faster feedback loop:** Developers receive immediate feedback, reducing the time spent manually verifying code changes.
