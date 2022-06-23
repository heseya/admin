<template>
  <field :label="title" class="editable-address">
    <template #labelSuffix>
      <icon-button
        v-if="!hideEdit"
        v-can="$p.Orders.Edit"
        size="small"
        type="transparent"
        class="editable-address__btn editable-address__btn--edit"
        @click="edit"
      >
        <template #icon>
          <i class="bx bxs-pencil"></i>
        </template>
      </icon-button>
      <pop-confirm
        v-if="!hideRemove && address"
        v-can="$p.Orders.Edit"
        :title="$t('removeConfirm')"
        :ok-text="$t('common.delete')"
        :cancel-text="$t('common.cancel')"
        @confirm="remove"
      >
        <icon-button
          size="small"
          type="transparent"
          class="editable-address__btn editable-address__btn--remove"
        >
          <template #icon>
            <i class="bx bxs-trash"></i>
          </template>
        </icon-button>
      </pop-confirm>
    </template>

    <OrderAddress :address="address" :order="order" />
  </field>
</template>

<i18n>
{
  "pl": {
    "removeConfirm": "Czy na pewno chcesz usunąć adres?"
  },
  "en": {
    "removeConfirm": "Are you sure you want to remove the address?"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import PopConfirm from '../../layout/PopConfirm.vue'
import OrderAddress from './OrderAddress.vue'
import Field from '../../Field.vue'

import { Address } from '@/interfaces/Address'
import { Order } from '@/interfaces/Order'

export default Vue.extend({
  name: 'Address',
  components: { PopConfirm, OrderAddress, Field },
  props: {
    title: {
      type: String,
      default: null,
    },
    address: {
      type: Object,
      default: () => null,
    } as Vue.PropOptions<Address>,
    hideEdit: {
      type: Boolean,
      default: false,
    },
    hideRemove: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      default: () => {},
    } as Vue.PropOptions<Order>,
  },
  methods: {
    edit() {
      this.$emit('edit')
    },
    remove() {
      this.$emit('remove')
    },
  },
})
</script>

<style lang="scss" scoped>
.editable-address {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  &__btn {
    margin-left: 3px;
    color: $gray-color-500;
  }
}
</style>
