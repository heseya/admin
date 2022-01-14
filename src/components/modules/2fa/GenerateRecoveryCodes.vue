<template>
  <div class="generate-recovery-codes">
    <h3>Kody odzyskujące</h3>
    <p>
      Kody odzyskujące mogą okazać się potrzebne gdy stracisz urządzenie na którym aktywowałeś
      podwójną weryfikacje. Kodów możesz użyć do zalogowania, pamiętaj jednak, że są jednorazowe!
    </p>
    <p>
      Jeśli zgubiłeś lub wykorzystałeś swoje kody odzyskujące, możesz je wygenerować poniżej.
      Poprzednie kody odzyskujące przestaną działać.
    </p>
    <app-button type="primary" @click="isModalActive = true">Wygeneruj kody odzyskujące</app-button>

    <template v-if="recoveryCodes.length">
      <hr />
      <h3>Poniżej widzisz kody odzyskujące, zapisz je w bezpiecznym miejscu.</h3>
      <recovery-codes :codes="recoveryCodes" />
    </template>

    <password-confirm-modal
      v-model="isModalActive"
      title="Wpisz swoje hasło, aby potwierdzić wygenerowanie nowych kodów odzyskujących"
      @confirm="onConfirm"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import AppButton from '@/components/layout/AppButton.vue'
import PasswordConfirmModal from '../../PasswordConfirmModal.vue'
import RecoveryCodes from './RecoveryCodes.vue'

import { generateRecoveryCodes } from '@/services/twoFactorAuth'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
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
        this.$toast.success('Nowe kody odzyskujące zostały wygenerowane')
        this.isModalActive = false
      } else {
        this.$toast.error(formatApiNotificationError(result.error))
      }
    },
  },
})
</script>

<style lang="scss" scoped></style>
