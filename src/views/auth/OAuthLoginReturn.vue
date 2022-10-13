<template>
  <central-screen-form v-if="!error">
    <h1 class="redirect-title">{{ $t('title') }}</h1>
  </central-screen-form>

  <central-screen-form v-else>
    <h1 class="redirect-title">{{ $t('errorTitle') }}</h1>
    <zone type="danger">{{ error }}</zone>
    <br />
    <app-button type="primary" :to="loginUrl">{{ $t('goBackToLogin') }}</app-button>
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
    loginUrl(): string {
      return `/login${stringifyQueryParams({
        next: this.$route.query.heseya_next as string,
      })}`
    },
  },

  async created() {
    const nextUrl = (this.$route.query.heseya_next as string) || '/'

    const result = await this.$accessor.auth.loginViaProvider(window.location.href)
    console.log('🚀 ~ file: OAuthLoginReturn.vue ~ line 41 ~ created ~ result', result)

    if (result.state === LoginState.Error) {
      this.error = result.error
      this.$toast.error(formatApiNotificationError(result.error))
    }

    if (result.state === LoginState.Success) {
      this.$router.push(nextUrl)
    }

    if (result.state === LoginState.TwoFactorAuthRequired) {
      // TODO
      // eslint-disable-next-line no-console
      console.error('TODO: 2FA in OAuthLoginReturn')
      this.error = new Error('Two factor auth required')
    }
  },
})
</script>

<style lang="scss" scoped>
.redirect-title {
  text-align: center;
}
</style>
