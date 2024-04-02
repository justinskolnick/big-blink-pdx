// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

const jest = jestPlugin.configs['flat/recommended'];

export default tseslint.config(
  {
    ignores: [
      'app/public/**/*',
    ],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: [
      '**/*.js',
      '**/*.ts',
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...jest.languageOptions.globals,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-var-requires': 0,
      'arrow-body-style': [
        'error',
        'as-needed',
      ],
      'block-scoped-var': 'error',
      'camelcase': [
        'error',
        {
          'properties': 'always',
        },
      ],
      'eqeqeq': [
        'error',
        'always',
      ],
      'func-style': [
        'error',
        'expression',
        {
          'allowArrowFunctions': true,
        },
      ],
      'keyword-spacing': [
        'error',
        {
          'before': true,
          'after': true,
          'overrides': {
            'catch': {
              'after': true,
            },
          },
        },
      ],
      'linebreak-style': [
        'error',
        'unix',
      ],
      'logical-assignment-operators': [
        'error',
        'never',
      ],
      'no-alert': 'error',
      'no-console': 'warn',
      'no-delete-var': 'error',
      'no-else-return': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-floating-decimal': 'error',
      'no-global-assign': 'error',
      'no-implicit-coercion': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      'no-mixed-operators': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-negated-condition': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-plusplus': [
        'error',
        {
          'allowForLoopAfterthoughts': true,
        },
      ],
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-restricted-exports': 'error',
      'no-restricted-syntax': [
        'error',
        'SequenceExpression',
      ],
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'error',
      'no-shadow-restricted-names': 'error',
      'no-trailing-spaces': [
        'error',
        {
          'skipBlankLines': false,
          'ignoreComments': true,
        },
      ],
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': [
        'error',
        {
          'allowShortCircuit': true,
        },
      ],
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-warning-comments': [
        'warn',
        {
          'terms': ['todo'],
        },
      ],
      'object-shorthand': 'error',
      'one-var': [
        'error',
        'never',
      ],
      'operator-assignment': [
        'error',
        'never',
      ],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-spread': 'error',
      'quote-props': [
        'error',
        'as-needed',
      ],
      'quotes': [
        'error',
        'single',
        {
          'avoidEscape': true,
        },
      ],
      'semi': [
        'error',
        'always',
      ],
      'yoda': [
        'error',
        'never',
      ],
    },
  },
);
