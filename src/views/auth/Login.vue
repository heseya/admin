<template>
  <central-screen-form :title="isTwoFactorAuth ? $t('twoFactorAuthTitle') : $t('loginTitle')">
    <login-form v-if="!isTwoFactorAuth" v-model="form" @submit="login" />
    <two-factor-auth-code-form
      v-else
      v-model="securityCode"
      :method="twoFactorAuthMethod"
      @cancel="clearForm"
      @submit="login"
    />
    <providers-login />
  </central-screen-form>
</template>

<i18n>
{
  "pl": {
    "loginTitle": "Logowanie",
    "twoFactorAuthTitle": "Weryfikacja dwuetapowa"
  },
  "en": {
    "loginTitle": "Login",
    "twoFactorAuthTitle": "Two-factor authentication"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { first, isNull } from 'lodash'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import LoginForm from '@/components/modules/auth/LoginForm.vue'
import TwoFactorAuthCodeForm from '@/components/modules/auth/TwoFactorAuthCodeForm.vue'
import ProvidersLogin from '@/components/modules/auth/ProvidersLogin.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'
import { LoginState } from '@/enums/login'

const DEFAULT_CREDENTIALS = process.env.NODE_ENV === 'development'

const CLEAR_LOGIN_FORM = {
  email: DEFAULT_CREDENTIALS ? '***REMOVED***' : '',
  password: DEFAULT_CREDENTIALS ? '***REMOVED***' : '',
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('loginTitle') as string }
  },
  components: {
    CentralScreenForm,
    LoginForm,
    TwoFactorAuthCodeForm,
    ProvidersLogin,
  },
  data: () => ({
    twoFactorAuthMethod: null as TwoFactorAuthMethod | null,
    securityCode: '',
    form: { ...CLEAR_LOGIN_FORM },
  }),
  computed: {
    nextURL(): string {
      const { next } = this.$route.query
      return (Array.isArray(next) ? first(next) : next) || '/'
    },
    isTwoFactorAuth(): boolean {
      return !isNull(this.twoFactorAuthMethod)
    },
  },
  watch: {
    '$accessor.auth.error'(error: any) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  methods: {
    clearForm() {
      this.twoFactorAuthMethod = null
      this.securityCode = ''
      this.form = { ...CLEAR_LOGIN_FORM }
    },
    async login() {
      this.$accessor.startLoading()
      const response = await this.$accessor.auth.login({
        ...this.form,
        code: this.twoFactorAuthMethod ? this.securityCode : undefined,
      })

      if (response.state === LoginState.Success) this.$router.push(this.nextURL)

      if (response.state === LoginState.TwoFactorAuthRequired) {
        this.twoFactorAuthMethod = response.method
      }

      this.$accessor.stopLoading()
    },
  },
})
</script>
