<template>
  <div class="micro-frontend" :data-host="host" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { findAppByHost, installApp, onMounted, openCommunicationChannel, uninstallApp } from 'bout'
import { Language } from '@heseya/store-core'
import { getApiURL } from '@/utils/api'
import { trimSlash } from '@/utils/trimSlash'

export default defineComponent({
  name: 'MicroFrontend',
  props: {
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
    isInitialized: false,
  }),

  computed: {
    standardHost(): string {
      // Enforce trailing slash
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
    '$accessor.isMicrofrontendInstalation'(isMicrofrontendInstalation: boolean) {
      if (!isMicrofrontendInstalation && !this.isInitialized) {
        this.initialize()
      }
    },
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
        const data = {
          coreUrl: trimSlash(getApiURL()),
          // TODO: this will be injected into any microfrontend, not only this one!
          serviceUrl: trimSlash(this.serviceUrl),
          token: this.$accessor.auth.getIdentityToken,
          user: this.$accessor.auth.user,
          uiLanguage: this.$i18n.locale,
          apiLanguage: this.$accessor.config.apiLanguage,
        }

        this.mainChannel.emit('init', data)

        this.wasMounted = true
      }
    })

    this.tokenChannel.on<undefined>('refresh', async () => {
      const { identityToken } = await this.$accessor.auth.refreshToken()
      return identityToken
    })
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
