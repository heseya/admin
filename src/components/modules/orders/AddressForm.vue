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
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import { Address } from '@/interfaces/Address'
import { Country } from '@/interfaces/Country'
import { api } from '@/api'

export default Vue.extend({
  name: 'AddressForm',
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Address>,
  },
  data: () => ({
    countries: [] as Country[],
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
    const {
      data: { data: countries },
    } = await api.get<{ data: Country[] }>('/countries')
    this.countries = countries
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
