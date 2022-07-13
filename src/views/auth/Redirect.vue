<template>
  <central-screen-form>
    <h1 class="redirect-title">{{ $t('title') }}</h1>
  </central-screen-form>
</template>

<i18n>
{
  "pl": {
    "title": "Przekierowywanie..."
  },
  "en": {
    "title": "Redirecting..."
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'

import CentralScreenForm from '@/components/form/CentralScreenForm.vue'
import { formatApiNotificationError } from '@/utils/errors'
import { AuthResponse } from '@/store/auth'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    CentralScreenForm,
  },
  async created() {
    const nextUrl = window.localStorage.getItem('nextUrl') || ''
    const provider = window.localStorage.getItem('provider')
    // Request not working yet
    try {
      const data = await api.get<AuthResponse>(
        `/auth/providers/${provider}/login${window.location.search}`,
      )
      // Do something with 'data'
      window.location.href = window.location.origin + '/' + nextUrl
    } catch (error: any) {
      this.$toast.error(formatApiNotificationError(error))
    }
  },
})
</script>

<style lang="scss" scoped>
.redirect-title {
  text-align: center;
}
</style>
