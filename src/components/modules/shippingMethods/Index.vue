<template>
  <div class="shipping-methods-form">
    <modal-form>
      <validated-input v-model="form.name" :disabled="disabled" rules="required" label="Nazwa" />
      <div class="center">
        <vs-select
          :key="paymentMethods.length"
          v-model="form.payment_methods"
          :disabled="disabled"
          multiple
          filter
          collapse-chips
          label="Dostępne metody płatności"
        >
          <vs-option
            v-for="method in paymentMethods"
            :key="method.id"
            :value="method.id"
            :label="method.name"
          >
            {{ method.name }}
          </vs-option>
        </vs-select>
      </div>
      <br />
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

      <h5>Wysyłka możliwa do</h5>
      <div class="center">
        <flex-input>
          <label class="title">Biała lista</label>
          <vs-switch v-model="form.black_list" :disabled="disabled" color="#000" />
          <label class="title">Czarna lista</label>
        </flex-input>
      </div>

      <div class="center">
        <vs-select
          :key="countries.length"
          v-model="form.countries"
          :disabled="disabled"
          multiple
          filter
          collapse-chips
          label="Kraje"
        >
          <vs-option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
            :label="country.name"
          >
            {{ country.name }}
          </vs-option>
        </vs-select>
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
      handler(v) {
        // @ts-ignore
        this.$refs.priceRange.validate()
      },
    },
  },
})
</script>

<style lang="scss">
.shipping-methods-form {
  margin-bottom: 24px;

  .flex-input {
    margin-bottom: 12px;
  }

  .switch-input {
    margin-top: 0;
  }

  label.title {
    margin: 0 6px;
  }
}
</style>
