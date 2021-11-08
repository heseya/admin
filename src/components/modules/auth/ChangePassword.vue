<template>
  <validation-observer v-slot="{ handleSubmit }">
    <validated-input
      v-model="password"
      icon-after
      label="Obecne hasło"
      type="password"
      rules="required"
    >
      <template #icon>
        <i class="bx bx-lock-open-alt"></i>
      </template>
    </validated-input>
    <validated-input
      v-model="passwordNew"
      label="Nowe hasło"
      type="password"
      rules="required|password"
      name="passwordNew"
    >
    </validated-input>
    <validated-input
      v-model="passwordConfirmation"
      label="Powtórz nowe hasło"
      type="password"
      rules="required|repeatPassword:@passwordNew"
    >
    </validated-input>
    <br />
    <div class="center">
      <app-button :loading="isLoading" @click="handleSubmit(changePassword)">
        Zmień hasło
      </app-button>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { api } from '../../../api'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: {
    ValidationObserver,
  },
  data: () => ({
    password: '',
    passwordNew: '',
    passwordConfirmation: '',
    isLoading: false,
  }),
  methods: {
    async changePassword() {
      this.isLoading = true
      try {
        await api.patch('user/password', {
          password: this.password,
          password_new: this.passwordNew,
          password_confirmation: this.passwordConfirmation,
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
