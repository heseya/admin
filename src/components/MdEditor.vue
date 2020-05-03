<template>
  <div class="editor">
    <editor
      ref="editor"
      initialValue=""
      :options="options"
      initialEditType="wysiwyg"
      previewStyle="vertical"
      @change="change"
      :height="height"
    />
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'

export default {
  data: () => ({
    options: {
      hideModeSwitch: true
    }
  }),
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  methods: {
    change() {
      const value = this.$refs.editor.invoke('getMarkdown')
      this.$emit('input', value)
    }
  },
  watch: {
    value(value) {
      this.$refs.editor.invoke('setMarkdown', value)
    }
  },
  components: {
    Editor
  }
}
</script>
