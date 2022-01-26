<template>
  <a-collapse
    accordion
    :bordered="false"
    class="seo-form-accrodion"
    :class="{ 'seo-form-accrodion--white': white }"
  >
    <template #expandIcon="{ isActive }">
      <div>
        <i v-if="isActive" class="bx bx-chevron-up"></i>
        <i v-else class="bx bx-chevron-down"></i>
      </div>
    </template>

    <a-collapse-panel>
      <template #header>
        <span class="seo-form-accrodion__title">{{ $t('title') }}</span>
      </template>
      <SeoForm v-model="form" :current="current" />
    </a-collapse-panel>
  </a-collapse>
</template>

<i18n>
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

import { SeoMetadata } from '@/interfaces/SeoMetadata'
import SeoForm from './Form.vue'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: {
    SeoForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<SeoMetadata>,
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
        return this.value
      },
      set(v: SeoMetadata) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<style lang="scss">
.seo-form-accrodion {
  &__title {
    font-weight: 600;
  }

  &--white .ant-collapse-item {
    background-color: #fff;
  }
}
</style>
