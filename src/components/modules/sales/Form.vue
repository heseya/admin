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
            <a-select-option :value="DiscountType.Percentage" :label="$t('discountTypes.percent')">
              {{ $t('discountTypes.percent') }}
            </a-select-option>
            <a-select-option :value="DiscountType.Amount" :label="$t('discountTypes.amount')">
              {{ $t('discountTypes.amount') }}
            </a-select-option>
            <template #error>{{ errors[0] }}</template>
          </app-select>
        </ValidationProvider>

        <validated-input
          v-model="form.value"
          :disabled="disabled"
          :rules="{
            required: true,
            'not-negative': true,
            'less-than': form.type === DiscountType.Percentage ? 100 : false,
          }"
          type="number"
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
          :label="$t('discountTargetTypes.order-value')"
        >
          {{ $t('discountTargetTypes.order-value') }}
        </a-select-option>
        <a-select-option
          :value="DiscountTargetType.Products"
          :label="$t('discountTargetTypes.products')"
        >
          {{ $t('discountTargetTypes.products') }}
        </a-select-option>
        <a-select-option
          :value="DiscountTargetType.ShippingPrice"
          :label="$t('discountTargetTypes.shipping-price')"
        >
          {{ $t('discountTargetTypes.shipping-price') }}
        </a-select-option>
        <a-select-option
          :value="DiscountTargetType.CheapestProduct"
          :label="$t('discountTargetTypes.cheapest-product')"
        >
          {{ $t('discountTargetTypes.cheapest-product') }}
        </a-select-option>
        <template #error>{{ errors[0] }}</template>
      </app-select>
    </ValidationProvider>

    <flex-input
      v-if="
        form.target_type === DiscountTargetType.ShippingPrice ||
        form.target_type === DiscountTargetType.Products
      "
      class="sale-configurator__switch"
    >
      <label class="title">{{ $t('common.blockList') }}</label>
      <a-switch v-model="form.target_is_allow_list" :disabled="disabled" />
      <label class="title">{{ $t('common.allowList') }}</label>
    </flex-input>

    <template v-if="form.target_type === DiscountTargetType.Products">
      <autocomplete-input
        v-model="form.target_products"
        :label="$t('form.target_products')"
        model="products"
        :disabled="disabled"
      />

      <autocomplete-input
        v-model="form.target_sets"
        :label="$t('form.target_sets')"
        model="productSets"
        :disabled="disabled"
      />
    </template>

    <autocomplete-input
      v-if="form.target_type === DiscountTargetType.ShippingPrice"
      v-model="form.target_shipping_methods"
      :label="$t('form.target_shipping_methods')"
      model="shippingMethods"
      :disabled="disabled"
    />

    <hr />

    <ConditionsConfigurator v-model="form.condition_groups" :disabled="disabled" />
  </div>
</template>

<i18n>
{
  "pl": {
    "form": {
      "code": "Kod",
      "discount": "Wartość zniżki",
      "priority": "Priorytet",
      "priorityTooltip": "Określa który w kolei będzie dany rabat przy naliczaniu wszystkich rabatów (w kolejności od największego do najmniejszego). Przy czym priorytet brany jest pod uwagę dopiero, gdy dwa rabaty mają ten sam typ przeceny i typ celu przeceny.",
      "type": "Typ przeceny",
      "target_type": "Typ celu przeceny",
      "target_is_allow_list": "Czy lista dozwolonych",
      "target_products": "Produkty",
      "target_sets": "Kolekcje",
      "target_shipping_methods": "Metody dostawy"
    }
  },
  "en": {
    "form": {
      "code": "Code",
      "discount": "Discount value",
      "priority": "Priority",
      "priorityTooltip": "Defines which discount will be applied first (in order of priority). Only discounts with the same type and target type will be considered.",
      "type": "Discount type",
      "target_type": "Discount target type",
      "target_is_allow_list": "Is allow list",
      "target_products": "Products",
      "target_sets": "Product sets",
      "target_shipping_methods": "Shipping methods"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import FlexInput from '@/components/layout/FlexInput.vue'
import AutocompleteInput from '../../AutocompleteInput.vue'

import { DiscountTargetType, DiscountType, SaleFormDto } from '@/interfaces/SalesAndCoupons'
import ConditionsConfigurator from './ConditionsConfigurator.vue'

export default Vue.extend({
  components: { ValidationProvider, FlexInput, AutocompleteInput, ConditionsConfigurator },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<SaleFormDto>,
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
      get(): SaleFormDto {
        return this.value
      },
      set(v: SaleFormDto) {
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

  &__switch {
    max-width: 340px;
    text-align: center;
    margin: 12px auto;

    label.title {
      margin-right: 0 !important;
    }
  }
}
</style>
