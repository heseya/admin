<template>
  <a-tooltip>
    <template #title>
      <slot>{{ text }}</slot>
    </template>
    <i v-if="icon" :class="['info-tooltip__icon', icon]" :style="{ color }"></i>
    <slot name="title"></slot>
  </a-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    text: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: 'bx bxs-info-circle',
    },
    color: {
      type: String,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped>
.info-tooltip {
  &__icon {
    color: var(--blue-color-500);
    font-size: 0.9em;
  }
}
</style>
