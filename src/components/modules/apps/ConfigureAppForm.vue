<template>
  <div class="configure-app-form">
    <h1>TODO: {{ app.name }}</h1>
  </div>
</template>

<script lang="ts">
import { App } from '@/interfaces/App'
import Vue from 'vue'

export default Vue.extend({
  props: {
    app: {
      type: Object,
      required: true,
    } as Vue.PropOptions<App>,
  },
  data: () => ({
    form: {} as Record<string, any>,
    isError: false,
    isLoading: false,
  }),
  methods: {
    async changeAppConfig() {
      // TODO
    },
  },
})
</script>

<style lang="scss">
.configure-app-form {
}
</style>
