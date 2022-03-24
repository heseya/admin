<template>
  <div class="coupon-view">
    <h1>COUPONS TODO</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CouponDto } from '@/interfaces/SalesAndCoupons'

const EMPTY_COUPON_FORM: CouponDto = {
  code: '',
  name: '',
  description: '',
  value: 0,
  type: DiscountType.Percentage,
  priority: 0,
  condition_groups: [],
  target_type: DiscountTargetType.OrderValue,
  target_products: [],
  target_sets: [],
  target_is_allow_list: false,
}

export default Vue.extend({})
</script>

<style lang="scss" scoped>
.coupon-view {
}
</style>
