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
    </template>

    <OrderAddress :order="order" :billing="billing" />
  </field>
</template>

<i18n lang="json">
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
import { defineComponent, PropOptions } from 'vue'
import { Address, Order } from '@heseya/store-core'

import OrderAddress from './OrderAddress.vue'
import Field from '../../Field.vue'

export default defineComponent({
  name: 'EditableOrderAddress',
  components: { OrderAddress, Field },
  props: {
    title: {
      type: String,
      default: null,
    },
    address: {
      type: Object,
      default: () => null,
    } as PropOptions<Address>,
    hideEdit: {
      type: Boolean,
      default: false,
    },
    billing: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      default: () => {},
    } as PropOptions<Order>,
  },
  methods: {
    edit() {
      this.$emit('edit')
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
    color: var(--gray-color-500);
  }
}
</style>
