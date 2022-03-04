<template>
  <div class="order-status-input">
    <app-select
      v-model="orderStatusId"
      :loading="isLoading"
      option-filter-prop="label"
      :label="$t('statusLabel')"
      :disabled="!$can($p.Orders.EditStatus)"
    >
      <a-select-option v-for="{ id, name, color } in statuses" :key="id" :label="name">
        <div class="order-status-input__option">
          <span class="order-status-input__option-dot" :style="{ backgroundColor: `#${color}` }">
          </span>
          {{ name }}
        </div>
      </a-select-option>
    </app-select>
  </div>
</template>

<i18n>
{
  "en": {
    "statusLabel": "Status",
    "statusChangeSuccess": "Status changed successfully"
  },
  "pl": {
    "statusLabel": "Status",
    "statusChangeSuccess": "Status zmieniony pomyślnie"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Order, OrderStatus } from '@/interfaces/Order'
import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    statuses(): OrderStatus[] {
      return this.$accessor.statuses.getData
    },
    orderStatusId: {
      get(): UUID {
        return this.order?.status?.id || ''
      },
      set(v: UUID) {
        this.updateOrderStatus(v)
      },
    },
  },
  methods: {
    async updateOrderStatus(newStatus: UUID) {
      this.isLoading = true

      // @ts-ignore // TODO: fix extended store actions typings
      const success = await this.$accessor.orders.changeStatus({
        orderId: this.order.id,
        statusId: newStatus,
      })

      if (success) {
        this.$emit('statusChanged', newStatus)
        this.$toast.success(this.$t('statusChangeSuccess') as string)
      }

      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.order-status-input {
  &__option {
    display: flex;
    align-items: center;
  }

  &__option-dot {
    display: block;
    width: 12px;
    height: 12px;
    background-color: $primary-color-500;
    border-radius: 50%;
    margin-right: 8px;
  }
}
</style>