<template>
  <main :id="name + '-container'" />
</template>

<script>
export default {
  name: 'MicroFrontend',
  props: ['history', 'name', 'host'],
  mounted() {
    const { name, host } = this
    const { document } = window
    const scriptId = `micro-frontend-script-${name}`
    if (document.getElementById(scriptId)) {
      this.renderMicroFrontend()
      return
    }
    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement('script')
        script.id = scriptId
        script.type = 'module'
        script.crossOrigin = ''
        const appSrc = manifest['index.js'] || manifest['main.js'] || manifest['main.umd.min.js']

        script.src = `${host}${appSrc}`
        script.onload = this.renderMicroFrontend
        document.head.appendChild(script)
      })
  },
  beforeDestroy() {
    const { name } = this
    window[`unmount${name}`](`${name}-container`)
  },
  methods: {
    renderMicroFrontend: function () {
      const { name, history } = this
      window[`render${name}`](`${name}-container`, history)
    },
  },
}
</script>
