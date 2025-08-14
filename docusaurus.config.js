// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { duotoneDark, jettwaveDark, nightOwl, oneDark, themes as prismThemes, vsDark } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Easy automated tests for WooCommerce plugins and themes - QIT',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://qit.woo.com/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '', // Usually your GitHub org/user name.
  projectName: '', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',  // Docs at the root of the Docusaurus site
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/woocommerce/qit-documentation/tree/trunk',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: [],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            // Force trailing slash on URLs that don't have one:
            return items
                .map((item) => {
                  if (!item.url.endsWith('/')) {
                    item.url = `${item.url}/`;
                  }
                  return item;
                });
          },
        },
      }),
    ],
  ],

  // Add Mermaid support
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Quality Insights Toolkit',
        logo: {
          alt: 'Woo',
          src: 'img/logo.svg?v=1',
          href: '/',
          target: '_self',
        },
        items: [
          {
            href: 'https://stagingcompatibilitydashboard.wpcomstaging.com/',
            label: '← Back to QIT Website',
            position: 'right',
            target: '_self',
          },
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'right',
            label: 'Documentation',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()}. Made with 💜 by the WooCommerce team`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['php', 'bash', 'json', 'yaml', 'makefile'],
      },
      algolia: {
        // The application ID provided by Algolia.
        appId: 'XLDNDE9LL2',
        // Public API key: it is safe to commit it.
        apiKey: '29c11bf5cd152f048721ec14a3adeffd',
        indexName: 'qit-woo',
        contextualSearch: false,
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'dark'},
        options: {
          maxTextSize: 50000,
        },
      },
    }),

};

export default config;
