<template>
  <div class="address-form">
    <validated-input rules="required" name="name" label="Imię i nazwisko" v-model="form.name" />
    <validated-input rules="required" name="address" label="Adres" v-model="form.address" />
    <div class="address-form__row">
      <validated-input rules="required" name="address" label="Kod pocztowy" v-model="form.zip" />
      <validated-input rules="required" name="address" label="Miasto" v-model="form.city" />
    </div>
    <validated-input rules="required" name="address" label="Kraj" v-model="form.country" />
    <validated-input rules="required" name="address" label="Telefon" v-model="form.phone" />
    <validated-input name="address" label="VAT" v-model="form.vat" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Address } from '@/interfaces/Address'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default Vue.extend({
  name: 'AddressForm',
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Address>,
  },
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
  components: {
    ValidatedInput,
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
}
</style>
