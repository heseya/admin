<template>
  <div class="flex-input">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.flex-input {
  display: flex;
  justify-content: space-between;
  align-items: center;

  label {
    margin-right: 10px !important;
  }
}
</style>
