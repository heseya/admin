<template>
  <div v-if="providers.length">
    <div class="providers-text">
      <hr />
      <span class="providers-text__text">{{ $t('orUse') }}</span>
      <hr />
    </div>
    <div class="login-providers">
      <app-button
        v-for="provider in providers"
        :key="provider.key"
        type="primary"
        class="login-providers__provider"
        @click="loginViaProvider(provider.key)"
      >
        <i v-if="provider.key == AuthProviderKey.Bitbucket" class="bx bxl-git"></i>
        <i v-else :class="`bx bxl-${provider.key}`"></i>
      </app-button>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "orUse": "lub zaloguj się używając"
  },
  "en": {
    "orUse": "or login with"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { AuthProviderKey, AuthProviderListed } from '@heseya/store-core'

import { sdk } from '@/api'
import { formatApiNotificationError } from '@/utils/errors'
import { OAUTH_PROVIDER_KEY, OAUTH_NEXT_URL_KEY } from '@/consts/oauthKeys'

export default defineComponent({
  data: () => ({
    providers: [] as AuthProviderListed[],
  }),
  computed: {
    AuthProviderKey(): typeof AuthProviderKey {
      return AuthProviderKey
    },
  },
  async created() {
    this.providers = (await sdk.Auth.Providers.get({ active: true })).data
  },
  methods: {
    async loginViaProvider(provider: AuthProviderKey) {
      try {
        localStorage.setItem(OAUTH_NEXT_URL_KEY, (this.$route.query.next as string) || '/')
        localStorage.setItem(OAUTH_PROVIDER_KEY, provider)

        const redirectUrl = await sdk.Auth.Providers.redirect(
          provider,
          `${window.location.origin}/oauth-login-return`,
        )

        window.location.href = redirectUrl
      } catch (error: any) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.providers-text {
  display: flex;
  align-items: center;
  padding-top: 10px;

  &__text {
    margin: 0 25px;
    white-space: nowrap;
  }
}

.login-providers {
  display: flex;
  flex-flow: wrap;
  justify-content: space-around;
  padding: 10px 5px;

  &__provider {
    margin: 5px;
  }
}
</style>
