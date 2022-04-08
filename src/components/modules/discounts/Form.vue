<template>
  <modal-form>
    <validated-input
      v-model="form.code"
      :disabled="disabled"
      rules="required"
      :label="$t('form.code')"
    />
    <validated-input
      v-model="form.description"
      :disabled="disabled"
      :label="$t('common.form.description')"
    />

    <hr />

    <validated-input
      v-model="form.discount"
      :disabled="disabled"
      rules="required"
      :label="$t('form.discount')"
    />
    <ValidationProvider v-slot="{ errors }" rules="required">
      <app-select v-model="form.type" :disabled="disabled" :label="$t('form.type')">
        <a-select-option :value="0" :label="$t('types.percent')">
          {{ $t('types.percent') }}
        </a-select-option>
        <a-select-option :value="1" :label="$t('types.amount')">
          {{ $t('types.amount') }}
        </a-select-option>
        <template #error>{{ errors[0] }}</template>
      </app-select>
    </ValidationProvider>

    <hr />

    <validated-input
      v-model="form.max_uses"
      :disabled="disabled"
      rules="required"
      :label="$t('form.max_uses')"
    />

    <hr />

    <validated-input
      v-model="form.starts_at"
      rules="date-before:@expires_at"
      type="datetime-local"
      allow-clear
      :disabled="disabled"
      :label="$t('form.starts_at')"
    />
    <validated-input
      v-model="form.expires_at"
      name="expires_at"
      type="datetime-local"
      allow-clear
      :disabled="disabled"
      :label="$t('form.expires_at')"
    />
    <small>
      {{ $t('expiry_date_description') }}
    </small>
  </modal-form>
</template>

<i18n>
{
  "pl": {
    "form": {
      "code": "Kod",
      "discount": "Zniżka",
      "type": "Typ",
      "max_uses": "Maksymalna ilość użyć",
      "starts_at": "Ważny od",
      "expires_at": "Ważny do"
    },
    "types": {
      "percent": "Rabat procentowy",
      "amount": "Rabat kwotowy"
    },
    "expiry_date_description": "W przypadku braku podania dat, kod rabatowy będzie ważny bez ograniczeń czasowych."
  },
  "en": {
    "form": {
      "code": "Code",
      "discount": "Discount",
      "type": "Type",
      "max_uses": "Max uses",
      "starts_at": "Starts at",
      "expires_at": "Expires at"
    },
    "types": {
      "percent": "Percentage discount",
      "amount": "Amount discount"
    },
    "expiry_date_description": "If you don't enter dates, the code will be valid without any time limit."
  }
}
</i18n>

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
