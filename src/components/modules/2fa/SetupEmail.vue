<template>
  <div class="setup-2fa-email">
    <h3>Aktywacja weryfikacji dwuetapowej przez wiadomości e-mail</h3>
    <p>
      Wysłaliśmy do Ciebie maila, który zawiera kod autoryzujący. Wpisz go poniżej, aby aktywować
      weryfikację dwuetapowa.
    </p>
    <small>Jeśli email nie doszedł, możesz wysłać go ponownie. Stary kod przestanie działać.</small>
    <app-button type="primary" size="small" :disabled="remainingSeconds > 0" @click="sendEmail()">
      Wyślij maila ponownie
      <template v-if="remainingSeconds"> (poczekaj jeszcze {{ remainingSeconds }}s) </template>
    </app-button>
  </div>
</template>

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
