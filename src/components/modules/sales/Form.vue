<template>
  <div class="sale-configurator">
    <div class="sale-configurator__fields">
      <validated-input
        v-model="form.name"
        class="sale-name"
        :disabled="disabled"
        rules="required"
        :label="$t('common.form.name')"
      />

      <validated-input
        v-model="form.description"
        class="sale-desc"
        :disabled="disabled"
        :label="$t('common.form.description')"
      />

      <ValidationProvider v-slot="{ errors }" rules="required" class="sale-type">
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
        class="sale-value"
        :disabled="disabled"
        :rules="{
          required: true,
          positive: true,
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
        class="sale-priority"
      >
        <template #label>
          {{ $t('form.priority') }} <info-tooltip>{{ $t('form.priorityTooltip') }}</info-tooltip>
        </template>
      </validated-input>

      <ValidationProvider v-slot="{ errors }" rules="required" class="sale-purpose">
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

      <div
        v-if="
          form.target_type === DiscountTargetType.ShippingPrice ||
          form.target_type === DiscountTargetType.Products
        "
        class="sale-switches"
      >
        <label class="app-input__label">{{ $t('refers') }}</label>
        <div class="sale-configurator__switches">
          <flex-input class="sale-configurator__switch">
            <label class="title">{{ $t('common.allowList') }}</label>
            <a-switch
              :checked="form.target_is_allow_list"
              :disabled="disabled"
              @change="form.target_is_allow_list = !form.target_is_allow_list"
            />
          </flex-input>
          <flex-input class="sale-configurator__switch">
            <label class="title">{{ $t('common.blockList') }}</label>
            <a-switch
              :checked="!form.target_is_allow_list"
              :disabled="disabled"
              @change="form.target_is_allow_list = !form.target_is_allow_list"
            />
          </flex-input>
        </div>
      </div>

      <template v-if="form.target_type === DiscountTargetType.Products">
        <autocomplete-input
          v-model="form.target_products"
          :label="$t('form.target_products')"
          model-url="products"
          :disabled="disabled"
          :rules="{ required: form.target_is_allow_list && form.target_sets.length === 0 }"
          class="target-products"
        />

        <autocomplete-input
          v-model="form.target_sets"
          :label="$t('form.target_sets')"
          model-url="product-sets"
          :disabled="disabled"
          :rules="{ required: form.target_is_allow_list && form.target_products.length === 0 }"
          class="target-sets"
        />
      </template>

      <autocomplete-input
        v-if="form.target_type === DiscountTargetType.ShippingPrice"
        v-model="form.target_shipping_methods"
        :label="$t('form.target_shipping_methods')"
        model-url="shipping-methods"
        :disabled="disabled"
        :rules="{ required: form.target_is_allow_list }"
        class="target-shipping"
      />
    </div>

    <hr />

    <ConditionsConfigurator v-model="form.condition_groups" :disabled="disabled" />
  </div>
</template>

<i18n>
{
  "pl": {
    "refers": "Dotyczy",
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
    "refers": "Refers to",
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
  ::v-deep .bxs-info-circle {
    font-size: 1rem;
  }

  ::v-deep .bx-plus {
    font-size: 1.25rem;
  }
  .ant-switch-checked {
    background-color: #10ce85;
  }

  &__fields {
    display: grid;
    gap: 10px;

    grid-template-areas:
      'name'
      'desc'
      'type'
      'value'
      'priority'
      'purpose'
      'switches';

    @media ($viewport-5) {
      grid-template-columns: 2fr 1fr 1fr;
      grid-template-areas:
        'name name name'
        'desc desc desc'
        'type value priority'
        'purpose purpose purpose'
        'switches switches switches';
    }

    @media ($viewport-8) {
      grid-template-columns: 35fr 15fr 25fr 25fr;
      gap: 26px 20px;
      grid-template-areas:
        'name desc desc desc'
        'type type value priority'
        'purpose purpose switches switches';
    }

    .sale-configurator__switch {
      button {
        margin-inline: 8px;

        @media ($viewport-5) {
          margin-inline: 0;
        }
      }
    }

    .target-products,
    .target-sets,
    .target-shipping {
      width: 100%;
      grid-column: 1/-1;
    }

    ::v-deep .app-input {
      margin-bottom: 0;
    }

    .sale-name {
      grid-area: name;
    }

    .sale-desc {
      grid-area: desc;
    }

    .sale-type {
      grid-area: type;
    }

    .sale-value {
      grid-area: value;
    }

    .sale-priority {
      grid-area: priority;
    }

    .sale-purpose {
      grid-area: purpose;
    }

    .sale-switches {
      grid-area: switches;
      width: 100%;
      margin: 0;
      display: grid;
    }
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    align-items: flex-start;
  }

  &__switches {
    display: flex;
    justify-content: space-evenly;

    @media ($viewport-8) {
      width: 100%;
      display: grid;
      column-gap: 20px;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      justify-content: flex-start;
    }
  }

  &__switch {
    text-align: center;

    label.title {
      font-weight: 400;
      margin-right: 0 !important;

      @media ($viewport-5) {
        margin-right: 20px !important;
      }
    }
  }
}
</style>
