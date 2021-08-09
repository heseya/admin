<template>
  <div class="switch-input" :class="{ 'switch-input--horizontal': horizontal }">
    <label class="switch-input__label">
      <slot name="title">{{ label }}</slot>
    </label>
    <vs-switch success :value="value" @input="onInput">
      <template #off>
        <i class="bx bx-x"></i>
      </template>
      <template #on>
        <i class="bx bx-check"></i>
      </template>
    </vs-switch>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    label: String,
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
  margin-top: 10px;

  &__label {
    font-family: $font-main;
    font-size: 0.8em;
    margin-bottom: 3px;
  }

  &--horizontal {
    flex-direction: row;
  }
  &--horizontal &__label {
    font-size: 1em;
    font-family: $font-sec;
    margin-right: 10px;
  }
}
</style>