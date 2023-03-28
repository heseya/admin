import { defineConfig } from 'vite'
import path from 'path'

import createVuePlugin from '@vitejs/plugin-vue2'
import { createI18nPlugin } from '@yfwz100/vite-plugin-vue2-i18n'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin(), createI18nPlugin(), VitePWA()],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
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

  build: {
    chunkSizeWarningLimit: 250000,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
