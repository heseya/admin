<template>
  <LayoutAccordion :title="$t('title').toString()">
    <rich-editor
      v-if="!loading || (loading && (form === '' || !!form))"
      v-model="form"
      :disabled="disabled"
    />
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Pełen opis"
  },
  "en": {
    "title": "Full description"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'

import RichEditor from '@/components/form/RichEditor.vue'
import LayoutAccordion from '@/components/layout/Accordion.vue'

export default defineComponent({
  components: { RichEditor, LayoutAccordion },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  computed: {
    form: {
      get(): string {
        return this.value || ''
      },
      set(value: string) {
        this.$emit('input', value)
      },
    },
  },
})
</script>
