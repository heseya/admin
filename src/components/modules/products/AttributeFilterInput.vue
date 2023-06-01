<template>
  <range-input
    v-if="attribute.type === AttributeType.Number"
    :label="attribute.name"
    :value="value"
    @input="updateValue"
  />

  <range-input
    v-else-if="attribute.type === AttributeType.Date"
    :label="attribute.name"
    class="span-2"
    type="date"
    :value="value"
    @input="updateValue"
  />

  <autocomplete-input
    v-else
    mode="default"
    :value="value"
    prop-mode="id"
    :model-url="`attributes/id:${attribute.id}/options`"
    :label="attribute.name"
    @input="updateValue"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Attribute, AttributeType } from '@heseya/store-core'

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
  },
  methods: {
    updateValue(value: string) {
      this.$emit('input', value)
    },
  },
})
</script>
