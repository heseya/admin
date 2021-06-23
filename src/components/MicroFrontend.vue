<template>
  <main :id="containerId" />
</template>

<script lang="ts">
import Vue from 'vue'
import { findAppByHost, initializeRepository, installApp, onRegister } from 'microfront-lib'

export default Vue.extend({
  name: 'MicroFrontend',
  props: ['appKey', 'host'],
  async mounted() {
    initializeRepository()

    onRegister((app) => {
      app.host = this.host
      console.log('register', app)
      this.mountApp()
    })

    if (findAppByHost(this.host)) {
      this.mountApp()
    } else {
      await installApp(this.host)
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
