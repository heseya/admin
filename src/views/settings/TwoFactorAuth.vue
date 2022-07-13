<template>
  <div class="narrower-page">
    <top-nav :title="$t('title')">
      <BooleanTag
        :value="user && user.is_tfa_active"
        :true-text="$t('common.active')"
        :false-text="$t('common.inactive')"
      />
    </top-nav>

    <card>
      <Setup2FA v-if="!isTfaActive" />
      <div v-else>
        <GenerateRecoveryCodes />
        <hr />
        <Remove2FA @removed="isTfaActive = false" />
      </div>
    </card>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Weryfikacja dwuetapowa"
  },
  "en": {
    "title": "Two-factor authentication"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import Setup2FA from '@/components/modules/2fa/Setup.vue'
import Remove2FA from '@/components/modules/2fa/Remove.vue'
import GenerateRecoveryCodes from '@/components/modules/2fa/GenerateRecoveryCodes.vue'

import { User } from '@/interfaces/User'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: { TopNav, Card, Setup2FA, Remove2FA, GenerateRecoveryCodes },
  data: () => ({
    isTfaActive: false,
  }),
  computed: {
    user(): User | null {
      return this.$accessor.auth.user
    },
  },
  created() {
    this.isTfaActive = this.user?.is_tfa_active || false
  },
})
</script>
