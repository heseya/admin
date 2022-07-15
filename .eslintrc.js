module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
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
    'vue/no-reserved-component-names': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-v-html': 'off',
    'vue/no-bare-strings-in-template': [
      'error',
      {
        allowlist: [
          'heseya',
          'Heseya',
          'x',
          's',
          'cm',
          'kg',
          '|',
          '/',
          '\\',
          'v',
          ')',
          '(',
          ':',
          ',',
          '.',
          '-',
          '_',
          '+',
          '*',
          '=',
          '%',
          '$',
          '#',
          '!',
          '?',
          '&',
          '^',
          '<',
          '>',
          ';',
          '"',
          "'",
        ],
        attributes: {
          '/.+/': ['title', 'message', 'label', 'description', 'alt', 'placeholder'],
        },
      },
    ],
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
