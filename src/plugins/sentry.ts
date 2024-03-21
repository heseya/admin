import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

const { VITE_SENTRY_URL, VITE_SENTRY_DISABLED, VITE_SENTRY_ENVIORNMENT } = import.meta.env
const { sentryUrl, sentryDisabled, sentryEnviornment } = window

const ENVIRONMENT =
  sentryEnviornment !== 'REPLACE_ME_SENTRY_ENVIORNMENT'
    ? sentryEnviornment
    : VITE_SENTRY_ENVIORNMENT || window.location.hostname

const ENABLED =
  sentryDisabled !== 'REPLACE_ME_SENTRY_DISABLED' ? sentryDisabled : VITE_SENTRY_DISABLED

const SENTRY_URL = sentryUrl !== 'REPLACE_ME_SENTRY_URL' ? sentryUrl : VITE_SENTRY_URL

if (!ENABLED && SENTRY_URL) {
  Sentry.init({
    Vue,
    dsn: SENTRY_URL,
    integrations: [new Integrations.BrowserTracing()],
    environment: ENVIRONMENT as string,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    logErrors: true,
  })
}
