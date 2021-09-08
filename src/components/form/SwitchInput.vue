<template>
  <div class="switch-input" :class="{ 'switch-input--horizontal': horizontal }">
    <label class="switch-input__label">
      <slot name="title">{{ label }}</slot>
    </label>
    <a-switch :checked="value" :disabled="disabled" @change="onInput">
      <i slot="unCheckedChildren" class="bx bx-x"></i>
      <i slot="checkedChildren" class="bx bx-check"></i>
    </a-switch>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    label: { type: String, default: '' },
  },
  methods: {
    onInput(v: boolean) {
      this.$emit('input', v)
    },
  },
})
</script>

<style lang="scss" scoped>
.switch-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__label {
    font-family: $primaryFont;
    font-size: 0.8em;
    margin-bottom: 3px;
  }

  &--horizontal {
    flex-direction: row;
  }
  &--horizontal &__label {
    font-size: 1em;
    font-weight: 600;
    margin-right: 10px;
  }

  .ant-switch {
    background-color: $background-color-600;

    i {
      margin-top: 4px;
      color: $font-color;
    }
  }
  .ant-switch-checked {
    background-color: $green-color-500;

    i {
      color: #ffffff;
    }
  }
}
</style>
