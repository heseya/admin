<template>
  <div class="sw-update-popup" :class="{ 'sw-update-popup--active': updateExists }">
    <p class="sw-update-popup__text">Dostępna jest aktualizacja</p>
    <app-button type="white" size="small" @click.stop="refreshApp"> Odśwież stronę </app-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { SERVICE_WORKER_UPDATED_EVENT } from '@/consts/serviceWorkerUpdated'

export default Vue.extend({
  data() {
    return {
      refreshing: false,
      updateExists: false,
      registration: null as null | ServiceWorkerRegistration,
    }
  },

  created() {
    document.addEventListener(SERVICE_WORKER_UPDATED_EVENT, this.updateAvailable, { once: true })

    // Watch for a new service worker to take control, then refresh the page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      window.location.reload()
    })
  },

  methods: {
    updateAvailable(event: any) {
      this.registration = event.detail
      this.updateExists = true
    },
    refreshApp() {
      this.updateExists = false
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return
      // Send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    },
  },
})
</script>

<style lang="scss" scoped>
.sw-update-popup {
  position: fixed;
  right: 10px;
  bottom: -120px;
  width: 100%;
  max-width: calc(100vw - 20px);
  padding: 8px;
  background-color: $primary-color-500;
  color: white;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  z-index: 1000;

  @media ($viewport-4) {
    flex-direction: row;
    max-width: 340px;
    right: 20px;
  }

  &--active {
    bottom: 64px;
    visibility: visible;
    opacity: 1;

    @media ($viewport-11) {
      bottom: 20px;
    }
  }

  &__text {
    font-weight: 600;
    margin: 0;
    margin-bottom: 8px;
    text-align: center;

    @media ($viewport-4) {
      text-align: left;
      margin-bottom: 0;
      margin-right: 8px;
    }
  }
}
</style>
