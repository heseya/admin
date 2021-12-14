<template>
  <textarea
    class="article-editor"
    ref="article"
    :value="value"
    :name="name"
    :placeholder="placeholder"
  />
</template>

<script lang="ts">
// @ts-nocheck
import Vue from 'vue'
export default Vue.extend({
  article: false,
  props: {
    value: {
      default: '',
      type: String,
    },
    placeholder: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    config: {
      default: {},
      type: Object,
    },
  },
  watch: {
    value(value) {
      this.article.editor.setContent({ html: value })
    },
  },
  mounted() {
    try {
      this.init()
    } catch (e) {
      console.error('[Article Editor]', e)
    }
  },
  beforeDestroy() {
    try {
      this.destroy()
    } catch (e) {
      console.error('[Article Editor]', e)
    }
  },
  methods: {
    init() {
      const me = this
      const subscribe = {
        'editor.change': function (event) {
          var html = event.get('html')
          me.handleInput(html)
          return html
        },
      }

      // extend config
      const config = {
        ...this.config,
        subscribe: {
          ...this.config?.subscribe,
          ...subscribe,
        },
      }

      // call
      var app = ArticleEditor(this.$refs.article, config)

      // set instance
      this.article = app
      this.$parent.article = app
    },
    destroy() {
      if (!this.article) return

      // Call destroy on article to cleanup event handlers
      this.article.stop()

      // unset instance for garbage collection
      this.article = null
      this.$parent.article = null
    },
    handleInput(val) {
      this.$emit('input', val)
    },
  },
})
</script>

<style lang="scss">
.article-editor {
}
</style>
