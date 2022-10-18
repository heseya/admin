<template>
  <central-screen-form v-if="!error">
    <h1 class="redirect-title">{{ $t('title') }}</h1>
  </central-screen-form>

  <central-screen-form v-else>
    <h1 class="redirect-title">{{ $t('errorTitle') }}</h1>
    <zone type="danger">{{ error }}</zone>
    <br />
    <app-button type="primary" :to="returnToLoginUrl">{{ $t('goBackToLogin') }}</app-button>
  </central-screen-form>
</template>

<i18n>
{
  "pl": {
    "title": "Przekierowywanie...",
    "errorTitle": "Coś poszło nie tak",
    "goBackToLogin": "Wróć do logowania"
  },
  "en": {
    "title": "Redirecting...",
    "errorTitle": "Something went wrong",
    "goBackToLogin": "Go back to login"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import { formatApiNotificationError } from '@/utils/errors'
import { LoginState } from '@/enums/login'
import { stringifyQueryParams } from '@/utils/stringifyQuery'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import Zone from '@/components/layout/Zone.vue'
import { OAUTH_NEXT_URL_KEY, OAUTH_PROVIDER_KEY } from '@/consts/oauthKeys'
import { AuthProviderKey } from '@/interfaces/Providers'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },

  components: {
    CentralScreenForm,
    Zone,
  },

  data: () => ({
    error: null as null | Error,
  }),

  computed: {
    returnToLoginUrl(): string {
      return `/login${stringifyQueryParams({
        next: localStorage.getItem(OAUTH_NEXT_URL_KEY) || '/',
      })}`
    },
  },

  async mounted(): Promise<void> {
    const provider = localStorage.getItem(OAUTH_PROVIDER_KEY) as AuthProviderKey
    if (!provider) return this.redirectToLogin()

    const result = await this.$accessor.auth.loginViaProvider({
      provider,
      returnUrl: window.location.href,
    })
    console.log('🚀 ~ file: OAuthLoginReturn.vue ~ line 41 ~ created ~ result', result)

    if (result.state === LoginState.Error) {
      this.cleanupAfterOAuth()
      this.error = result.error
      this.$toast.error(formatApiNotificationError(result.error))
    }

    if (result.state === LoginState.Success) this.redirectToNextUrl()

    if (result.state === LoginState.TwoFactorAuthRequired) {
      // TODO
      // eslint-disable-next-line no-console
      console.error('TODO: 2FA in OAuthLoginReturn')
      this.error = new Error('Two factor auth required')
    }
  },

  methods: {
    cleanupAfterOAuth() {
      localStorage.removeItem(OAUTH_PROVIDER_KEY)
      localStorage.removeItem(OAUTH_NEXT_URL_KEY)
    },

    redirectToLogin() {
      this.cleanupAfterOAuth()
      this.$router.push(this.returnToLoginUrl)
    },

    redirectToNextUrl() {
      this.cleanupAfterOAuth()
      const nextUrl = localStorage.getItem(OAUTH_NEXT_URL_KEY) || '/'
      this.$router.push(nextUrl)
    },
  },
})
</script>

<style lang="scss" scoped>
.redirect-title {
  text-align: center;
}
</style>
