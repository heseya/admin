<template>
  <div class="remove-2fa">
    <h3>Usunięcie weryfikacji dwuetapowej</h3>
    <p>
      Poniżej możesz usunąć weryfikację dwuetapową ze swojego konta. Będziesz mógł skonfigurować
      weryfikację dwuetapową ponownie.
    </p>
    <app-button type="danger" @click="isModalActive = true">
      Dezaktywuj weryfikację dwuetapową
    </app-button>

    <password-confirm-modal
      v-model="isModalActive"
      title="Wpisz swoje hasło, aby potwierdzić usunięcie weryfikacji dwuetapowej"
      ok-text="Usuń weryfikację dwuetapową"
      ok-type="danger"
      @confirm="onConfirm"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AppButton from '@/components/layout/AppButton.vue'
import PasswordConfirmModal from './PasswordConfirmModal.vue'
import { removeTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: { AppButton, PasswordConfirmModal },
  data: () => ({
    isModalActive: false,
  }),
  methods: {
    async onConfirm(password: string) {
      const result = await removeTwoFactorAuth(password)
      if (result.success) {
        this.$toast.success('Weryfikacja dwuetapowa została usunięta')
        this.$emit('removed')
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
  },
})
</script>
