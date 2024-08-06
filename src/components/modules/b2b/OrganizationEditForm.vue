<template>
  <validation-observer v-slot="{ handleSubmit }">
    <a-modal :visible="visible" width="600px" @cancel="close">
      <template #title> {{ isNew ? $t('newTitle') : $t('editTitle') }} </template>

      <modal-form>
        <validated-input
          v-model="form.client_id"
          name="client_id"
          type="input"
          rules="required"
          :label="$t('form.client_id').toString()"
        />
        <validated-input
          v-model="form.billing_email"
          name="billing_email"
          type="input"
          rules="required"
          :label="$t('form.billing_email').toString()"
        />
        <hr />
        <h4>{{ $t('form.billing_address') }}</h4>
        <AddressForm v-model="form.billing_address" />
        <hr />
        <AutocompleteInput
          v-model="form.sales_channel_id"
          prop-mode="id"
          mode="default"
          model-url="sales-channels"
          :label="$t('form.sales_channel_id').toString()"
        />
        <hr />
        <h4>{{ $t('form.consents') }}</h4>
        <OrganizationConsentsForm v-model="form.consents" />
      </modal-form>
      <template #footer>
        <div class="row">
          <app-button html-type="button" type="white" data-cy="cancel-btn" @click="close">
            {{ $t('common.cancel') }}
          </app-button>
          <app-button data-cy="save-btn" type="primary" @click="handleSubmit(saveB2BCompany)">
            {{ isNew ? $t('common.add') : $t('common.save') }}
          </app-button>
        </div>
      </template>
    </a-modal>
  </validation-observer>
</template>

<i18n lang="json">
{
  "pl": {
    "newTitle": "Dodaj organizację",
    "editTitle": "Edytuj organizację",
    "form": {
      "client_id": "ID Klienta",
      "billing_email": "Adres email do wysyłania faktur",
      "billing_address": "Adres rozliczeniowy",
      "consents": "Zgody organizacji",
      "sales_channel_id": "Kanał sprzedaży"
    },
    "alerts": {
      "created": "Organizacja została dodana",
      "updated": "Organizacja została zaktualizowana"
    }
  },
  "en": {
    "newTitle": "Add organization",
    "editTitle": "Edit organization",
    "form": {
      "client_id": "Client ID",
      "billing_email": "Billing email",
      "billing_address": "Billing address",
      "consents": "Organization consents",
      "sales_channel_id": "Sales channel"
    },
    "alerts": {
      "created": "Organization has been created",
      "updated": "Organization has been updated"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidationObserver } from 'vee-validate'
import { Organization, OrganizationUpdateDto, OrganizationCreateDto } from '@heseya/store-core'
import { cloneDeep } from 'lodash'

import ModalForm from '@/components/form/ModalForm.vue'
import AddressForm from '@/components/modules/orders/AddressForm.vue'
import OrganizationConsentsForm from './OrganizationConsentsForm.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'

const CLEAR_FORM: OrganizationUpdateDto & OrganizationCreateDto = {
  client_id: '',
  billing_email: '',
  billing_address: { ...DEFAULT_ADDRESS_FORM },
  sales_channel_id: '',
  consents: {},
  shipping_addresses: [],
}

export default defineComponent({
  components: {
    ValidationObserver,
    ModalForm,
    AddressForm,
    AutocompleteInput,
    OrganizationConsentsForm,
  },
  props: {
    initialValue: {
      type: Object as PropType<Organization>,
      default: () => ({}),
    },
    visible: { type: Boolean, default: false },
  },

  data: () => ({
    form: cloneDeep(CLEAR_FORM) as OrganizationUpdateDto & OrganizationCreateDto,
  }),

  computed: {
    isNew(): boolean {
      return !this.initialValue?.id
    },
  },

  watch: {
    visible: {
      immediate: true,
      handler(visible) {
        if (visible) {
          this.form = {
            ...cloneDeep(CLEAR_FORM),
            ...cloneDeep(this.initialValue),
            consents:
              this.initialValue?.consents?.reduce((acc, c) => ({ ...acc, [c.id]: c.value }), {}) ||
              {},
            sales_channel_id: this.initialValue?.sales_channel?.id,
          }
        }
      },
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async saveB2BCompany() {
      this.$accessor.startLoading()
      const success = this.isNew
        ? await this.$accessor.b2bOrganizations.add({
            ...this.form,
            shipping_addresses: [
              { id: '', name: 'Default', address: this.form.billing_address, default: true },
            ],
          })
        : await this.$accessor.b2bOrganizations.update({
            id: this.initialValue.id,
            item: this.form,
          })
      this.$accessor.stopLoading()

      if (success) {
        if (this.isNew) this.$toast.success(this.$t('alerts.created') as string)
        else this.$toast.success(this.$t('alerts.updated') as string)
        this.$emit('saved', success)
        this.close()
      }
    },
  },
})
</script>
