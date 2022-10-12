<template>
  <div class="shipping-methods-form">
    <modal-form>
      <validated-input
        v-model="form.name"
        :disabled="disabled"
        rules="required"
        :label="$t('common.form.name')"
      />
      <div class="center">
        <app-select
          v-model="form.payment_methods"
          :disabled="disabled"
          mode="multiple"
          option-filter-prop="label"
          :label="$t('form.paymentMethods')"
        >
          <a-select-option v-for="method in paymentMethods" :key="method.id" :label="method.name">
            {{ method.name }}
          </a-select-option>
        </app-select>
      </div>

      <div class="center">
        <flex-input>
          <label class="title">{{ $t('form.public') }}</label>
          <switch-input v-model="form.public" :disabled="disabled"> </switch-input>
        </flex-input>
      </div>

      <hr />

      <validation-provider ref="priceRange" v-slot="{ errors }" rules="price-ranges-duplicates">
        <PriceRangesForm v-model="form.price_ranges" :disabled="disabled" :error="errors[0]" />
      </validation-provider>

      <hr />

      <h5>{{ $t('form.deliveryTime') }}</h5>
      <div class="row">
        <validated-input
          v-model="form.shipping_time_min"
          type="number"
          min="0"
          name="shipping_time_min"
          :disabled="disabled"
          rules="not-negative|less-than:@shipping_time_max"
          :label="$t('form.minDeliveryDays')"
        />
        <validated-input
          v-model="form.shipping_time_max"
          type="number"
          min="0"
          name="shipping_time_max"
          :disabled="disabled"
          rules="not-negative"
          :label="$t('form.maxDeliveryDays')"
        />
      </div>

      <hr />

      <h5>{{ $t('form.deliveryRegions') }}</h5>
      <div class="center">
        <flex-input>
          <label class="title">{{ $t('common.allowList') }}</label>
          <a-switch v-model="form.block_list" :disabled="disabled" />
          <label class="title">{{ $t('common.blockList') }}</label>
        </flex-input>
      </div>
      <div class="center">
        <validated-select
          v-model="form.countries"
          :options="countries"
          option-key="code"
          :disabled="disabled"
          mode="multiple"
          :label="$t('form.countries')"
          option-filter-prop="label"
          :rules="{ required: !form.block_list && form.countries.length === 0 }"
        />
      </div>
    </modal-form>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "form": {
      "paymentMethods": "Dostępne metody płatności",
      "public": "Widoczność opcji dostawy",
      "deliveryTime": "Czas dostawy",
      "minDeliveryDays": "Minimalna ilość dni dostawy",
      "maxDeliveryDays": "Maksymalna ilość dni dostawy",
      "deliveryRegions": "Wysyłka możliwa do",
      "countries": "Kraje"
    }
  },
  "en": {
    "form": {
      "paymentMethods": "Available payment methods",
      "public": "Shipping option visibility",
      "deliveryTime": "Delivery time",
      "minDeliveryDays": "Minimal number of days of delivery",
      "maxDeliveryDays": "Maximum number of days of delivery",
      "deliveryRegions": "Delivery is possible to",
      "countries": "Countries"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import { PaymentMethod, ShippingCountry, ShippingMethodCreateDto } from '@heseya/store-core'

import ModalForm from '@/components/form/ModalForm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import FlexInput from '@/components/layout/FlexInput.vue'

import PriceRangesForm from './PriceRangesForm.vue'

export default Vue.extend({
  name: 'ShippingMethodsForm',
  components: {
    ModalForm,
    FlexInput,
    ValidationProvider,
    SwitchInput,
    PriceRangesForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ShippingMethodCreateDto>,
    countries: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ShippingCountry[]>,
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    form: {
      get(): ShippingMethodCreateDto {
        return this.value
      },
      set(value: ShippingMethodCreateDto) {
        this.$emit('input', value)
      },
    },
    paymentMethods(): PaymentMethod[] {
      return this.$accessor.paymentMethods.getData
    },
  },
  watch: {
    'form.price_ranges': {
      deep: true,
      handler() {
        // @ts-ignore
        this.$refs.priceRange.validate()
      },
    },
  },
})
</script>

<style lang="scss">
.shipping-methods-form {
  .switch-input {
    margin-top: 0;
  }

  label.title {
    margin: 0 6px;
  }

  .ant-switch {
    background-color: var(--background-color-600);
  }
  .ant-switch-checked {
    background-color: var(--black-color);
  }
}
</style>
