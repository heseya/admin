<template>
  <div class="items-availability">
    <div class="items-availability__header">
      <h4>{{ $t('title') }}</h4>

      <icon-button
        v-can="$p.Deposits.Add"
        size="small"
        data-cy="deposit-create-btn"
        @click="openDepositModal(null)"
      >
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addDeposit') }}
      </icon-button>
    </div>

    <div class="items-availability__row items-availability__row--header">
      <span> {{ $t('table.shippingTime') }} </span>
      <span> {{ $t('table.quantity') }} </span>
    </div>
    <div
      v-for="{ shipping_time, shipping_date, quantity } in availability"
      :key="`${shipping_time}-${shipping_date}`"
      class="items-availability__row"
    >
      <span> {{ formatShippingTime(shipping_date || shipping_time) }} </span>
      <span> {{ quantity }} </span>

      <a-tooltip v-can="$p.Deposits.Add">
        <template #title> {{ $t('addDepositTime') }} </template>
        <icon-button size="small" @click="openDepositModal(shipping_date || shipping_time)">
          <template #icon>
            <i class="bx bx-edit"></i>
          </template>
        </icon-button>
      </a-tooltip>
    </div>

    <deposit-form-modal
      :visible="isDepositModalOpen"
      :default-time="defaultDepositDeliveryTime"
      :disabled="!$can($p.Deposits.Add)"
      :item-id="item.id"
      @close="closeDepositModal"
    />
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Dostępność produktu",
    "addDeposit": "Dodaj wpis magazynowy",
    "addDepositTime": "Zmodyfikuj ilość dla danej dostępności",
    "table": {
      "shippingTime": "Czas wysyłki",
      "quantity": "Ilość w magazynie"
    },
    "availabilityTime": "w {time} dni",
    "availabilityDate": "od {date}"
  },
  "en": {
    "title": "Product availability",
    "addDeposit": "Add deposit",
    "addDepositTime": "Edit quantity for this availability",
    "table": {
      "shippingTime": "Shipping time",
      "quantity": "Quantity in stock"
    },
    "availabilityTime": "in {time} days",
    "availabilityDate": "from {date}"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import isNumber from 'lodash/isNumber'

import { WarehouseItem } from '@/interfaces/WarehouseItem'

import DepositFormModal from './DepositFormModal.vue'

export default Vue.extend({
  components: { DepositFormModal },
  props: {
    item: { type: Object, default: null } as Vue.PropOptions<WarehouseItem>,
  },

  data: () => ({
    isDepositModalOpen: false,
    defaultDepositDeliveryTime: null as string | number | null,
  }),

  computed: {
    availability(): WarehouseItem['availability'] {
      return this.item.availability
    },
  },

  methods: {
    formatShippingTime(time: number | string | null) {
      if (isNumber(time)) return this.$t('availabilityTime', { time })
      if (time) return this.$t('availabilityDate', { date: time })
      return '-'
    },

    openDepositModal(time: string | number | null) {
      this.defaultDepositDeliveryTime = time
      this.isDepositModalOpen = true
    },

    closeDepositModal() {
      this.isDepositModalOpen = false
      this.defaultDepositDeliveryTime = null
    },
  },
})
</script>

<style lang="scss" scoped>
.items-availability {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  &__row {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 32px;
    grid-gap: 8px;
    margin-bottom: 4px;

    &--header {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10px;
    }
  }
}
</style>
