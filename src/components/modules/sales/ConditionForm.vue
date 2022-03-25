<template>
  <div class="condition-form">
    <div class="condition-form__header">
      <ValidationProvider v-slot="{ errors }" rules="required">
        <app-select v-model="condition.type" :disabled="disabled" :label="$t('common.form.type')">
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
      {{ condition }}
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
      "max-user-per-user": "Max uses per user",
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
      "max-user-per-user": "Maksymalna liczba użyć na użytkownika",
      "weekday-in": "Dzień tygodnia",
      "cart-length": "Wielkość koszyka"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import { DiscountConditionDto, DiscountConditionType } from '@/interfaces/SaleCondition'

export default Vue.extend({
  components: { ValidationProvider },
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
  },
  methods: {
    removeSelf() {
      this.$emit('remove')
    },
  },
})
</script>

<style lang="scss" scoped>
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
}
</style>
