<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal :visible="visible" :title="$t('title')" @cancel="close">
      <div class="deposit-form">
        <loading :active="isLoading" />

        <validated-input
          v-model="form.quantity"
          data-cy="quantity"
          :disabled="disabled"
          rules="required|non-zero"
          type="number"
          :label="$t('form.quantity')"
        />

        <boolean-select v-model="form.from_unlimited" :add-all="false">
          <template #label>
            {{ $t('form.from_unlimited') }}
            <info-tooltip>
              {{ $t('form.from_unlimited_tooltip') }}
            </info-tooltip>
          </template>
        </boolean-select>

        <app-select v-model="stockTimeType" :label="$t('stockTimeType.label')">
          <a-select-option
            :value="StockTimeType.Time"
            :label="$t(`stockTimeType.${StockTimeType.Time}`)"
          >
            {{ $t(`stockTimeType.${StockTimeType.Time}`) }}
          </a-select-option>
          <a-select-option
            :value="StockTimeType.Date"
            :label="$t(`stockTimeType.${StockTimeType.Date}`)"
          >
            {{ $t(`stockTimeType.${StockTimeType.Date}`) }}
          </a-select-option>
        </app-select>

        <validated-input
          v-if="stockTimeType === StockTimeType.Date"
          v-model="form.shipping_date"
          :disabled="disabled"
          type="datetime-local"
          rules="required"
        >
          <template #label>
            {{ $t('form.shipping_date') }}
            <info-tooltip>
              {{ $t('form.shipping_date_tooltip') }}
            </info-tooltip>
          </template>
        </validated-input>

        <validated-input
          v-if="stockTimeType === StockTimeType.Time"
          v-model="form.shipping_time"
          :disabled="disabled"
          type="number"
          rules="required|not-negative"
        >
          <template #label>
            {{ $t('form.shipping_time') }}
            <info-tooltip>
              {{ $t('form.shipping_time_tooltip') }}
            </info-tooltip>
          </template>
        </validated-input>
      </div>
      <template #footer>
        <app-button
          v-if="!disabled"
          data-cy="deposit-add-btn"
          type="primary"
          @click="handleSubmit(saveDeposit)"
        >
          {{ $t('common.add') }}
        </app-button>
      </template>
    </a-modal>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Dodawanie depozytu do magazynu",
    "form": {
      "quantity": "Ilość",
      "shipping_date": "Data wysyłki",
      "shipping_date_tooltip": "Oznacza, że wysyłka będzie realizowana po danej dacie. Przedmioty są traktowane jako dostępne do tej daty włącznie, chyba że wyczerpie się ilość.",
      "shipping_time": "Czas wysyłki w dniach",
      "shipping_time_tooltip": "Oznacza czas wysyłki w dniach przedmiotów dla podanej ilości, jeśli ilość się skończy, przedmiot staje się niedostępny w ramach tej ilości dni wysyłki.",
      "from_unlimited": "Z nieograniczonego stanu",
      "from_unlimited_tooltip": "Ta zmiana dotyczy nieskończonych ilości i nie wpływa na obecną ilość produktów na magazynie"
    },
    "addedSuccessfully": "Dodano depozyt do magazynu",
    "stockTimeType": {
      "label": "Typ czasu wysyłki",
      "time": "Czas wysyłki w dniach",
      "date": "Data wysyłki"
    }
  },
  "en": {
    "title": "Adding a deposit to a warehouse",
    "form": {
      "quantity": "Quantity",
      "shipping_date": "Shipping date",
      "shipping_date_tooltip": "Indicates that the delivery will be realized after the given date. Items are treated as available until that date, unless the quantity is exhausted.",
      "shipping_time": "Shipping time in days",
      "shipping_time_tooltip": "Indicates the time of delivery of items for the given quantity, if the quantity is exhausted, the item becomes unavailable for the given number of days of delivery.",
      "from_unlimited": "From unlimited stock",
      "from_unlimited_tooltip": "This change concerns unlimited quantities and does not affect the current quantity of products in stock"
    },
    "addedSuccessfully": "Added deposit to the warehouse",
    "stockTimeType": {
      "label": "Stock time type",
      "time": "Shipping time in days",
      "date": "Shipping date"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { isNumber, isString } from 'lodash'

import Loading from '@/components/layout/Loading.vue'
import { formatDateTimeInput, formatISO } from '@/utils/dates'
import { WarehouseDepositDto } from '@heseya/store-core'
import BooleanSelect from '@/components/form/BooleanSelect.vue'

type InnerWarehouseDepositDto = {
  quantity: number
  shipping_time?: number | undefined
  shipping_date?: string | undefined
  from_unlimited: '0' | '1'
}

const EMPTY_DEPOSIT_FORM: InnerWarehouseDepositDto = {
  quantity: 0,
  shipping_time: 0,
  shipping_date: undefined,
  from_unlimited: '0',
}

enum StockTimeType {
  Time = 'time',
  Date = 'date',
}

export default Vue.extend({
  components: { ValidationObserver, Loading, BooleanSelect },
  props: {
    defaultTime: { type: [Number, String], default: null },
    defaultFromUnlimited: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    itemId: { type: String, required: true },
  },

  data: () => ({
    form: { ...EMPTY_DEPOSIT_FORM },
    isLoading: false,
    stockTimeType: StockTimeType.Time,
  }),

  computed: {
    StockTimeType(): typeof StockTimeType {
      return StockTimeType
    },
  },

  watch: {
    visible(visible) {
      if (visible) {
        this.form = { ...EMPTY_DEPOSIT_FORM }
        this.stockTimeType = StockTimeType.Time
        this.form.from_unlimited = this.defaultFromUnlimited ? '1' : '0'
        if (isString(this.defaultTime)) {
          this.stockTimeType = StockTimeType.Date
          this.form.shipping_date = formatDateTimeInput(this.defaultTime) || ''
        } else if (isNumber(this.defaultTime)) this.form.shipping_time = this.defaultTime
      }
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async saveDeposit() {
      this.isLoading = true

      const timeKey = this.stockTimeType === StockTimeType.Time ? 'shipping_time' : 'shipping_date'

      const deposit = await this.$accessor.items.createDeposit({
        id: this.itemId,
        deposit: {
          quantity: this.form.quantity,
          [timeKey]:
            this.stockTimeType === StockTimeType.Time
              ? this.form[timeKey]
              : formatISO(this.form[timeKey]),
          from_unlimited: this.form.from_unlimited === '1',
        } as WarehouseDepositDto,
      })

      if (deposit) {
        this.$toast.success(this.$t('addedSuccessfully') as string)
        this.close()
      }

      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.deposit-form {
  position: relative;
}
</style>
