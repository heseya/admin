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
import { defineComponent } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'
export default defineComponent({
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
$bg-color: rgba(lighten($primary-color-100, 5), 0.6);

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $bg-color;
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
