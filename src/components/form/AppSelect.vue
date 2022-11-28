<template>
  <div class="app-input">
    <label class="app-input__label">
      <slot name="label"> {{ label }} </slot>
    </label>
    <a-select
      v-model="innerValue"
      class="app-input__input"
      v-bind="$props"
      :data-cy="dataCy || name"
      v-on="$listeners"
    >
      <a-select-option v-if="addAll" value="_all" :label="allText || $t('all')">
        {{ allText || $t('all') }}
      </a-select-option>
      <slot></slot>

      <template #notFoundContent>
        <slot name="notFoundContent">
          <empty> {{ $t('notFoundContent') }} </empty>
        </slot>
      </template>
    </a-select>
    <span class="app-input__error">
      <slot name="error"> {{ error }} </slot>
    </span>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "all": "Wszystkie",
    "notFoundContent": "Brak wyników"
  },
  "en": {
    "all": "All",
    "notFoundContent": "No results found"
  }
}
</i18n>

<script lang="ts">
/* eslint-disable vue/require-default-prop */
import Vue from 'vue'
import Empty from '../layout/Empty.vue'

export default Vue.extend({
  name: 'AppSelect',
  components: { Empty },
  props: {
    value: [String, Number, Array],
    label: String,
    placeholder: String,
    name: String,
    error: String,
    type: String,
    mode: String,
    size: String,
    allowClear: Boolean,
    loading: Boolean,
    disabled: Boolean,
    addAll: Boolean,
    allText: String,
    showSearch: Boolean,
    labelInValue: Boolean,
    filterOption: Boolean,
    tokenSeparators: Array,
    optionFilterProp: String,
    dataCy: String,
  },
  computed: {
    innerValue: {
      get(): string | number | unknown[] {
        return this.value
      },
      set(v: string | number | unknown[]) {
        this.$emit('input', v)
      },
    },
  },
})
</script>
