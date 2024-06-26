<template>
  <div
    class="switch-input"
    :class="{ 'switch-input--horizontal': horizontal, [`switch-input--${type}`]: true }"
    @click.prevent
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
      :loading="loading"
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
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    value: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    horizontal: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
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
    display: flex;
    align-items: center;
    text-align: right;

    & > i {
      margin-left: 4px;
    }

    &--colorized {
      margin: 0;
      text-transform: uppercase;
      font-weight: 400;
      font-size: 11px;
    }

    &--colorized#{&}--enabled {
      color: var(--green-color-500);
    }

    &--colorized#{&}--disabled {
      color: var(--gray-color-600);
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
    background-color: var(--background-color-600);
    position: relative;

    .ant-switch-loading-icon,
    .ant-switch-inner i {
      color: var(--font-color) !important;
    }

    .ant-switch-inner i {
      margin-top: 4px;
    }
  }
  .ant-switch-checked {
    background-color: var(--green-color-500);

    .ant-switch-inner i {
      color: var(--white-color) !important;
    }
  }

  &--red {
    .ant-switch-checked {
      background-color: var(--red-color-500);
    }
  }

  &__error {
    color: var(--red-color-500);
  }
}
</style>
