<template>
  <div class="order-product-urls">
    <h3 class="order-product-urls__header">
      {{ $t('title') }} <span class="gray-text">{{ product.product.name }}</span> &nbsp;

      <tag v-if="product.is_delivered" type="success" small>{{ $t('delivered') }}</tag>
      <tag v-else type="error" small>{{ $t('notDelivered') }}</tag>
    </h3>

    <cms-table class="order-product-urls__table" :value="product.urls" :config="tableConfig">
      <template #item="{ item: url }">
        <cms-table-row :key="url.id" :item="url" no-hover :headers="tableConfig.headers">
          <template #url>
            <a :href="url.url" target="_blank">{{ $t('download') }}</a>
          </template>
        </cms-table-row>
      </template>
    </cms-table>

    <AppButton
      :loading="isLoading"
      class="order-product-urls__btn"
      type="primary"
      @click="sendProductViaMail"
    >
      {{ $t('send') }}
    </AppButton>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Linki do produktu",
    "download": "Pobierz",
    "delivered": "Dostarczono",
    "notDelivered": "Nie dostarczono",
    "send": "Wyślij maila do klienta z linkami do pobrania produktów",
    "sendSuccess": "Linki do pobrania produktów zostały wysłane na adres email klienta",
    "sendError": "Wystąpił błąd podczas wysyłania maila z linkami do pobrania produktów"
  },
  "en": {
    "title": "Product links of",
    "download": "Download",
    "delivered": "Delivered",
    "notDelivered": "Not delivered",
    "send": "Send email to customer with links to download products",
    "sendSuccess": "Links to download products have been sent to the customer's email address",
    "sendError": "An error occurred while sending an email with links to download products"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { OrderProduct, OrderProductUrl } from '@heseya/store-core'

import { TableConfig } from '@/interfaces/CmsTable'

import CmsTable from '@/components/cms/CmsTable.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import { sdk } from '@/api'

export default Vue.extend({
  components: { CmsTable, CmsTableRow },
  props: {
    product: {
      type: Object,
      required: true,
    } as Vue.PropOptions<OrderProduct>,
    orderId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
  }),

  computed: {
    tableConfig(): TableConfig<OrderProductUrl> {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
            render: (v: string) => v.toUpperCase(),
          },
          {
            key: 'url',
            label: this.$t('common.form.slug') as string,
          },
        ],
      }
    },
  },

  methods: {
    async sendProductViaMail() {
      this.isLoading = true
      try {
        await sdk.Orders.sendProducts(this.orderId)
        this.$toast.success(this.$t('sendSuccess') as string)
      } catch {
        this.$toast.error(this.$t('sendError') as string)
      }
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.order-product-urls {
  display: flex;
  flex-direction: column;

  &__btn {
    margin-top: 16px;
    align-self: center;
  }
}
</style>
