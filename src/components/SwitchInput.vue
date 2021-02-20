<template>
  <div class="switch-input">
    <label class="switch-input__label">
      <slot name="title"></slot>
    </label>
    <slot></slot>
  </div>
</template>

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
