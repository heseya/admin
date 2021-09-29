<template>
  <div class="micro-app-containter">
    <loading :active="isLoading">
      <micro-frontend v-if="app" :app-key="app.slug" :host="app.microfrontend_url" />
    </loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import MicroFrontend from '@/components/MicroFrontend.vue'
import Loading from '@/components/layout/Loading.vue'

import { App } from '@/interfaces/App'

export default Vue.extend({
  components: { MicroFrontend, Loading },
  data: () => ({
    isLoading: true,
  }),
  computed: {
    appId(): string {
      return this.$route.params.id
    },
    app(): App | null {
      return this.$accessor.apps.getSelected
    },
  },
  async created() {
    this.isLoading = true
    const success = await this.$accessor.apps.get(this.appId)

    if (!success) this.$router.replace('/apps')
    this.isLoading = false
  },
})
</script>

<style lang="scss" scoped>
.micro-app-containter {
}
</style>
