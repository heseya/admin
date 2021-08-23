<template>
  <validation-observer v-slot="{ handleSubmit }">
    <validation-provider v-slot="{ errors }" rules="required">
      <vs-input v-model="password" icon-after label="Obecne hasło" type="password">
        <template #message-danger>{{ errors[0] }}</template>
        <template #icon><i class="bx bx-lock-open-alt"></i></template>
      </vs-input>
    </validation-provider>
    <br />
    <br />
    <validation-provider v-slot="{ errors }" rules="required|password" vid="passwordNew">
      <vs-input v-model="passwordNew" label="Nowe hasło" type="password">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <br />
    <br />
    <validation-provider v-slot="{ errors }" rules="required|repeatPassword:@passwordNew">
      <vs-input v-model="passwordConfirmation" label="Powtórz nowe hasło" type="password">
        <template #message-danger>{{ errors[0] }}</template>
      </vs-input>
    </validation-provider>
    <br />
    <div class="center">
      <vs-button color="dark" :loading="isLoading" @click="handleSubmit(changePassword)">
        Zmień hasło
      </vs-button>
    </div>
  </validation-observer>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { api } from '../../../api'
import { formatApiError } from '@/utils/errors'

export default Vue.extend({
  components: {
    ValidationProvider,
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
        this.$vs.notification({
          color: 'success',
          title: 'Hasło zostało zmienione',
        })
      } catch (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
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
