<template>
  <!-- <app-input
    v-if="attribute.type === AttributeType.Date"
    :value="value"
    type="date"
    allow-clear
    :label="attribute.name"
    @input="updateValue"
  /> -->

  <div v-if="attribute.type === AttributeType.Number || attribute.type === AttributeType.Date">
    {{ attribute.name }}
  </div>

  <autocomplete-input
    v-else
    mode="default"
    :value="value"
    id-mode
    :model-url="`attributes/id:${attribute.id}/options`"
    :label="attribute.name"
    @input="updateValue"
  />
</template>

<script lang="ts">
import Vue from 'vue'

import { Attribute, AttributeType } from '@/interfaces/Attribute'

import AutocompleteInput from '@/components/AutocompleteInput.vue'

export default Vue.extend({
  components: { AutocompleteInput },
  props: {
    attribute: { type: Object, required: true } as Vue.PropOptions<Attribute>,
    value: { type: String, default: undefined },
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
