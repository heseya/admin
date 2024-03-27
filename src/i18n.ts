import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getDefaultUiLanguage } from './utils/i18n'
import { accessor } from './store'

// Locales
import en from '@/locales/en.json'
import pl from '@/locales/pl.json'

Vue.use(VueI18n)

export default new VueI18n({
  locale: window.runtimeConfig.i18n.locale || accessor.config.uiLanguage || getDefaultUiLanguage(),
  fallbackLocale: window.runtimeConfig.i18n.fallbackLocale,
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
