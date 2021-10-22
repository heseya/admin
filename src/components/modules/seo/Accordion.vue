<template>
  <a-collapse accordion :bordered="false" class="seo-form-accrodion">
    <template #expandIcon="{ isActive }">
      <div>
        <i v-if="isActive" class="bx bx-chevron-up"></i>
        <i v-else class="bx bx-chevron-down"></i>
      </div>
    </template>

    <a-collapse-panel>
      <template #header>
        <span class="seo-form-accrodion__title">Ustawienia SEO</span>
      </template>
      <SeoForm v-model="form" />
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import Vue from 'vue'

import { SeoMetadata } from '@/interfaces/SeoMetadata'
import SeoForm from './Form.vue'

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

<style lang="scss" scoped>
.seo-form-accrodion {
  &__title {
    font-weight: 600;
  }
}
</style>
