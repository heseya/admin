<template>
  <central-screen-form :title="title">
    <Zone
      v-if="isMergingAccounts"
      :style="{ marginBottom: '24px' }"
      type="info"
      :title="$t('mergeAccountsInfo').toString()"
    />

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

<i18n lang="json">
{
  "pl": {
    "loginTitle": "Logowanie",
    "twoFactorAuthTitle": "Weryfikacja dwuetapowa",
    "mergeAccountsTitle": "Połącz konta",
    "mergeAccountsInfo": "Zalogowałeś się na konto, którego adres email jest już przypisany do innego konta. Aby połączyć te konta, zaloguj się na drugie konto i kliknij przycisk \"Połącz konta\"."
  },
  "en": {
    "loginTitle": "Login",
    "twoFactorAuthTitle": "Two-factor authentication",
    "mergeAccountsTitle": "Merge accounts",
    "mergeAccountsInfo": "You have logged in to an account whose email address is already assigned to another account. To merge these accounts, log in to the second account and click the \"Merge accounts\" button."
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { first, isNull } from 'lodash'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import LoginForm from '@/components/modules/auth/LoginForm.vue'
import TwoFactorAuthCodeForm from '@/components/modules/auth/TwoFactorAuthCodeForm.vue'
import ProvidersLogin from '@/components/modules/auth/ProvidersLogin.vue'

import { formatApiNotificationError } from '@/utils/errors'
import { TwoFactorAuthMethod } from '@/enums/twoFactorAuth'
import { LoginState } from '@/enums/login'
import Zone from '@/components/layout/Zone.vue'

const SHOW_DEFAULT_CREDENTIALS = import.meta.env.DEV

const CLEAR_LOGIN_FORM = {
  email: SHOW_DEFAULT_CREDENTIALS ? '***REMOVED***' : '',
  password: SHOW_DEFAULT_CREDENTIALS ? '***REMOVED***' : '',
}

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('loginTitle') as string }
  },
  components: {
    CentralScreenForm,
    LoginForm,
    TwoFactorAuthCodeForm,
    ProvidersLogin,
    Zone,
  },
  data: () => ({
    twoFactorAuthMethod: null as TwoFactorAuthMethod | null,
    securityCode: '',
    form: { ...CLEAR_LOGIN_FORM },
  }),
  computed: {
    nextURLParam(): string {
      const { next } = this.$route.query
      return (Array.isArray(next) ? first(next) : next) || '/'
    },

    nextURL(): string {
      if (this.isMergingAccounts) return `/merge-accounts?token=${this.$route.query.mergeToken}`
      return this.nextURLParam
    },

    isTwoFactorAuth(): boolean {
      return !isNull(this.twoFactorAuthMethod)
    },
    isMergingAccounts(): boolean {
      return !!this.$route.query.mergeToken
    },

    title(): string {
      if (this.isMergingAccounts) return this.$t('mergeAccountsTitle') as string
      if (this.isTwoFactorAuth) return this.$t('twoFactorAuthTitle') as string
      return this.$t('loginTitle') as string
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
