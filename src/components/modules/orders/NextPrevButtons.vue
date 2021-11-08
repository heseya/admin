<template>
  <div class="next-prev-buttons">
    <button
      class="next-prev-buttons__btn"
      :class="{ 'next-prev-buttons__btn--disabled': !prevOrder }"
      title="Poprzednie"
      aria-label="Poprzednie"
      @click="goToPrevOrder"
    >
      <i class="bx bx-chevron-left"></i>
    </button>
    <button
      class="next-prev-buttons__btn"
      :class="{ 'next-prev-buttons__btn--disabled': !nextOrder }"
      title="Następne"
      aria-label="Następne"
      @click="goToNextOrder"
    >
      <i class="bx bx-chevron-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { Order } from '@/interfaces/Order'
import Vue from 'vue'
export default Vue.extend({
  computed: {
    queryParams(): Record<string, any> {
      return this.$accessor.orders.getQueryParams
    },
    currentOrder(): Order {
      return this.$accessor.orders.getSelected
    },
    orders(): Order[] {
      return this.$accessor.orders.getData
    },
    nextOrder(): Order | null {
      const currIndex = this.orders.findIndex((order) => order.id === this.currentOrder.id)
      return this.orders[currIndex + 1]
    },
    prevOrder(): Order | null {
      const currIndex = this.orders.findIndex((order) => order.id === this.currentOrder.id)
      return this.orders[currIndex - 1]
    },
  },
  methods: {
    goToNextOrder() {
      if (this.nextOrder?.id)
        this.$router.push({ name: this.$route.name!, params: { id: this.nextOrder.id } })
    },
    goToPrevOrder() {
      if (this.prevOrder?.id)
        this.$router.push({ name: this.$route.name!, params: { id: this.prevOrder.id } })
    },
  },
})
</script>

<style lang="scss" scoped>
.next-prev-buttons {
  position: fixed;
  right: 50px;
  bottom: 50px;
  display: flex;

  &__btn {
    all: unset;
    display: block;
    padding: 0;
    font-size: 5rem;
    line-height: 4rem;
    color: $primary-color-500;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      color: $primary-color-300;
    }

    &--disabled {
      pointer-events: none;
      color: $primary-color-100;
    }
  }
}
</style>
