<template>
  <div>
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
      >
        <i v-if="provider.key == AuthProviderKey.Bitbucket" class="bx bxl-git"></i>
        <i v-else :class="`bx bxl-${provider.key}`"></i>
      </app-button>
    </div>
  </div>
</template>

<i18n>
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
import Vue from 'vue'

import { api } from '@/api'
import { AuthProvider } from '@/interfaces/Providers'
import { AuthProviderKey } from '@/interfaces/Providers'

export default Vue.extend({
  data: () => ({
    providers: [] as AuthProvider[],
  }),
  computed: {
    AuthProviderKey(): typeof AuthProviderKey {
      return AuthProviderKey
    },
  },
  async created() {
    const { data: providersData } = await api.get<{ data: AuthProvider[] }>(
      `/auth/providers?active=1`,
    )
    this.providers = providersData.data
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
