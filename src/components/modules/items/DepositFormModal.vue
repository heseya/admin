<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal :visible="visible" :title="$t('title')" @cancel="close">
      <div class="deposit-form">
        <loading :active="isLoading" />

        <validated-input
          v-model="form.quantity"
          :disabled="disabled"
          rules="required|non-zero"
          type="number"
          :label="$t('form.quantity')"
        />

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
          rules="not-negative"
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
        <app-button v-if="!disabled" type="primary" @click="handleSubmit(saveDeposit)">
          {{ $t('common.add') }}
        </app-button>
      </template>
    </a-modal>
  </validation-observer>
</template>

<i18n>
{
  "pl": {
    "title": "Dodawanie depozytu do magazynu",
    "form": {
      "quantity": "Ilość",
      "shipping_date": "Data dostawy",
      "shipping_date_tooltip": "Oznacza, że wysyłka będzie realizowana po danej dacie. Przedmioty są traktowane jako dostępne do tej daty włącznie, chyba że wyczerpie się ilość.",
      "shipping_time": "Czas dostawy w dniach",
      "shipping_time_tooltip": "Oznacza czas wysyłki w dniach przedmiotów dla podanej ilości, jeśli ilość się skończy, przedmiot staje się niedostępny w ramach tej ilości dni dostawy."
    },
    "addedSuccessfully": "Dodano depozyt do magazynu",
    "stockTimeType": {
      "label": "Typ czasu dostawy",
      "time": "Czas dostawy w dniach",
      "date": "Data dostawy"
    }
  },
  "en": {
    "title": "Adding a deposit to a warehouse",
    "form": {
      "quantity": "Quantity",
      "shipping_date": "Shipping date",
      "shipping_date_tooltip": "Indicates that the delivery will be realized after the given date. Items are treated as available until that date, unless the quantity is exhausted.",
      "shipping_time": "Shipping time in days",
      "shipping_time_tooltip": "Indicates the time of delivery of items for the given quantity, if the quantity is exhausted, the item becomes unavailable for the given number of days of delivery."
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

import { WarehouseDepositDto } from '@/interfaces/WarehouseItem'
import Loading from '@/components/layout/Loading.vue'

const EMPTY_DEPOSIT_FORM: WarehouseDepositDto = {
  quantity: 0,
  shipping_time: undefined,
  shipping_date: undefined,
}

enum StockTimeType {
  Time = 'time',
  Date = 'date',
}

export default Vue.extend({
  components: { ValidationObserver, Loading },
  props: {
    defaultTime: { type: [Number, String], default: null },
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
        if (isString(this.defaultTime)) {
          this.stockTimeType = StockTimeType.Date
          this.form.shipping_date = this.defaultTime
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

      // @ts-ignore // TODO: fix extended store actions typings
      const deposit = await this.$accessor.items.createDeposit({
        id: this.itemId,
        deposit: this.form,
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
