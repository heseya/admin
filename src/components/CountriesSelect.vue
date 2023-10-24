<template>
  <validated-select
    v-model="selected"
    :options="countries"
    option-key="code"
    :disabled="disabled"
    :loading="isLoading"
    mode="multiple"
    :label="label"
    option-filter-prop="label"
    filter-option
    :rules="{ required: !blockList && value.length === 0 }"
  />
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { ShippingCountry } from '@heseya/store-core'
import { sdk } from '@/api'

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    blockList: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: () => '',
    },
  },

  data: () => ({
    isLoading: false,
    countries: [] as ShippingCountry[],
  }),

  computed: {
    selected: {
      get() {
        return this.value
      },
      set(value: string[]) {
        this.$emit('input', value)
      },
    },
  },

  async created() {
    this.isLoading = true
    const countries = await sdk.ShippingMethods.getCountries()
    this.countries = countries.sort((a, b) => a.name.localeCompare(b.name))
    this.isLoading = false
  },
})
</script>
