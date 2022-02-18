<template>
  <div class="micro-frontend" />
</template>

<script lang="ts">
import Vue from 'vue'
import { findAppByHost, installApp, uninstallApp } from 'bout'

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
    const { head, body } = this.initShadowDom()
    this.container = body

    try {
      await installApp(this.standardHost, head)
      this.mountApp(body)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Installation failed: ', e)
    }
  },
  beforeDestroy() {
    this.unmountApp()
    uninstallApp(this.standardHost)
  },
  methods: {
    initShadowDom() {
      this.$el.attachShadow({ mode: 'open' }).innerHTML = `
        <div id="document">
          <div id="head"></div>
          <div id="body"></div>
        </div>`

      const document = this.$el.shadowRoot!.getElementById('document')!
      const head = document.querySelector('#head')!
      const body = document.querySelector('#body')!

      return { head, body, document }
    },

    mountApp(container: Element | string) {
      const app = findAppByHost(this.standardHost)
      if (app) app.mount(container)
      // eslint-disable-next-line no-console
      else console.warn('App not found', this.standardHost)
    },
    unmountApp() {
      const app = findAppByHost(this.standardHost)
      if (app) app.unmount()
    },
  },
})
</script>
