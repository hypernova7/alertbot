module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/warnings'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      classes: true,
      impliedStrict: true
    },
    ecmaVersion: '2018',
    sourceType: 'module'
  },
  plugins: ['import', 'html', 'prettier'],
  root: true,
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    'comma-dangle': ['error', 'never'],
    eqeqeq: 'warn',
    'func-names': 0,
    'import/no-named-as-default': 0,
    indent: 'off',
    'indent-legacy': [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'no-alert': 0,
    'no-bitwise': 0,
    'no-console': 1,
    'no-debuger': 0,
    'no-duplicate-imports': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'no-extend-native': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
        maxBOF: 0,
        maxEOF: 1
      }
    ],
    'no-template-curly-in-string': 'error',
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern: '^err',
        ignoreRestSiblings: true
      }
    ],
    'no-shadow': 0,
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'all'
      }
    ],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true
      }
    ],
    semi: 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }
    ],
    'space-before-blocks': 'error',
    'space-before-function-paren': 'error',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'template-curly-spacing': 'error'
  }
};
