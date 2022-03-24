<template>
  <div class="sale-configurator">
    <validated-input v-model="form.name" :disabled="disabled" :label="$t('common.form.name')" />

    <validated-input
      v-model="form.description"
      :disabled="disabled"
      :label="$t('common.form.description')"
    />

    <hr />

    <ValidationProvider v-slot="{ errors }" rules="required">
      <app-select v-model="form.type" :disabled="disabled" :label="$t('common.form.type')">
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
      :label="$t('form.priority')"
    />

    <hr />

    condition_groups:
    {{ form.condition_groups }}

    <hr />

    target_type: {{ form.target_type }} <br />
    target_products: {{ form.target_products }} <br />
    target_sets: {{ form.target_sets }} <br />
    target_is_allow_list: {{ form.target_is_allow_list }} <br />
  </div>
</template>

<i18n>
{
  "pl": {
    "form": {
      "code": "Kod",
      "discount": "Wartość zniżki",
      "priority": "Priorytet"
    },
    "types": {
      "percent": "Rabat procentowy",
      "amount": "Rabat kwotowy"
    }
  },
  "en": {
    "form": {
      "code": "Code",
      "discount": "Discount value",
      "priority": "Priority"
    },
    "types": {
      "percent": "Percentage discount",
      "amount": "Amount discount"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import { DiscountType, SaleDto } from '@/interfaces/SalesAndCoupons'

export default Vue.extend({
  components: { ValidationProvider },
  props: {
    value: { type: Object, required: true } as Vue.PropOptions<SaleDto>,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    DiscountType(): typeof DiscountType {
      return DiscountType
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
}
</style>
