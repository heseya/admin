import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import { LOCALE_STORAGE_KEY } from './consts/i18n'

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

const getDefaultLanguage = () => {
  const browserLang = window.navigator.language
  if (browserLang.includes('pl')) return 'pl'
  return 'en'
}

export default new VueI18n({
  locale: window.localStorage.getItem(LOCALE_STORAGE_KEY) || getDefaultLanguage(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'pl', // TODO: change to 'en' when all translations are done
  messages: loadLocaleMessages(),
})
