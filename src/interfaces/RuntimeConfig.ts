export interface RuntimeConfig {
  apiUrl: string
  baseUrl: string
  i18n: {
    locale: string
    fallbackLocale: string
  }
  sentry: {
    url: string
    disabled: string
    enviornment: string
  }
}
