<template>
  <div class="range-input">
    <label class="range-input__label">
      <slot name="label"> {{ label }} </slot>
    </label>
    <a-input-group class="range-input__group" compact>
      <a-input
        :type="type"
        :value="value.min"
        :min="min"
        :max="max"
        class="range-input__input range-input__input--min"
        :placeholder="$t('min')"
        @input="(e) => updateValue('min', e.target?.value)"
      />
      <a-input class="range-input__separator" placeholder="-" disabled />
      <a-input
        :type="type"
        :value="value.max"
        :min="min"
        :max="max"
        class="range-input__input range-input__input--max"
        :placeholder="$t('max')"
        @input="(e) => updateValue('max', e.target?.value)"
      />
      <a-input v-if="addonAfter" class="range-input__addon" :placeholder="addonAfter" disabled />
    </a-input-group>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "max": "Maksimum",
    "min": "Minimum"
  },
  "en": {
    "max": "Maximum",
    "min": "Minimum"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    type: { type: String as PropType<'number' | 'date'>, default: 'number' },
    label: { type: String, default: '' },
    addonAfter: { type: String, default: '' },
    value: {
      type: Object as PropType<{
        min: number | string
        max: number | string
      }>,
      default: () => ({ min: '', max: '' }),
    },
    min: { type: [String, Number], default: undefined },
    max: { type: [String, Number], default: undefined },
  },
  methods: {
    updateValue(key: 'min' | 'max', value: string | number) {
      this.$emit('input', { ...this.value, [key]: value })
    },
  },
})
</script>

<style lang="scss" scoped>
.range-input {
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;

  &__label {
    font-size: 0.8em;
    color: $gray-color-600;
    margin-bottom: 4px;
  }

  &__group {
    display: flex;
  }

  &__input {
    text-align: center;
    padding: 4px;

    &--min {
      border-right-width: 0 !important;
    }

    &--max {
      border-left-width: 0;
    }
  }

  &__separator {
    width: 10px;
    padding: 2px;
    pointer-events: none;
    border-left-width: 0;
    background-color: var(--white-color);
  }

  &__addon {
    width: 28px;
    padding: 4px;
    font-size: 0.6em;

    &::placeholder {
      color: var(--font-color) !important;
    }
  }
}
</style>
