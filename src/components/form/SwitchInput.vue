<template>
  <div
    class="switch-input"
    :class="{ 'switch-input--horizontal': horizontal, [`switch-input--${type}`]: true }"
  >
    <label
      class="switch-input__label"
      :class="{
        'switch-input__label--colorized': colorizedLabel,
        'switch-input__label--disabled': disabled,
        'switch-input__label--enabled': !disabled,
      }"
    >
      <slot name="title">{{ label }}</slot>
    </label>
    <a-switch
      :checked="value"
      :disabled="disabled"
      :name="name"
      :data-cy="dataCy"
      @change="onInput"
    >
      <template #unCheckedChildren>
        <slot name="unCheckedChildren">
          <i class="bx bx-x"></i>
        </slot>
      </template>
      <template #checkedChildren>
        <slot name="checkedChildren">
          <i class="bx bx-check"></i>
        </slot>
      </template>
    </a-switch>
    <small class="switch-input__error">
      <slot name="error"></slot>
    </small>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: { type: Boolean, required: true },
    disabled: { type: Boolean, default: false },
    horizontal: { type: Boolean, default: false },
    label: { type: String, default: '' },
    name: { type: String, default: '' },
    type: { type: String, default: 'default' },
    dataCy: { type: String, default: '' },
    colorizedLabel: { type: Boolean, default: false },
  },
  methods: {
    onInput(v: boolean) {
      this.$emit('input', v)
    },
  },
})
</script>

<style lang="scss">
.switch-input {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__label {
    $label: &;
    font-family: $primaryFont;
    font-size: 0.8em;
    margin-bottom: 3px;

    &--colorized {
      margin: 0;
      text-transform: uppercase;
      font-weight: 400;
      font-size: 11px;
    }

    &--colorized#{&}--enabled {
      color: $green-color-500;
    }
  }

  &--horizontal {
    flex-direction: row;
  }
  &--horizontal &__label {
    font-size: 1em;
    font-weight: 600;
    margin-right: 10px;

    &--colorized {
      text-transform: uppercase;
      font-weight: 400;
      font-size: 11px;
    }
  }

  .ant-switch {
    background-color: $background-color-600;

    i {
      margin-top: 4px;
      color: $font-color !important;
    }
  }
  .ant-switch-checked {
    background-color: $green-color-500;

    i {
      color: #ffffff !important;
    }
  }

  &--red {
    .ant-switch-checked {
      background-color: $red-color-500;
    }
  }

  &__error {
    color: $red-color-500;
  }
}
</style>
