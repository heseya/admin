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
      <icon-button reversed size="small" @click="showPaymentHistory">
        <template #icon>
          <i class="bx bx-list-ul"></i>
        </template>
        {{ $t('showList') }}
      </icon-button>
    </OrderField>

    <a-modal
      :visible="isPaymentHistoryVisible"
      width="750px"
      :footer="null"
      :title="$t('labels.history')"
      @cancel="closePaymentHistory"
    >
      <cms-table :value="order.payments" :config="paymentsTableConfig" />
    </a-modal>
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
    "table": {
      "date": "Date of transaction",
      "method": "Payment method",
      "amount": "Amount",
      "success": "Is payment successful?"
    },
    "showList": "Show list"
  },
  "pl": {
    "labels": {
      "code": "Nr zamówienia",
      "date": "Data utworzenia",
      "shipping": "Metoda dostawy",
      "payment": "Płatność",
      "history": "Historia płatności"
    },
    "table": {
      "date": "Data transakcji",
      "method": "Metoda płatności",
      "amount": "Kwota",
      "success": "Płatność się powiodła?"
    },
    "showList": "Pokaż listę"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'

import Card from '@/components/layout/Card.vue'
import SummaryPayment from './SummaryPayment.vue'
import OrderField from './Field.vue'
import CmsTable from '@/components/cms/CmsTable.vue'

import { Order } from '@/interfaces/Order'
import { formatDate } from '@/utils/dates'
import { TableConfig } from '@/interfaces/CmsTable'
import { PAYMENT_METHODS } from '@/consts/paymentMethods'
import { formatCurrency } from '@/utils/currency'

export default Vue.extend({
  components: { Card, OrderField, SummaryPayment, CmsTable },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  data: () => ({
    viewportWidth: window.innerWidth,
    isPaymentHistoryVisible: false,
  }),
  computed: {
    formattedDate(): string | null {
      return this.order.created_at && formatDate(this.order.created_at)
    },
    isHorizontal(): boolean {
      return this.viewportWidth > 460 && this.viewportWidth < 850
    },
    paymentsTableConfig(): TableConfig {
      return {
        headers: [
          // { key: 'created_at', label: this.$t('table.date') as string },
          {
            key: 'method',
            label: this.$t('table.method') as string,
            render: (v: keyof typeof PAYMENT_METHODS) => PAYMENT_METHODS[v] || v,
          },
          {
            key: 'amount',
            label: this.$t('table.amount') as string,
            render: (v: number) => this.formatCurrency(v),
          },
          { key: 'paid', label: this.$t('table.success') as string },
        ],
      }
    },
  },
  created() {
    window.addEventListener('resize', this.updateWidth)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth)
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.currency)
    },
    updateWidth(): void {
      this.viewportWidth = window.innerWidth
    },
    showPaymentHistory() {
      this.isPaymentHistoryVisible = true
    },
    closePaymentHistory() {
      this.isPaymentHistoryVisible = false
    },
  },
})
</script>

<style lang="scss" scoped>
.order-summary {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  white-space: nowrap;

  @media ($viewport-8) {
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
  }

  ::v-deep .order-field--horizontal .order-field__label {
    width: 140px;
  }
}
</style>