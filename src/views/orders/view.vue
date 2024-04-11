<template>
  <div>
    <top-nav :title="$t('title').toString()">
      <QrCodeModalButton type="Order" :body="{ id: order.id }" />

      <a v-if="storefrontPaymentUrl" :href="`${storefrontPaymentUrl}${order.code}`" target="_blank">
        <icon-button>
          <template #icon>
            <i class="bx bxs-dollar-circle"></i>
          </template>
          {{ $t('goToPayment') }}
        </icon-button>
      </a>

      <next-prev-buttons />
    </top-nav>

    <main class="order-page">
      <Loading :active="isLoading" />

      <OrderSummary class="order-page__summary" :order="order" />

      <card class="order-page__status">
        <a-tooltip v-bind="!order?.status?.cancel ? { visible: false } : undefined">
          <template #title>
            {{ $t('errors.CLIENT_ERROR.CLIENT_CHANGE_CANCELED_ORDER_STATUS') }}
          </template>
          <StatusInput :order="order" />
        </a-tooltip>
      </card>
      <card class="order-page__cart">
        <Cart :order="order" />
      </card>
      <card class="order-page__metadata">
        <OrderMetadatas :order="order" />
      </card>
      <card class="order-page__address">
        <CustomerDetails :order="order" />
      </card>
      <card v-if="order.id && order.shipping_method" class="order-page__shipping">
        <ShippingNumberForm
          :order-id="order.id"
          :shipping-number="order.shipping_number || undefined"
          @set="onShippingNumberChange"
        />
      </card>
      <card class="order-page__documents">
        <OrderDocuments v-if="order.id" :order-id="order.id" :documents="order.documents" />
      </card>
    </main>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Szczegóły zamówienia",
    "goToPayment": "Przejdź do płatności"
  },
  "en": {
    "title": "Order details",
    "goToPayment": "Go to payment"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Order } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import NextPrevButtons from '@/components/modules/orders/NextPrevButtons.vue'
import ShippingNumberForm from '@/components/modules/orders/ShippingNumberForm.vue'
import OrderSummary from '@/components/modules/orders/Summary.vue'
import StatusInput from '@/components/modules/orders/StatusInput.vue'

import { formatApiNotificationError } from '@/utils/errors'
import CustomerDetails from '@/components/modules/orders/CustomerDetails.vue'
import Cart from '@/components/modules/orders/Cart.vue'
import OrderMetadatas from '@/components/modules/orders/OrderMetadatas.vue'
import OrderDocuments from '@/components/modules/orders/documents/OrderDocumentsList.vue'
import QrCodeModalButton from '@/components/modules/qrCode/CodeModalButton.vue'
import Loading from '@/components/layout/Loading.vue'

export default defineComponent({
  metaInfo(this: any): any {
    return { title: `${this.$t('title')} ${this.order?.code || ''}` }
  },
  components: {
    TopNav,
    Card,
    NextPrevButtons,
    ShippingNumberForm,
    OrderSummary,
    StatusInput,
    CustomerDetails,
    Cart,
    OrderMetadatas,
    OrderDocuments,
    QrCodeModalButton,
    Loading,
  },

  data: () => ({
    packageTemplateId: '',
    modalFormTitle: '',
    form: {},
    isLoading: false,
    isModalActive: false,
  }),
  computed: {
    error(): any {
      return this.$accessor.orders.getError
    },
    order(): Order {
      return this.$accessor.orders.getSelected || ({ currency: 'PLN' } as any)
    },
    storefrontPaymentUrl(): string | undefined {
      return this.$accessor.config.env.storefront_payment_url || undefined
    },
  },
  watch: {
    error(error) {
      if (error) this.$toast.error(formatApiNotificationError(error))
    },
  },
  async created() {
    this.isLoading = true
    await Promise.all([
      this.$accessor.orders.get(this.$route.params.id),
      this.$accessor.statuses.fetch(),
    ])
    this.isLoading = false
  },
  methods: {
    onShippingNumberChange(shippingNumber: string) {
      this.order.shipping_number = shippingNumber
    },
  },
})
</script>

<style lang="scss">
.order-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'summary' 'status' 'cart' 'address' 'documents' 'shipping' 'metadata';
  grid-gap: 16px;
  align-items: start;
  position: relative;

  @media ($viewport-10) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'summary status' 'cart address' 'cart shipping' 'cart documents' 'cart metadata' 'cart .';
  }

  .card {
    margin-bottom: 0 !important;
  }

  @media screen and (max-width: 780px) {
    grid-template-columns: 1fr;
  }

  &__summary {
    grid-area: summary;
  }

  &__status {
    grid-area: status;
  }

  &__cart {
    grid-area: cart;
  }

  &__address {
    grid-area: address;
  }

  &__metadata {
    grid-area: metadata;
  }

  &__documents {
    grid-area: documents;
  }
}

.order-title {
  display: block;
  font-size: 1em;
  color: var(--gray-color-500);
}
</style>
