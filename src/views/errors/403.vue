<template>
  <error-page :title="$t('title').toString()" :description="$t('description').toString()" />
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
import { defineComponent } from 'vue'
import ErrorPage from '@/components/layout/ErrorPage.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    ErrorPage,
  },
})
</script>
