<template>
  <div class="order-summary-payment">
    <info-tooltip v-if="order.summary_paid > order.summary" icon="bx bxs-error" color="red">
      {{ $t('overpaidTitle') }}
      <b>{{ formatCurrency(order.summary_paid - order.summary) }}</b>
      !
      <br />
      <br />
      {{
        $t('overpaidMessage', {
          paid: formatCurrency(order.summary_paid),
          should: formatCurrency(order.summary),
        })
      }}
    </info-tooltip>

    <span v-if="lastSuccessfullPayment" class="order-summary-payment__name">
      {{ PAYMENT_METHODS[lastSuccessfullPayment.method] || lastSuccessfullPayment.method }}
    </span>

    <boolean-tag
      :value="order.paid"
      :true-text="$t('orderPaid')"
      :false-text="$t('orderNotPaid')"
    />

    <pop-confirm
      v-if="order.payable"
      :title="$t('offlinePayment.confirmText')"
      :ok-text="$t('offlinePayment.successText')"
      ok-color="success"
      :cancel-text="$t('common.cancel')"
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

<i18n lang="json">
{
  "en": {
    "offlinePayment": {
      "buttonText": "Mark payed",
      "confirmText": "Are you sure you want to manually mark the order as paid? (E.g. by cash or bank transfer)",
      "successText": "Pay",
      "resultSuccess": "The order has been marked as paid",
      "resultError": "An error occurred while marking the order as paid"
    },
    "overpaidTitle": "Order was overpaid by",
    "overpaidMessage": "Client paid {paid} instead of {should}",
    "orderPaid": "Paid",
    "orderNotPaid": "Not paid"
  },
  "pl": {
    "offlinePayment": {
      "buttonText": "Opłać",
      "confirmText": "Czy na pewno chcesz ręcznie oznaczyć zamówienie jako opłacone? (Np. przelewem tradycyjnym lub gotówką)",
      "successText": "Opłać",
      "resultSuccess": "Zamówienie zostało opłacone",
      "resultError": "Wystąpił błąd podczas opłacania zamówienia"
    },
    "overpaidTitle": "Zamówienie zostało nadpłacone o",
    "overpaidMessage": "Klient zapłacił {paid} zamiast {should}",
    "changedSuccess": "Status zamówienia został zmieniony",
    "orderPaid": "Opłacono",
    "orderNotPaid": "Nie opłacono"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Order, Payment } from '@heseya/store-core'

import PopConfirm from '@/components/layout/PopConfirm.vue'
import InfoTooltip from '@/components/layout/InfoTooltip.vue'

import { sdk } from '@/api'
import { formatCurrency } from '@/utils/currency'
import { PAYMENT_METHODS } from '@/consts/paymentMethods'

export default Vue.extend({
  components: { PopConfirm, InfoTooltip },
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
  },
  computed: {
    lastSuccessfullPayment(): Payment | undefined {
      return this.order.payments?.find((payment) => payment.paid)
    },
    PAYMENT_METHODS(): Record<string, string> {
      return PAYMENT_METHODS
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
    async payOffline() {
      this.$accessor.startLoading()
      try {
        await sdk.Orders.pay(this.order.code, 'offline', '/')
        await this.$accessor.orders.get(this.$route.params.id)
        this.$toast.success(this.$t('offlinePayment.resultSuccess') as string)
      } catch {
        this.$toast.error(this.$t('offlinePayment.resultError') as string)
      }

      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss" scoped>
.order-summary-payment {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > * {
    margin-right: 8px;
  }

  &__name {
    text-transform: capitalize;
  }
}
</style>
