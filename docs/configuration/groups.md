---
description: "Guide to test groups in qit.json. Groups batch multiple test profiles across different test types into a single `qit run:group` command. Covers group structure (maps test type names to arrays of profile names), common patterns for CI pipelines (ci-quick, ci-full) and release stages (alpha, beta, release), and the --only flag to run a specific test type within a group. Naming rules: alphanumeric, hyphens, underscores only."
---

# Test Groups

Groups allow batch execution of multiple test profiles across different test types.

## Overview

Run multiple test profiles with one command:

```json
{
  "groups": {
    "pre-release": {
      "e2e": ["smoke", "full"],
      "security": ["scan"],
      "phpstan": ["strict"]
    }
  }
}
```

Run all:
```bash
qit run:group pre-release
```

## Group Structure

Groups map test types to profile arrays:

```json
{
  "groups": {
    "group-name": {
      "test-type": ["profile1", "profile2"],
      "another-type": ["profile3"]
    }
  }
}
```

**Naming Rules:**
- Group names, test type names, and profile names must use only alphanumeric, hyphens (`-`), underscores (`_`)
- No spaces or special characters
- See [Validation Rules](validation-rules.md#naming-constraints)

## Common Group Patterns

### CI Pipeline Groups

```json
{
  "groups": {
    "ci-quick": {
      "e2e": ["smoke"]
    },
    "ci-full": {
      "e2e": ["smoke", "full", "compatibility"],
      "security": ["scan"],
      "phpstan": ["analysis"]
    }
  }
}
```

### Release Groups

```json
{
  "groups": {
    "alpha": {
      "e2e": ["smoke"]
    },
    "beta": {
      "e2e": ["smoke", "full"],
      "security": ["scan"]
    },
    "release": {
      "e2e": ["smoke", "full", "compatibility"],
      "security": ["scan"],
      "phpstan": ["strict"],
      "phpcompatibility": ["check"]
    }
  }
}
```

## Using Groups

### Run a Group

```bash
qit run:group pre-release
```

### Run Specific Test Type in Group

```bash
qit run:group pre-release --only=e2e
```

## Best Practices

- Use descriptive group names
- Group related test profiles
- Document group purposes
- Keep groups maintainable

## Related Topics

- [Test Profiles](profiles.md) - Individual test configurations
- [qit.json Structure](qit-json.md) - Complete configuration