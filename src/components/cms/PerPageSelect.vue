<template>
  <vs-select
    class="per-page-select"
    :value="value"
    label="Elementów na stronę"
    @input="(v) => $emit('input', v)"
  >
    <vs-option v-for="option in perPageOptions" :key="option" :label="option" :value="option">
      {{ option }}
    </vs-option>
  </vs-select>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    perPageOptions(): number[] {
      return [12, 24, 36, 48, 64, 128, 250, 500]
    },
  },
})
</script>

<style lang="scss">
.per-page-select {
  max-width: 140px;
  margin: 0px 4px;

  .vs-select__label {
    color: $font-color !important;
    font-size: 0.6em;
  }

  .vs-select__input {
    background-color: #f0f3f4;
  }

  .vs-pagination-content {
    margin: 10px 0px;
  }
}
</style>
