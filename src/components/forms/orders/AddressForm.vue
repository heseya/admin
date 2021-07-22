<template>
  <div class="address-form">
    <validated-input rules="required" name="name" label="Imię i nazwisko" v-model="form.name" />
    <validated-input rules="required" name="address" label="Adres" v-model="form.address" />
    <div class="address-form__row">
      <validated-input rules="required" name="address" label="Kod pocztowy" v-model="form.zip" />
      <validated-input rules="required" name="address" label="Miasto" v-model="form.city" />
    </div>
    <ValidationProvider rules="required" tag="div" class="address-form__select">
      <vs-select v-model="form.country" label="Kraj" :key="countries.length" filter>
        <vs-option
          v-for="country in countries"
          :key="country.code"
          :label="country.name"
          :value="country.code"
        >
          {{ country.name }}
        </vs-option>
      </vs-select>
    </ValidationProvider>
    <validated-input rules="required" name="address" label="Telefon" v-model="form.phone" />
    <validated-input name="address" label="NIP" v-model="form.vat" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import { Address } from '@/interfaces/Address'
import { Country } from '@/interfaces/Country'
import ValidatedInput from '@/components/form/ValidatedInput.vue'
import { api } from '@/api'

export default Vue.extend({
  name: 'AddressForm',
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
  components: {
    ValidatedInput,
    ValidationProvider,
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
