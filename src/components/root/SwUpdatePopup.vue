<template>
  <div class="sw-update-popup" :class="{ 'sw-update-popup--active': updateExists }">
    <p class="sw-update-popup__text">Dostępna jest aktualizacja</p>
    <app-button type="white" size="small" @click.stop="refreshApp"> Zaktualizuj </app-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      refreshing: false,
      updateExists: false,
      registration: null as null | ServiceWorkerRegistration,
    }
  },
  // watch: {
  //   updateExists(val: boolean) {
  //     if (!val) return

  //   },
  // },
  created() {
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })

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
  right: 20px;
  bottom: -120px;
  width: 100%;
  max-width: calc(100vw - 40px);
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

  @media ($viewport-4) {
    flex-direction: row;
    max-width: 320px;
  }

  &--active {
    bottom: 20px;
    visibility: visible;
    opacity: 1;
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
