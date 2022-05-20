<template>
  <div class="items-availibility">
    <div class="items-availibility__header">
      <h4>{{ $t('title') }}</h4>

      <icon-button v-can="$p.Deposits.Add" size="small" @click="openDepositModal(null)">
        <template #icon>
          <i class="bx bx-plus"></i>
        </template>
        {{ $t('addDeposit') }}
      </icon-button>
    </div>

    <div class="items-availibility__row items-availibility__row--header">
      <span> {{ $t('table.delivery_time') }} </span>
      <span> {{ $t('table.quantity') }} </span>
    </div>
    <div
      v-for="{ delivery_time, delivery_date, quantity } in availibility"
      :key="`${delivery_time}-${delivery_date}`"
      class="items-availibility__row"
    >
      <span> {{ formatDeliveryTime(delivery_date || delivery_time) }} </span>
      <span> {{ quantity }} </span>

      <a-tooltip v-can="$p.Deposits.Add">
        <template #title> {{ $t('addDepositTime') }} </template>
        <icon-button size="small" @click="openDepositModal(delivery_date || delivery_time)">
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
      "delivery_time": "Czas dostawy",
      "quantity": "Ilość w magazynie"
    },
    "availibilityTime": "w {time} dni",
    "availibilityDate": "od {date}"
  },
  "en": {
    "title": "Product availibility",
    "addDeposit": "Add deposit",
    "addDepositTime": "Edit quantity for this availibility",
    "table": {
      "delivery_time": "Delivery time",
      "quantity": "Quantity in stock"
    },
    "availibilityTime": "in {time} days",
    "availibilityDate": "from {date}"
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
    availibility(): WarehouseItem['availibility'] {
      return (
        this.item.availibility || [
          // TODO: cause api does not return this
          { quantity: 0, delivery_time: null, delivery_date: null },
          { quantity: 0, delivery_time: 0, delivery_date: null },
          { quantity: 1, delivery_time: null, delivery_date: '20-01-2022' },
          { quantity: 2, delivery_time: 3, delivery_date: null },
          { quantity: 0, delivery_time: 4, delivery_date: null },
        ]
      )
    },
  },

  methods: {
    formatDeliveryTime(time: number | string | null) {
      if (isNumber(time)) return this.$t('availibilityTime', { time })
      if (time) return this.$t('availibilityDate', { date: time })
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
.items-availibility {
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
