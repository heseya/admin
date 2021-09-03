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
          'primary-color': '#0879eb',
          'link-color': '#8dc6ff',
        },
      },
    },
  },
  pwa: {
    themeColor: '#000',
  },
}
