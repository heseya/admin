import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import { accessor } from './store'
import { getDefaultUiLanguage } from './utils/i18n'

Vue.use(VueI18n)

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: LocaleMessages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}
export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || accessor.config.uiLanguage || getDefaultUiLanguage(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  fallbackRoot: true,
  silentFallbackWarn: true,
  pluralizationRules: {
    pl(choice, choicesLength) {
      if (choice === 0) {
        return 0
      }
      if (choice === 1) {
        return 1
      }

      const teen = choice > 10 && choice < 20

      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2
      }

      return choicesLength < 4 ? 2 : 3
    },
  },
})
