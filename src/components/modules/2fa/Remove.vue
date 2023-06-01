<template>
  <div class="remove-2fa">
    <h3>{{ $t('title') }}</h3>
    <p>
      {{ $t('text') }}
    </p>
    <app-button type="danger" @click="isModalActive = true">
      {{ $t('removeBtnText') }}
    </app-button>

    <password-confirm-modal
      v-model="isModalActive"
      :title="$t('passwordConfirm').toString()"
      :ok-text="$t('removeBtnText').toString()"
      ok-type="danger"
      @confirm="onConfirm"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Usunięcie weryfikacji dwuetapowej",
    "text": "Poniżej możesz usunąć weryfikację dwuetapową ze swojego konta. Będziesz mógł skonfigurować weryfikację dwuetapową ponownie.",
    "removeBtnText": "Dezaktywuj weryfikację dwuetapową",
    "passwordConfirm": "Wpisz swoje hasło, aby potwierdzić usunięcie weryfikacji dwuetapowej",
    "successMessage": "Weryfikacja dwuetapowa została usunięta"
  },
  "en": {
    "title": "Remove two-factor authentication",
    "text": "Below you can remove two-factor authentication from your account. You can configure two-factor authentication again.",
    "removeBtnText": "Deactivate two-factor authentication",
    "passwordConfirm": "Enter your password to confirm removing two-factor authentication",
    "successMessage": "Two-factor authentication has been removed"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import AppButton from '@/components/layout/AppButton.vue'
import PasswordConfirmModal from '../../PasswordConfirmModal.vue'
import { removeTwoFactorAuth } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  components: { AppButton, PasswordConfirmModal },
  data: () => ({
    isModalActive: false,
  }),
  methods: {
    async onConfirm(password: string) {
      const result = await removeTwoFactorAuth(password)
      if (result.success) {
        this.$toast.success(this.$t('successMessage') as string)
        this.isModalActive = false
        this.$emit('removed')
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
  },
})
</script>
