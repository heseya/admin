<template>
  <div class="partial-update-form">
    <ValidationObserver v-slot="{ handleSubmit }">
      <div v-for="key in formKeys" :key="key">
        <address-form
          v-if="key === 'delivery_address' || key === 'invoice_address'"
          v-model="form[key]"
        />

        <validated-input
          v-else-if="key === 'email'"
          name="email"
          label="Adres e-mail"
          rules="required|email"
          v-model="form[key]"
        />

        <validated-input
          v-else-if="key === 'comment'"
          name="comment"
          label="Komentarz do zamówienia"
          v-model="form[key]"
        />
      </div>
      <vs-button dark @click="handleSubmit(save)">Zapisz</vs-button>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'

import { Order } from '@/interfaces/Order'
import AddressForm from './AddressForm.vue'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default Vue.extend({
  components: { AddressForm, ValidationObserver, ValidatedInput },
  name: 'PartialUpdateForm',
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Partial<Order>>,
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
  },
  methods: {
    save() {
      this.$emit('save', this.form)
    },
  },
})
</script>

<style lang="scss" scoped>
.partial-update-form {
}
</style>
