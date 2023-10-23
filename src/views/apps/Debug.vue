<template>
  <div class="micro-app-containter">
    <micro-frontend app-key="debug" :host="appUrl" />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Aplikacja testowa",
    "error": "Musisz podać adres aplikacji w query `url`"
  },
  "en": {
    "title": "Test application",
    "error": "You must provide application url in query `url`"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import MicroFrontend from '@/components/microfrontends/MicroFrontend.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: { MicroFrontend },
  computed: {
    appUrl(): string {
      return this.$route.query.url as string
    },
  },
  async created() {
    if (!this.appUrl) {
      this.$toast.warning(this.$t('error') as string)
      this.$router.push('/apps')
    }
  },
})
</script>
