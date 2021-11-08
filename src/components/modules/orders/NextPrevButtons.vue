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
        <icon-button
          :disabled="!prevOrder"
          title="Poprzednie zamówienie"
          aria-label="Poprzednie zamówienie"
          @click="goToPrevOrder"
        >
          <i slot="icon" class="bx bxs-chevron-left"></i>
        </icon-button>
        <icon-button
          :disabled="!nextOrder"
          title="Następne zamówienie"
          aria-label="Następne zamówienie"
          @click="goToNextOrder"
        >
          <i slot="icon" class="bx bxs-chevron-right"></i>
        </icon-button>
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
  mounted() {
    this.$accessor.orders.fetch({ ...this.$accessor.orders.getQueryParams, page: 1, limit: 500 })
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
  &__content {
    display: flex;
    margin-left: 12px;
  }
}
</style>
