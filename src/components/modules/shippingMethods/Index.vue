<template>
  <div class="shipping-methods-form">
    <modal-form>
      <validated-input v-model="form.name" :disabled="disabled" rules="required" label="Nazwa" />
      <div class="center">
        <app-select
          v-model="form.payment_methods"
          :disabled="disabled"
          mode="multiple"
          option-filter-prop="label"
          label="Dostępne metody płatności"
        >
          <a-select-option v-for="method in paymentMethods" :key="method.id" :label="method.name">
            {{ method.name }}
          </a-select-option>
        </app-select>
      </div>

      <div class="center">
        <flex-input>
          <label class="title">Widoczność opcji dostawy</label>
          <switch-input v-model="form.public" :disabled="disabled"> </switch-input>
        </flex-input>
      </div>

      <hr />

      <validation-provider ref="priceRange" v-slot="{ errors }" rules="price-ranges-duplicates">
        <PriceRangesForm v-model="form.price_ranges" :disabled="disabled" :error="errors[0]" />
      </validation-provider>

      <hr />

      <h5>Czas dostawy</h5>
      <div class="row">
        <validated-input
          v-model="form.shipping_time_min"
          type="number"
          min="0"
          name="shipping_time_min"
          :disabled="disabled"
          rules="not-negative|less-than:@shipping_time_max"
          label="Minimalna ilość dni dostawy"
        />
        <validated-input
          v-model="form.shipping_time_max"
          type="number"
          min="0"
          name="shipping_time_max"
          :disabled="disabled"
          rules="not-negative"
          label="Maksymalna ilość dni dostawy"
        />
      </div>

      <hr />

      <h5>Wysyłka możliwa do</h5>
      <div class="center">
        <flex-input>
          <label class="title">Biała lista</label>
          <a-switch v-model="form.black_list" :disabled="disabled" />
          <label class="title">Czarna lista</label>
        </flex-input>
      </div>

      <div class="center">
        <app-select
          v-model="form.countries"
          :disabled="disabled"
          mode="multiple"
          label="Kraje"
          option-filter-prop="label"
        >
          <a-select-option v-for="country in countries" :key="country.code" :label="country.name">
            {{ country.name }}
          </a-select-option>
        </app-select>
      </div>
    </modal-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import SwitchInput from '@/components/form/SwitchInput.vue'
import FlexInput from '@/components/layout/FlexInput.vue'

import { ShippingMethodCountry, ShippingMethodDTO } from '@/interfaces/ShippingMethod'
import { PaymentMethod } from '@/interfaces/PaymentMethod'
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
    } as Vue.PropOptions<ShippingMethodDTO>,
    countries: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ShippingMethodCountry[]>,
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    form: {
      get(): ShippingMethodDTO {
        return this.value
      },
      set(value: ShippingMethodDTO) {
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
    background-color: $background-color-600;
  }
  .ant-switch-checked {
    background-color: #000000;
  }
}
</style>
