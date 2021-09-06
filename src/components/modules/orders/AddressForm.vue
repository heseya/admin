<template>
  <div class="address-form">
    <validated-input v-model="form.name" rules="required" name="name" label="Imię i nazwisko" />
    <validated-input v-model="form.address" rules="required" name="address" label="Adres" />
    <div class="address-form__row">
      <validated-input v-model="form.zip" rules="required" name="address" label="Kod pocztowy" />
      <validated-input v-model="form.city" rules="required" name="address" label="Miasto" />
    </div>
    <ValidationProvider rules="required" tag="div" class="address-form__select">
      <app-select v-model="form.country" label="Kraj" show-search>
        <a-select-option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </a-select-option>
      </app-select>
    </ValidationProvider>
    <validated-input v-model="form.phone" rules="required" name="address" label="Telefon" />
    <validated-input v-model="form.vat" name="address" label="NIP" />
  </div>
</template>

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
    } = await api.get('/countries')
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

    ::v-deep .vs-select__label--label {
      transform: translateY(-28px) !important;
    }
  }
}
</style>
