<template>
  <div class="shipping-methods-form">
    <modal-form>
      <validation-provider rules="required" v-slot="{ errors }">
        <vs-input v-model="form.name" label="Nazwa">
          <template #message-danger>{{ errors[0] }}</template>
        </vs-input>
      </validation-provider>
      <vs-input v-model="form.price" label="Cena" type="number" step="0.01" />
      <div class="center">
        <vs-select
          v-model="form.payment_methods"
          :key="paymentMethods.length"
          multiple
          filter
          collapse-chips
          label="Metody płatności"
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

      <hr />

      <div class="center">
        <flex-input>
          <label class="title">Biała lista</label>
          <switch-input v-model="form.black_list" />
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
      <br />
      <hr />

      <div class="center">
        <flex-input>
          <label class="title">Widoczność opcji dostawy</label>
          <switch-input v-model="form.public"> </switch-input>
        </flex-input>
      </div>
    </modal-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import ModalForm from '@/components/ModalForm.vue'
import SwitchInput from '@/components/SwitchInput.vue'
import FlexInput from '@/components/FlexInput.vue'

import { ShippingMethod } from '@/interfaces/ShippingMethod'
import { PaymentMethod } from '@/interfaces/PaymentMethod'

export default Vue.extend({
  name: 'ShippingMethodsForm',
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<ShippingMethod>,
    countries: {
      type: Array,
      required: true,
    } as Vue.PropOptions<any[]>,
  },
  data: () => ({
    countries: [] as any[],
  }),
  computed: {
    form: {
      get(): ShippingMethod {
        return this.value
      },
      set(value: ShippingMethod) {
        this.$emit('input', value)
      },
    },
    paymentMethods(): PaymentMethod[] {
      return this.$store.getters['paymentMethods/getData']
    },
  },
  components: {
    ModalForm,
    FlexInput,
    ValidationProvider,
    SwitchInput,
  },
})
</script>

<style lang="scss">
.shipping-methods-form {
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
