<template>
  <div class="offline-banner" :class="{ 'offline-banner--visible': isOffline }">
    <div class="offline-banner__content">
      <div class="offline-banner__icon">
        <i class="bx bxs-error-alt"></i>
      </div>
      <div class="offline-banner__text">
        <span class="offline-banner__title">
          {{ $t('offlineMode') }}
        </span>
        <span>
          {{ $t('offlineModeText') }}
        </span>
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "offlineMode": "Offline mode",
    "offlineModeText": "You are currently offline. Some features may not work properly."
  },
  "pl": {
    "offlineMode": "Tryb offline",
    "offlineModeText": "Jesteś obecnie offline. Niektóre funkcje mogą nie działać poprawnie."
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  data: () => ({
    isOffline: !window.navigator.onLine,
  }),
  created() {
    window.addEventListener('online', () => (this.isOffline = false))
    window.addEventListener('offline', () => (this.isOffline = true))
  },
})
</script>

<style lang="scss" scoped>
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: $red-color-500;
  color: #fff;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  font-size: 0.7rem;
  transition: 0.3s;
  transform: translateY(-100%);

  &--visible {
    transform: translateY(0);
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    margin-right: 10px;
    font-size: 2.2em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  &__title {
    font-size: 1.2em;
    font-weight: 600;
  }
}
</style>
