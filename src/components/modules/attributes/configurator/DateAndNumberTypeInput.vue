<template>
  <div v-if="type === AttributeType.Date" class="date-input">
    <app-input
      v-model="selectedOption.value_date"
      class="date-input__input"
      type="date"
      name="value_date"
    />
  </div>
  <div v-else-if="type === AttributeType.Number" class="number-input">
    <app-input
      v-model="selectedOption.name"
      class="number-input__input"
      name="name"
      :label="$t('displayName')"
      :placeholder="$t('namePlaceholder')"
    />
    <app-input
      v-model="selectedOption.value_number"
      class="number-input__input"
      type="number"
      name="value_number"
      :label="$t('value')"
      :placeholder="$t('valuePlaceholder')"
    />
  </div>
</template>

<i18n>
{
  "en": {
    "displayName": "Display name",
    "value": "Numeric value",
    "namePlaceholder": "E.g. 300cm",
    "valuePlaceholder": "E.g. 300"
  },
  "pl": {
    "displayName": "Wyświetlana nazwa",
    "value": "Wartość liczbowa",
    "namePlaceholder": "Np. 300cm",
    "valuePlaceholder": "Np. 300"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'

import { AttributeOptionDto, AttributeType, ProductAttribute } from '@/interfaces/Attribute'

const EMPTY_OPTION: AttributeOptionDto = {
  name: 'temp',
  value_number: null,
  value_date: null,
}

export default Vue.extend({
  props: {
    type: {
      type: String,
      required: true,
    } as Vue.PropOptions<AttributeType.Number | AttributeType.Date>,
    value: {
      type: Object,
      default: () => undefined,
    } as Vue.PropOptions<AttributeOptionDto | undefined>,
    attribute: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductAttribute>,
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    selectedOption: {
      get(): AttributeOptionDto {
        return this.value || cloneDeep(EMPTY_OPTION)
      },
      set(option: AttributeOptionDto) {
        this.$emit('input', option)
      },
    },
    AttributeType(): typeof AttributeType {
      return AttributeType
    },
  },
  watch: {
    value() {
      this.setDefaultValue()
    },
  },
  mounted() {
    this.setDefaultValue()
  },
  methods: {
    setDefaultValue() {
      if (!this.value) this.selectedOption = cloneDeep(EMPTY_OPTION)
    },
  },
})
</script>

<style lang="scss" scoped>
.date-input {
  &__input {
    min-width: 330px;
    margin-bottom: 0;
  }
}

.number-input {
  display: flex;

  &__input {
    display: block;
    margin-bottom: 0;
    margin-left: 10px;
    margin-top: -20px;
    width: 160px;
  }
}
</style>
