<template>
  <div class="address-form">
    <validated-input v-model="form.name" rules="required" name="name" :label="$t('name')" />
    <validated-input
      v-model="form.address"
      rules="required"
      name="address"
      :label="$t('address')"
    />
    <div class="address-form__row">
      <validated-input v-model="form.zip" rules="required" name="zip" :label="$t('zip')" />
      <validated-input v-model="form.city" rules="required" name="city" :label="$t('city')" />
    </div>
    <ValidationProvider rules="required" tag="div" class="address-form__select">
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
    </ValidationProvider>
    <validated-input v-model="form.phone" rules="required" name="phone" :label="$t('phone')" />
    <validated-input v-model="form.vat" name="vat" :label="$t('vat')" />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "name": "Imię i nazwisko",
    "address": "Adres",
    "zip": "Kod pocztowy",
    "city": "Miasto",
    "country": "Kraj",
    "phone": "Telefon",
    "vat": "NIP"
  },
  "en": {
    "name": "Name",
    "address": "Address",
    "zip": "Zip code",
    "city": "City",
    "country": "Country",
    "phone": "Phone",
    "vat": "VAT ID"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationProvider } from 'vee-validate'
import { Address, ShippingCountry } from '@heseya/store-core'

import { sdk } from '@/api'

export default defineComponent({
  name: 'AddressForm',
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: Object as PropType<Address>,
      required: true,
    },
  },
  data: () => ({
    countries: [] as ShippingCountry[],
  }),
  computed: {
    form: {
      get(): Address {
        return this.value
      },
      set(v: Address) {
        this.$emit('input', v)
      },
    },
    formKeys(): string[] {
      return Object.keys(this.form)
    },
  },
  async created() {
    this.countries = await sdk.ShippingMethods.getCountries()
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
