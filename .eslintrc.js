module.exports = {
  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      modules: true,
    },
  },

  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    camelcase: ['error', { properties: 'never' }],
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],

  plugins: ['prettier'],
}
