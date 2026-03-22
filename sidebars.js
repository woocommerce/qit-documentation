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
                    ],
                },
                {
                    type: 'category',
                    label: 'Concepts',
                    collapsed: true,
                    items: [
                        'test-packages/concepts/global-setup',
                        'test-packages/concepts',
                        'test-packages/concepts/subpackages',
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
                        'test-packages/reference/network-requirements',
                        'test-packages/results',
                        'test-packages/examples',
                    ],
                },
                {
                    type: 'category',
                    label: 'Advanced',
                    collapsed: true,
                    items: [
                        'test-packages/secrets',
                        'test-packages/ci',
                        'test-packages/sharding',
                    ],
                },
                'test-packages/troubleshooting',
            ],
        },
        {
            type: 'category',
            label: 'Local Environment',
            collapsed: true,
            items: [
                'environment/introduction',
                'environment/development-workflow',
                'environment/tunnel',
                'environment/persistent-tunnel',
                'environment/environment-variables',
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
                'configuration/validation-rules',
            ],
        },
        {
            type: 'category',
            label: 'AI-Assisted Development',
            collapsed: true,
            items: [
                'ai/getting-started',
                {
                    type: 'category',
                    label: 'Test Packages',
                    collapsed: true,
                    items: [
                        'ai/test-packages/writing-with-agents',
                        'ai/test-packages/browser-observation',
                    ],
                },
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
