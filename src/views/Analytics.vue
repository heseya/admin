<template>
  <div>
    <top-nav :title="$t('title').toString()"></top-nav>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Statystyki"
  },
  "en": {
    "title": "Analytics"
  }
}
</i18n>

<script lang="ts">
import TopNav from '@/components/layout/TopNav.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: { TopNav },
})
</script>
