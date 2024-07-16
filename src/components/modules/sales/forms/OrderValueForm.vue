<template>
  <div class="order-value-form">
    <AppSelect v-model="rangeType" :label="$t('form.type.title').toString()">
      <a-select-option value="min"> {{ $t('form.type.min') }} </a-select-option>
      <a-select-option value="max"> {{ $t('form.type.max') }} </a-select-option>
      <a-select-option value="both"> {{ $t('form.type.both') }} </a-select-option>
    </AppSelect>

    <div class="condition-form__row">
      <CurrencyPriceForm
        v-if="rangeType === 'min' || rangeType === 'both'"
        v-model="form.min_values"
        class="order-value-form__row-item"
        :label="$t('form.min_value').toString()"
        :disabled="disabled"
        :name="`${formId}.min_value_`"
        :rules="maxValueRules"
      />
      <div v-else class="order-value-form__row-item"></div>

      <CurrencyPriceForm
        v-if="rangeType === 'max' || rangeType === 'both'"
        v-model="form.max_values"
        class="order-value-form__row-item"
        :label="$t('form.max_value').toString()"
        :disabled="disabled"
        :name="`${formId}.max_value_`"
        rules="not-negative"
      />
      <div v-else class="order-value-form__row-item"></div>
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
      "include_taxes": "Include taxes",
      "type": {
        "title": "Range type",
        "min": "Only min value",
        "max": "Only max value",
        "both": "Both min and max value"
      }
    },
    "tooltips": {
      "is_in_range": "If checked, discount will be applied only if order value is in range, otherwise discount will be applied only if order value is out of range"
    }
  },
  "pl": {
    "form": {
      "min_value": "Minimalna wartość",
      "max_value": "Maksymalna wartość",
      "is_in_range": "Wartości wewnątrz zakresu",
      "include_taxes": "Uwzględniaj podatek",
      "type": {
        "title": "Rodzaj przedziału",
        "min": "Tylko wartość minimalna",
        "max": "Tylko wartość maksymalna",
        "both": "Wartość minimalna i maksymalna"
      }
    },
    "tooltips": {
      "is_in_range": "Jeżeli zaznaczone, rabat będzie obowiązywał tylko jeżeli wartość zamówienia jest w zakresie, w przeciwnym wypadku rabat będzie obowiązywał tylko jeżeli wartość zamówienia jest poza zakresem"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  OrderValueDiscountCondition,
  OrderValueDiscountConditionDto,
  Price,
} from '@heseya/store-core'
import { cloneDeep } from 'lodash'

import SwitchInput from '@/components/form/SwitchInput.vue'
import CurrencyPriceForm from '@/components/CurrencyPriceForm.vue'
import { mapPricesToDto } from '@/utils/currency'
import AppSelect from '@/components/form/AppSelect.vue'

type Condition = OrderValueDiscountCondition | OrderValueDiscountConditionDto

type RangeType = 'min' | 'max' | 'both'

const isPriceArray = (v: any): v is Price[] => Array.isArray(v) && !!v[0] && 'net' in v[0]

export default defineComponent({
  components: { SwitchInput, CurrencyPriceForm, AppSelect },
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

    rangeType: {
      get(): RangeType {
        if (this.form.min_values?.length && this.form.max_values?.length) return 'both'
        if (this.form.min_values?.length) return 'min'
        if (this.form.max_values?.length) return 'max'
        return 'both'
      },
      set(type: RangeType) {
        const EMPTY_VALUES = this.$accessor.config.currencies.map((currency) => ({
          currency: currency.code,
          value: '0',
        }))

        if (type === 'min') {
          this.form.min_values =
            this.form.min_values !== null ? this.form.min_values : cloneDeep(EMPTY_VALUES)
          this.form.max_values = null
        } else if (type === 'max') {
          this.form.max_values =
            this.form.max_values !== null ? this.form.max_values : cloneDeep(EMPTY_VALUES)
          this.form.min_values = null
        } else {
          this.form.min_values =
            this.form.min_values !== null ? this.form.min_values : cloneDeep(EMPTY_VALUES)
          this.form.max_values =
            this.form.max_values !== null ? this.form.max_values : cloneDeep(EMPTY_VALUES)
        }
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

<style lang="scss" scoped>
.order-value-form {
  &__row-item {
    width: 100%;
  }
}
</style>
