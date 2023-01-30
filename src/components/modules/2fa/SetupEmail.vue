<template>
  <div class="setup-2fa-email">
    <h3>{{ $t('title') }}</h3>
    <p>
      {{ $t('text') }}
    </p>
    <small>{{ $t('subtext') }}</small>
    <app-button type="primary" size="small" :disabled="remainingSeconds > 0" @click="sendEmail()">
      {{ $t('resend') }}
      <template v-if="remainingSeconds">
        ({{ $t('remaningSeconds') }} {{ remainingSeconds }}s)
      </template>
    </app-button>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Aktywacja weryfikacji dwuetapowej przez wiadomości e-mail",
    "text": "Wysłaliśmy do Ciebie maila, który zawiera kod autoryzujący. Wpisz go poniżej, aby aktywować weryfikację dwuetapowa.",
    "subtext": "Jeśli email nie doszedł, możesz wysłać go ponownie. Stary kod przestanie działać.",
    "resend": "Wyślij maila ponownie",
    "remaningSeconds": "poczekaj jeszcze"
  },
  "en": {
    "title": "Activate two-factor authentication by email",
    "text": "We sent you an email with a code to verify. Enter it below to activate two-factor authentication.",
    "subtext": "If you don't receive the email, you can send it again. The old code will stop working.",
    "resend": "Send email again",
    "remaningSeconds": "wait"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { initEmailTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

const TIMEOUT = 30 // seconds

export default Vue.extend({
  data: () => ({
    remainingSeconds: TIMEOUT,
    intervalId: 0,
  }),
  created() {
    this.sendEmail(true)

    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) this.remainingSeconds = this.remainingSeconds - 1
    }, 1000)
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    async sendEmail(initial = false) {
      const result = await initEmailTwoFactorAuth()
      if (result.success) {
        if (!initial)
          this.$toast.success('Wiadomość email zawierająca kod autoryzacyjny została wysłana')

        this.remainingSeconds = TIMEOUT
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
        if (initial) this.$emit('cancel')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.setup-2fa-email {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
