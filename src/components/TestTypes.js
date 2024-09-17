import React from 'react';

// Populate the list of test types used in the documentation.
// Set `includeCode` to true to include the CLI commands. For example, this is used on the "Running Tests" CLI documentation page. 
export default function TestTypes({ includeCode = false }) {
    return (
        <ul>
            <li>
                Managed tests
                <ul>
                    <li><a href="/docs/managed-tests/woo-e2e">Woo E2E tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:woo-e2e</code></li>
                    <li><a href="/docs/managed-tests/woo-api">Woo API tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:woo-api</code></li>
                    <li><a href="/docs/managed-tests/activation">Activation tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:activation</code></li>
                    <li><a href="/docs/managed-tests/security">Security tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:security</code></li>
                    <li><a href="/docs/managed-tests/phpstan">PHPStan tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:phpstan</code></li>
                    <li><a href="/docs/managed-tests/phpcompatibility">PHPCompatibility tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:phpcompatibility</code></li>
                    <li><a href="/docs/managed-tests/malware">Malware tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:malware</code></li>
                    <li><a href="/docs/managed-tests/validation">Validation tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:validation</code></li>
                    <li>Performance tests <i>(Coming soon)</i></li>
                </ul>
            </li>
            <li>
                Custom tests
                <ul>
                    <li><a href="/docs/custom-tests/introduction">Custom E2E tests</a> <code
                        style={{ display: includeCode ? 'inline-block' : 'none' }}>run:e2e</code></li>
                </ul>
            </li>

        </ul>
    );
}
