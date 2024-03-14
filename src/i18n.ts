import { createI18n } from 'vue-i18n'
import { getDefaultUiLanguage } from './utils/i18n'
import { accessor } from './store'

// Locales
import en from '@/locales/en.json'
import pl from '@/locales/pl.json'

const i18n = createI18n({
  locale: import.meta.env.VITE_I18N_LOCALE || accessor.config.uiLanguage || getDefaultUiLanguage(),
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

export default i18n
