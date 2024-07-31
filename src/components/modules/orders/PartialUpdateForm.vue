<template>
  <div class="partial-update-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <div v-for="key in formKeys" :key="key">
        <validated-input
          v-if="key === 'email'"
          v-model="form[key]"
          name="email"
          :label="$t('email').toString()"
          rules="required|email"
        />

        <validated-input
          v-else-if="key === 'comment'"
          v-model="form[key]"
          name="comment"
          :label="$t('comment').toString()"
        />

        <app-select
          v-else-if="key === 'shipping_place' && orderShippingType === ShippingType.Point"
          v-model="form.shipping_place"
          option-filter-prop="label"
          :label="$t('choosePoint').toString()"
        >
          <a-select-option v-for="point in shippingPoints" :key="point.id" :label="point.name">
            {{ point.name }}
          </a-select-option>
        </app-select>

        <validated-input
          v-else-if="key === 'shipping_place' && orderShippingType === ShippingType.PointExternal"
          v-model="form[key]"
          name="shipping_place"
          rules="required"
        >
          <template #label>
            {{ $t('pointExternalId') }}
            <info-tooltip> {{ $t('pointExternalInfo') }}</info-tooltip>
          </template>
        </validated-input>
        <address-form
          v-else-if="(key === 'shipping_place' || key === 'billing_address') && form[key]"
          v-model="form[key]"
          :hide-vat="key !== 'billing_address'"
        />

        <switch-input
          v-else-if="key === 'invoice_requested'"
          v-model="form.invoice_requested"
          :label="$t('invoiceRequested').toString()"
          horizontal
        />
      </div>
      <app-button @click="handleSubmit(save)">{{ $t('common.save') }}</app-button>
    </ValidationObserver>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "email": "Adres e-mail",
    "comment": "Komentarz do zamówienia",
    "choosePoint": "Wybierz punkt",
    "pointExternalId": "Zewnętrzny identyfikator punktu",
    "pointExternalInfo": "Zewnętrzny identyfikator punktu może być używany przez integracje do nadawania paczek",
    "invoiceRequested": "Żądanie faktury"
  },
  "en": {
    "email": "Email address",
    "comment": "Order comment",
    "choosePoint": "Choose point",
    "pointExternalId": "External point ID",
    "pointExternalInfo": "External point ID can be used by integration to send parcels",
    "invoiceRequested": "Invoice requested"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Order, Address, OrderShippingMethod, ShippingType } from '@heseya/store-core'

import AddressForm from './AddressForm.vue'

export default defineComponent({
  name: 'PartialUpdateForm',
  components: { AddressForm, ValidationObserver },
  props: {
    value: {
      type: Object as PropType<Partial<Order>>,
      required: true,
    },
    shippingMethod: {
      type: Object as PropType<OrderShippingMethod | undefined>,
      default: () => {},
    },
  },
  computed: {
    form: {
      get(): Partial<Order> {
        return this.value
      },
      set(v: Partial<Order>) {
        this.$emit('input', v)
      },
    },
    formKeys(): string[] {
      return Object.keys(this.form)
    },
    ShippingType(): typeof ShippingType {
      return ShippingType
    },
    orderShippingType(): ShippingType | undefined {
      return this.shippingMethod?.shipping_type
    },
    shippingPoints(): Address[] {
      return (
        this.$accessor.shippingMethods.data.find((method) => method.id === this.shippingMethod?.id)
          ?.shipping_points ?? []
      )
    },
  },
  created() {
    this.$accessor.shippingMethods.fetch()
  },
  methods: {
    save() {
      this.$emit('save', this.form)
    },
  },
})
</script>
