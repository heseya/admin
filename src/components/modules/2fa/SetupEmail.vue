<template>
  <div class="setup-2fa-email">
    <h3>Aktywacja weryfikacji dwuetapowej przez Email</h3>
    <p>
      Wysłaliśmy do Ciebie maila, który zawiera kod autoryzujący. Wpisz go poniżej, aby aktywować
      weryfikację dwuetapowa.
    </p>
    <app-button type="primary" size="small" disabled @click="sendEmail">
      Wyślij maila ponownie (poczekaj jeszcze {{ 5 }}s)
    </app-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { initEmailTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  created() {
    this.sendEmail(true)
  },
  methods: {
    async sendEmail(initial = false) {
      const result = await initEmailTwoFactorAuth()
      if (result.success) {
        if (!initial)
          this.$toast.success('Wiadomość email zawierająca kod autoryzacyjny została wysłana')
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
