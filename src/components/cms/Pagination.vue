<template>
  <div class="pagination">
    <p-button v-if="showFirstButton" :page="1" :current="page" @click="set(1)"> 1 </p-button>
    <div v-if="showFirstSpacer" class="pagination__space">...</div>

    <p-button v-for="i in showable" :key="i" :page="i" :current="page" @click="set(i)">
      {{ i }}
    </p-button>

    <div v-if="showLastSpacer" class="pagination__space">...</div>
    <p-button v-if="showLastButton" :page="length" :current="page" @click="set(length)">
      {{ length }}
    </p-button>

    <app-button
      v-if="page !== length"
      class="pagination__next-button"
      type="white"
      shadow
      @click="next"
    >
      Następna
      <template #icon>
        <i class="bx bxs-chevron-right"></i>
      </template>
    </app-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PaginationButton from './PaginationButton.vue'

export default Vue.extend({
  name: 'Pagination',
  components: { pButton: PaginationButton },
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
    showable(): number[] {
      return [...Array(this.length).keys()]
        .map((v) => v + 1)
        .filter((v) => v >= this.page - 1)
        .slice(0, 5)
    },

    showFirstButton(): boolean {
      return !this.showable.includes(1)
    },
    showFirstSpacer(): boolean {
      return !this.showable.includes(Math.min(2, this.length))
    },
    showLastButton(): boolean {
      return !this.showable.includes(this.length)
    },
    showLastSpacer(): boolean {
      return !this.showable.includes(Math.max(this.length - 1, 1))
    },
  },
  methods: {
    set(v: number | string) {
      if (v !== this.page) this.$emit('input', v)
    },
    next() {
      if (this.page < this.length) this.set(this.page + 1)
    },
    prev() {
      if (this.page > 1) this.set(this.page - 1)
    },
  },
})
</script>

<style lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;

  &__space {
    margin: 0 9px;
    font-size: 0.9em;
  }

  &__next-button {
    margin-left: 16px;
  }
}
</style>
