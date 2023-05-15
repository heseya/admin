<template>
  <div class="items-availability">
    <div class="items-availability__header">
      <h4>{{ $t('title') }}</h4>

      <icon-button
        v-can="$p.Deposits.Add"
        size="small"
        data-cy="deposit-create-btn"
        @click="openDepositModal(null, false)"
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
      <span>
        {{ $t('table.from_unlimited') }} <info-tooltip :text="$t('table.from_unlimited_tooltip')" />
      </span>
    </div>

    <div v-if="availability.length === 0" class="items-availability__row">
      <span> - </span>
      <span> - </span>
      <span> - </span>
    </div>

    <div
      v-for="{ shipping_time, shipping_date, quantity, from_unlimited } in availability"
      :key="`${shipping_time}-${shipping_date}`"
      class="items-availability__row"
    >
      <span :class="{ 'items-availability__row-value--past': isDateInPast(shipping_date) }">
        {{ formatShippingTime(shipping_date || shipping_time) }}
        <info-tooltip v-if="isDateInPast(shipping_date)" :text="$t('dateInPastTooltip')" />
      </span>
      <span> {{ quantity }} </span>
      <span> <BooleanTag small :value="from_unlimited" /> </span>

      <a-tooltip v-can="$p.Deposits.Add">
        <template #title> {{ $t('addDepositTime') }} </template>
        <icon-button
          size="small"
          @click="openDepositModal(shipping_date || shipping_time, from_unlimited)"
        >
          <template #icon>
            <i class="bx bx-edit"></i>
          </template>
        </icon-button>
      </a-tooltip>
    </div>

    <deposit-form-modal
      :visible="isDepositModalOpen"
      :default-time="defaultDepositDeliveryTime"
      :default-from-unlimited="defaultFromUnlimited"
      :disabled="!$can($p.Deposits.Add)"
      :item-id="item && item.id"
      @close="closeDepositModal"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Dostępność produktu",
    "addDeposit": "Dodaj wpis magazynowy",
    "addDepositTime": "Zmodyfikuj ilość dla danej dostępności",
    "table": {
      "shippingTime": "Czas wysyłki",
      "quantity": "Ilość w magazynie",
      "from_unlimited": "Z nieograniczonego stanu",
      "from_unlimited_tooltip": "Ta zmiana dotyczy nieskończonych ilości i nie wpływa na obecną ilość produktów na magazynie"
    },
    "dateInPastTooltip": "Data dostępności jest w przeszłości, nie wpływa na aktualną dostępność produktu ani na aktualną sumę produktów w magazynie",
    "availabilityTime": "w {time} dni",
    "availabilityDate": "od {date}"
  },
  "en": {
    "title": "Product availability",
    "addDeposit": "Add deposit",
    "addDepositTime": "Edit quantity for this availability",
    "table": {
      "shippingTime": "Shipping time",
      "quantity": "Quantity in stock",
      "from_unlimited": "From unlimited stock",
      "from_unlimited_tooltip": "This change concerns unlimited quantities and does not affect the current quantity of products in stock"
    },
    "dateInPastTooltip": "The availability date is in the past, it does not affect the current availability of the product or the current sum of products in stock",
    "availabilityTime": "in {time} days",
    "availabilityDate": "from {date}"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import isNumber from 'lodash/isNumber'
import { WarehouseItem } from '@heseya/store-core'

import DepositFormModal from './DepositFormModal.vue'
import { formatDate } from '@/utils/dates'

export default Vue.extend({
  components: { DepositFormModal },
  props: {
    item: { type: Object, default: null } as Vue.PropOptions<WarehouseItem | null>,
  },

  data: () => ({
    isDepositModalOpen: false,
    defaultDepositDeliveryTime: null as string | number | null,
    defaultFromUnlimited: false,
  }),

  computed: {
    availability(): WarehouseItem['availability'] {
      return this.item?.availability || []
    },
  },

  methods: {
    formatShippingTime(time: number | string | null) {
      if (isNumber(time)) return this.$t('availabilityTime', { time })
      if (time) return this.$t('availabilityDate', { date: formatDate(time) })
      return '-'
    },

    isDateInPast(time: string | number | null) {
      if (!time) return false
      return new Date(time) < new Date()
    },

    openDepositModal(time: string | number | null, fromUnlimited: boolean) {
      this.defaultDepositDeliveryTime = time
      this.defaultFromUnlimited = fromUnlimited
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
    grid-template-columns: 1fr 1fr 1fr 32px;
    grid-gap: 8px;
    margin-bottom: 4px;

    &--header {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10px;
    }
  }

  &__row-value--past {
    color: $gray-color-400;
  }
}
</style>
