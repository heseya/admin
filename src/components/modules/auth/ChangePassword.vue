<template>
  <validation-observer v-slot="{ handleSubmit }">
    <validated-input
      v-model="oldPassword"
      icon-after
      label="Obecne hasło"
      type="password"
      rules="required"
    >
    </validated-input>
    <validated-input
      v-model="newPassword"
      label="Nowe hasło"
      type="password"
      rules="required|password"
      name="newPassword"
    >
    </validated-input>
    <validated-input
      v-model="confirmNewPassword"
      label="Powtórz nowe hasło"
      type="password"
      rules="required|repeatPassword:@newPassword"
    >
    </validated-input>

    <hr />

    <div class="center">
      <app-button type="primary" :loading="isLoading" @click="handleSubmit(changePassword)">
        Zmień hasło
      </app-button>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  data: () => ({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    isLoading: false,
  }),
  methods: {
    async changePassword() {
      try {
        this.isLoading = true

        if (this.newPassword !== this.confirmNewPassword) throw new Error('Hasła nie są identyczne')

        await this.$accessor.auth.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        })

        this.$toast.success('Hasło zostało zmienione')
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      } finally {
        this.isLoading = false
        this.$emit('close')
      }
    },
  },
})
</script>

<style>
.center {
  display: flex;
  justify-content: center;
}
</style>
