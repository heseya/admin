<template>
  <div class="zone" :class="`zone--${type}`">
    <div v-if="title" class="zone__title">{{ title }}</div>
    <div v-else class="zone__title"><slot name="title"></slot></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss" scoped>
.zone {
  --zone-border-color: #eee;
  --zone-text-color: #333;

  &--danger {
    --zone-text-color: #f54758;
    --zone-border-color: #f54758;
  }

  &__title {
    font-weight: 600;
    color: var(--zone-text-color);
    display: flex;
    align-items: center;
  }

  padding: 12px;
  border-radius: 12px;
  border: solid 1px var(--zone-border-color);
}
</style>
