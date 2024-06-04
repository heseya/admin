<template>
  <LayoutAccordion class="product-advanced-details" :title="$t('title').toString()">
    <div class="product-advanced-details__form">
      <GoogleCategorySelect v-model="form.google_product_category" :disabled="disabled" />

      <div class="product-advanced-details__row">
        <boolean-select v-model="form.shipping_digital" :add-all="false" :disabled="disabled">
          <template #label>
            {{ $t('form.shippingDigital') }}
            <info-tooltip>{{ $t('form.shippingDigitalTooltip') }}</info-tooltip>
          </template>
        </boolean-select>

        <validated-input
          v-model="form.purchase_limit_per_user"
          type="number"
          name="purchase_limit_per_user"
          :disabled="disabled"
        >
          <template #label>
            {{ $t('form.purchaseLimit') }}
            <info-tooltip>{{ $t('form.purchaseLimitTooltip') }}</info-tooltip>
          </template>
        </validated-input>
      </div>

      <div class="product-advanced-details__row">
        <validated-input
          v-model="form.quantity_step"
          rules="required"
          type="number"
          step="0.01"
          name="quantity_step"
          :disabled="disabled"
        >
          <template #label>
            {{ $t('form.quantityStep') }}
            <info-tooltip>{{ $t('form.quantityStepTooltip') }}</info-tooltip>
          </template>
        </validated-input>

        <validated-input v-model="form.order" type="number" name="order" :disabled="disabled">
          <template #label>
            {{ $t('form.order') }}
            <info-tooltip>{{ $t('form.orderTooltip') }}</info-tooltip>
          </template>
        </validated-input>
      </div>
    </div>
  </LayoutAccordion>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Pozostałe informacje",
    "form": {
      "shippingDigital": "Produkt z wysyłką cyfrową",
      "shippingDigitalTooltip": "Produkt z wysyłką cyfrową wymaga cyfrowej metody dostawy zamiast standardowych podczas składania zamówienia.",
      "purchaseLimit": "Limit zakupów na użytkownika",
      "purchaseLimitTooltip": "Ogranicza liczbę zakupów danego produktu przez jednego użytkownika. Wartość 0 oznacza brak limitu.",
      "order": "Priorytet sortowania",
      "orderTooltip": "Pozwala na zmianę kolejności produktów na liście. Produkty z mniejszą liczbą wyświetlane są wyżej.",
      "quantityStep": "Format ilości",
      "quantityStepTooltip": "Oznacza jaki jest najmniejszy możliwy krok zmiany ilości produktu. Domyślnie jest to 1, ale dla niektórych produktów konieczna może okazać się możliwość zamawiania w krokach mniejszych lub większych krokach (Np. sprzedając sznurek na metry, możemy chcieć sprzedawać co 10 cm))"
    }
  },
  "en": {
    "title": "Other information",
    "form": {
      "shippingDigital": "Product with digital shipping",
      "shippingDigitalTooltip": "Product with digital shipping requires a digital shipping method instead of standard shipping when placing an order.",
      "purchaseLimit": "Purchase limit per user",
      "purchaseLimitTooltip": "Limits the number of purchases of a given product by one user. The value 0 means no limit.",
      "order": "Sort priority",
      "orderTooltip": "Allows you to change the order of the products in the list. Products with a lower number are displayed higher.",
      "quantityStep": "Quantity format",
      "quantityStepTooltip": "Indicates the smallest possible step of quantity change. Default is 1, but for some products it may be necessary to change the step in smaller or larger steps (e.g. selling a screw on meters, you can change the step to 10 cm)"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'

import GoogleCategorySelect from '../GoogleCategorySelect.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import InfoTooltip from '@/components/layout/InfoTooltip.vue'
import BooleanSelect from '@/components/form/BooleanSelect.vue'
import LayoutAccordion from '@/components/layout/Accordion.vue'

export default defineComponent({
  components: { LayoutAccordion, GoogleCategorySelect, ValidatedInput, InfoTooltip, BooleanSelect },
  props: {
    value: {
      type: Object as PropType<ProductComponentForm>,
      required: true,
    },
    product: {
      type: Object as PropType<Product>,
      default: () => ({} as Product),
    },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    form: {
      get(): ProductComponentForm {
        return this.value
      },
      set(value: ProductComponentForm) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.product-advanced-details {
  &__form {
    width: 100%;

    @media ($viewport-14) {
      width: 75%;
    }
  }

  &__row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0 16px;

    @media ($viewport-4) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
