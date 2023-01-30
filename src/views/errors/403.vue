<template>
  <error-page :title="$t('title')" :description="$t('description')" />
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Błąd 403",
    "description": "Nie masz uprawnień by wyświetlić tę stronę"
  },
  "en": {
    "title": "Error 403",
    "description": "You don't have permissions to view this page"
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
