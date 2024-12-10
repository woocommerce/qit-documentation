# Scripting

QIT CLI allows you to integrate test execution into scripts, automating repetitive tasks and optimizing your development workflow. By writing simple shell, NPM, Composer, or Make scripts, you can streamline how you authenticate QIT, run tests, and react to results.

## Why scripting?

- **Automation:** Run tests automatically on commit, pull request, or release events.
- **Consistency:** Ensure all developers execute tests with the same parameters and environment each time.
- **Integration with CI/CD:** Seamlessly incorporate QIT tests into GitHub Actions, Jenkins, or other CI pipelines.

## Example: bash script

Here's an example of a bash script (`bin/qit.sh`) used for authentication and running a security test against a development build of your extension:

```bash
#!/bin/bash
set -x # Verbose mode.

# Check if QIT_USER and QIT_APP_PASSWORD are set and not empty
if [[ -z "${QIT_USER}" ]] || [[ -z "${QIT_APP_PASSWORD}" ]]; then
    echo "QIT_USER or QIT_APP_PASSWORD environment variables are not set or empty. Please set them before running the script."
    exit 1
fi

# When QIT is run for the first time, it will prompt for onboarding. this will disable that prompt.
export QIT_DISABLE_ONBOARDING=yes

# If QIT_BINARY is not set, default to ./vendor/bin/qit
QIT_BINARY=${QIT_BINARY:-./vendor/bin/qit}

# Check if 'partner:remove' command is in the list of available commands
if ! $QIT_BINARY list | grep -q "partner:remove"; then
    echo "Adding partner with QIT_USER and QIT_APP_PASSWORD..."
    $QIT_BINARY partner:add --user="${QIT_USER}" --application_password="${QIT_APP_PASSWORD}"
    if [ $? -ne 0 ]; then
        echo "Failed to add partner. Exiting with status 1."
        exit 1
    fi
fi

# Run the security command
echo "Running security command..."
$QIT_BINARY run:security my-extension --zip=./../build/extension.zip --wait
if [ $? -ne 0 ]; then
    echo "Failed to run security command. Exiting with status 1."
    exit 1
fi
```

This script:
- Authenticates QIT if needed.
- Runs a security test against a local zip file.
- Exits with a non-zero status if the test fails, aiding CI pipelines that rely on exit codes.

## Script runners

You can choose different script runners based on your preference:

### NPM

Use NPM to define scripts in `package.json`:
```json
{
  "scripts": {
    "qit-security": "npm run build && dotenv -e .env -- bash ./bin/qit.sh",
    "build": "zip -r build/extension.zip my-extension"
  },
  "devDependencies": {
    "dotenv-cli": "^7.2.1"
  }
}
```

Now run:
```bash
npm run qit-security
```

### Composer

Use Composer scripts in `composer.json`:
```json
{
  "scripts": {
    "build": "zip -r build/extension.zip my-extension",
    "qit-security": "export $(cat .env | xargs) && composer run-script build && ./bin/qit.sh"
  }
}
```

Then:
```bash
composer run qit-security
```

### Makefile

Use Make for a more traditional Unix-based approach:
```makefile
include ./.env
export

build:
    zip -r build/extension.zip my-extension

qit-security: build
    bash ./bin/qit.sh
```

Run:
```bash
make qit-security
```

## Tips for scripting

- **Check exit codes:** Your scripts should check the exit code of QIT commands and handle failures appropriately, for instance by failing the CI job or sending notifications.
- **Use environment variables:** Pass credentials, tokens, or feature flags via environment variables instead of hardcoding them.
- **Combine with config files:** Store stable configuration (WP, WC versions) in qit.yml, while using scripting for tasks that vary per run.

## Advanced scenarios

- **Multi-step CI pipelines:** A CI pipeline might authenticate QIT, run activation tests, security tests, and E2E tests in parallel, and aggregate results.
- **Conditional logic:** Scripts can run different sets of tests based on branch name, tag, or commit message.
- **Failure hooks:** If a test fails, the script can post a message to Slack, create a GitHub issue, or revert a commit automatically.
