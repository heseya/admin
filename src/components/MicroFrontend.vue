<template>
  <div :id="containerId" />
</template>

<script lang="ts">
import Vue from 'vue'
import { findAppByHost, installApp } from 'microfront-lib'

export default Vue.extend({
  name: 'MicroFrontend',
  props: {
    appKey: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
  },
  computed: {
    containerId(): string {
      return `${this.appKey}-container`
    },
    standardHost(): string {
      return this.host.endsWith('/') ? this.host : `${this.host}/`
    },
  },
  async mounted() {
    if (findAppByHost(this.standardHost)) {
      this.mountApp()
    } else {
      await installApp(this.standardHost)
      this.mountApp()
    }
  },
  beforeDestroy() {
    this.unmountApp()
  },
  methods: {
    mountApp() {
      const app = findAppByHost(this.standardHost)
      if (app) app.mount(this.containerId)
    },
    unmountApp() {
      const app = findAppByHost(this.standardHost)
      if (app) app.unmount(this.containerId)
    },
  },
})
</script>
