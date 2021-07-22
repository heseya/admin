<template>
  <div class="pagination">
    <vs-button @click="prev" :disabled="page === 1" icon dark>
      <i class="bx bxs-chevron-left"></i>
    </vs-button>
    <vs-select :value="page" @input="onInput">
      <vs-option v-for="page in length" :label="page" :value="page" :key="page">
        {{ page }}
      </vs-option>
    </vs-select>
    <vs-button @click="next" :disabled="page === length" icon dark>
      <i class="bx bxs-chevron-right"></i>
    </vs-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Pagination',
  props: {
    value: {
      type: [Number, String],
      default: 1,
    },
    length: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      default: 'dark',
    },
  },
  computed: {
    page(): number {
      return Number(this.value)
    },
  },
  methods: {
    onInput(v: number | string) {
      this.$emit('input', v)
    },
    next() {
      if (this.page < this.length) this.onInput(this.page + 1)
    },
    prev() {
      if (this.page > 1) this.onInput(this.page - 1)
    },
  },
})
</script>

<style lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #334656 !important;

  .vs-select-content {
    max-width: 80px;
    margin: 0px 4px;
  }

  .vs-select__input {
    background-color: #f0f3f4;
  }

  .vs-pagination-content {
    margin: 10px 0px;
  }
}
</style>
