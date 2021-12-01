module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
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

    iconPaths: {
      appleTouchIcon: 'img/apple-touch-icon.png',
      // maskIcon: 'img/safari-pinned-tab.svg',
      maskIcon: null,
      msTileImage: 'img/mstile-150x150.svg',
    },
  },
}
