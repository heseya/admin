<template>
  <div class="partial-update-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <div v-for="key in formKeys" :key="key">
        <validated-input
          v-if="key === 'email'"
          v-model="form[key]"
          name="email"
          :label="$t('email')"
          rules="required|email"
        />

        <validated-input
          v-else-if="key === 'comment'"
          v-model="form[key]"
          name="comment"
          :label="$t('comment')"
        />
        <app-select
          v-else-if="key === 'shipping_place' && shippingType === ShippingType.Point"
          v-model="form.shipping_place"
          option-filter-prop="label"
          :label="$t('choosePoint')"
        >
          <a-select-option v-for="point in shippingPoints" :key="point.id" :label="point.name">
            {{ point.name }}
          </a-select-option>
        </app-select>

        <validated-input
          v-else-if="key === 'shipping_place' && shippingType === ShippingType.PointExternal"
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
          v-else-if="key === 'shipping_place' || key === 'billing_address'"
          v-model="form[key]"
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
    "choosePoint":"Wybierz punkt",
    "pointExternalId": "Zewnętrzny identyfikator punktu",
    "pointExternalInfo": "Zewnętrzny identyfikator punktu może być używany przez integracje do nadawania paczek"
  },
  "en": {
    "email": "Email address",
    "comment": "Order comment",
    "choosePoint":"Choose point",
    "pointExternalId": "External point ID",
    "pointExternalInfo": "External point ID can be used by integration to send parcels"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Order } from '@heseya/store-core'

import AddressForm from './AddressForm.vue'
import { AddressDto } from '@/interfaces/Address'
import { ShippingMethod, ShippingType } from '@/interfaces/ShippingMethod'

export default Vue.extend({
  name: 'PartialUpdateForm',
  components: { AddressForm, ValidationObserver },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Partial<Order>>,
    shippingMethod: {
      type: Object,
      default: () => {},
    } as Vue.PropOptions<ShippingMethod>,
    shippingType: {
      type: String,
      default: () => null,
    } as Vue.PropOptions<ShippingType>,
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
    shippingPoints(): AddressDto[] {
      return this.shippingMethod.shipping_points
    },
  },
  methods: {
    save() {
      this.$emit('save', this.form)
    },
  },
})
</script>
