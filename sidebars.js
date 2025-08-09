// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    docsSidebar: [
        {
            type: 'doc',
            id: 'intro', // maps to docs/intro.md
            label: 'Introduction to QIT',
        },
        {
            type: 'category',
            label: 'Core Concepts',
            collapsed: true,
            items: [
                'core-concepts/how-qit-works',
                'core-concepts/test-types-overview',
                'core-concepts/marketplace-overview',
            ],
        },
        {
            type: 'category',
            label: 'Installation & Setup',
            collapsed: true,
            items: [
                'installation-setup/cli-installation',
                'installation-setup/authenticating',
                'installation-setup/local-env-setup',
            ],
        },
        {
            type: 'category',
            label: 'Using QIT',
            collapsed: true,
            items: [
                'using-qit/running-tests-cli',
                'using-qit/running-tests-dashboard',
                'using-qit/github-workflows',
                'using-qit/notifications-results',
            ],
        },
        {
            type: 'category',
            label: 'Managed Tests',
            collapsed: true,
            items: [
                'managed-tests/introduction',
                'managed-tests/activation',
                'managed-tests/woo-e2e',
                'managed-tests/woo-api',
                'managed-tests/security',
                'managed-tests/phpcompatibility',
                'managed-tests/phpstan',
                'managed-tests/malware',
                'managed-tests/validation',
                'managed-tests/plugin-check',
                'managed-tests/extension-sets',
                'managed-tests/group-tests',
            ],
        },
        {
            type: 'category',
            label: 'Test Packages',
            collapsed: true,
            items: [
                'test-packages/index',
                {
                    type: 'category',
                    label: 'Core Concepts',
                    collapsed: true,
                    items: [
                        'test-packages/concepts',
                        'test-packages/manifest',
                        'test-packages/lifecycle',
                    ],
                },
                {
                    type: 'category',
                    label: 'Development',
                    collapsed: true,
                    items: [
                        'test-packages/development-workflow',
                        'test-packages/ai-development',
                        'test-packages/packages',
                    ],
                },
                {
                    type: 'category',
                    label: 'Configuration',
                    collapsed: true,
                    items: [
                        'test-packages/qit-config',
                        'test-packages/test-profiles',
                        'test-packages/utility-packages',
                    ],
                },
                {
                    type: 'category',
                    label: 'Execution',
                    collapsed: true,
                    items: [
                        'test-packages/commands',
                        'test-packages/secrets',
                        'test-packages/results',
                    ],
                },
                {
                    type: 'category',
                    label: 'Deployment',
                    collapsed: true,
                    items: [
                        'test-packages/ci',
                        'test-packages/examples',
                        'test-packages/troubleshooting',
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Test Packages 2.0',
            collapsed: false,
            items: [
                {
                    type: 'category',
                    label: 'Start Here',
                    collapsed: false,
                    items: [
                        'test-packages-new/start-here/what-are-test-packages',
                        'test-packages-new/start-here/quickstart-scaffold-run-verify',
                        'test-packages-new/start-here/tutorial-first-multipackage-run',
                        'test-packages-new/start-here/package-registry-and-versioning',
                    ],
                },
                {
                    type: 'category',
                    label: 'Concepts',
                    collapsed: true,
                    items: [
                        'test-packages-new/concepts/architecture-and-lifecycle',
                        'test-packages-new/concepts/orchestration-and-execution-order',
                        'test-packages-new/concepts/venues-host-vs-container',
                        'test-packages-new/concepts/isolation-semantics',
                        'test-packages-new/concepts/environment-models',
                        'test-packages-new/concepts/package-capabilities',
                        'test-packages-new/concepts/results-and-artifacts',
                    ],
                },
                {
                    type: 'category',
                    label: 'How-To Guides',
                    collapsed: true,
                    items: [
                        'test-packages-new/how-to-guides/scaffold-test-package',
                        'test-packages-new/how-to-guides/configure-playwright-ctrf',
                        'test-packages-new/how-to-guides/run-only-global-setup',
                        'test-packages-new/how-to-guides/pass-playwright-options',
                        'test-packages-new/how-to-guides/manage-secrets',
                        'test-packages-new/how-to-guides/ci-github-actions',
                    ],
                },
                {
                    type: 'category',
                    label: 'Reference',
                    collapsed: true,
                    items: [
                        'test-packages-new/reference/cli-commands',
                        'test-packages-new/reference/manifest-schema',
                        'test-packages-new/reference/qit-json-schema',
                        'test-packages-new/reference/environment-variables',
                    ],
                },
                {
                    type: 'category',
                    label: 'Operations',
                    collapsed: true,
                    items: [
                        'test-packages-new/operations/troubleshooting',
                    ],
                },
                {
                    type: 'category',
                    label: 'Examples',
                    collapsed: true,
                    items: [
                        'test-packages-new/examples/index',
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Environment & Configuration',
            collapsed: true,
            items: [
                'environment/introduction',
                'environment/creating-config-files',
                'environment/installing-plugins-and-themes',
                'environment/installing-from-other-sources',
                'environment/tunnel',
                'environment/persistent-tunnel',
                'environment/custom-tunnel',
                'environment/environment-variables',
            ],
        },
        {
            type: 'category',
            label: 'Test Execution & Reporting',
            collapsed: true,
            items: [
                'test-execution/useful-commands',
                'test-execution/viewing-allure-reports',
                'test-execution/troubleshooting',
            ],
        },
        {
            type: 'category',
            label: 'Advanced Usage',
            collapsed: true,
            items: [
                'advanced-usage/scripting',
                'advanced-usage/advanced-config-handlers',
            ],
        },
        {
            type: 'category',
            label: 'Support & Resources',
            collapsed: true,
            items: [
                'support/contact-us',
                'support/test-options',
                'support/faqs',
            ],
        },
    ],
};

export default sidebars;
