<template>
  <div class="rich-editor" :style="{ '--height': height }">
    <article-editor ref="editor" v-model="innerValue" :config="editorConfig" :disabled="disabled" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { uploadMedia } from '@/services/uploadMedia'
import { CdnMedia } from '@/interfaces/Media'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '400px',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    editorConfig: {
      css: '/article-editor/css/',
      plugins: ['imageposition', 'imageresize', 'counter', 'underline', 'removeformat', 'reorder'],
      link: {
        nofollow: true,
      },
      image: {
        async upload(upload: any, data: { files: File[]; e: any }) {
          const rawFiles = Array.from(data.files)
          const responses = await Promise.all(rawFiles.map((file: File) => uploadMedia(file)))
          const files = responses
            .map((r) => (r.success ? r.file : null))
            .filter((v) => !!v) as CdnMedia[]

          // create response
          const uploadedFiles = files.reduce((acc, f) => ({ ...acc, [f.id]: f }), {})

          // call complete
          upload.complete(uploadedFiles, data.e)
        },
      },
    },
  }),
  computed: {
    innerValue: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style lang="scss">
.rich-editor {
  .arx-editor-frame {
    min-height: var(--height) !important;
  }
}
</style>
