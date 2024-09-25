<template>
  <RangeInput
    v-if="attribute.type === AttributeType.Number"
    :label="attribute.name"
    :value="numberValue"
    @input="updateValue"
  />

  <RangeInput
    v-else-if="attribute.type === AttributeType.Date"
    :label="attribute.name"
    class="span-2"
    type="date"
    :value="dateValue"
    @input="updateValue"
  />

  <AutocompleteInput
    v-else
    mode="default"
    :value="otherValue"
    prop-mode="id"
    :model-url="`attributes/id:${attribute.id}/options`"
    :label="attribute.name"
    @input="updateValue"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  Attribute,
  AttributeNumber,
  AttributeDate,
  AttributeType,
  AttributeMultiOption,
  AttributeSingleOption,
} from '@heseya/store-core'

import AutocompleteInput from '@/components/AutocompleteInput.vue'
import RangeInput from '@/components/form/RangeInput.vue'

export default defineComponent({
  components: { AutocompleteInput, RangeInput },
  props: {
    attribute: { type: Object as PropType<Attribute>, required: true },
    value: { type: [String, Object, Array], default: undefined },
  },
  computed: {
    AttributeType(): typeof AttributeType {
      return AttributeType
    },
    // only for vue-tsc error with types
    numberValue: {
      get(): AttributeNumber {
        return this.value as AttributeNumber
      },
      set(v: AttributeNumber) {
        this.$emit('input', v)
      },
    },
    // only for vue-tsc error with types
    dateValue: {
      get(): AttributeDate {
        return this.value as AttributeDate
      },
      set(v: AttributeDate) {
        this.$emit('input', v)
      },
    },
    // only for vue-tsc error with types
    otherValue: {
      get(): AttributeSingleOption | AttributeMultiOption {
        return this.value as AttributeSingleOption | AttributeMultiOption
      },
      set(v: AttributeSingleOption | AttributeMultiOption) {
        this.$emit('input', v)
      },
    },
  },
  methods: {
    updateValue(value: string) {
      this.$emit('input', value)
    },
  },
})
</script>
