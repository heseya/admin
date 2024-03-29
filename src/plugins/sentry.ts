import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const {
  url: sentryUrl,
  disabled: sentryDisabled,
  enviornment: sentryEnviornment,
} = window.runtimeConfig.sentry

if (!sentryDisabled && sentryUrl) {
  Sentry.init({
    Vue,
    dsn: sentryUrl,
    integrations: [new Integrations.BrowserTracing()],
    environment: sentryEnviornment,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: true,
  })
}
