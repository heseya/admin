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
          <vs-button dark @click="handleSubmit(sendResetRequest)"> Resetuj hasło </vs-button>
          <vs-button transparent dark to="/login"> Wróć do strony logowania </vs-button>
        </div>
      </ValidationObserver>
    </template>
    <template v-else>
      <p>Prośba resetu hasła została wysłana. Sprawdź swoją skrzynkę pocztową!</p>
      <br />
      <vs-button dark to="/login"> Wróć do strony logowania </vs-button>
    </template>
  </central-screen-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

import { formatApiError } from '@/utils/errors'

export default Vue.extend({
  components: {
    CentralScreenForm,
    ValidatedInput,
    ValidationObserver,
  },
  data() {
    return {
      email: '',
      isSuccess: false,
    }
  },
  computed: {
    error(): any {
      return this.$accessor.auth.error
    },
  },
  watch: {
    error(error: any) {
      if (error) {
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
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
