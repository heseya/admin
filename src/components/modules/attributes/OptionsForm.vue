<template>
  <div class="attributes-options-form">
    <div class="attributes-options-form__header">
      <h4>{{ $t('title') }}</h4>
      <icon-button
        size="small"
        :disabled="disabled || type !== AttributeType.SingleOption"
        @click="addOption"
      >
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('add') }}
      </icon-button>
    </div>
    <div v-if="options.length" class="attributes-options-form__content">
      <div
        v-for="(option, i) in options"
        :key="option.id || i"
        class="attributes-options-form__option"
      >
        <validated-input
          v-if="type !== AttributeType.Date"
          v-model="option.name"
          :disabled="disabled"
          name="name"
          rules="required"
          :label="
            type === AttributeType.SingleOption ? $t('form.value_text') : $t('common.form.name')
          "
        />

        <validated-input
          v-if="type === AttributeType.Number"
          v-model="option.value_number"
          disabled
          type="number"
          name="value_number"
          :label="$t('form.value_number')"
        />

        <validated-input
          v-if="type === AttributeType.Date"
          v-model="option.value_date"
          disabled
          type="date"
          name="value_date"
          :label="$t('form.value_date')"
        />

        <icon-button size="small" type="danger" :disabled="disabled" @click="removeOption(i)">
          <template #icon>
            <i class="bx bx-trash"></i>
          </template>
        </icon-button>
      </div>
    </div>
    <empty v-else>{{ $t('empty') }}</empty>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Opcje cechy",
    "empty": "Brak opcji",
    "add": "Dodaj opcję",
    "form": {
      "value_text": "Wartość tekstowa",
      "value_number": "Wartość liczbowa",
      "value_date": "Data"
    }
  },
  "en": {
    "title": "Attribute options",
    "empty": "No options",
    "add": "Add option",
    "form": {
      "value_text": "Text value",
      "value_number": "Number value",
      "value_date": "Date value"

    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { AttributeOptionDto, AttributeType } from '@/interfaces/Attribute'

import Empty from '@/components/layout/Empty.vue'

const EMPTY_FORM: AttributeOptionDto = {
  name: '',
  value_number: null,
  value_date: null,
}

export default Vue.extend({
  components: { Empty },
  props: {
    value: {
      type: Array,
      required: true,
    } as Vue.PropOptions<AttributeOptionDto[]>,
    type: {
      type: String,
      required: true,
    } as Vue.PropOptions<AttributeType>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    options: {
      get(): AttributeOptionDto[] {
        return this.value
      },
      set(v: AttributeOptionDto[]) {
        this.$emit('input', v)
      },
    },
    AttributeType(): typeof AttributeType {
      return AttributeType
    },
  },
  methods: {
    addOption() {
      this.options.push(cloneDeep(EMPTY_FORM))
    },
    removeOption(index: number) {
      this.options = this.options.filter((_, i) => i !== index)
    },
  },
})
</script>

<style lang="scss" scoped>
.attributes-options-form {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__option {
    display: flex;
    align-items: center;

    > *:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
