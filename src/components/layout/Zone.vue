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
  --zone-border-color: #eeeeee;
  --zone-text-color: #333333;

  &--danger {
    --zone-text-color: #{$red-color-500};
    --zone-border-color: #{$red-color-500};
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
