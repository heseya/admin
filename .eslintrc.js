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
    // 'vue/no-deprecated-v-on-native-modifier': 'error',
    'vue/no-deprecated-vue-config-keycodes': 'error',
    'vue/no-deprecated-v-on-number-modifiers': 'error',
    'vue/no-deprecated-v-bind-sync': 'error',
    'vue/v-on-event-hyphenation': 'warn',
    // 'vue/require-explicit-emits': 'warn',
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

  extends: ['plugin:vue/recommended', '@vue/typescript', 'prettier', 'plugin:prettier/recommended'],

  plugins: ['prettier'],
}
