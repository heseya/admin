<template>
  <div class="zone" :class="`zone--${type}`">
    <div v-if="title" class="zone__title">{{ title }}</div>
    <div v-else class="zone__title"><slot name="title"></slot></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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
  --zone-border-color: var(--gray-color-400);
  --zone-text-color: var(--font-color);

  &--danger {
    --zone-text-color: var(--red-color-500);
    --zone-border-color: var(--red-color-500);
  }

  &--info {
    --zone-text-color: var(--blue-color-500);
    --zone-border-color: var(--blue-color-500);
  }

  &__title {
    font-weight: 600;
    color: var(--zone-text-color);
    display: flex;
    align-items: center;
    margin-top: -4px;
    margin-bottom: 4px;
    justify-content: space-between;
  }

  padding: 8px;
  border-radius: 6px;
  border: solid 1px var(--zone-border-color);
}
</style>
