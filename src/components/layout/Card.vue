<template>
  <div class="card" :class="{ 'card--border': border }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss">
.card {
  @extend %card;
  margin-bottom: 30px;

  &--border {
    @extend %card--border;
  }
}
</style>
