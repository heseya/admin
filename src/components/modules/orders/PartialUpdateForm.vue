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
          v-model="form[key]"
          name="email"
          label="Adres e-mail"
          rules="required|email"
        />

        <validated-input
          v-else-if="key === 'comment'"
          v-model="form[key]"
          name="comment"
          label="Komentarz do zamówienia"
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

export default Vue.extend({
  name: 'PartialUpdateForm',
  components: { AddressForm, ValidationObserver },
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
