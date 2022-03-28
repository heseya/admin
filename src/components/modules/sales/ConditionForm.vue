<template>
  <div class="condition-form">
    <div class="condition-form__header">
      <ValidationProvider v-slot="{ errors }" rules="required">
        <app-select
          :value="condition.type"
          :disabled="disabled"
          :label="$t('common.form.type')"
          @input="changeConditionType"
        >
          <a-select-option
            v-for="option in conditionTypesOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            {{ option.label }}
          </a-select-option>
          <template #error>{{ errors[0] }}</template>
        </app-select>
      </ValidationProvider>

      <icon-button type="danger" size="small" @click="removeSelf()">
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
    </div>

    <div class="condition-form__content">
      <component :is="formComponent" v-model="condition" :disabled="disabled">
        {{ condition }}
      </component>
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "discountConditionTypes": {
      "order-value": "Order value",
      "user-in-role": "User belongs to role",
      "user-in": "Group of users",
      "product-in-set": "Product in set",
      "product-in": "Group of products",
      "date-between": "Date between",
      "time-between": "Time between",
      "max-uses": "Max uses",
      "max-uses-per-user": "Max uses per user",
      "weekday-in": "Weekday",
      "cart-length": "Cart size"
    }
  },
  "pl": {
    "discountConditionTypes": {
      "order-value": "Wartość zamówienia",
      "user-in-role": "Użytkownik należący do roli",
      "user-in": "Grupa użytkowników",
      "product-in-set": "Produkt w kolekcji",
      "product-in": "Grupa produktów",
      "date-between": "Data pomiędzy",
      "time-between": "Czas pomiędzy",
      "max-uses": "Maksymalna liczba użyć",
      "max-uses-per-user": "Maksymalna liczba użyć na użytkownika",
      "weekday-in": "Dzień tygodnia",
      "cart-length": "Wielkość koszyka"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider } from 'vee-validate'

import { DiscountConditionDto, DiscountConditionType } from '@/interfaces/SaleCondition'

import OrderValueForm from './forms/OrderValueForm.vue'

import * as SALES_FORMS from '@/consts/salesConditionsForms'

export default Vue.extend({
  components: { ValidationProvider, OrderValueForm },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<DiscountConditionDto>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountConditionType(): typeof DiscountConditionType {
      return DiscountConditionType
    },
    conditionTypesOptions(): { value: string; label: string }[] {
      return Object.values(DiscountConditionType).map((key) => ({
        value: key,
        label: this.$t(`discountConditionTypes.${key}`) as string,
      }))
    },
    condition: {
      get(): DiscountConditionDto {
        return this.value
      },
      set(v: DiscountConditionDto) {
        this.$emit('input', v)
      },
    },

    formComponent(): string {
      switch (this.condition.type) {
        case DiscountConditionType.OrderValue:
          return 'OrderValueForm'
        case DiscountConditionType.UserInRole:
        case DiscountConditionType.UserIn:
        case DiscountConditionType.ProductInSet:
        case DiscountConditionType.ProductIn:
        case DiscountConditionType.DateBetween:
        case DiscountConditionType.TimeBetween:
        case DiscountConditionType.MaxUses:
        case DiscountConditionType.MaxUsesPerUser:
        case DiscountConditionType.WeekdayIn:
        case DiscountConditionType.CartLength:
        default:
          return 'div'
      }
    },
  },

  methods: {
    removeSelf() {
      this.$emit('remove')
    },

    changeConditionType(newType: DiscountConditionType) {
      switch (newType) {
        case DiscountConditionType.OrderValue:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_ORDER_VALUE_FORM))
        case DiscountConditionType.UserInRole:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_USER_IN_ROLE_FORM))
        case DiscountConditionType.UserIn:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_USER_IN_FORM))
        case DiscountConditionType.ProductInSet:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_PRODUCT_IN_SET_FORM))
        case DiscountConditionType.ProductIn:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_PRODUCT_IN_FORM))
        case DiscountConditionType.DateBetween:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_DATE_BETWEEN_FORM))
        case DiscountConditionType.TimeBetween:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_TIME_BETWEEN_FORM))
        case DiscountConditionType.MaxUses:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_MAX_USES_FORM))
        case DiscountConditionType.MaxUsesPerUser:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_MAX_USES_PER_USER_FORM))
        case DiscountConditionType.WeekdayIn:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_WEEKDAY_IN_FORM))
        case DiscountConditionType.CartLength:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_CART_LENGTH_FORM))
        default:
          throw new Error(`Unknown condition type: ${newType}`)
      }
    },
  },
})
</script>

<style lang="scss">
.condition-form {
  border: dashed 1px $background-color-700;
  border-radius: 4px;
  margin: 8px 0;
  padding: 8px;

  &:hover {
    background-color: $background-color-500;
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;

    > span {
      width: 100%;
      margin-right: 8px;
    }
  }

  &__row {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;

    > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
