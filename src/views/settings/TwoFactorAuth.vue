<template>
  <div class="narrower-page">
    <top-nav title="Weryfikacja dwuetapowa">
      <tag v-if="user.is_2fa_active" type="success"> <i class="bx bx-check"></i> Aktywna </tag>
      <tag v-else type="error"> <i class="bx bx-x"></i> Nieaktywna </tag>
    </top-nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import TopNav from '@/components/layout/TopNav.vue'
import Tag from '@/components/Tag.vue'

export default Vue.extend({
  components: { TopNav, Tag },
  computed: {
    user(): User {
      return this.$accessor.auth.user!
    },
  },
})
</script>
