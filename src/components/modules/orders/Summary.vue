<template>
  <card class="order-summary">
    <OrderField :label="$t('labels.code')" :value="order.code" :horizontal="isHorizontal" />
    <OrderField :label="$t('labels.date')" :value="formattedDate" :horizontal="isHorizontal" />
    <OrderField
      :label="$t('labels.shipping')"
      :value="order.shipping_method && order.shipping_method.name"
      :horizontal="isHorizontal"
    />

    <OrderField
      :label="$t('labels.payment')"
      class="order-summary__payment"
      :horizontal="isHorizontal"
    >
      <SummaryPayment :order="order" />
    </OrderField>

    <OrderField :label="$t('labels.history')" :horizontal="isHorizontal">
      <icon-button reversed size="small">
        <template #icon>
          <i class="bx bx-list-ul"></i>
        </template>
        {{ $t('showList') }}
      </icon-button>
    </OrderField>
  </card>
</template>

<i18n>
{
  "en": {
    "labels": {
      "code": "Order code",
      "date": "Creation date",
      "shipping": "Shipping method",
      "payment": "Payment",
      "history": "Payment history"
    },
    "showList": "Show"
  },
  "pl": {
    "labels": {
      "code": "Nr zamówienia",
      "date": "Data utworzenia",
      "shipping": "Metoda dostawy",
      "payment": "Płatność",
      "history": "Historia płatności"
    },
    "showList": "Pokaż"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import Card from '@/components/layout/Card.vue'
import SummaryPayment from './SummaryPayment.vue'
import OrderField from './Field.vue'

import { Order } from '@/interfaces/Order'
import { formatDate } from '@/utils/dates'

export default Vue.extend({
  components: { Card, OrderField, SummaryPayment },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  data: () => ({
    viewportWidth: window.innerWidth,
  }),
  computed: {
    formattedDate(): string | null {
      return this.order.created_at && formatDate(this.order.created_at)
    },
    isHorizontal(): boolean {
      return this.viewportWidth > 460 && this.viewportWidth < 850
    },
  },
  created() {
    window.addEventListener('resize', this.updateWidth)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth)
  },
  methods: {
    updateWidth(): void {
      this.viewportWidth = window.innerWidth
    },
  },
})
</script>

<style lang="scss" scoped>
.order-summary {
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media ($viewport-8) {
    align-items: center;
    flex-direction: row;
  }

  @media ($viewport-13) {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }

  ::v-deep .order-field--horizontal .order-field__label {
    width: 140px;
  }

  &__payment {
    grid-column: span 2;
  }
}
</style>
