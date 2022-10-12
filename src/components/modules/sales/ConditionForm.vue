<template>
  <div class="condition-form">
    <div class="condition-form__header">
      <h3 class="condition-form__heading">{{ $t('condition', { number }) }}</h3>
      <icon-button :disabled="disabled" type="danger" size="small" @click="removeSelf()">
        {{ $t('remove') }}
        <template #icon>
          <i class="bx bx-trash"></i>
        </template>
      </icon-button>
    </div>

    <div class="condition-form__content">
      <ValidationProvider v-slot="{ errors }" rules="required">
        <app-select
          :value="condition.type"
          :disabled="disabled"
          :label="$t('type')"
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
      <component
        :is="formComponent"
        :key="condition.type"
        v-model="condition"
        :disabled="disabled"
        :type="condition.type"
      >
        {{ condition }}
      </component>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "type": "Condition type",
    "remove": "Remove condition",
    "condition": "Condition {number}",
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
      "cart-length": "Cart size",
      "coupons-count": "Coupons count"
    }
  },
  "pl": {
    "type": "Typ warunku",
    "remove": "Usuń warunek",
    "condition": "Warunek {number}",
    "discountConditionTypes": {
      "order-value": "Wartość zamówienia",
      "user-in-role": "Użytkownik należący do roli",
      "user-in": "Grupa użytkowników",
      "product-in-set": "Produkt w kolekcji",
      "product-in": "Grupa produktów",
      "date-between": "Data pomiędzy",
      "time-between": "Godzina pomiędzy",
      "max-uses": "Maksymalna liczba użyć",
      "max-uses-per-user": "Maksymalna liczba użyć na użytkownika",
      "weekday-in": "Dzień tygodnia",
      "cart-length": "Wielkość koszyka",
      "coupons-count": "Ilość kuponów"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider } from 'vee-validate'
import { DiscountConditionDto, DiscountConditionType } from '@heseya/store-core'

import OrderValueForm from './forms/OrderValueForm.vue'
import MaxUsesForm from './forms/MaxUsesForm.vue'
import CartCouponsForm from './forms/CartCouponsForm.vue'
import DateBetweenForm from './forms/DateBetweenForm.vue'
import TimeBetweenForm from './forms/TimeBetweenForm.vue'
import WeekdayInForm from './forms/WeekdayInForm.vue'
import EntitiesForm from './forms/EntitiesForm.vue'

import * as SALES_FORMS from '@/consts/salesConditionsForms'

export default Vue.extend({
  components: {
    ValidationProvider,
    OrderValueForm,
    MaxUsesForm,
    CartCouponsForm,
    DateBetweenForm,
    TimeBetweenForm,
    WeekdayInForm,
    EntitiesForm,
  },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<DiscountConditionDto>,
    disabled: { type: Boolean, default: false },
    number: { type: Number, required: true },
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
        case DiscountConditionType.MaxUses:
        case DiscountConditionType.MaxUsesPerUser:
          return 'MaxUsesForm'
        case DiscountConditionType.CartLength:
        case DiscountConditionType.CouponsCount:
          return 'CartCouponsForm'
        case DiscountConditionType.DateBetween:
          return 'DateBetweenForm'
        case DiscountConditionType.TimeBetween:
          return 'TimeBetweenForm'
        case DiscountConditionType.WeekdayIn:
          return 'WeekdayInForm'
        case DiscountConditionType.UserInRole:
        case DiscountConditionType.UserIn:
        case DiscountConditionType.ProductInSet:
        case DiscountConditionType.ProductIn:
          return 'EntitiesForm'
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
        case DiscountConditionType.CouponsCount:
          return (this.condition = cloneDeep(SALES_FORMS.EMPTY_COUPONS_COUNT_FORM))
        default:
          throw new Error(`Unknown condition type: ${newType}`)
      }
    },
  },
})
</script>

<style lang="scss">
.condition-form {
  border: solid 1px var(--gray-color-300);
  background-color: white;
  border-radius: 4px;
  padding: 8px;

  &__heading {
    font-size: 14px;
    line-height: 17px;
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span {
      width: 100%;
      margin-right: 8px;
    }
  }

  .switch-input {
    flex-direction: row;

    & > * ~ * {
      margin-left: 14px;
    }
  }

  &__row {
    display: flex;
    align-items: flex-start;

    > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
