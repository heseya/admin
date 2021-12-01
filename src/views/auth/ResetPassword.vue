<template>
  <central-screen-form title="Resetowanie hasła">
    <template v-if="!isSuccess">
      <ValidationObserver v-slot="{ handleSubmit }">
        <validated-input
          v-model="email"
          rules="required|email"
          label="E-mail"
          type="email"
          @keydown.enter="handleSubmit(sendResetRequest)"
        />
        <br />

        <div class="central-screen-form__row">
          <app-button type="primary" @click="handleSubmit(sendResetRequest)">
            Resetuj hasło
          </app-button>
          <app-button type="white" to="/login"> Wróć do strony logowania </app-button>
        </div>
      </ValidationObserver>
    </template>
    <template v-else>
      <p>Prośba resetu hasła została wysłana. Sprawdź swoją skrzynkę pocztową!</p>
      <br />
      <app-button to="/login"> Wróć do strony logowania </app-button>
    </template>
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  metaInfo: { title: 'Resetowanie hasła' },
  components: {
    CentralScreenForm,
    ValidationObserver,
  },
  data: () => ({
    email: '',
    isSuccess: false,
  }),
  computed: {
    error(): any {
      return this.$accessor.auth.error
    },
  },
  watch: {
    error(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  methods: {
    async sendResetRequest() {
      this.$accessor.startLoading()
      this.isSuccess = await this.$accessor.auth.requestResetPassword({
        email: this.email,
      })
      this.$accessor.stopLoading()
    },
  },
})
</script>
