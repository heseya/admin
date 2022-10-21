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
        :address="order.shipping_place"
        :order="order"
        hide-remove
        :hide-edit="order.shipping_type === ShippingType.None"
        @edit="editShippingAddress"
      />

      <EditableOrderAddress
        :title="$t('invoiceAddressSection')"
        :address="order.billing_address"
        :order="order"
        @edit="editBillingAddress"
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
      :title="`${$t('common.edit')} ${modalFormTitle.toLowerCase()}`"
    >
      <modal-form>
        <partial-update-form
          v-model="form"
          :shipping-type="order.shipping_type"
          :shipping-method="order.shipping_method"
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
    "invoiceAddressSection": "Invoice address",
    "commentSection": "Comment",
    "editSuccess": "Order has been updated.",
    "editFailed": "Order has not been updated.",
    "commentEmpty": "-- No order comment --"
  },
  "pl": {
    "emailSection": "Adres e-mail",
    "userSection": "Kupujący",
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
import { AddressDto, Order, OrderUpdateDto } from '@heseya/store-core'
import { ShippingType } from '@/interfaces/ShippingType'

import Field from '@/components/Field.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import IconButton from '@/components/layout/IconButton.vue'

import EditableOrderAddress from './EditableOrderAddress.vue'
import PartialUpdateForm from './PartialUpdateForm.vue'
import OrderBuyer from './OrderBuyer.vue'

import { DEFAULT_ADDRESS_FORM } from '@/consts/addressConsts'

export default Vue.extend({
  components: { Field, EditableOrderAddress, PartialUpdateForm, ModalForm, IconButton, OrderBuyer },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
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
      switch (this.order.shipping_type) {
        case ShippingType.Address:
          this.form = {
            shipping_place: {
              ...(this.order.shipping_place as AddressDto),
            },
          }
          break
        case ShippingType.Point:
          this.form = {
            shipping_place: (this.order.shipping_place as AddressDto).id,
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
      }
    },
    removeInvoiceAddress() {
      this.form = { billing_address: null }
      this.saveForm()
    },
    async saveForm() {
      this.$accessor.startLoading()
      //TODO: Delete this when [PATCH] will works correctly
      this.form = {
        shipping_place:
          this.order.shipping_type === ShippingType.Point
            ? (this.order.shipping_place as AddressDto).id
            : this.order.shipping_place,
        ...this.form,
      }

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
