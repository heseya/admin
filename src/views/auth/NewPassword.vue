<template>
  <central-screen-form :title="$t('newPassword').toString()">
    <ValidationObserver v-slot="{ handleSubmit }">
      <validated-input
        v-model="password"
        name="password"
        rules="required|password"
        :label="$t('newPassword')"
        type="password"
        @keydown.enter="handleSubmit(changePassword)"
      />
      <validated-input
        v-model="repeatPassword"
        name="repeatPassword"
        rules="required|repeatPassword:@password"
        :label="$t('repeatPassword')"
        type="password"
        @keydown.enter="handleSubmit(changePassword)"
      />
      <br />

      <div class="central-screen-form__row">
        <app-button type="primary" @click="handleSubmit(changePassword)">
          {{ $t('changePassword') }}
        </app-button>
      </div>
    </ValidationObserver>
  </central-screen-form>
</template>

<i18n lang="json">
{
  "pl": {
    "newPassword": "Nowe hasło",
    "repeatPassword": "Powtórz nowe hasło",
    "changePassword": "Zmień hasło",
    "successMessage": "Hasło zostało zmienione."
  },
  "en": {
    "newPassword": "New password",
    "repeatPassword": "Repeat new password",
    "changePassword": "Change password",
    "successMessage": "Password has been changed."
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationObserver } from 'vee-validate'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { sdk } from '@/api'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('newPassword') as string }
  },
  components: {
    CentralScreenForm,
    ValidationObserver,
  },
  data: () => ({
    password: '',
    repeatPassword: '',
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
  async created() {
    const { token, email } = this.$route.query

    try {
      if (!token || !email) throw new Error('Token or email does not exist')
      // This verifies token & email before showing the set password form
      await sdk.Auth.verifyResetPasswordToken(token as string, email as string)
    } catch (e: any) {
      this.$toast.error(formatApiNotificationError(e))
      this.$router.replace('/login')
    }
  },
  methods: {
    async changePassword() {
      const { token, email } = this.$route.query as Record<string, string>

      this.$accessor.startLoading()
      const isSuccess = await this.$accessor.auth.resetPassword({
        email,
        token,
        password: this.password,
      })
      this.$accessor.stopLoading()

      if (isSuccess) {
        this.$toast.success(this.$t('successMessage') as string)
        this.$router.push({ name: 'Login' })
      }
    },
  },
})
</script>
