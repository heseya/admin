<template>
  <div class="audit-formatter">
    <template v-if="isAddress">
      <OrderAddress
        class="audit-formatter__address"
        :address="parsedJsonValue"
        hide-edit
        hide-remove
      />
    </template>
    <template v-else-if="isBoolean">
      <i v-if="value" class="bx bxs-check-circle audit-formatter__true"></i>
      <i v-else class="bx bxs-x-circle audit-formatter__false"></i>
    </template>
    <template v-else>{{ value }}</template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OrderAddress from '@/components/modules/orders/OrderAddress.vue'

export default Vue.extend({
  components: {
    OrderAddress,
  },
  props: {
    fieldKey: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Object, Number],
      required: true,
    },
  },
  computed: {
    isAddress(): boolean {
      return this.fieldKey.includes('address')
    },
    isBoolean(): boolean {
      return this.fieldKey === 'public'
    },
    parsedJsonValue(): object | null {
      try {
        return JSON.parse(this.value)
      } catch {
        return null
      }
    },
  },
})
</script>

<style lang="scss">
.audit-formatter {
  &__address {
    font-size: 0.8rem;
    line-height: 1rem;
  }

  &__true {
    color: $green-color-500;
  }

  &__false {
    color: $red-color-500;
  }
}
</style>
