import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { LOCALE_STORAGE_KEY } from './consts/i18n'

// Locales
import en from '@/locales/en.json'
import pl from '@/locales/pl.json'

Vue.use(VueI18n)

const getDefaultUiLanguage = () => {
  const browserLang = window.navigator.language
  if (browserLang.includes('pl')) return 'pl'
  return 'en'
}

export default new VueI18n({
  locale:
    import.meta.env.VUE_APP_I18N_LOCALE ||
    window.localStorage.getItem(LOCALE_STORAGE_KEY) ||
    getDefaultUiLanguage(),
  fallbackLocale: (import.meta.env.VITE_I18N_FALLBACK_LOCALE as string) || 'pl', // TODO: change to 'en' when all translations are done
  messages: {
    pl,
    en,
  },
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
