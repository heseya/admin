import { defineConfig } from 'vite'
import path from 'path'

import createVuePlugin from '@vitejs/plugin-vue2'
import { createI18nPlugin } from '@yfwz100/vite-plugin-vue2-i18n'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [
    createVuePlugin(),
    createI18nPlugin(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      includeAssets: ['/img/favicon.ico', '/img/apple-touch-icon.png'],
      manifest: {
        name: 'Heseya',
        short_name: 'Heseya',
        description: 'Admin panel for Heseya Store API',
        theme_color: '#8f022c',
        icons: [
          {
            src: '/img/favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/img/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/img/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        sourcemap: true,
        maximumFileSizeToCacheInBytes: 4000000,
      },
    }),
  ],

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
    chunkSizeWarningLimit: 400000,
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
