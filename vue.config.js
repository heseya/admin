module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
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

  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
  },

  pwa: {
    name: 'Heseya',
    themeColor: '#8f022c',
    msTileColor: '#8f022c',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      background_color: '#8f022c',
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
          src: '/img/favicon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },

    // workboxOptions: {
    // Probably file size should be reduced instead of increasing the limit
    // maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    // },

    iconPaths: {
      appleTouchIcon: 'img/apple-touch-icon.png',
      // maskIcon: 'img/safari-pinned-tab.svg',
      maskIcon: null,
      msTileImage: 'img/mstile-150x150.svg',
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'pl',
      fallbackLocale: 'pl',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false,
    },
  },
}
