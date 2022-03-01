<template>
  <div class="order-customer-details">{{ order.delivery_address }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/interfaces/Order'

export default Vue.extend({
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
})
</script>

<style lang="scss" scoped>
.order-customer-details {
  color: blue;
}
</style>
