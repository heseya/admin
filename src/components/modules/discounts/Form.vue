<template>
  <modal-form>
    <validated-input v-model="form.code" :disabled="disabled" rules="required" label="Kod" />
    <validated-input v-model="form.description" :disabled="disabled" label="Opis" />

    <hr />

    <validated-input v-model="form.discount" :disabled="disabled" rules="required" label="Zniżka" />
    <ValidationProvider v-slot="{ errors }" rules="required">
      <app-select v-model="form.type" :disabled="disabled" label="Typ">
        <a-select-option :value="0">Rabat Procentowy</a-select-option>
        <a-select-option :value="1">Rabat Kwotowy</a-select-option>
        <template #error>{{ errors[0] }}</template>
      </app-select>
    </ValidationProvider>

    <hr />

    <validated-input
      v-model="form.max_uses"
      :disabled="disabled"
      rules="required"
      label="Maksymalna ilość użyć"
    />

    <hr />

    <validated-input
      v-model="form.starts_at"
      rules="date-before:@expires_at"
      type="datetime-local"
      allow-clear
      :disabled="disabled"
      label="Ważny od"
    />
    <validated-input
      v-model="form.expires_at"
      name="expires_at"
      type="datetime-local"
      allow-clear
      :disabled="disabled"
      label="Ważny do"
    />
    <small>
      W przypadku braku podania dat, kod rabatowy będzie ważny bez ograniczeń czasowych.
    </small>
  </modal-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

import ModalForm from '@/components/form/ModalForm.vue'
import { DiscountCode } from '@/interfaces/DiscountCode'
import ValidatedInput from '@/components/form/ValidatedInput.vue'

export default Vue.extend({
  components: {
    ModalForm,
    ValidationProvider,
    ValidatedInput,
  },
  props: {
    value: {
      type: Object,
      required: true,
    } as Vue.PropOptions<DiscountCode>,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form: {
      get(): DiscountCode {
        return this.value
      },
      set(discount: DiscountCode) {
        this.$emit('input', discount)
      },
    },
  },
})
</script>
