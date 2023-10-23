<template>
  <div class="sw-update-popup" :class="{ 'sw-update-popup--active': updateExists }">
    <p class="sw-update-popup__text">{{ $t('message') }}</p>
    <app-button type="white" size="small" @click.stop="refreshApp">
      {{ $t('install') }}
    </app-button>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "message": "Dostępna jest aktualizacja",
    "install": "Odśwież stronę"
  },
  "en": {
    "message": "There is an update available",
    "install": "Refresh page"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import { SERVICE_WORKER_UPDATED_EVENT } from '@/consts/serviceWorkerUpdated'

export default defineComponent({
  data() {
    return {
      updateExists: false,
    }
  },

  created() {
    document.addEventListener(
      SERVICE_WORKER_UPDATED_EVENT,
      () => {
        this.updateExists = true
      },
      { once: true },
    )
  },

  methods: {
    refreshApp() {
      window.updateSW()
      this.updateExists = false
      return
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
  background-color: var(--primary-color-500);
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
