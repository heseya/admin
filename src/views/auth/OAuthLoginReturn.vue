<template>
  <central-screen-form v-if="!errorMessage" class="oauth-login-return">
    <h1 class="oauth-login-return__title">{{ $t('title') }}</h1>
  </central-screen-form>

  <central-screen-form v-else class="oauth-login-return">
    <h1 class="oauth-login-return__title">{{ $t('errorTitle') }}</h1>
    <div class="oauth-login-return__error"><i class="bx bx-error"></i> {{ errorMessage }}</div>
    <br />
    <app-button type="primary" :to="returnToLoginUrl">{{ $t('goBackToLogin') }}</app-button>
  </central-screen-form>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Przekierowywanie...",
    "errorTitle": "Coś poszło nie tak",
    "goBackToLogin": "Wróć do logowania",
    "2faError": "Logowanie przez SocialMedia z dwuetapową weryfikacją nie jest jeszcze obsługiwane. Skontaktuj się z administratorem."
  },
  "en": {
    "title": "Redirecting...",
    "errorTitle": "Something went wrong",
    "goBackToLogin": "Go back to login",
    "2faError": "Logging in via SocialMedia with two-factor authentication is not yet supported. Contact the administrator."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { AuthProviderKey } from '@heseya/store-core'

import { formatApiError, formatApiNotificationError } from '@/utils/errors'
import { LoginState } from '@/enums/login'
import { stringifyQueryParams } from '@/utils/stringifyQuery'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import { OAUTH_NEXT_URL_KEY, OAUTH_PROVIDER_KEY } from '@/consts/oauthKeys'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: (this.errorMessage ? this.$t('errorTitle') : this.$t('title')) as string }
  },

  components: {
    CentralScreenForm,
  },

  data: () => ({
    errorMessage: '',
  }),

  computed: {
    returnToLoginUrl(): string {
      return `/login${stringifyQueryParams({
        next: localStorage.getItem(OAUTH_NEXT_URL_KEY) || undefined,
      })}`
    },
  },

  async mounted(): Promise<void> {
    const provider = localStorage.getItem(OAUTH_PROVIDER_KEY) as AuthProviderKey
    if (!provider) return this.redirectToLogin()

    const result = await this.$accessor.auth.login({
      provider,
      returnUrl: window.location.href,
    })

    if (result.state === LoginState.Error) {
      this.cleanupAfterOAuth()
      const error = formatApiError(result.error)
      this.errorMessage = error.messages.join(', ') || error.title
      this.$toast.error(formatApiNotificationError(result.error))
    }

    if (result.state === LoginState.AccountMergeRequired) {
      this.cleanupAfterOAuth()
      this.$router.push({
        name: 'Login',
        query: {
          mergeToken: result.mergeToken,
        },
      })
    }

    if (result.state === LoginState.Success) this.redirectToNextUrl()

    if (result.state === LoginState.TwoFactorAuthRequired) {
      // TODO: 2FA when logging in via OAuth
      // eslint-disable-next-line no-console
      console.error('TODO: 2FA in OAuthLoginReturn')
      this.errorMessage = this.$t('2faError') as string
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
.oauth-login-return {
  text-align: center;

  &__title {
    text-align: center;
  }

  &__error {
    font-size: 1.4em;
    background-color: var(--red-color-200);
    padding: 8px;
    color: var(--red-color-500);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
}
</style>
