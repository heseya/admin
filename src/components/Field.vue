<template>
  <div class="field" :class="{ 'field--horizontal': horizontal }">
    <span class="field__label">
      <slot name="label">
        {{ label }}
      </slot>
      <slot name="labelSuffix"></slot>
    </span>
    <div class="field__value" :data-cy="dataCy">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    dataCy: {
      type: String,
      default: undefined,
    },
  },
})
</script>

<style lang="scss" scoped>
.field {
  padding: 4px 12px;
  position: relative;
  display: grid;
  grid-auto-flow: row;
  justify-content: flex-start;

  &__label {
    display: flex;
    align-items: center;
    color: var(--gray-color-500);
    font-size: 0.9em;

    .icon-button {
      color: $gray-color-500;
    }
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &--horizontal {
    display: flex;
    align-items: center;
  }
  &--horizontal &__label {
    font-size: 1em;
    margin-right: 8px;
  }
}
</style>
