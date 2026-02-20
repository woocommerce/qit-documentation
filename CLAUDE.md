# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation site for QIT (Quality Insights Toolkit), WooCommerce's automated testing platform for WordPress plugins and themes. Built with **Docusaurus v3.8.1** and deployed to https://qit.woo.com/.

## Commands

```bash
# Install dependencies (requires Node 20, see .nvmrc)
npm install

# Local dev server with hot reload (http://localhost:3000)
npm start

# Production build (outputs to /build)
npm run build

# Serve built site locally
npm run serve

# Clear Docusaurus cache
npm run clear
```

No linting or test suites are configured.

## Architecture

**Docusaurus static site** with these key areas:

- `docs/` — All documentation content as Markdown files. Organized into sections matching the sidebar categories (core-concepts, managed-tests, custom-tests, environment, etc.)
- `sidebars.js` — Defines the documentation navigation structure. When adding/removing docs, update this file.
- `docusaurus.config.js` — Site configuration including Algolia search, Prism syntax highlighting languages, and strict broken link checking (`onBrokenLinks: 'throw'`).
- `src/components/` — React components used within docs (e.g., `TestTypes.js` renders the list of all QIT test types, reused across pages).
- `src/prism/qitbash.js` — Custom Prism language definition for QIT CLI command syntax highlighting. Used via the `qitbash` language tag in code blocks.
- `src/css/custom.css` — Global styles including color tokens for light/dark themes and custom Prism token colors for the `qitbash` language.
- `changelog/` — Version release notes.

## Key Conventions

- **Broken links are build errors.** Docusaurus is configured to throw on broken links, anchors, and markdown links. Always verify internal links after renaming or moving docs.
- **Package manager is npm**, not yarn (despite the README mentioning yarn — the lockfile is `package-lock.json`).
- **Main branch is `trunk`**, not `main` or `master`.
- **QIT CLI code blocks** use the custom `qitbash` language tag for syntax-highlighted CLI examples. Standard shell commands use `bash`.
- Docs use MDX, so React components can be imported and used directly in markdown files.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds the site and deploys via a PHP upload script. Pushes to `trunk` deploy to production; manual dispatch can target staging.
