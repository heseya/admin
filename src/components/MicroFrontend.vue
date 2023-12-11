<template>
  <div class="micro-frontend" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { findAppByHost, installApp, onMounted, openCommunicationChannel, uninstallApp } from 'bout'
import { Language } from '@heseya/store-core'
import { getApiURL } from '@/utils/api'

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
    serviceUrl: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    wasMounted: false,
    container: null as null | string | Element,
  }),
  computed: {
    containerId(): string {
      return `${this.appKey}-container`
    },
    standardHost(): string {
      return this.host.endsWith('/') ? this.host : `${this.host}/`
    },

    mainChannel() {
      return openCommunicationChannel('Main')
    },
    tokenChannel() {
      return openCommunicationChannel('Token')
    },
  },

  watch: {
    '$accessor.auth.getIdentityToken'(token: string) {
      this.tokenChannel.emit('set', token)
    },

    '$i18n.locale'(locale: string) {
      this.mainChannel.emit('uiLanguage:set', locale)
    },
    '$accessor.config.apiLanguage'(lang: Language) {
      this.mainChannel.emit('apiLanguage:set', lang)
    },
  },

  created() {
    onMounted(() => {
      if (!this.wasMounted) {
        this.mainChannel.emit('init', {
          coreUrl: getApiURL(),
          // TODO: this will be injected into any microfrontend, not only this one!
          serviceUrl: this.serviceUrl,
          token: this.$accessor.auth.getIdentityToken,
          user: this.$accessor.auth.user,
          uiLanguage: this.$i18n.locale,
          apiLanguage: this.$accessor.config.apiLanguage,
        })

        this.wasMounted = true
      }
    })

    this.tokenChannel.on<undefined>('refresh', async () => {
      const { identityToken } = await this.$accessor.auth.refreshToken()
      return identityToken
    })
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
      const shadowRoot = this.$el.attachShadow({ mode: 'open' })

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
