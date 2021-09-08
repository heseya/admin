<template>
  <div class="rich-editor" :style="{ '--height': height }">
    <quill-editor ref="editor" :value="value" @input="onInput" :options="editorOption" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { uploadMedia } from '@/services/uploadMedia'
import { QuillOptionsStatic } from 'quill'

export default Vue.extend({
  data: () => ({
    editorOption: {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block', 'image'],

          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],

          ['clean'], // remove formatting button
        ],
        imageUploader: {
          upload: async (sourceFile: File) => {
            const { success, file, error } = await uploadMedia(sourceFile)
            if (success && file) return file.url
            // eslint-disable-next-line no-console
            console.error('Failed to upload file to CDN:', error)
            // this.$vs.notification({ color: 'danger', ...formatApiError(error) })
            return null
          },
        },
      },
    } as QuillOptionsStatic,
  }),
  props: {
    value: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '400px',
    },
  },
  methods: {
    onInput(value: string) {
      this.$emit('input', value)
    },
  },
})
</script>

<style lang="scss">
.rich-editor {
  .ql-editor {
    height: var(--height);
  }
}
</style>
