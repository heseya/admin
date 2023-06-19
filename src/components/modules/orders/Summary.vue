<template>
  <card class="order-summary">
    <OrderField
      :label="$t('labels.code').toString()"
      :value="order.code"
      :horizontal="isHorizontal"
    />
    <OrderField
      :label="$t('labels.date').toString()"
      :value="formattedDate"
      :horizontal="isHorizontal"
    />
    <OrderField
      v-if="order.shipping_method"
      :label="$t('labels.shipping').toString()"
      :value="order.shipping_method.name"
      :horizontal="isHorizontal"
    >
      <template #labelSuffix>
        <icon-button
          v-can="$p.Orders.Edit"
          size="small"
          type="transparent"
          class="order-summary__edit-btn"
          @click="editShippingMethod(false)"
        >
          <template #icon>
            <i class="bx bxs-pencil"></i>
          </template>
        </icon-button>
      </template>
    </OrderField>

    <OrderField
      v-if="order.digital_shipping_method"
      :label="$t('labels.digitalShipping').toString()"
      :value="order.digital_shipping_method.name"
      :horizontal="isHorizontal"
    >
      <template #labelSuffix>
        <icon-button
          v-can="$p.Orders.Edit"
          size="small"
          type="transparent"
          class="order-summary__edit-btn"
          @click="editShippingMethod(true)"
        >
          <template #icon>
            <i class="bx bxs-pencil"></i>
          </template>
        </icon-button>
      </template>
    </OrderField>
    <OrderField
      :label="$t('labels.payment').toString()"
      class="order-summary__payment"
      :horizontal="isHorizontal"
    >
      <SummaryPayment :order="order" />
    </OrderField>

    <OrderField :label="$t('labels.history').toString()" :horizontal="isHorizontal">
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
      <cms-table :value="order.payments" :config="paymentsTableConfig" no-hover />
    </a-modal>
    <a-modal
      v-model="isShippingModalActive"
      width="750px"
      :footer="null"
      :title="`${$t('labels.editShippingMethod')}`"
    >
      <ShippingMethodForm
        v-if="isShippingModalActive"
        :order="order"
        :digital="isDigitalShippingMethodEdited"
        @success="isShippingModalActive = false"
      />
    </a-modal>
  </card>
</template>

<i18n lang="json">
{
  "en": {
    "labels": {
      "code": "Order code",
      "date": "Order date",
      "shipping": "Shipping method",
      "digitalShipping": "Digital shipping",
      "payment": "Payment",
      "history": "Payment history",
      "editShippingMethod": "Edit shipping method"
    },
    "table": {
      "date": "Date of transaction",
      "method": "Payment method",
      "amount": "Amount",
      "status": "Status"
    },
    "showList": "Show list"
  },
  "pl": {
    "labels": {
      "code": "Nr zamówienia",
      "date": "Data zamówienia",
      "shipping": "Metoda dostawy",
      "digitalShipping": "Dostawa cyfrowa",
      "payment": "Płatność",
      "history": "Historia płatności",
      "editShippingMethod": "Edytuj metodę dostawy"
    },
    "table": {
      "date": "Data transakcji",
      "method": "Metoda płatności",
      "amount": "Kwota",
      "status": "Status"
    },
    "showList": "Pokaż listę"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Order } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import SummaryPayment from './SummaryPayment.vue'
import OrderField from '../../Field.vue'
import CmsTable from '@/components/cms/CmsTable.vue'
import ShippingMethodForm from './ShippingMethodForm.vue'

import { formatDate } from '@/utils/dates'
import { TableConfig } from '@/interfaces/CmsTable'
import { PAYMENT_METHODS } from '@/consts/paymentMethods'
import { formatCurrency } from '@/utils/currency'

export default defineComponent({
  components: {
    Card,
    OrderField,
    SummaryPayment,
    CmsTable,
    ShippingMethodForm,
  },
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  data: () => ({
    viewportWidth: window.innerWidth,
    isPaymentHistoryVisible: false,
    isShippingModalActive: false,
    isDigitalShippingMethodEdited: false,
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
          {
            key: 'date',
            label: this.$t('table.date') as string,
            render: (v: string) => formatDate(v) || v,
          },
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
          {
            key: 'status',
            label: this.$t('table.status') as string,
            render: (v) => this.$t(`paymentStatus.${v}`) as string,
          },
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
      return formatCurrency(amount, this.$accessor.config.currency)
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
    editShippingMethod(isDigitalEdited: boolean) {
      this.isDigitalShippingMethodEdited = isDigitalEdited
      this.isShippingModalActive = true
    },
  },
})
</script>

<style lang="scss" scoped>
.order-summary {
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media ($viewport-5) {
    white-space: nowrap;
  }

  &__edit-btn {
    @media ($viewport-8) {
      position: absolute;
      right: -14px;
    }
  }

  @media ($viewport-8) {
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
  }

  :deep(.field--horizontal .field__label) {
    width: 140px;
  }
}
</style>
