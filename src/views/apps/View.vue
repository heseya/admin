<template>
  <div class="micro-app-containter">
    <loading :active="isLoading" />
    <micro-frontend v-if="app && !isLoading" :app-key="app.slug" :host="app.microfrontend_url" />
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Aplikacja",
    "error": "Ta aplikacja nie posiada dedykowanego widoku"
  },
  "en": {
    "title": "Application",
    "error": "This application has no dedicated view"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import MicroFrontend from '@/components/MicroFrontend.vue'
import Loading from '@/components/layout/Loading.vue'

import { App } from '@/interfaces/App'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.app?.name || (this.$t('title') as string) }
  },
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

    if (!this.app?.microfrontend_url) {
      this.$toast.warning(this.$t('error') as string)
      this.$router.push('/apps')
    }

    if (!success) this.$router.replace('/apps')
    this.isLoading = false
  },
})
</script>
