<template>
  <main :id="appKey + '-container'" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'MicroFrontend',
  props: ['appKey', 'host'],
  async mounted() {
    this.initializeRepository()

    const registerChannel = new BroadcastChannel('register')
    registerChannel.onmessage = (ev) => {
      const appName = ev.data.split(': ')[1]
      const app = window.microApps.find((app) => app.name === appName)
      app.host = this.host
      console.log('register', app)
      this.mountApp()
    }

    if (this.findApp(this.host)) {
      this.mountApp()
    } else {
      await this.registerApp(this.appKey, this.host)
    }
  },
  beforeDestroy() {
    this.unmountApp()
  },
  methods: {
    initializeRepository() {
      if (!window.microApps) window.microApps = []
    },

    findApp(host: string) {
      return window.microApps.find((app) => app.host === host)
    },

    async registerApp(appKey: string, host: string) {
      const { document } = window

      const scriptId = `micro-frontend-script-${appKey}`
      if (document.getElementById(scriptId)) {
        this.mountApp()
        return
      }

      const response = await fetch(`${host}/asset-manifest.json`)
      const manifest = await response.json()

      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'module'
      script.crossOrigin = ''
      const appSrc = manifest['index.js'] || manifest['main.js'] || manifest['main.umd.min.js']

      script.src = `${host}${appSrc}`
      document.head.appendChild(script)
    },

    mountApp() {
      const app = window.microApps.find((app) => app.host === this.host)
      app.mount(`${this.appKey}-container`, history)
    },
    unmountApp() {
      const app = window.microApps.find((app) => app.host === this.host)
      app.unmount(`${this.appKey}-container`)
    },
  },
})
</script>
