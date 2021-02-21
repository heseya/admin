<template>
  <div class="pagination">
    <vs-pagination @input="onInput" :color="color" :value="value" :length="length">
      <vs-select :value="value" @input="onInput">
        <vs-option v-for="page in length" :label="page" :value="page" :key="page">
          {{ page }}
        </vs-option>
      </vs-select>
    </vs-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    value: {
      type: Number,
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
  methods: {
    onInput(v) {
      this.$emit('input', v)
    },
  },
}
</script>

<style lang="scss">
.pagination {
  .vs-select-content {
    max-width: 60px;
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
