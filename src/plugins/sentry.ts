import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const { VITE_SENTRY_URL, VITE_SENTRY_DISABLED, VITE_SENTRY_ENVIORNMENT } = import.meta.env

const ENVIRONMENT = VITE_SENTRY_ENVIORNMENT || window.location.hostname

if (!VITE_SENTRY_DISABLED) {
  Sentry.init({
    Vue,
    dsn:
      (VITE_SENTRY_URL as string) || '***REMOVED***',
    integrations: [new Integrations.BrowserTracing()],
    environment: ENVIRONMENT as string,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: true,
  })
}
