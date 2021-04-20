<template>
  <div class="editor">
    <editor
      ref="editor"
      :initialValue="value"
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
// import debounce from 'lodash/debounce'
import { Editor } from '@toast-ui/vue-editor'

export default {
  data: () => ({
    options: {
      hideModeSwitch: true,
      toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'divider',
        'table',
        'link',
        'divider',
        'code',
        'codeblock',
      ],
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
    change() {
      const value = this.$refs.editor.invoke('getMarkdown')
      this.$emit('input', value)
    },
  },
  mounted() {
    this.$refs.editor.invoke('setMarkdown', this.value)
  },
  components: {
    Editor,
  },
}
</script>
