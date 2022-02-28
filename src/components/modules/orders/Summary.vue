<template>
  <card class="order-summary"> {{ order.code }} </card>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from '@/components/layout/Card.vue'
import { Order } from '@/interfaces/Order'

export default Vue.extend({
  components: { Card },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
})
</script>

<style lang="scss" scoped>
.order-summary {
  color: red;
}
</style>
