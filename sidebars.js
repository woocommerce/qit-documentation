// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    docsSidebar: [
        {
            type: 'doc',
            id: 'intro',
            label: 'Introduction to QIT',
        },
        {
            type: 'doc',
            id: 'getting-started',
            label: 'Getting Started',
        },
        {
            type: 'category',
            label: 'Test Packages',
            collapsed: true,
            items: [
                'test-packages/index',
                {
                    type: 'category',
                    label: 'Tutorials',
                    collapsed: true,
                    items: [
                        'test-packages/tutorials/quickstart',
                        'test-packages/tutorials/sharing-packages',
                        'test-packages/tutorials/combining-packages',
                        'test-packages/tutorials/publishing-focused-packages',
                    ],
                },
                {
                    type: 'category',
                    label: 'How-To Guides',
                    collapsed: true,
                    items: [
                        'test-packages/how-to/create-packages',
                        'test-packages/how-to/use-secrets',
                        // These will be created later:
                        // 'test-packages/how-to/run-packages',
                        // 'test-packages/how-to/debug-failures',
                        // 'test-packages/how-to/configure-ci',
                    ],
                },
                {
                    type: 'category',
                    label: 'Concepts',
                    collapsed: true,
                    items: [
                        'test-packages/concepts',
                        'test-packages/lifecycle',
                        'test-packages/manifest',
                        'test-packages/utility-packages',
                    ],
                },
                {
                    type: 'category',
                    label: 'Reference',
                    collapsed: true,
                    items: [
                        'test-packages/commands',
                        'test-packages/results',
                        'test-packages/examples',
                    ],
                },
                {
                    type: 'category',
                    label: 'Advanced',
                    collapsed: true,
                    items: [
                        'test-packages/development-workflow',
                        'test-packages/secrets',
                        'test-packages/ci',
                        'test-packages/ai-development',
                        'test-packages/sharding',
                    ],
                },
                'test-packages/troubleshooting',
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
            ],
        },
        {
            type: 'category',
            label: 'Test Configuration',
            collapsed: true,
            items: [
                'configuration/index',
                'configuration/qit-json',
                'configuration/profiles',
                'configuration/environments',
                'configuration/groups',
                'configuration/extension-sets',
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