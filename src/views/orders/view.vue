<template>
  <div>
    <top-nav :title="$t('title')">
      <audits-modal :id="order.id" model="orders" />
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
      <OrderSummary class="order-page__summary" :order="order" />

      <card class="order-page__status">
        <StatusInput :order="order" @status-changed="updateStatus" />
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
      <card class="order-page__shipping">
        <send-package
          v-if="order.id"
          :order-id="order.id"
          :shipping-method="order.shipping_method.name"
          :shipping-number="order.shipping_number"
          @created="onPackageCreated"
        />
      </card>
      <card class="order-page__documents">
        <order-documents v-if="order.id" :order-id="order.id" :documents="order.documents" />
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
import Vue from 'vue'
import { Order } from '@heseya/store-core'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import AuditsModal from '@/components/modules/audits/AuditsModal.vue'
import NextPrevButtons from '@/components/modules/orders/NextPrevButtons.vue'
import SendPackage from '@/components/modules/orders/SendPackage.vue'
import OrderSummary from '@/components/modules/orders/Summary.vue'
import StatusInput from '@/components/modules/orders/StatusInput.vue'

import { formatApiNotificationError } from '@/utils/errors'
import CustomerDetails from '@/components/modules/orders/CustomerDetails.vue'
import Cart from '@/components/modules/orders/Cart.vue'
import OrderMetadatas from '@/components/modules/orders/OrderMetadatas.vue'
import OrderDocuments from '@/components/modules/orders/documents/OrderDocumentsList.vue'

export default Vue.extend({
  metaInfo(this: any): any {
    return { title: `${this.$t('title')} ${this.order?.code}` }
  },
  components: {
    TopNav,
    Card,
    AuditsModal,
    NextPrevButtons,
    SendPackage,
    OrderSummary,
    StatusInput,
    CustomerDetails,
    Cart,
    OrderMetadatas,
    OrderDocuments,
  },
  data: () => ({
    packageTemplateId: '',
    modalFormTitle: '',
    form: {},
    isModalActive: false,
  }),
  computed: {
    error(): any {
      return this.$accessor.orders.getError
    },
    order(): Order {
      return this.$accessor.orders.getSelected || ({} as any)
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
    this.$accessor.startLoading()
    await Promise.all([
      this.$accessor.orders.get(this.$route.params.id),
      this.$accessor.statuses.fetch(),
    ])
    this.$accessor.stopLoading()
  },
  methods: {
    updateStatus(statusId: string) {
      this.order.status.id = statusId
    },
    onPackageCreated(shippingNumber: string) {
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

  @media ($viewport-10) {
    grid-template-columns: 2fr 1fr;
    grid-template-areas: 'summary status' 'cart address' 'cart shipping' 'cart documents' 'cart metadata';
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
  color: $gray-color-500;
}
</style>
