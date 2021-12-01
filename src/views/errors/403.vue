<template>
  <error-page title="403" description="Nie masz uprawnień by wyświetlić tę stronę" />
</template>

<script lang="ts">
import Vue from 'vue'
import ErrorPage from '@/components/layout/ErrorPage.vue'

export default Vue.extend({
  metaInfo: { title: 'Błąd 403' },
  components: {
    ErrorPage,
  },
})
</script>
