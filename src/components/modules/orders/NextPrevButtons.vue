<template>
  <div class="next-prev-buttons">
    <button v-if="prevOrder" @click="goToPrevOrder">Poprzednie</button>
    <button v-if="nextOrder" @click="goToNextOrder">Następne</button>
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
        this.$router.push({ ...this.$route, params: { id: this.nextOrder.id } })
    },
    goToPrevOrder() {
      if (this.prevOrder?.id)
        this.$router.push({ ...this.$route, params: { id: this.prevOrder.id } })
    },
  },
})
</script>

<style lang="scss" scoped>
.next-prev-buttons {
  position: fixed;
  right: 20px;
  top: 150px;
}
</style>
