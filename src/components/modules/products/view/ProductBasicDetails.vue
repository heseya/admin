<template>
  <div class="product-basic-details">
    <validated-input
      v-model="form.name"
      rules="required"
      :label="$t('common.form.name')"
      name="name"
      :disabled="disabled"
      @input="editSlug"
    />

    <product-set-select v-model="form.sets" :product="product" :disabled="disabled" />

    <validated-input
      v-model="form.slug"
      rules="required|slug"
      :label="$t('common.form.slug')"
      name="slug"
      :disabled="disabled"
    />

    <div class="product-basic-details__price-row">
      <validated-input
        v-model="form.price"
        rules="required|not-negative"
        type="number"
        step="0.01"
        :label="$t('form.price')"
        name="price"
        :disabled="disabled"
      />

      <validated-input
        v-model="form.vat_rate"
        rules="not-negative|less-than:100"
        type="number"
        :label="$t('form.vatRate')"
        name="vat_rate"
        :disabled="disabled"
      />

      <validated-input
        v-model="form.quantity_step"
        rules="required"
        type="number"
        max="999999"
        step="0.01"
        name="quantity_step"
        :disabled="disabled"
      >
        <template #label>
          {{ $t('form.quantityStep') }}
          <info-tooltip>{{ $t('form.quantityStepTooltip') }}</info-tooltip>
        </template>
      </validated-input>
    </div>

    <app-textarea
      v-if="!loading"
      v-model="form.description_short"
      :label="$t('form.shortDescription')"
      :disabled="disabled"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "price": "Cena brutto",
      "vatRate": "Stawka VAT (%)",
      "quantityStep": "Format ilości",
      "quantityStepTooltip": "Oznacza jaki jest najmniejszy możliwy krok zmiany ilości produktu. Domyślnie jest to 1, ale dla niektórych produktów konieczna może okazać się możliwość zamawiania w krokach mniejszych lub większych krokach (Np. sprzedając sznurek na metry, możemy chcieć sprzedawać co 10 cm))",
      "shortDescription": "Krótki opis"
    }
  },
  "en": {
    "form": {
      "price": "Price (gross)",
      "vatRate": "VAT rate (%)",
      "quantityStep": "Quantity format",
      "quantityStepTooltip": "Indicates the smallest possible step of quantity change. Default is 1, but for some products it may be necessary to change the step in smaller or larger steps (e.g. selling a screw on meters, you can change the step to 10 cm)",
      "shortDescription": "Short description"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@heseya/store-core'

import { ProductComponentForm } from '@/interfaces/Product'
import ProductSetSelect from '../ProductSetSelect.vue'

import { generateSlug } from '@/utils/generateSlug'
import Textarea from '@/components/form/Textarea.vue'

export default Vue.extend({
  components: { ProductSetSelect, AppTextarea: Textarea },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ProductComponentForm>,
    product: {
      type: Object,
      default: () => ({} as Product),
    } as Vue.PropOptions<Product>,
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
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

  methods: {
    editSlug() {
      if (this.isNew) this.form.slug = generateSlug(this.form.name)
    },
  },
})
</script>

<style lang="scss" scoped>
.product-basic-details {
  &__price-row {
    display: grid;
    grid-template-columns: 1fr 0.5fr 1fr;
    grid-gap: 16px;
  }
}
</style>
