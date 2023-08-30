<template>
  <div class="order-value-form">
    <div class="condition-form__row">
      <CurrencyPriceForm
        v-model="form.min_values"
        :label="$t('form.min_value').toString()"
        :disabled="disabled"
        :name="`${formId}.min_value_`"
        :rules="maxValueRules"
      />
      <CurrencyPriceForm
        v-model="form.max_values"
        :label="$t('form.max_value').toString()"
        :disabled="disabled"
        :name="`${formId}.max_value_`"
        rules="not-negative"
      />
    </div>

    <div class="condition-form__row">
      <switch-input v-model="form.is_in_range" :disabled="disabled">
        <template #title>
          {{ $t('form.is_in_range') }}
          <info-tooltip>{{ $t('tooltips.is_in_range') }}</info-tooltip>
        </template>
      </switch-input>
      <!-- <switch-input v-model="form.include_taxes" :label="$t('form.include_taxes')" /> -->
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "form": {
      "min_value": "Min order value",
      "max_value": "Max order value",
      "is_in_range": "Is in range",
      "include_taxes": "Include taxes"
    },
    "tooltips": {
      "is_in_range": "If checked, discount will be applied only if order value is in range, otherwise discount will be applied only if order value is out of range"
    }
  },
  "pl": {
    "form": {
      "min_value": "Minimalna wartość zamówienia",
      "max_value": "Maksymalna wartość zamówienia",
      "is_in_range": "Wartość z zakresu",
      "include_taxes": "Uwzględniaj podatek"
    },
    "tooltips": {
      "is_in_range": "Jeżeli zaznaczone, rabat będzie obowiązywał tylko jeżeli wartość zamówienia jest w zakresie, w przeciwnym wypadku rabat będzie obowiązywał tylko jeżeli wartość zamówienia jest poza zakresem"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { OrderValueDiscountCondition } from '@heseya/store-core'

import SwitchInput from '@/components/form/SwitchInput.vue'
import CurrencyPriceForm from '@/components/CurrencyPriceForm.vue'
import { OrderValueDiscountConditionDto } from '@heseya/store-core'
import { mapPricesToDto } from '@/utils/currency'
import { Price } from '@heseya/store-core'

type Condition = OrderValueDiscountCondition | OrderValueDiscountConditionDto

const isPriceArray = (v: any): v is Price[] => Array.isArray(v) && 'net' in v[0]

export default defineComponent({
  components: { SwitchInput, CurrencyPriceForm },
  props: {
    value: { type: Object as PropType<Condition>, required: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    formId(): string {
      // @ts-ignore // ? Unofficial Vue api
      return this._uid
    },
    form: {
      get(): OrderValueDiscountConditionDto {
        // In watch there is a mapping from Price to PriceDto
        return this.value as OrderValueDiscountConditionDto
      },
      set(v: OrderValueDiscountConditionDto) {
        this.$emit('input', v)
      },
    },
  },

  watch: {
    value: {
      handler() {
        /**
         * If in min/max values there is Price instead of PriceDto, convert it to dto
         */
        if (isPriceArray(this.value.min_values) || isPriceArray(this.value.max_values))
          this.form = {
            ...this.form,
            min_values: isPriceArray(this.value.min_values)
              ? mapPricesToDto(this.value.min_values)
              : this.value.min_values,
            max_values: isPriceArray(this.value.max_values)
              ? mapPricesToDto(this.value.max_values)
              : this.value.max_values,
          }
      },
      immediate: true,
    },
  },

  methods: {
    maxValueRules(currency: string) {
      return `not-negative|less-than:@${this.formId}.max_value_${currency}`
    },
  },
})
</script>
