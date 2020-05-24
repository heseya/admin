<template>
  <div class="list">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@media (min-width: $break) {
  .list {
    padding: 10px 24px;
  }
}
</style>
