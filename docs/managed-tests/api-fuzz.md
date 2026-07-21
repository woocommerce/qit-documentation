---
description: "Reference for the authenticated beta `run:api-fuzz` managed test. Covers plugin-owned REST route discovery, anonymous and administrator fuzzing, the 20-minute/2,500-request budget, clean-state confirmation replays, lifecycle and campaign states, exit codes, reports, exact-fingerprint suppressions, artifacts, asynchronous and JSON workflows, and beta feedback."
---

# API fuzz tests

::::info Beta — feedback welcome
API fuzz testing is a new, authenticated beta for WooCommerce plugins. We are gathering feedback about route discovery, findings, reports, and false positives. Share a test run ID and any relevant finding IDs with [QIT support](../support/contact-us.md), open a [GitHub issue](https://github.com/woocommerce/qit-cli/issues), or run `qit feedback "your message"`.
::::

API fuzz tests exercise the WordPress REST API routes owned by your plugin. QIT derives request shapes from the registered route metadata, generates valid and invalid inputs, and looks for reproducible server errors in a disposable environment.

This test is different from [Woo API tests](./woo-api.md). Woo API tests run a fixed compatibility suite against WooCommerce Core endpoints. API fuzz tests discover the routes your plugin adds or changes and generate requests from their schemas.

The beta is available to authenticated WooCommerce plugin owners and uses a fixed environment with stable WordPress, stable WooCommerce, and PHP 8.3. It runs only when explicitly requested and is not part of groups, mass tests, release automation, or marketplace policy.

## How the campaign works

1. QIT starts a disposable WordPress and WooCommerce environment and activates your plugin.
2. It compares the REST API registry before and after activation to find operations added or modified by the plugin. Shared WordPress, WooCommerce, or dependency operations are recorded separately and excluded from the primary campaign.
3. QIT exercises usable plugin-owned operations as both an anonymous visitor and an administrator. It performs a breadth pass before spending the remaining budget on deeper generation.
4. The database and persistent object cache are reset between operation batches. Marked requests cannot send external HTTP requests or email.
5. A candidate PHP fatal, uncaught exception, or unexpected 5xx response is minimized and must reproduce in **two additional clean-state confirmation replays** before it becomes a confirmed finding.

The campaign can generate up to **2,500 requests** and run for up to **20 minutes**. Some of that budget is reserved for confirmation. If QIT cannot exercise and confirm the complete usable surface within the budget, it reports a `partial` campaign instead of claiming a clean result.

:::note Isolation boundary
Database state and the persistent object cache are restored during the campaign. Filesystem changes are not restored between requests. The entire environment is discarded after the run, but filesystem-dependent findings may need additional review.
:::

## Run an API fuzz test

Run against the current published build using its WooCommerce.com slug or numeric product ID:

```qitbash
qit run:api-fuzz my-plugin
qit run:api-fuzz 123456
```

Test a development build using a local ZIP, a local plugin directory, or a remote HTTP(S) ZIP:

```qitbash
qit run:api-fuzz my-plugin --zip=./my-plugin.zip
qit run:api-fuzz my-plugin --zip=./my-plugin
qit run:api-fuzz my-plugin --zip=https://example.com/my-plugin.zip
```

QIT uploads artifact inputs through the standard secure upload flow and associates them with the extension given as the command argument.

## Synchronous, asynchronous, and JSON workflows

By default, the command waits for the final Manager lifecycle status. API fuzz tests use a 45-minute client timeout so queueing, setup, the campaign, confirmation, teardown, and result delivery have time to finish:

```qitbash
qit run:api-fuzz my-plugin
qit run:api-fuzz my-plugin --timeout=3600
```

Use `--async` to enqueue the test and return immediately, then follow it with `qit get`:

```qitbash
qit run:api-fuzz my-plugin --async
qit get <test-run-id>
```

Use JSON output for automation or to inspect the complete normalized result:

```qitbash
qit run:api-fuzz my-plugin --json
qit run:api-fuzz my-plugin --async --json
qit get <test-run-id> --json
```

An asynchronous JSON response includes the test ID, pending lifecycle status, and report URL. Campaign data appears only after a result exists. In completed results, `test_result_json` is a decoded JSON object rather than a nested JSON string.

Pressing Ctrl+C stops the local wait but does not cancel the remote test. Check it later with `qit get <test-run-id>`. QIT may cancel an older identical run when a newer duplicate is dispatched; `cancelled` remains a lifecycle status and is never reported as campaign `unavailable`.

## Understand states and exit codes

API fuzz output keeps platform lifecycle and campaign completeness separate:

| Field | Meaning | Values |
| --- | --- | --- |
| `Status` | Manager lifecycle and overall outcome | `pending`, `dispatched`, `running`, `success`, `warning`, `failed`, `hanged`, `cancelled` |
| `Campaign State` | State of the fuzz campaign in `test_result_json.campaign.state` | `completed`, `partial`, `not_applicable`, `unavailable` |

`unavailable` is a campaign state. The Manager maps it to lifecycle `failed` before the CLI receives the final result. Cancellation is different: it remains lifecycle `cancelled` and does not create an `unavailable` campaign.

The CLI uses these exit codes:

| Exit code | Interpretation |
| --- | --- |
| `0` | The campaign completed without confirmed actionable findings. |
| `1` | A plugin-attributed finding was confirmed, the campaign was unavailable, or the lifecycle ended as failed, hanged, or cancelled. |
| `3` | Review is needed, but the plugin did not receive a failure outcome—for example a partial or not-applicable campaign, or a confirmed fault attributed to shared/core code. |

A `not_applicable` campaign means activation exposed no usable plugin-owned REST operations. It is not a clean pass because no plugin-owned API surface was exercised.

## Review findings and coverage

The report and normalized JSON result include:

- discovered, selected, exercised, and excluded operations;
- anonymous and administrator coverage;
- the minimized request and clean-state confirmation evidence;
- the route owner and fault origin;
- grouped findings, anomalies, suppressions, and campaign errors.

`route_owner` identifies the plugin whose REST operation was exercised. `fault_origin` identifies where the confirmed fault occurred. A plugin-owned route can fail inside WordPress, WooCommerce, or another dependency. Confirmed faults attributed to the tested plugin fail the run; shared or core faults produce a warning so the evidence is visible without treating it as a plugin failure.

## Handle false positives and suppressions

Each confirmed finding has a stable 64-character SHA-256 **Finding ID** (its fingerprint). API fuzz suppressions match that complete fingerprint only; route-wide, status-wide, wildcard, and partial matches are not supported.

During the beta, suppression requests follow this flow:

1. Review the minimized request, confirmation replays, `route_owner`, and `fault_origin` in the report.
2. Reproduce the behavior on an equivalent disposable site when possible.
3. If the finding is a false positive or an accepted upstream/framework behavior, contact QIT with the test run ID, Finding ID, reason, and any upstream issue link.
4. The QIT team reviews the evidence. An accepted suppression records an owner, reason, and optional expiry date in the managed suppression list.
5. Rerun the test. An applied suppression remains visible and counted in the report and normalized JSON for auditing, but it does not create an actionable normalized finding or affect the outcome as an unsuppressed finding would.

There is no plugin-local suppression file or CLI suppression option for managed API fuzz runs. Expired, malformed, or non-exact suppression records are ignored. Because the fingerprint includes finding evidence, a meaningful code or fault change can produce a new Finding ID that requires fresh review.

## Report URLs are sensitive

QIT report URLs contain a secret token and should be treated like bearer links. Interactive synchronous runs and `qit get` display the URL, matching other managed tests. Async and non-interactive output require an explicit request:

```qitbash
qit run:api-fuzz my-plugin --async --print-report-url
qit run:api-fuzz my-plugin --print-report-url # non-interactive/CI output
```

JSON output preserves the Manager response and includes the report URL when one is available. Avoid printing it in public CI logs, issue descriptions, or chat channels.

## CLI usage

{/* QIT_COMMAND:run:api-fuzz */}
