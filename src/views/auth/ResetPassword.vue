<template>
  <central-screen-form :title="$t('title')">
    <template v-if="!isSuccess">
      <ValidationObserver v-slot="{ handleSubmit }">
        <validated-input
          v-model="email"
          rules="required|email"
          :label="$t('email')"
          type="email"
          @keydown.enter="handleSubmit(sendResetRequest)"
        />
        <br />

        <div class="central-screen-form__row">
          <app-button type="primary" @click="handleSubmit(sendResetRequest)">
            {{ $t('resetPassword') }}
          </app-button>
          <app-button type="white" to="/login"> {{ $t('returnToLogin') }} </app-button>
        </div>
      </ValidationObserver>
    </template>
    <template v-else>
      <p>{{ $t('successMessage') }}</p>
      <br />
      <app-button to="/login"> {{ $t('returnToLogin') }} </app-button>
    </template>
  </central-screen-form>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Resetowanie hasła",
    "email": "E-mail",
    "resetPassword": "Resetuj hasło",
    "returnToLogin": "Wróć do strony logowania",
    "successMessage": "Prośba resetu hasła została wysłana. Sprawdź swoją skrzynkę pocztową!"
  },
  "en": {
    "title": "Password reset",
    "email": "E-mail",
    "resetPassword": "Reset password",
    "returnToLogin": "Return to login page",
    "successMessage": "Your password reset request has been sent. Check your mailbox!"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'

import { formatApiNotificationError } from '@/utils/errors'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
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
