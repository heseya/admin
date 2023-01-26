<template>
  <div class="micro-frontend" :data-host="host" />
</template>

<script lang="ts">
import Vue from 'vue'
import { findAppByHost, installApp, uninstallApp } from 'bout'

export default Vue.extend({
  name: 'MicroFrontend',
  props: {
    host: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    container: null as null | string | Element,
    isInitialized: false,
  }),

  computed: {
    standardHost(): string {
      return this.host.endsWith('/') ? this.host : `${this.host}/`
    },
  },

  watch: {
    '$accessor.isMicrofrontendInstalation'(isMicrofrontendInstalation: boolean) {
      if (!isMicrofrontendInstalation && !this.isInitialized) {
        this.initialize()
      }
    },
  },

  async mounted() {
    if (!this.$accessor.isMicrofrontendInstalation) this.initialize()
    this.$el
  },

  beforeDestroy() {
    this.unmountApp()
    uninstallApp(this.standardHost)
  },

  methods: {
    initShadowDom(): { head: Element; body: Element; document: Element } {
      const root = this.$el.attachShadow({ mode: 'open' })

      root.innerHTML = `
        <div id="document">
          <div id="head"></div>
          <div id="body"></div>
        </div>`

      const document = root.getElementById('document')!
      const head = document.querySelector('#head')!
      const body = document.querySelector('#body')!

      return { head, body, document }
    },

    async initialize(): Promise<void> {
      this.$accessor.SET_IS_MICROFRONTEND_INSTALATION(true)
      const { head, body } = this.initShadowDom()
      this.container = body

      try {
        await installApp(this.standardHost, head)
        this.mountApp(body)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Installation failed: ', e)
      }
      this.$accessor.SET_IS_MICROFRONTEND_INSTALATION(false)
      this.isInitialized = true
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
