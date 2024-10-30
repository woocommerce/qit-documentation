# Environment Variables

You can pass environment variables to your test context using the `--env` or `--env_file` options.

Passing a single env value:

```qitbash
qit run:e2e your-plugin --env FOO=FOO_VALUE
```

Passing multiple env values:

```qitbash
qit run:e2e your-plugin --env FOO=FOO_VALUE --env BAR=BAR_VALUE
```

Using a file:

```qitbash
qit run:e2e your-plugin --env_file .env
```