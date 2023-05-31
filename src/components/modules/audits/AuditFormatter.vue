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
import { defineComponent } from 'vue'
import OrderAddress from '@/components/modules/orders/OrderAddress.vue'

export default defineComponent({
  components: {
    OrderAddress,
  },
  props: {
    fieldKey: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Object, Number, Boolean],
      default: null,
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
    color: var(--green-color-500);
  }

  &__false {
    color: var(--red-color-500);
  }
}
</style>
