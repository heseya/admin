<template>
  <div class="shipping-methods-form">
    <modal-form>
      <validation-provider rules="required" v-slot="{ errors }">
        <vs-input v-model="form.name" label="Nazwa">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <div class="center">
        <vs-select
          v-model="form.payment_methods"
          :key="paymentMethods.length"
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
          <switch-input v-model="form.public"> </switch-input>
        </flex-input>
      </div>

      <hr />

      <validation-provider ref="priceRange" rules="price-ranges-duplicates" v-slot="{ errors }">
        <PriceRangesForm v-model="form.price_ranges" :error="errors[0]" />
      </validation-provider>

      <hr />

      <h5>Wysyłka możliwa do</h5>
      <div class="center">
        <flex-input>
          <label class="title">Biała lista</label>
          <vs-switch color="#000" v-model="form.black_list" />
          <label class="title">Czarna lista</label>
        </flex-input>
      </div>

      <div class="center">
        <vs-select
          v-model="form.countries"
          :key="countries.length"
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

import ModalForm from '@/components/ModalForm.vue'
import SwitchInput from '@/components/SwitchInput.vue'
import FlexInput from '@/components/layout/FlexInput.vue'

import { ShippingMethodCountry, ShippingMethodDTO } from '@/interfaces/ShippingMethod'
import { PaymentMethod } from '@/interfaces/PaymentMethod'
import PriceRangesForm from './PriceRangesForm.vue'

export default Vue.extend({
  name: 'ShippingMethodsForm',
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ShippingMethodDTO>,
    countries: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ShippingMethodCountry[]>,
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
      return this.$store.getters['paymentMethods/getData']
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
  components: {
    ModalForm,
    FlexInput,
    ValidationProvider,
    SwitchInput,
    PriceRangesForm,
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
