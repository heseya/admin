<template>
  <div class="order-summary-payment">
    <info-tooltip v-if="order.summary_paid > order.summary" icon="bx bxs-error" color="red">
      {{ $t('overpaidTitle') }}
      <b>{{ formatCurrency(parseFloat(order.summary_paid) - parseFloat(order.summary)) }}</b>
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

    <tag v-if="!order.paid && order?.payment_method_type === 'postpaid'" type="warning">
      <i class="bx bxs-package"></i> {{ $t('status.postpaid') }}
    </tag>
    <boolean-tag
      v-else
      :value="order.paid"
      :true-text="$t('status.paid')"
      :false-text="$t('status.notPaid')"
    />
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "overpaidTitle": "Order was overpaid by",
    "overpaidMessage": "Client paid {paid} instead of {should}",
    "status": {
      "paid": "Paid",
      "notPaid": "Not paid",
      "postpaid": "Payment on delivery"
    }
  },
  "pl": {
    "overpaidTitle": "Zamówienie zostało nadpłacone o",
    "overpaidMessage": "Klient zapłacił {paid} zamiast {should}",
    "changedSuccess": "Status zamówienia został zmieniony",
    "status": {
      "paid": "Opłacone",
      "notPaid": "Nieopłacone",
      "postpaid": "Płatność po dostawie"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Order, OrderPayment, PaymentStatus } from '@heseya/store-core'

import InfoTooltip from '@/components/layout/InfoTooltip.vue'

import { formatCurrency } from '@/utils/currency'
import { PAYMENT_METHODS } from '@/consts/paymentMethods'

export default defineComponent({
  components: { InfoTooltip },
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  computed: {
    lastSuccessfullPayment(): OrderPayment | undefined {
      return this.order.payments?.find((payment) => payment.status === PaymentStatus.Successful)
    },
    PAYMENT_METHODS(): Record<string, string> {
      return PAYMENT_METHODS
    },
  },
  methods: {
    formatCurrency(amount: number | string) {
      return formatCurrency(amount, this.order.currency)
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
