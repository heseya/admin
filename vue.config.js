module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_font.scss";
          @import "@/scss/01_abstracts/_variables.scss";
        `,
      },
    },
  },
  pwa: {
    themeColor: '#000',
  },
}
