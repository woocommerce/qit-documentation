# Test Package Docs Audit TODO

Audit each page against actual CLI behavior and code.
Delete this file when done.

## Already audited and fixed
- [x] test-packages/index.md
- [x] test-packages/tutorials/quickstart.md
- [x] test-packages/tutorials/sharing-packages.md
- [x] test-packages/tutorials/combining-packages.md
- [x] test-packages/tutorials/publishing-focused-packages.md
- [x] test-packages/how-to/create-packages.md
- [x] test-packages/how-to/use-secrets.md

## Remaining to audit
- [x] test-packages/manifest.md
- [x] test-packages/lifecycle.md
- [x] test-packages/concepts.md
- [x] test-packages/concepts/global-setup.md
- [x] test-packages/concepts/subpackages.md
- [ ] test-packages/commands.md — NEEDS MAJOR REWRITE: 796 lines with wrong defaults (PHP 8.1→8.2, latest→stable, --wordpress→--wordpress_version, qit-config.json→qit.json). Hand-written options tables should be replaced with auto-generated CLI help + keep examples
- [x] test-packages/results.md — OK, no issues found
- [x] test-packages/examples.md — Fixed: qit-config.json→qit.json, wordpress→wp, woocommerce→woo, latest→stable, broken context.newPage(). Note: CommonJS vs ESM inconsistency with scaffold remains (minor)
- [x] test-packages/secrets.md — Fixed JSON comments, added --env_file mention
- [x] test-packages/ci.md — Fixed --wordpress→--wp, latest→stable in matrix examples
- [x] test-packages/ai-development.md — Fixed: removed phantom "namespace" field, added package_type
- [x] test-packages/sharding.md — OK, correctly documents sharding is not supported
- [x] test-packages/utility-packages.md — Fixed JSON comments
- [x] test-packages/reference/network-requirements.md — Fixed: requires_network→requires.network, removed JSON comment, fixed manifest example structure
- [x] test-packages/troubleshooting.md — Fixed: phantom "namespace" field, [host] prefix→host: prefix, execution venue docs. Note: still has JSON comments throughout (in troubleshooting context, less critical)
