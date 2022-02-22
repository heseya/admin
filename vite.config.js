import { defineConfig } from 'vite'
import path from 'path'

import { createVuePlugin as vue } from 'vite-plugin-vue2'
import { createI18nPlugin } from '@yfwz100/vite-plugin-vue2-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), createI18nPlugin()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@/scss/_font.scss";
        @import "@/scss/01_abstracts/index.scss";
        `,
      },
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#8f022c',
          'link-color': '#bd204f',
          'success-color': '#27e29a',
          'warning-color': '#faad14',
          'error-color': '#ef4545',
        },
      },
    },
  },

  assetsInclude: ['@/assets/**/*.*'],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
