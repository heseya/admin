<template>
  <error-page :title="$t('title').toString()" :description="$t('description').toString()" />
</template>

<i18n lang="json">
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
