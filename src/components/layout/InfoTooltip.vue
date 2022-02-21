<template>
  <a-tooltip>
    <template #title>
      <slot>{{ text }}</slot>
    </template>
    <i v-if="icon" :class="['info-tooltip__icon', icon]"></i>
    <slot name="title"></slot>
  </a-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: 'bx bxs-info-circle',
    },
  },
})
</script>

<style lang="scss" scoped>
.info-tooltip {
  &__icon {
    color: $blue-color-500;
  }
}
</style>
