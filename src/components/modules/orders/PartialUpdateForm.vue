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
          :label="$t('email')"
          rules="required|email"
        />

        <validated-input
          v-else-if="key === 'comment'"
          v-model="form[key]"
          name="comment"
          :label="$t('comment')"
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
    "comment": "Komentarz do zamówienia"
  },
  "en": {
    "email": "Email address",
    "comment": "Order comment"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Order } from '@heseya/store-core'

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
