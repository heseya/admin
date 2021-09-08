module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    camelcase: ['error', { properties: 'never' }],
  },

  extends: [
    // 'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],

  plugins: ['prettier'],
}
