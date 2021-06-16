<template>
  <div class="editor">
    <quill-editor
      ref="editor"
      :value="value"
      @input="onInput"
      :options="editorOption"
      :height="height"
    />
  </div>
</template>

<script>
import { uploadMedia } from '@/services/uploadMedia'
import { formatApiError } from '@/utils/errors'

export default {
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
          upload: async (sourceFile) => {
            const { success, file, error } = await uploadMedia(sourceFile)
            if (success) return file.url
            this.$vs.notification({ color: 'danger', ...formatApiError(error) })
            return null
          },
        },
      },
    },
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
    onInput(value) {
      this.$emit('input', value)
    },
  },
}
</script>
