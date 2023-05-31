<template>
  <div class="order-customer-details">
    <field v-if="order.buyer" :label="$t('userSection')">
      <order-buyer :buyer="order.buyer" />
    </field>

    <field :label="$t('emailSection')">
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
        :order="order"
        :hide-edit="order.shipping_place === null"
        @edit="editShippingAddress"
      />

      <EditableOrderAddress
        :title="$t('invoiceAddressSection')"
        :order="order"
        billing
        @edit="editBillingAddress"
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
      :title="`${$t('common.edit')} ${modalFormTitle.toLowerCase()}`"
    >
      <modal-form>
        <partial-update-form
          v-model="form"
          :shipping-method="order.shipping_method || undefined"
          @save="saveForm"
        />
      </modal-form>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "emailSection": "E-mail address",
    "userSection": "Buyer",
    "deliveryAddressSection": "Delivery address",
    "invoiceAddressSection": "Billing address",
    "commentSection": "Comment",
    "editSuccess": "Order has been updated.",
    "editFailed": "Order has not been updated.",
    "commentEmpty": "-- No order comment --"
  },
  "pl": {
    "emailSection": "Adres e-mail",
    "userSection": "Kupujący",
    "deliveryAddressSection": "Adres dostawy",
    "invoiceAddressSection": "Adres rozliczeniowy",
    "commentSection": "Komentarz",
    "editSuccess": "Zamówienie zostało zaktualizowane.",
    "editFailed": "Zamówienie nie zostało zaktualizowane.",
    "commentEmpty": "-- Brak komentarza do zamówienia --"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Address, Order, OrderUpdateDto, ShippingType } from '@heseya/store-core'

import Field from '@/components/Field.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import IconButton from '@/components/layout/IconButton.vue'

import EditableOrderAddress from './EditableOrderAddress.vue'
import PartialUpdateForm from './PartialUpdateForm.vue'
import OrderBuyer from './OrderBuyer.vue'

import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'

export default defineComponent({
  components: { Field, EditableOrderAddress, PartialUpdateForm, ModalForm, IconButton, OrderBuyer },
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  data: () => ({
    isEditModalActive: false,
    modalFormTitle: '',
    form: {} as OrderUpdateDto,
  }),
  computed: {
    ShippingType(): typeof ShippingType {
      return ShippingType
    },
  },
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
      this.modalFormTitle = this.$t('emailSection') as string
      this.form = {
        email: this.order.email,
      }
    },
    editShippingAddress() {
      this.isEditModalActive = true
      this.modalFormTitle = (this.$t('deliveryAddressSection') as string).toLowerCase()
      switch (this.order.shipping_method?.shipping_type) {
        case ShippingType.Address:
          this.form = {
            shipping_place: {
              ...(this.order.shipping_place as Address),
            },
          }
          break
        case ShippingType.Point:
          this.form = {
            shipping_place: (this.order.shipping_place as Address).id,
          }
          break
        case ShippingType.PointExternal:
          this.form = {
            shipping_place: this.order.shipping_place,
          }
          break
      }
    },
    editBillingAddress() {
      this.isEditModalActive = true
      this.modalFormTitle = (this.$t('invoiceAddressSection') as string).toLowerCase()
      this.form = {
        billing_address: {
          ...(this.order.billing_address || DEFAULT_ADDRESS_FORM),
        },
        invoice_requested: this.order.invoice_requested,
      }
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
    color: var(--font-color);

    &:hover {
      color: var(--primary-color-500);
    }
  }
}

.comment-field {
  border-radius: 6px;
  padding-bottom: 8px;

  &__empty {
    font-style: italic;
    color: var(--gray-color-600);
  }

  &--filled {
    background: var(--primary-color-500);

    :deep(.field__value, .field__label) {
      color: var(--white-color);
    }
  }
}

.section-edit-btn {
  // position: absolute;
  top: 3px;
  color: var(--gray-color-500);
  right: 0;
}
</style>
