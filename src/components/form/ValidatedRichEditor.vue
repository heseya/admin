<template>
  <validation-provider
    v-slot="{ errors }"
    :rules="rules"
    :name="name"
    class="rich-editor"
    :style="{ '--height': height }"
  >
    <RichEditor v-model="innerValue" :name="name" :height="height" :disabled="disabled" />
    <span v-if="errors.length" class="app-input__error">{{ errors[0] }} </span>
  </validation-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ValidationProvider } from 'vee-validate'
import RichEditor from '@/components/form/RichEditor.vue'

export default defineComponent({
  components: {
    RichEditor,
    ValidationProvider,
  },
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
    rules: {
      type: String,
      default: null,
    },
  },
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
.validated-rich-editor {
}
</style>
