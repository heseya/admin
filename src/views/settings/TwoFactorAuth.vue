<template>
  <div class="narrower-page">
    <top-nav title="Weryfikacja dwuetapowa">
      <tag v-if="user && user.is_tfa_active" type="success">
        <i class="bx bx-check"></i> {{ $t('common.active') }}
      </tag>
      <tag v-else type="error"> <i class="bx bx-x"></i> {{ $t('common.inactive') }} </tag>
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

<script lang="ts">
import Vue from 'vue'

import TopNav from '@/components/layout/TopNav.vue'
import Tag from '@/components/Tag.vue'
import Card from '@/components/layout/Card.vue'
import Setup2FA from '@/components/modules/2fa/Setup.vue'
import Remove2FA from '@/components/modules/2fa/Remove.vue'
import GenerateRecoveryCodes from '@/components/modules/2fa/GenerateRecoveryCodes.vue'

import { User } from '@/interfaces/User'

export default Vue.extend({
  components: { TopNav, Tag, Card, Setup2FA, Remove2FA, GenerateRecoveryCodes },
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
