<template>
  <error-page :title="$t('title')" :description="$t('description')" />
</template>

<i18n>
{
  "pl": {
    "title": "Błąd 404",
    "description": "Podana strona nie istnieje"
  },
  "en": {
    "title": "Error 404",
    "description": "The requested page does not exist"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import ErrorPage from '@/components/layout/ErrorPage.vue'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ErrorPage,
  },
})
</script>
