<template>
  <button
    class="pagination-button"
    :class="{ 'pagination-button--active': current === page }"
    @click="$emit('click', page)"
  >
    {{ page }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    page: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.pagination-button {
  all: unset;
  display: block;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
  background-color: var(--background-color-700);
  color: var(--font-color);
  transition: 0.3s;
  margin-right: 4px;

  &:hover {
    // TODO: darken
    background-color: var(--background-color-700);
  }

  &--active {
    background-color: var(--font-color) !important;
    color: var(--background-color-700) !important;
    cursor: default;
  }
}
</style>
