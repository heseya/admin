<template>
  <div class="micro-frontend" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { findAppByHost, installApp, uninstallApp } from 'bout'

export default defineComponent({
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
      const shadowRoot = this.$el.attachShadow({ mode: 'closed' })

      const shadowDocument = document.createElement('html')
      const shadowHead = document.createElement('head')
      const shadowBody = document.createElement('body')

      shadowDocument.appendChild(shadowHead)
      shadowDocument.appendChild(shadowBody)

      shadowRoot.appendChild(shadowDocument)

      return { head: shadowHead, body: shadowBody, document: shadowDocument }
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
