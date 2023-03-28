/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { SERVICE_WORKER_UPDATED_EVENT } from './consts/serviceWorkerUpdated'

if (import.meta.env.PROD) {
  register(`${import.meta.env.BASE_URL}sw.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB',
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated(registration) {
      console.log('New content is available; please refresh.')
      document.dispatchEvent(
        new CustomEvent(SERVICE_WORKER_UPDATED_EVENT, { detail: registration }),
      )
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
