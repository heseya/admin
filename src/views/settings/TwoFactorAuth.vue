<template>
  <div class="narrower-page">
    <top-nav title="Weryfikacja dwuetapowa">
      <tag v-if="user && user.is_tfa_active" type="success">
        <i class="bx bx-check"></i> Aktywna
      </tag>
      <tag v-else type="error"> <i class="bx bx-x"></i> Nieaktywna </tag>
    </top-nav>

    <card>
      <Setup2FA v-if="!isTfaActive" />
      <div v-else>
        <h3>2FA jest aktywne</h3>
        <p>TODO: usuwanie i zmiana kodów odzyskujących</p>
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

import { User } from '@/interfaces/User'

export default Vue.extend({
  components: { TopNav, Tag, Card, Setup2FA },
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
