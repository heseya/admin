<template>
  <div class="order-customer-details">
    <field :label="$t('userSection')">
      <template #labelSuffix>
        <icon-button
          v-can="$p.Orders.Edit"
          size="small"
          type="transparent"
          class="section-edit-btn"
          @click="editEmail"
        >
          <template #icon>
            <i class="bx bxs-pencil"></i>
          </template>
        </icon-button>
      </template>

      <a :href="`mailto:${order.email}`" class="order-customer-details__email">{{ order.email }}</a>
    </field>

    <div class="order-customer-details__addresses">
      <EditableOrderAddress
        :title="$t('deliveryAddressSection')"
        :address="order.delivery_address"
        hide-remove
        @edit="editDeliveryAddress"
      />

      <EditableOrderAddress
        :title="$t('invoiceAddressSection')"
        :address="order.invoice_address"
        @edit="editInvoiceAddress"
        @remove="removeInvoiceAddress"
      />
    </div>

    <field
      :label="$t('commentSection')"
      class="comment-field"
      :class="{ 'comment-field--filled': !!order.comment }"
    >
      <template #labelSuffix>
        <icon-button
          v-can="$p.Orders.Edit"
          size="small"
          :type="order.comment ? 'transparent-white' : 'transparent'"
          class="section-edit-btn"
          @click="editComment"
        >
          <template #icon>
            <i class="bx bxs-pencil"></i>
          </template>
        </icon-button>
      </template>
      <span v-if="order.comment">{{ order.comment }}</span>
      <span v-else class="comment-field__empty">{{ $t('commentEmpty') }}</span>
    </field>

    <a-modal
      v-model="isEditModalActive"
      width="800px"
      :footer="null"
      :title="`${$t('common.edit')} ${modalFormTitle}`"
    >
      <modal-form>
        <partial-update-form v-model="form" @save="saveForm" />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "userSection": "User",
    "deliveryAddressSection": "Delivery address",
    "invoiceAddressSection": "Invoice address",
    "commentSection": "Comment",
    "editSuccess": "Order has been updated.",
    "editFailed": "Order has not been updated.",
    "commentEmpty": "-- No order comment --"
  },
  "pl": {
    "userSection": "Użytkownik",
    "deliveryAddressSection": "Adres dostawy",
    "invoiceAddressSection": "Adres do faktury",
    "commentSection": "Komentarz",
    "editSuccess": "Zamówienie zostało zaktualizowane.",
    "editFailed": "Zamówienie nie zostało zaktualizowane.",
    "commentEmpty": "-- Brak komentarza do zamówienia --"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Order } from '@heseya/store-core'

import Field from '../../Field.vue'
import EditableOrderAddress from './EditableOrderAddress.vue'
import PartialUpdateForm from './PartialUpdateForm.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import IconButton from '@/components/layout/IconButton.vue'

const DEFAULT_ADDRESS_FORM = {
  address: '',
  city: '',
  country: 'PL',
  country_name: '',
  name: '',
  phone: '',
  vat: '',
  zip: '',
}

export default Vue.extend({
  components: { Field, EditableOrderAddress, PartialUpdateForm, ModalForm, IconButton },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  data: () => ({
    isEditModalActive: false,
    modalFormTitle: '',
    form: {},
  }),
  methods: {
    editComment() {
      this.isEditModalActive = true
      this.modalFormTitle = this.$t('commentSection') as string
      this.form = {
        comment: this.order.comment,
      }
    },
    editEmail() {
      this.isEditModalActive = true
      this.modalFormTitle = this.$t('userSection') as string
      this.form = {
        email: this.order.email,
      }
    },
    editDeliveryAddress() {
      this.isEditModalActive = true
      this.modalFormTitle = (this.$t('deliveryAddressSection') as string).toLowerCase()
      this.form = {
        delivery_address: {
          ...this.order.delivery_address,
        },
      }
    },
    editInvoiceAddress() {
      this.isEditModalActive = true
      this.modalFormTitle = (this.$t('invoiceAddressSection') as string).toLowerCase()
      this.form = {
        invoice_address: {
          ...(this.order.invoice_address || DEFAULT_ADDRESS_FORM),
        },
      }
    },
    removeInvoiceAddress() {
      this.form = { invoice_address: null }
      this.saveForm()
    },
    async saveForm() {
      this.$accessor.startLoading()
      const success = await this.$accessor.orders.update({ id: this.order.id, item: this.form })

      this.isEditModalActive = false
      if (success) this.$toast.success(this.$t('editSuccess') as string)
      else this.$toast.error(this.$t('editFailed') as string)
      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.order-customer-details {
  &__addresses {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    margin-bottom: 12px;

    @media ($viewport-4) {
      grid-template-columns: 1fr 1fr;
    }

    @media ($viewport-10) {
      grid-template-columns: 1fr;
    }

    @media ($viewport-14) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__email {
    color: $font-color;

    &:hover {
      color: $primary-color-500;
    }
  }
}

.comment-field {
  border-radius: 6px;
  padding-bottom: 8px;

  &__empty {
    font-style: italic;
    color: $gray-color-600;
  }

  &--filled {
    background: $primary-color-500;

    :deep(.order-field__value, .order-field__label) {
      color: #fff;
    }
  }
}

.section-edit-btn {
  // position: absolute;
  top: 3px;
  color: $gray-color-500;
  right: 0;
}
</style>
