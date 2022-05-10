<template>
  <div class="address-form">
    <validation-observer v-slot="{ handleSubmit }" ref="observer">
      <form @submit.prevent="handleSubmit(addPoint)" @reset.prevent="reset">
        <div class="address-form__row">
          <validated-input
            v-model="form.name"
            name="name"
            :label="$t('name')"
            :rules="{
              required: validate,
              'shipping-points-duplicates': [shippingPoints],
            }"
          />
          <validated-input v-model="form.phone" name="phone" :label="$t('phone')" />
        </div>
        <div class="address-form__row">
          <validated-input v-model="form.vat" name="vat" :label="$t('vat')" />
          <validated-input v-model="form.address" name="address" :label="$t('address')" />
        </div>

        <div class="address-form__row">
          <validated-input v-model="form.zip" name="zip" :label="$t('zip')" />
          <validated-input
            v-model="form.city"
            name="city"
            :label="$t('city')"
            :rules="{
              required: validate,
            }"
          />
        </div>

        <div class="address-form__select">
          <app-select
            v-model="form.country"
            :label="$t('country')"
            show-search
            option-filter-prop="label"
          >
            <a-select-option v-for="country in countries" :key="country.code" :label="country.name">
              {{ country.name }}
            </a-select-option>
          </app-select>
        </div>
        <app-button html-type="submit">
          {{ $t('addPoint') }}
        </app-button>
      </form>
    </validation-observer>
  </div>
</template>

<i18n>
{
  "pl": {
    "name": "Nazwa",
    "address": "Adres",
    "zip": "Kod pocztowy",
    "city": "Miasto",
    "country": "Kraj",
    "phone": "Telefon",
    "vat": "NIP",
    "addPoint":"Dodaj",
    "successMessage": "Dodano nowy punkt dostawy"
  },
  "en": {
    "name": "Name",
    "address": "Address",
    "zip": "Zip code",
    "city": "City",
    "country": "Country",
    "phone": "Phone",
    "vat": "VAT",
    "addPoint":"Add",
    "successMessage": "Added new shipping point"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import { AddressDto } from '@/interfaces/Address'
import { ShippingMethodCountry } from '@/interfaces/ShippingMethod'

export const CLEAR_POINT_FORM: AddressDto = {
  name: '',
  address: '',
  vat: '',
  zip: '',
  city: '',
  country: '',
  phone: '',
}

export default Vue.extend({
  name: 'AddressForm',
  components: { ValidationObserver },
  props: {
    countries: {
      type: Array,
      required: true,
    } as Vue.PropOptions<ShippingMethodCountry[]>,
    shippingPoints: {
      type: Array,
      required: true,
    } as Vue.PropOptions<AddressDto[]>,
    validate: {
      type: Boolean,
      required: true,
    } as Vue.PropOptions<boolean>,
  },
  data: () => ({
    form: { ...CLEAR_POINT_FORM },
  }),
  methods: {
    reset() {
      this.form = { ...CLEAR_POINT_FORM }
      // @ts-ignore
      this.$refs.observer.reset()
    },
    addPoint() {
      this.$emit('added', this.form)
      this.$toast.success(this.$t('successMessage') as string)
      this.reset()
    },
  },
})
</script>

<style lang="scss" scoped>
.address-form {
  &__row {
    width: 100%;
    display: flex;
    justify-content: space-between;

    > * {
      width: 100%;

      &:not(:first-child) {
        margin-left: 16px;
      }
    }
  }

  &__select {
    position: relative;
    margin-bottom: 32px;
  }
}
</style>
