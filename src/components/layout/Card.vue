<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.card {
  @extend %card;
  margin-bottom: 30px;
}
</style>
