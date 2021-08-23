<template>
  <error-page title="404" description="Podana strona nie istnieje" />
</template>

<script lang="ts">
import Vue from 'vue'
import ErrorPage from '@/components/layout/ErrorPage.vue'

export default Vue.extend({
  components: {
    ErrorPage,
  },
})
</script>
