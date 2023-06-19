<template>
  <div class="card" :class="{ 'card--border': border }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
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
