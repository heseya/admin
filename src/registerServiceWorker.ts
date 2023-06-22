/* eslint-disable no-console */

import { registerSW } from 'virtual:pwa-register'
import { SERVICE_WORKER_UPDATED_EVENT } from './consts/serviceWorkerUpdated'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('onNeedRefresh')
    console.log('New content is available; please refresh.')
    document.dispatchEvent(new CustomEvent(SERVICE_WORKER_UPDATED_EVENT, {}))
  },
  onOfflineReady() {
    console.log('Content has been cached for offline use.')
  },
  onRegisteredSW() {
    console.log('Service worker has been registered.')
  },
  onRegisterError(error) {
    console.error('Error during service worker registration:', error)
  },
})

window.updateSW = updateSW
