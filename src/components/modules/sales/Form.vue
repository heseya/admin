<template>
  <div class="sale-configurator">
    <div class="sale-configurator__row">
      <div class="sale-configurator__section">
        <validated-input v-model="form.name" :disabled="disabled" :label="$t('common.form.name')" />

        <validated-input
          v-model="form.description"
          :disabled="disabled"
          :label="$t('common.form.description')"
        />
      </div>

      <div class="sale-configurator__section">
        <ValidationProvider v-slot="{ errors }" rules="required">
          <app-select v-model="form.type" :disabled="disabled" :label="$t('form.type')">
            <a-select-option :value="DiscountType.Percentage" :label="$t('types.percent')">
              {{ $t('types.percent') }}
            </a-select-option>
            <a-select-option :value="DiscountType.Amount" :label="$t('types.amount')">
              {{ $t('types.amount') }}
            </a-select-option>
            <template #error>{{ errors[0] }}</template>
          </app-select>
        </ValidationProvider>

        <validated-input
          v-model="form.value"
          :disabled="disabled"
          rules="required"
          :label="$t('form.discount')"
        />

        <validated-input
          v-model="form.priority"
          :disabled="disabled"
          type="number"
          rules="required"
        >
          <template #label>
            {{ $t('form.priority') }} <info-tooltip>{{ $t('form.priorityTooltip') }}</info-tooltip>
          </template>
        </validated-input>
      </div>
    </div>

    <hr />

    <ValidationProvider v-slot="{ errors }" rules="required">
      <app-select v-model="form.target_type" :disabled="disabled" :label="$t('form.target_type')">
        <a-select-option
          :value="DiscountTargetType.OrderValue"
          :label="$t('targetTypes.orderValue')"
        >
          {{ $t('targetTypes.orderValue') }}
        </a-select-option>
        <a-select-option :value="DiscountTargetType.Products" :label="$t('targetTypes.products')">
          {{ $t('targetTypes.products') }}
        </a-select-option>
        <a-select-option
          :value="DiscountTargetType.ShippingPrice"
          :label="$t('targetTypes.shippingPrice')"
        >
          {{ $t('targetTypes.shippingPrice') }}
        </a-select-option>
        <a-select-option
          :value="DiscountTargetType.CheapestProduct"
          :label="$t('targetTypes.cheapestProduct')"
        >
          {{ $t('targetTypes.cheapestProduct') }}
        </a-select-option>
        <template #error>{{ errors[0] }}</template>
      </app-select>
    </ValidationProvider>

    <template v-if="form.target_type === DiscountTargetType.Products">
      target_products: {{ form.target_products }} <br />
      target_sets: {{ form.target_sets }} <br />

      <flex-input>
        <switch-input
          v-model="form.target_is_allow_list"
          horizontal
          :label="$t('form.target_is_allow_list')"
          :disabled="disabled"
        />
      </flex-input>
    </template>

    <hr />

    condition_groups: {{ form.condition_groups }}
  </div>
</template>

<i18n>
{
  "pl": {
    "form": {
      "code": "Kod",
      "discount": "Wartość zniżki",
      "priority": "Priorytet",
      "priorityTooltip": "TODO",
      "type": "Typ przeceny",
      "target_type": "Typ celu przeceny",
      "target_is_allow_list": "Czy lista dozwolonych"
    },
    "types": {
      "percent": "Rabat procentowy",
      "amount": "Rabat kwotowy"
    },
    "targetTypes": {
      "orderValue": "Całkowita wartość zamówienia",
      "products": "Wybrane produkty",
      "shippingPrice": "Cena dostawy",
      "cheapestProduct": "Najtańszy produkt w koszyku"
    }
  },
  "en": {
    "form": {
      "code": "Code",
      "discount": "Discount value",
      "priority": "Priority",
      "priorityTooltip": "TODO",
      "type": "Discount type",
      "target_type": "Discount target type",
      "target_is_allow_list": "Is allow list"
    },
    "types": {
      "percent": "Percentage discount",
      "amount": "Amount discount"
    },
    "targetTypes": {
      "orderValue": "Order total value",
      "products": "Selected products",
      "shippingPrice": "Shipping price",
      "cheapestProduct": "Cheapest product in cart"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import FlexInput from '@/components/layout/FlexInput.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'

import { DiscountTargetType, DiscountType, SaleDto } from '@/interfaces/SalesAndCoupons'

export default Vue.extend({
  components: { ValidationProvider, FlexInput, SwitchInput },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<SaleDto>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountType(): typeof DiscountType {
      return DiscountType
    },
    DiscountTargetType(): typeof DiscountTargetType {
      return DiscountTargetType
    },
    form: {
      get(): SaleDto {
        return this.value
      },
      set(v: SaleDto) {
        this.$emit('input', v)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.sale-configurator {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    align-items: flex-start;
  }
}
</style>
