# Environment variables

`The local test environment is available as early-access.`

## Introduction

Environment variables let you pass configuration values, secrets, or feature flags into your QIT test environment without hardcoding them in your tests or code. By injecting environment variables at runtime, you can easily adjust behavior, supply API keys, toggle features, or run tests under different conditions.

## Passing environment variables

You can set environment variables directly via the CLI using the `--env` option:

```bash
qit run:e2e your-extension --env FOO=FOO_VALUE
```

You can specify multiple variables:

```bash
qit run:e2e your-extension --env FOO=FOO_VALUE --env BAR=BAR_VALUE
```

## Using an environment file

If you have many environment variables or prefer keeping them organized in a file, use the `--env_file` option:

```bash
qit run:e2e your-extension --env_file .env
```

In the `.env` file:
```env
FOO=FOO_VALUE
BAR=BAR_VALUE
```

All variables defined in the `.env` file are loaded into the environment during the test run.

## Reading variables in tests and code

### Within tests

In your Playwright tests (or bootstrap scripts), you can access environment variables using `process.env`:

```javascript
console.log(process.env.FOO);
```

Use this to conditionally adjust test logic, endpoints, or credentials without changing test code.

### Within PHP code

Your plugin code can read environment variables via `getenv`:
```php
$value = getenv("FOO");
```

This allows your extension to adapt based on values you pass at test runtime, such as using a staging API endpoint instead of production.

### QIT helpers

If you're using QIT Helpers in your tests:
- `qit.getEnv("MY_ENV_VAR")` retrieves an environment variable within the test script.
- `qit.setEnv("MY_ENV_VAR", "my-value")` sets or overrides an environment variable dynamically.

## Best practices

- **Keep secrets out of code:** Store API keys, tokens, or other sensitive data in environment variables rather than committing them to your repository.
- **Use .env files for collaboration:** By versioning a template `.env.example` (without sensitive values), team members can create their own `.env` files, ensuring consistency.
- **Combine with config files:** Use environment variables alongside config files (qit.yml or qit.json) to handle dynamic values that should not be hardcoded.

## Overriding variables

If a variable is set in both the CLI and an `.env` file, the CLI argument takes precedence. This lets you temporarily override values without editing the file.

## Example scenario

1. Create a `.env` file:
```env
API_URL=https://staging.api.example.com
API_KEY=12345
```

2. Run tests:
```bash
qit run:e2e your-extension --env_file .env
```

Your tests and plugin code can now reference `API_URL` and `API_KEY` from `process.env` or `getenv`, enabling staging endpoint tests without changing code.
