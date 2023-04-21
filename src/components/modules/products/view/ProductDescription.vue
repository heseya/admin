<template>
  <a-collapse accordion :bordered="false" class="product-advanced-details">
    <template #expandIcon="{ isActive }">
      <div>
        <i :class="`bx ${isActive ? 'bx-chevron-up' : 'bx-chevron-down'}`"></i>
      </div>
    </template>

    <a-collapse-panel>
      <template #header>
        <span class="seo-form-accordion__title">{{ $t('title') }}</span>
      </template>

      <rich-editor v-if="!loading" v-model="form" :disabled="disabled" />
    </a-collapse-panel>
  </a-collapse>
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
import Vue from 'vue'

import RichEditor from '@/components/form/RichEditor.vue'

export default Vue.extend({
  components: { RichEditor },
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
