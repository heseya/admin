module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_variables.scss";
          @import "@/scss/_title.scss";
        `,
      },
    },
  },
  pwa: {
    themeColor: '#000',
  },
}
