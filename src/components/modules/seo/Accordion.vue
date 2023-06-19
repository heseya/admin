<template>
  <LayoutAccordion :title="$t('title').toString()" :white="white">
    <SeoForm v-model="form" :current="current" />
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Ustawienia SEO"
  },
  "en": {
    "title": "SEO settings"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SeoMetadata } from '@heseya/store-core'

import SeoForm from './Form.vue'
import LayoutAccordion from '@/components/layout/Accordion.vue'
import { UUID } from '@/interfaces/UUID'

export default defineComponent({
  components: {
    SeoForm,
    LayoutAccordion,
  },
  props: {
    value: {
      type: Object as PropType<SeoMetadata | null>,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    white: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object as PropType<{ id: UUID; model: string }>,
      default: null,
    },
  },
  computed: {
    form: {
      get(): SeoMetadata {
        return this.value || {}
      },
      set(v: SeoMetadata) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
