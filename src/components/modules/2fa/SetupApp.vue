<template>
  <div class="setup-2fa-app">
    <h3>Aktywacja weryfikacji dwuetapowej przez aplikacje</h3>
    <p>
      Zeskanuj poniższy kod QR w aplikacji do weryfikacji dwuetapowej (Np. Google Authenticator).
      Następnie potwierdź aktywację weryfikacji przez wpisanie kodu który wyświetli Ci się na
      ekranie.
    </p>
    <img
      v-if="qrCodeUrl"
      :src="qrCodeUrl"
      alt="Kod QR do aktywacji weryfikacji dwuetapowej"
      class="setup-2fa-app__image"
    />
    <div class="setup-2fa-app__secret-wrapper">
      <small>Możesz też wpisać klucz ręcznie w aplikacji:</small>
      <code class="setup-2fa-app__secret">{{ secret }}</code>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { initAppTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  data: () => ({
    qrCodeUrl: '',
    secret: '',
  }),
  async created() {
    const result = await initAppTwoFactorAuth()
    if (result.success) {
      this.qrCodeUrl = result.qrCodeUrl
      this.secret = result.secret
    } else {
      this.$toast.error(formatApiNotificationError(result.error))
      this.$emit('cancel')
    }
  },
})
</script>

<style lang="scss" scoped>
.setup-2fa-app {
  text-align: center;

  &__image {
    max-width: 200px;
  }

  &__secret-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 24px;
  }

  &__secret {
    font-size: 1.4em;
    font-weight: 600;
  }
}
</style>
