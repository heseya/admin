<template>
  <main :id="containerId" />
</template>

<script lang="ts">
import Vue from 'vue'
import { findAppByHost, installApp } from 'microfront-lib'

export default Vue.extend({
  name: 'MicroFrontend',
  props: ['appKey', 'host'],
  async mounted() {
    if (findAppByHost(this.host)) {
      this.mountApp()
    } else {
      await installApp(this.host)
      this.mountApp()
    }
  },
  beforeDestroy() {
    this.unmountApp()
  },
  computed: {
    containerId(): string {
      return `${this.appKey}-container`
    },
  },
  methods: {
    mountApp() {
      const app = findAppByHost(this.host)
      if (app) app.mount(this.containerId)
    },
    unmountApp() {
      const app = findAppByHost(this.host)
      if (app) app.unmount(this.containerId)
    },
  },
})
</script>
