<template>
  <div class="generate-recovery-codes">
    <h3>{{ $t('title') }}</h3>
    <p>{{ $t('text1') }}</p>
    <p>{{ $t('text2') }}</p>
    <app-button type="primary" @click="isModalActive = true">{{ $t('generate') }}</app-button>

    <template v-if="recoveryCodes.length">
      <hr />
      <h3>{{ $t('recoveryCodes') }}</h3>
      <recovery-codes :codes="recoveryCodes" />
    </template>

    <password-confirm-modal
      v-model="isModalActive"
      :title="$t('confirmPassword')"
      @confirm="onConfirm"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Kody odzyskujące",
    "text1": "Kody odzyskujące mogą okazać się potrzebne gdy stracisz urządzenie na którym aktywowałeś podwójną weryfikacje. Kodów możesz użyć do zalogowania, pamiętaj jednak, że są jednorazowe!",
    "text2": "Jeśli zgubiłeś lub wykorzystałeś swoje kody odzyskujące, możesz je wygenerować poniżej. Poprzednie kody odzyskujące przestaną działać.",
    "generate": "Wygeneruj kody odzyskujące",
    "generatedMessage": "Nowe kody odzyskujące zostały wygenerowane",
    "recoveryCodes": "Poniżej widzisz kody odzyskujące, zapisz je w bezpiecznym miejscu.",
    "confirmPassword": "Wpisz swoje hasło, aby potwierdzić wygenerowanie nowych kodów odzyskujących"
  },
  "en": {
    "title": "Recovery codes",
    "text1": "Recovery codes are useful if you lose or forget your device on which you enabled two-factor authentication. Codes are only valid once.",
    "text2": "If you lose or forget your recovery codes, you can generate new ones below. Your previous codes will no longer work.",
    "generate": "Generate recovery codes",
    "generatedMessage": "New recovery codes have been generated",
    "recoveryCodes": "Here you can see your recovery codes. Keep them safe.",
    "confirmPassword": "Enter your password to confirm the generation of new recovery codes"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import AppButton from '@/components/layout/AppButton.vue'
import PasswordConfirmModal from '../../PasswordConfirmModal.vue'
import RecoveryCodes from './RecoveryCodes.vue'

import { generateRecoveryCodes } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  components: { AppButton, PasswordConfirmModal, RecoveryCodes },
  data: () => ({
    isModalActive: false,
    recoveryCodes: [] as string[],
  }),
  methods: {
    async onConfirm(password: string) {
      const result = await generateRecoveryCodes(password)
      if (result.success) {
        this.recoveryCodes = result.recoveryCodes
        this.$toast.success(this.$t('generatedMessage') as string)
        this.isModalActive = false
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
