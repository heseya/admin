<template>
  <div class="next-prev-buttons">
    <a-tooltip>
      <template slot="title">
        Użyj <code>Alt + &#8594;</code> aby przejść do kolejnego lub <code>Alt + &#8592;</code> do
        poprzedniego zamówienia.
      </template>

      <Keypress key-event="keyup" :key-code="37" :modifiers="['altKey']" @success="goToPrevOrder" />
      <Keypress key-event="keyup" :key-code="39" :modifiers="['altKey']" @success="goToNextOrder" />

      <div class="next-prev-buttons__content">
        <button
          class="next-prev-buttons__btn"
          :class="{ 'next-prev-buttons__btn--disabled': !prevOrder }"
          title="Poprzednie zamówienie"
          aria-label="Poprzednie zamówienie"
          @click="goToPrevOrder"
        >
          <i class="bx bx-chevron-left"></i>
        </button>
        <button
          class="next-prev-buttons__btn"
          :class="{ 'next-prev-buttons__btn--disabled': !nextOrder }"
          title="Następne zamówienie"
          aria-label="Następne zamówienie"
          @click="goToNextOrder"
        >
          <i class="bx bx-chevron-right"></i>
        </button>
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/interfaces/Order'

export default Vue.extend({
  components: {
    Keypress: () => import('vue-keypress'),
  },
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
  right: 20px;
  bottom: 59px;
  font-size: 3rem;
  line-height: 1em;
  background-color: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border: solid 1px $primary-color-100;

  @media ($viewport-10) {
    font-size: 5rem;
    right: 50px;
    bottom: 50px;
    border: none;
    background-color: #fff0;
  }

  &__content {
    display: flex;
  }

  &__btn {
    all: unset;
    display: block;
    padding: 0;
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
