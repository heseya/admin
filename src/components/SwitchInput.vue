<template>
  <div class="switch-input">
    <label class="switch-input__label">
      <slot name="title"></slot>
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

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInput(v) {
      this.$emit('input', v)
    },
  },
}
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
}
</style>
