<template>
  <div class="rich-editor" :style="{ '--height': height }">
    <article-editor
      ref="editor"
      v-model="innerValue"
      :name="name"
      :config="editorConfig"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CdnMedia } from '@heseya/store-core'

import { uploadMedia } from '@/services/uploadMedia'
import { formatApiError } from '@/utils/errors'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: null,
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

  computed: {
    canUpload(): boolean {
      return this.$can(this.$p.Media.Add)
    },

    editorConfig(): any {
      return {
        css: '/article-editor/css/',
        plugins: [
          'imageposition',
          'imageresize',
          'underline',
          'removeformat',
          'reorder',
          'filelink',
        ],
        link: {
          nofollow: true,
        },
        image: {
          upload: this.canUpload ? this.uploadFileToArticle : false,
        },
        filelink: {
          upload: this.canUpload ? this.uploadFileToArticle : false,
        },
      }
    },

    innerValue: {
      get(): string {
        return this.value
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
  },

  methods: {
    async uploadFileToArticle(upload: any, data: { files: File[]; e: any }) {
      const rawFiles = Array.from(data.files)
      const responses = await Promise.all(rawFiles.map((file: File) => uploadMedia(file)))
      const files = responses
        .map((r) => (r.success ? r.file : null))
        .filter((v) => !!v) as CdnMedia[]

      const errors = responses.map((r) => (r.success ? null : r.error)).filter(Boolean)
      if (errors.length) this.$toast.error(formatApiError(errors[0]!).title)

      // create response
      const uploadedFiles = files.reduce((acc, file) => ({ ...acc, [file.id]: file }), {})

      // call complete
      upload.complete(uploadedFiles, data.e)
    },
  },
})
</script>

<style lang="scss">
.rich-editor {
  .arx-editor-frame {
    min-height: var(--height) !important;
  }

  .arx-editor-container {
    border-right-width: 2px;
  }
}

.arx-popup {
  z-index: 100000;
}
</style>
