<template>
  <div :id="containerId" />
</template>

<script lang="ts">
import Vue from 'vue'
import { findAppByHost, installApp } from 'bout'

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
  data: () => ({
    container: null as null | string | Element,
  }),
  computed: {
    containerId(): string {
      return `${this.appKey}-container`
    },
    standardHost(): string {
      return this.host.endsWith('/') ? this.host : `${this.host}/`
    },
  },
  async mounted() {
    // this.$el.attachShadow({ mode: 'open' })
    // this.$el.shadowRoot.innerHTML = `<div id="${this.containerId}" />`

    this.container = this.$el

    if (findAppByHost(this.standardHost)) {
      this.mountApp(this.container)
    } else {
      await installApp(this.standardHost)
      this.mountApp(this.container)
    }
  },
  beforeDestroy() {
    this.unmountApp()
  },
  methods: {
    mountApp(container: Element | string) {
      const app = findAppByHost(this.standardHost)
      if (app) app.mount(container)
    },
    unmountApp() {
      const app = findAppByHost(this.standardHost)
      if (app) app.unmount()
    },
  },
})
</script>
