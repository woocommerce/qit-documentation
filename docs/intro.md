---
sidebar_position: 1
slug: /
hide_table_of_contents: true
hide_title: true
pagination_next: null
title: "QIT: Quality Insights Toolkit"
description: "QIT (Quality Insights Toolkit) is an automated testing platform for WooCommerce extensions. The official quality gateway for the WooCommerce.com Marketplace, built by Automattic. AI-first: let your coding agent drive the CLI."
---

<div className="qit-hero-title">Quality Insights Toolkit</div>
<p className="qit-hero-sub">
  Automated testing infrastructure for WooCommerce extensions.<br />
  The official quality gateway for the <strong>WooCommerce.com Marketplace</strong>.
</p>

<div className="qit-diagram">

```mermaid
graph TD
    Dev[🧑‍💻 Developer<br/>Creates/Updates Extension]
    Dev -->|Publishes| Gate[🛡️ QIT Gateway]
    Gate --> MT[Managed Tests<br/>━━━━━━━━━<br/>Woo E2E Tests<br/>Woo API Tests<br/>Activation Tests<br/>Security Tests<br/>PHPStan Tests<br/>Code Compatibility Tests<br/>Malware Tests<br/>Validation Tests<br/>Plugin Check Tests<br/>Performance Tests]
    Gate --> TP[Test Packages<br/>━━━━━━━━━<br/>E2E Testing<br/>• Custom Plugin Behavior<br/>• Cross-Plugin Compatibility]
    MT --> Market[✅ Trusted Marketplaces]
    TP --> Market
    Market --> Users[👥 Users<br/>Install and Update with Confidence]

    classDef developer fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b
    classDef gateway fill:#fff3e0,stroke:#f9a825,stroke-width:3px,color:#f57f17
    classDef tests fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c
    classDef market fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#1b5e20
    classDef users fill:#e0f2f1,stroke:#00796b,stroke-width:2px,color:#004d40

    class Dev developer
    class Gate gateway
    class MT,TP tests
    class Market market
    class Users users
```

</div>

<div className="qit-grid">
  <div className="qit-card">
    <div className="qit-card-icon">🛡️</div>
    <h3>Managed Tests</h3>
    <p>10 automated checks (security, compatibility, performance, static analysis) that run with zero setup. Same checks locally, in CI, and at the marketplace gate.</p>
  </div>
  <div className="qit-card">
    <div className="qit-card-icon">🧩</div>
    <h3>Test Packages</h3>
    <p>Playwright-based E2E tests in a standardized format. Combine packages from different plugins in one run to verify cross-plugin compatibility.</p>
  </div>
  <div className="qit-card">
    <div className="qit-card-icon">🐳</div>
    <h3>Local Environment</h3>
    <p>Sandboxed, Alpine-based Docker environments optimized for CI and automated testing. Spin up, test, tear down.</p>
  </div>
  <div className="qit-card">
    <div className="qit-card-icon">⚙️</div>
    <h3>CI-Ready</h3>
    <p>Single CLI that works the same everywhere. Run the full suite in GitHub Actions with <code>qit run</code>. Same commands, same results.</p>
  </div>
</div>

<div className="qit-ai-banner">
  <div className="qit-ai-banner-icon">🤖</div>
  <div>
    <h3>AI-First</h3>
    <p>
      QIT is a CLI designed to be driven by your AI coding agent. Install the <strong>Claude Code</strong> plugin and your agent gets full QIT expertise: running tests, creating test packages, debugging failures, and configuring projects.
    </p>
    <code>/plugin marketplace add woocommerce/qit-cli</code><br />
    <code>/plugin install qit@woocommerce-qit</code>
    <p style={{marginTop: '0.75rem'}}>
      Using another AI assistant? Point it to <a href="https://qit.woo.com/docs/llms.txt">qit.woo.com/docs/llms.txt</a> and ask it to take it from there.
    </p>
  </div>
</div>

<div style={{textAlign: 'center'}}>
<a className="qit-cta" href="/docs/getting-started/">Get Started with QIT →</a>
</div>
