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
      :label="$t('labels.channel').toString()"
      :value="order.sales_channel?.name || '-'"
      :horizontal="isHorizontal"
    />
    <OrderField
      :label="$t('labels.language').toString()"
      :value="languageName"
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
      width="900px"
      :footer="null"
      @cancel="closePaymentHistory"
    >
      <template #title>
        <div class="order-summary-modal-header">
          <h4>{{ $t('labels.history') }}</h4>
          <pop-confirm
            v-if="!order.paid"
            :title="$t('offlinePayment.confirmText').toString()"
            :ok-text="$t('offlinePayment.successText').toString()"
            ok-color="success"
            :cancel-text="$t('common.cancel').toString()"
            @confirm="payOffline"
          >
            <icon-button size="small" reversed>
              <template #icon>
                <i class="bx bx-check"></i>
              </template>
              {{ $t('offlinePayment.buttonText') }}
            </icon-button>
          </pop-confirm>
        </div>
      </template>

      <CmsTable :value="order.payments" :config="paymentsTableConfig" no-hover>
        <template #row-action="{ item }">
          <icon-button
            size="small"
            type="danger"
            reversed
            :disabled="item.status !== PaymentStatus.Pending"
            @click="updatePayment(item.id, PaymentStatus.Failed)"
          >
            <template #icon><i class="bx bx-x-circle"></i></template>
            {{ $t('rejectPayment') }}
          </icon-button>
          <icon-button
            size="small"
            type="success"
            reversed
            :disabled="item.status !== PaymentStatus.Pending"
            @click="updatePayment(item.id, PaymentStatus.Successful)"
          >
            <template #icon><i class="bx bx-check-circle"></i></template>
            {{ $t('acceptPayment') }}
          </icon-button>
        </template>
      </CmsTable>
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
      "channel": "Sales channel",
      "shipping": "Shipping method",
      "digitalShipping": "Digital shipping",
      "payment": "Payment",
      "history": "Payment history",
      "editShippingMethod": "Edit shipping method",
      "language": "Language"
    },
    "table": {
      "date": "Date of transaction",
      "method": "Payment method",
      "amount": "Amount",
      "status": "Status"
    },
    "showList": "Show list",
    "acceptPayment": "Accept payment",
    "rejectPayment": "Reject payment",
    "paymentStatusUpdated": "Payment status updated",

    "offlinePayment": {
      "buttonText": "Mark the order as paid",
      "confirmText": "Are you sure you want to manually mark the order as paid? (E.g. by cash or bank transfer)",
      "successText": "Pay",
      "resultSuccess": "The order has been marked as paid",
      "resultError": "An error occurred while marking the order as paid"
    }
  },
  "pl": {
    "labels": {
      "code": "Nr zamówienia",
      "date": "Data zamówienia",
      "channel": "Kanał sprzedaży",
      "shipping": "Metoda dostawy",
      "digitalShipping": "Dostawa cyfrowa",
      "payment": "Płatność",
      "history": "Historia płatności",
      "editShippingMethod": "Edytuj metodę dostawy",
      "language": "Język"
    },
    "table": {
      "date": "Data transakcji",
      "method": "Metoda płatności",
      "amount": "Kwota",
      "status": "Status"
    },
    "showList": "Pokaż listę",
    "acceptPayment": "Zaakceptuj płatność",
    "rejectPayment": "Odrzuć płatność",
    "paymentStatusUpdated": "Zaktualizowano status płatności",
    "offlinePayment": {
      "buttonText": "Oznacz zamówienie jako opłacone",
      "confirmText": "Czy na pewno chcesz ręcznie oznaczyć zamówienie jako opłacone? (Np. przelewem tradycyjnym lub gotówką)",
      "successText": "Opłać",
      "resultSuccess": "Zamówienie zostało opłacone",
      "resultError": "Wystąpił błąd podczas opłacania zamówienia"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Order, PaymentStatus } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import SummaryPayment from './SummaryPayment.vue'
import OrderField from '../../Field.vue'
import CmsTable from '@/components/cms/CmsTable.vue'
import ShippingMethodForm from './ShippingMethodForm.vue'

import { formatDate } from '@/utils/dates'
import { TableConfig } from '@/interfaces/CmsTable'
import { PAYMENT_METHODS } from '@/consts/paymentMethods'
import { formatCurrency } from '@/utils/currency'
import { formatApiNotificationError } from '@/utils/errors'

import { sdk } from '@/api'

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
    formattedDate(): string | undefined {
      return (this.order.created_at && formatDate(this.order.created_at)) || undefined
    },
    isHorizontal(): boolean {
      return this.viewportWidth > 460 && this.viewportWidth < 850
    },
    languageName(): string {
      return (
        this.$accessor.languages.data.find((lang) => lang.iso === this.order.language)?.name ||
        this.order.language ||
        '-'
      )
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
          {
            key: 'action',
            label: '',
            width: '1.5fr',
          },
        ],
      }
    },
    PaymentStatus(): typeof PaymentStatus {
      return PaymentStatus
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
      return formatCurrency(amount, this.order.currency)
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

    async payOffline() {
      this.$accessor.startLoading()
      try {
        await sdk.Orders.markAsPaid(this.order.code)
        await this.$accessor.orders.get(this.$route.params.id)
        this.$toast.success(this.$t('offlinePayment.resultSuccess') as string)
      } catch {
        this.$toast.error(this.$t('offlinePayment.resultError') as string)
      }

      this.$accessor.stopLoading()
    },

    async updatePayment(id: string, status: PaymentStatus) {
      try {
        const updated = await sdk.Payments.update(id, { status })
        this.$emit('payment-updated', updated)
        this.$toast.success(this.$t('paymentStatusUpdated') as string)
      } catch (e: any) {
        this.$toast.error(formatApiNotificationError(e))
      }
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

.order-summary-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
  }
}
</style>
