module.exports = {
  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
  },

  extends: ['plugin:vue/essential', '@vue/standard', '@vue/typescript'],
}
