/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_I18N_LOCALE: string
  readonly VITE_I18N_FALLBACK_LOCALE: string
  readonly VITE_API_URL: string

  readonly VITE_SENTRY_URL: string
  readonly VITE_SENTRY_DISABLED: string
  readonly VITE_SENTRY_ENVIORNMENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
