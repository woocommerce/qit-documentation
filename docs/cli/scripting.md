# Scripting

QIT CLI allows you to create robust scripts that can optimize your development workflow. Here is an example of a bash script used for authentication and running tests against a development build.

### Directory Structure

For this example, we will assume the following directory structure:

- .env
- bin/qit.sh
- package.json
- vendor/bin/qit
- build/extension.zip _(Assuming this is created by `npm run build`)_

### package.json

In your `package.json`, define the "qit-security" script. This script first builds the project and then executes `qit.sh`, loading environment variables from `.env` using dotenv.

```json
{
  "name": "Foo",
  "scripts": {
    "qit-security": "npm run build && dotenv -e .env -- bash ./bin/qit.sh"
  },
  "devDependencies": {
    "dotenv-cli": "^7.2.1"
  }
}
```

### .env

Create a `.env` file in the root directory of your project and add your QIT user and application password:

```bash
QIT_USER=foo
QIT_APP_PASS=bar
```

### Bash script (bin/qit.sh)

This script authenticates the QIT_USER and then runs security tests against the extension build. If the 'partner:remove' command is not available, it adds a partner using `QIT_USER` and `QIT_APP_PASSWORD`.

```bash
#!/bin/bash
set -x # Verbose mode.

# Check if QIT_USER and QIT_APP_PASSWORD are set and not empty
if [[ -z "${QIT_USER}" ]] || [[ -z "${QIT_APP_PASSWORD}" ]]; then
    echo "QIT_USER or QIT_APP_PASSWORD environment variables are not set or empty. Please set them before running the script."
    exit 1
fi

export QIT_DISABLE_ONBOARDING=yes

# If QIT_BINARY is not set, default to ./vendor/bin/qit
QIT_BINARY=${QIT_BINARY:-./vendor/bin/qit}

# Check if 'partner:remove' command is in the list of available commands
if ! $QIT_BINARY list | grep -q 'partner:remove'; then
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

With this setup, you can run the `qit-security` script with the command `npm run qit-security`. This command will build your project, perform the necessary authentication checks, add a partner if required, and finally, run security tests against your extension build.