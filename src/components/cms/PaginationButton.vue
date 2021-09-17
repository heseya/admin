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
import Vue from 'vue'
export default Vue.extend({
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
  background-color: $background-color-700;
  color: $font-color;
  transition: 0.3s;
  margin-right: 4px;

  &:hover {
    background-color: darken($background-color-700, 2);
  }

  &--active {
    background-color: $font-color !important;
    color: $background-color-700 !important;
    cursor: default;
  }
}
</style>
