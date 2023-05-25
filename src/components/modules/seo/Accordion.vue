<template>
  <LayoutAccordion :title="$t('title')" :white="white">
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
import Vue from 'vue'
import { SeoMetadata } from '@heseya/store-core'

import SeoForm from './Form.vue'
import LayoutAccordion from '@/components/layout/Accordion.vue'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: {
    SeoForm,
    LayoutAccordion,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<SeoMetadata | null>,
    disabled: {
      type: Boolean,
      default: false,
    },
    white: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Object,
      default: null,
    } as Vue.PropOptions<{ id: UUID; model: string }>,
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
