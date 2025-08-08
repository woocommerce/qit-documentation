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
