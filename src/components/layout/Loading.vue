<template>
  <div
    class="loading"
    :class="{ 'loading--active': active, 'loading--relative': relative }"
    :style="`font-size: ${size}px`"
  >
    <div class="loading__loader">
      <loading-indicator />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'
export default Vue.extend({
  components: { LoadingIndicator },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    relative: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: 48,
    },
  },
})
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--primary-color-100);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: $loading-z-index;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  backdrop-filter: blur(2px);

  &--active {
    opacity: 1;
    visibility: visible;
  }

  &--relative {
    position: absolute;
  }
}
</style>
