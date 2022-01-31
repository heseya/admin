module.exports = {
  root: true,

  env: {
    browser: true,
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
    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-bare-strings-in-template': ['warn', { allowlist: ['|', 'v', ')', '(', 's'] }],
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
