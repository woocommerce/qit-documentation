import React from 'react';

// Populate the list of test types used in the documentation.
// Set `includeCode` to true to include the CLI commands. For example, this is used on the "Running Tests" CLI documentation page. 
export default function TestTypes({ includeCode = false }) {
    return (
        <ul>
            <li><a href="test-types/woo-e2e">Woo E2E Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } } >run:woo-e2e</code></li>
            <li><a href="test-types/woo-api">Woo API Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } }>run:woo-api</code></li>
            <li><a href="test-types/activation">Activation Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } }>run:activation</code></li>
            <li><a href="test-types/security">Security Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } }>run:security</code></li>
            <li><a href="test-types/phpstan">PHPStan Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } }>run:phpstan</code></li>
            <li><a href="test-types/phpcompatibility">PHPCompatibility Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } }>run:phpcompatibility</code></li>
            <li><a href="test-types/malware">Malware Tests</a> <code style={ { display: includeCode ? 'inline-block' : 'none' } }>run:malware</code></li>
            <li>Performance Tests <i>(Coming soon)</i></li>
            <li>Custom E2E Tests <i>(Coming soon)</i></li>
        </ul>
    );
}
