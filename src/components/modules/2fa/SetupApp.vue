<template>
  <div class="setup-2fa-app">
    <h3>{{ $t('title') }}</h3>
    <p>
      {{ $t('message') }}
    </p>
    <img v-if="qrCodeUrl" :src="qrCodeUrl" :alt="$t('imageAlt')" class="setup-2fa-app__image" />
    <div class="setup-2fa-app__secret-wrapper">
      <small>{{ $t('secretText') }}</small>
      <code class="setup-2fa-app__secret">{{ secret }}</code>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Aktywacja weryfikacji dwuetapowej przez aplikacje",
    "message": "Zeskanuj poniższy kod QR w aplikacji do weryfikacji dwuetapowej (Np. Google Authenticator). Następnie potwierdź aktywację weryfikacji przez wpisanie kodu który wyświetli Ci się na ekranie.",
    "imageAlt": "Kod QR do aktywacji weryfikacji dwuetapowej",
    "secretText": "Możesz też wpisać klucz ręcznie w aplikacji:"
  },
  "en": {
    "title": "Activate two-factor authentication by apps",
    "message": "Scan the QR code below in your app to activate two-factor authentication (e.g. Google Authenticator). Then enter the code that shows up on your screen.",
    "imageAlt": "QR code to activate two-factor authentication",
    "secretText": "You can also enter the secret manually in your app:"
  }
}
</i18n>

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
