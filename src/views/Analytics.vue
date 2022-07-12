<template>
  <div>
    <top-nav :title="$t('title')" subtitle="TODO"></top-nav>
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
import Vue from 'vue'
export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: { TopNav },
})
</script>
