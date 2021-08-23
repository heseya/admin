module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    camelcase: ['error', { properties: 'never' }],
  },

  extends: [
    // 'plugin:vue/recommended',
    'plugin:vue/essential',
    '@vue/typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],

  plugins: ['prettier'],
}
