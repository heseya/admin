<template>
  <div class="order-field">
    <span class="order-field__label">
      <slot name="label">
        {{ label }}
      </slot>
      <slot name="labelSuffix"></slot>
    </span>
    <div class="order-field__value">
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
  },
})
</script>

<style lang="scss" scoped>
.order-field {
  padding: 4px 12px;
  position: relative;

  &__label {
    display: flex;
    align-items: center;
    color: $gray-color-500;
    font-size: 0.9em;
  }

  &__value {
    display: flex;
    align-items: center;
  }
}
</style>
