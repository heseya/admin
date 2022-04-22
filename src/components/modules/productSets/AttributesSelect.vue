<template>
  <app-select
    v-model="selectedAttributes"
    :label="$t('label')"
    :placeholder="$t('placeholder')"
    :disabled="disabled"
    :loading="isLoading"
    mode="multiple"
    name="selectedAttributes"
    option-filter-prop="label"
    @search="onSearch"
  >
    <a-select-option v-for="attribute in attributes" :key="attribute.id" :label="attribute.name">
      {{ attribute.name }}
    </a-select-option>
  </app-select>
</template>

<i18n>
{
  "pl": {
    "label": "Cechy, po których można filtrować produkty",
    "placeholder": "Wybierz cechy"
  },
  "en": {
    "label": "Attributes, by which you can filter products",
    "placeholder": "Select attributes"
  }
}
</i18n>

<script lang="ts">
import { Attribute } from '@/interfaces/Attribute'
import { debounce } from 'lodash'
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<Attribute[]>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    selectedAttributes: {
      get(): Attribute[] {
        return this.value
      },
      set(value: Attribute[]) {
        this.$emit('input', value)
      },
    },
    attributes(): Attribute[] {
      return this.$accessor.attributes.data
    },
  },
  created() {
    this.searchAttributes()
  },
  methods: {
    async searchAttributes(value?: string) {
      this.isLoading = true
      await this.$accessor.attributes.fetch({ search: value, global: 0 })
      this.isLoading = false
    },
    onSearch: debounce(function (this: any, value: string) {
      this.searchAttributes(value)
    }, 200),
  },
})
</script>