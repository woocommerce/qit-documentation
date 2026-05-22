---
description: "Reference for all validation rules enforced by the qit.json schema. Covers naming constraints (alphanumeric, hyphens, underscores only; pattern ^[a-zA-Z0-9_-]+$), SUT validation (required fields, source type constraints), environment variable rules (all values must be strings), PHPStan level validation (integer 0-9), plugin/theme configuration formats, and profile/group structure requirements."
---

# Validation Rules

This page documents all validation rules, patterns, and constraints enforced by the QIT configuration schema.

## Naming Constraints

All names in QIT configuration files must follow this pattern: **alphanumeric characters, hyphens, and underscores only**.

**Pattern:** `^[a-zA-Z0-9_-]+$`

**Applies to:**
- Environment names
- Test type names
- Profile names
- Group names
- SUT slug
- Plugin slugs
- Theme slugs
- PHP extension names

**Valid Examples:**
- ✅ `test-checkout`
- ✅ `my_profile`
- ✅ `env123`
- ✅ `smoke-test-v2`

**Invalid Examples:**
- ❌ `test checkout` (contains space)
- ❌ `my.profile` (contains period)
- ❌ `env@home` (contains special character)
- ❌ `profile!` (contains exclamation mark)

---

## Version Formats

### PHP Version

**Pattern:** `^[0-9]+\.[0-9]+(\.[0-9]+)?$`

Must be in format `X.Y` or `X.Y.Z` where X, Y, Z are digits.

**Valid Examples:**
- ✅ `"8.0"`
- ✅ `"7.4"`
- ✅ `"8.3.1"`
- ✅ `"8.2.15"`

**Invalid Examples:**
- ❌ `"php8.0"` (contains prefix)
- ❌ `"8"` (missing minor version)
- ❌ `"8.0.0.1"` (too many parts)
- ❌ `"8.x"` (contains non-digit)

**Applies to:**
- Environment `php` property
- Profile `php` property

---

### WordPress and WooCommerce Versions

**Valid Values:**
- `"stable"` - Current stable release (default)
- `"rc"` - Release candidate
- `"nightly"` - Development/nightly build
- `"latest"` - Latest available version
- Specific versions - e.g., `"6.4"`, `"8.5.0"`

**Examples:**
```json
{
  "wp": "6.5",        // Specific version
  "woo": "stable",    // Keyword
  "php": "8.2"        // Must follow X.Y format
}
```

---

## Source URLs

**Pattern:** `^https?://.*\.zip$`

All source URLs must:
- Use HTTP or HTTPS protocol
- End with `.zip` extension

**Valid Examples:**
- ✅ `"https://example.com/plugin.zip"`
- ✅ `"http://example.com/my-theme.zip"`
- ✅ `"https://github.com/user/repo/archive/v1.0.zip"`

**Invalid Examples:**
- ❌ `"ftp://example.com/plugin.zip"` (wrong protocol)
- ❌ `"https://example.com/plugin"` (missing .zip)
- ❌ `"https://example.com/plugin.tar.gz"` (wrong extension)

**Applies to:**
- SUT source URL
- Plugin URLs
- Theme URLs

---

## File Paths

### Local Paths

**Pattern:** `^(/|\.\/|\.\.\/).*`

Local file paths must start with:
- `/` for absolute paths
- `./` for relative to current directory
- `../` for relative to parent directory

**Valid Examples:**
- ✅ `"/absolute/path/to/plugin"`
- ✅ `"./relative/plugin"`
- ✅ `"../parent/plugin"`

**Invalid Examples:**
- ❌ `"relative/plugin"` (missing ./ prefix)
- ❌ `"~/home/plugin"` (tilde not supported)

**Applies to:**
- Plugin paths (simple string format)
- Theme paths (simple string format)
- SUT local source path
- Plugin/theme config `path` property

---

## Volume Mappings

**Pattern:** `^[^:]+:[^:]+$`

Volume mappings must:
- Contain exactly one colon (`:`)
- Have non-empty source (before colon)
- Have non-empty destination (after colon)

**Format:** `source:destination`

**Valid Examples:**
- ✅ `"./local:/var/www/html/wp-content/plugins/my-plugin"`
- ✅ `"/absolute/path:/container/path"`
- ✅ `"./build:/wp-content/themes/my-theme"`

**Invalid Examples:**
- ❌ `"./local"` (missing colon and destination)
- ❌ `":/container"` (empty source)
- ❌ `"./local:"` (empty destination)
- ❌ `"./local:/container:/extra"` (too many colons)

---

## Global Setup Packages

**Value Type:** Array of strings (test package references)

The `global_setup` property in environments specifies test packages that should run **only their globalSetup phase** for environment configuration.

**Valid Examples:**
- ✅ `["./utility-packages/setup-woocommerce"]`
- ✅ `["woocommerce/minimal:latest"]`
- ✅ `["./local/path", "namespace/package:1.0"]`

**What it does:**
1. Runs the globalSetup phase from specified packages
2. Skips test execution phases (run, setup, etc.)
3. Changes persist to database snapshot

**Common uses:**
- Dismiss onboarding wizards
- Configure payment gateways
- Import sample data
- Set plugin defaults

See [Environments Documentation](environments.md#utility-packages) for detailed examples.

---

## Environment Variables

All environment variable **values** must be strings.

**Valid Examples:**
```json
{
  "envs": {
    "WP_DEBUG": "true",           // ✅ String
    "WP_DEBUG_LOG": "true",       // ✅ String
    "SCRIPT_DEBUG": "true",       // ✅ String
    "MY_CUSTOM_VAR": "123"        // ✅ String (numbers must be quoted)
  }
}
```

**Invalid Examples:**
```json
{
  "envs": {
    "WP_DEBUG": true,             // ❌ Boolean not allowed
    "MY_NUMBER": 123,             // ❌ Number not allowed
    "MY_ARRAY": ["value"]         // ❌ Array not allowed
  }
}
```

**Remember:** Even for boolean or numeric values, use strings: `"true"`, `"false"`, `"123"`

---

## PHPStan Analysis Level

**Range:** 0 to 9 (inclusive)

Must be an integer between 0 (lowest) and 9 (highest strictness).

**Valid Examples:**
- ✅ `"phpstan_level": 0`
- ✅ `"phpstan_level": 5`
- ✅ `"phpstan_level": 9`

**Invalid Examples:**
- ❌ `"phpstan_level": 10` (exceeds maximum)
- ❌ `"phpstan_level": -1` (below minimum)
- ❌ `"phpstan_level": "5"` (must be number, not string)

---

## Plugin and Theme Configuration

### Simple String Formats

Plugins and themes in the `plugins` and `themes` arrays can be specified as simple strings in three formats:

1. **WordPress.org slug** - Must match `^[a-zA-Z0-9_-]+$`
   ```json
   "plugins": ["woocommerce", "jetpack"]
   ```

2. **URL** - Must match `^https?://` and end with `.zip`
   ```json
   "plugins": ["https://example.com/plugin.zip"]
   ```

3. **Local path** - Must match `^(/|\.\/|\.\.\/).*`
   ```json
   "plugins": ["./build/my-plugin", "/absolute/path/plugin"]
   ```

### Object Format

For more control, use object format:

```json
{
  "slug": "plugin-name",          // Must match ^[a-zA-Z0-9_-]+$
  "from": "wporg|wccom|local|url",
  "version": "stable",             // Optional (wporg/wccom only)
  "path": "./path",                // Required for local
  "url": "https://example.com/plugin.zip",  // Required for url
  "build": "npm run build"         // Optional build command
}
```

---

## SUT Configuration

### Required Fields

- `type` - Must be `"plugin"` or `"theme"`
- `slug` - Must match `^[a-zA-Z0-9_-]+$` and have minimum length 1
- `source` - Object with source configuration

### Source Types

Same validation rules as plugin/theme sources:
- `local` - Requires `path`, optional `build`
- `url` - Requires `url` (must be HTTP/HTTPS ending in .zip)
- `wporg` - Optional `version` (default: "stable")
- `wccom` - Optional `version` (default: "stable")

---

## Common Validation Errors

### "Invalid property name"
**Cause:** Name contains spaces or special characters
**Fix:** Use only alphanumeric, hyphens, underscores: `my-profile` instead of `my.profile`

### "Invalid PHP version format"
**Cause:** Version doesn't match X.Y or X.Y.Z pattern
**Fix:** Use format like `"8.0"` instead of `"php8.0"` or `"8"`

### "URL must end with .zip"
**Cause:** Source URL doesn't have .zip extension
**Fix:** Ensure URL ends with `.zip`: `https://example.com/plugin.zip`

### "Invalid volume mapping"
**Cause:** Volume doesn't follow source:destination pattern
**Fix:** Use format `./local:/container/path` with exactly one colon

### "Environment variable must be string"
**Cause:** Used boolean or number instead of string
**Fix:** Quote all values: `"WP_DEBUG": "true"` not `"WP_DEBUG": true`

---

## Schema Reference

For the complete JSON schema with all validation rules, see:
`https://raw.githubusercontent.com/woocommerce/qit-cli/trunk/src/src/PreCommand/Schemas/qit-schema.json`

Add to your `qit.json`:
```json
{
  "$schema": "https://raw.githubusercontent.com/woocommerce/qit-cli/trunk/src/src/PreCommand/Schemas/qit-schema.json"
}
```

This enables IDE validation and autocomplete.
