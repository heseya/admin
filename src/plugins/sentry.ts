import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const { VUE_APP_SENTRY_URL, VUE_APP_SENTRY_DISABLED, VUE_APP_SENTRY_ENVIORNMENT } = process.env

const ENVIRONMENT = VUE_APP_SENTRY_ENVIORNMENT || window.location.hostname

if (!VUE_APP_SENTRY_DISABLED && VUE_APP_SENTRY_URL) {
  Sentry.init({
    Vue,
    dsn: VUE_APP_SENTRY_URL || '',
    integrations: [new Integrations.BrowserTracing()],
    environment: ENVIRONMENT,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: true,
  })
}
