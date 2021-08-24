<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.card {
  background: #fff;
  padding: 12px;
  border-radius: 7px;
  border: solid 1px $background-color-600;
  margin-bottom: 30px;
}
</style>
