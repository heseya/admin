import { defineConfig } from 'vite'
import path from 'path'

import createVuePlugin from '@vitejs/plugin-vue'
import createI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'spa',
  plugins: [
    createVuePlugin({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
    Components({
      resolvers: [AntDesignVueResolver({})],
    }),
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
    createI18nPlugin({}),
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
      vue: '@vue/compat',
    },
  },
})
