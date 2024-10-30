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

## Reading the environment variables

You can read the environment variables in your tests bootstrap, example:

bootstrap.sh

```bash
echo $FOO
echo $BAR
```

some-test.spec.js

```js
console.log(process.env.FOO);
console.log(process.env.BAR);
```

And in your plugin's code:

```php
echo getenv('FOO');
echo getenv('BAR');
```