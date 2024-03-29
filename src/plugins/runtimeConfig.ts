import { RuntimeConfig } from '@/interfaces/RuntimeConfig'

const {
  VITE_API_URL,
  VITE_BASE_URL,
  VITE_SENTRY_URL,
  VITE_SENTRY_DISABLED,
  VITE_SENTRY_ENVIORNMENT,
  VITE_I18N_LOCALE,
  VITE_I18N_FALLBACK_LOCALE,
} = import.meta.env

const INITIAL_RUNTIME_CONFIG: RuntimeConfig = {
  apiUrl: 'REPLACE_ME_API_URL',
  baseUrl: 'REPLACE_ME_BASE_URL',
  i18n: {
    locale: 'REPLACE_ME_I18N_LOCALE',
    fallbackLocale: 'REPLACE_ME_I18N_FALLBACK_LOCALE',
  },
  sentry: {
    url: 'REPLACE_ME_SENTRY_URL',
    disabled: 'REPLACE_ME_SENTRY_DISABLED',
    enviornment: 'REPLACE_ME_SENTRY_ENVIORNMENT',
  },
}

const setupRuntimeConfigProperty = (
  property: string,
  initialValue: string,
  fallbackValue: string,
) => (property !== initialValue ? property : fallbackValue)

/**
 * Base
 */
window.runtimeConfig.apiUrl = setupRuntimeConfigProperty(
  window.runtimeConfig.apiUrl,
  INITIAL_RUNTIME_CONFIG.apiUrl,
  VITE_API_URL,
)
window.runtimeConfig.baseUrl = setupRuntimeConfigProperty(
  window.runtimeConfig.baseUrl,
  INITIAL_RUNTIME_CONFIG.baseUrl,
  VITE_BASE_URL,
)

/**
 * I18n
 */
window.runtimeConfig.i18n.locale = setupRuntimeConfigProperty(
  window.runtimeConfig.i18n.locale,
  INITIAL_RUNTIME_CONFIG.i18n.locale,
  VITE_I18N_LOCALE,
)
window.runtimeConfig.i18n.fallbackLocale = setupRuntimeConfigProperty(
  window.runtimeConfig.i18n.fallbackLocale,
  INITIAL_RUNTIME_CONFIG.i18n.fallbackLocale,
  VITE_I18N_FALLBACK_LOCALE || 'pl',
)

/**
 * Sentry
 */
window.runtimeConfig.sentry.url = setupRuntimeConfigProperty(
  window.runtimeConfig.sentry.url,
  INITIAL_RUNTIME_CONFIG.sentry.url,
  VITE_SENTRY_URL || window.location.hostname,
)
window.runtimeConfig.sentry.disabled = setupRuntimeConfigProperty(
  window.runtimeConfig.sentry.disabled,
  INITIAL_RUNTIME_CONFIG.sentry.disabled,
  VITE_SENTRY_DISABLED,
)
window.runtimeConfig.sentry.enviornment = setupRuntimeConfigProperty(
  window.runtimeConfig.sentry.enviornment,
  INITIAL_RUNTIME_CONFIG.sentry.enviornment,
  VITE_SENTRY_ENVIORNMENT,
)
