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
    } as Vue.PropOptions<object>,
  },
  data: () => ({
    article: null as any,
  }),
  watch: {
    value(value: string) {
      console.log('🚀 ~ SET: ArticleEditor.vue ~ line 38 ~ value ~ value', {
        same: value === this.value,
        value,
      })
      if (value !== this.value) this.article.editor.setContent({ html: value })
    },
  },
  mounted() {
    try {
      this.init()
    } catch (e: any) {
      console.error('[Article Editor]', e)
    }
  },
  beforeDestroy() {
    try {
      this.destroy()
    } catch (e: any) {
      console.error('[Article Editor]', e)
    }
  },
  methods: {
    init() {
      const subscribe = {
        'editor.change': (event: any) => {
          const html = event.get('html')
          console.log('🚀 ~ GET: ArticleEditor.vue ~ line 60 ~ init ~ html', {
            same: html === this.value,
            html,
          })
          if (html !== this.value) this.handleInput(html)
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
      const article = ArticleEditor(this.$refs.article, config)
      console.log('🚀 ~ INIT: ArticleEditor.vue ~ line 77 ~ init ~ article', article)

      // set instance
      this.article = article
      this.$parent.article = article
    },
    destroy() {
      if (!this.article) return

      // Call destroy on article to cleanup event handlers
      this.article.stop()
      this.article.destroy()

      // unset instance for garbage collection
      this.article = null
      this.$parent.article = null
    },
    handleInput(value: any) {
      this.$emit('input', value)
    },
  },
})
</script>
