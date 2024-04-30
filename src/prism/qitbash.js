export default function (Prism) {
    Prism.languages.qitbash = {
        'qit_command': {
            pattern: /^qit \S+/,
            inside: {
                'keyword': /^qit/,
                'qit_subcommand': {
                    pattern: /\s+\S+/,
                    lookbehind: true
                }
            }
        },
        'qit_option': {
            // Matches options with and without an equals sign
            pattern: /--\w+(?:\s+\S+|\=\S+)?/,
            inside: {
                'option-name': {
                    pattern: /--\w+/,
                    alias: 'parameter'
                },
                'option-value': {
                    pattern: /(?<=\=)\S+|(?<=\s)\S+/,
                    lookbehind: true,
                    alias: 'value'
                }
            }
        },
        'qit_argument': {
            pattern: /((?<=\s|^)(?!--)\b[a-zA-Z-]+\b(?=\s|$))/,
            alias: 'variable'
        }
    };
};
