<template>
  <div class="partial-update-form"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@/interfaces/Order'

export default Vue.extend({
  name: 'PartialUpdateForm',
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Partial<Order>>,
  },
  computed: {
    form: {
      get(): Partial<Order> {
        return this.value
      },
      set(v: Partial<Order>) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.partial-update-form {
}
</style>
