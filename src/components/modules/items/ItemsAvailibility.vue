<template>
  <div class="items-availibility">
    <div class="items-availibility__header">
      <h4>{{ $t('title') }}</h4>

      <icon-button size="small" @click="openDepositModal()">
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
      v-for="{ delivery_time: time, quantity } in tempAvailibility"
      :key="time"
      class="items-availibility__row"
    >
      <span> {{ formatDeliveryTime(time) }} </span>
      <span> {{ quantity }} </span>

      <a-tooltip>
        <template #title> {{ $t('addDepositTime') }} </template>
        <icon-button size="small" @click="openDepositModal(time)">
          <template #icon>
            <i class="bx bx-edit"></i>
          </template>
        </icon-button>
      </a-tooltip>
    </div>
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

export default Vue.extend({
  props: {
    item: { type: Object, default: null } as Vue.PropOptions<WarehouseItem>,
  },

  computed: {
    // TODO: cause api does not return this
    tempAvailibility(): WarehouseItem['availibility'] {
      return [
        { quantity: 0, delivery_time: 0 },
        { quantity: 1, delivery_time: '20-01-2022' },
        { quantity: 2, delivery_time: 3 },
        { quantity: 0, delivery_time: 4 },
      ]
    },
  },

  methods: {
    formatDeliveryTime(time: number | string) {
      if (isNumber(time)) return this.$t('availibilityTime', { time })
      else return this.$t('availibilityDate', { date: time })
    },

    openDepositModal(time?: string | number) {
      // TODO
      console.log('🚀 ~ file: ItemsAvailibility.vue ~ line 94 ~ openDepositModal ~ time', time)
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
