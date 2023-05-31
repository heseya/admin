<template>
  <div class="order-cart">
    <span class="order-cart__header-title order-title">{{ $t('header.title') }}</span>
    <div class="order-cart__header">
      <span class="order-title">{{ $t('header.title') }}</span>
      <span class="order-title">{{ $t('header.perItem') }}</span>
      <span class="order-title">{{ $t('header.discounted') }}</span>
      <span class="order-title">{{ $t('header.quantity') }}</span>
      <span class="order-title">{{ $t('header.total') }}</span>
    </div>
    <CartItem
      v-for="item in order.products"
      :key="item.id"
      :item="item"
      @show-urls="openProductUrls(item)"
    />
    <hr />

    <XlsxDownloadButton
      v-if="order.products"
      class="order-cart__export-btn"
      :items="order.products"
      :xlsx-file-config="xlsxFileConfig"
      :text="$t('export.btn')"
    />

    <div class="order-cart__summary">
      <field :label="$t('summary.cart')" horizontal>
        {{ formatCurrency(order.cart_total_initial) }}
      </field>
      <field :label="$t('summary.shipping')" horizontal>
        <div class="discount-summary">
          <span class="discount-summary__total">
            {{ formatCurrency(order.shipping_price) }}
          </span>
          <info-tooltip v-if="order.shipping_price !== order.shipping_price_initial">
            <b>
              {{ $t('summary.baseShipping') }}:
              {{ formatCurrency(order.shipping_price_initial) }}
            </b>
            <OrderDiscountSummary
              :discounts="order.discounts"
              :types="[DiscountTargetType.ShippingPrice]"
            />
          </info-tooltip>
        </div>
      </field>
      <field
        v-if="order.discounts && totalDiscount > 0"
        :label="$t('summary.discounts')"
        horizontal
      >
        <div class="discount-summary">
          <span class="discount-summary__total">
            {{ formatCurrency(-totalDiscount) }}
          </span>
          <info-tooltip>
            <OrderDiscountSummary
              :discounts="order.discounts"
              :types="[
                DiscountTargetType.CheapestProduct,
                DiscountTargetType.OrderValue,
                DiscountTargetType.Products,
              ]"
            />
          </info-tooltip>
        </div>
      </field>
      <field class="order-cart__summary-total" :label="$t('summary.total')" horizontal>
        {{ formatCurrency(order.summary) }}
      </field>
      <boolean-tag
        :value="order.paid"
        :true-text="$t('orderPaid')"
        :false-text="$t('orderNotPaid')"
      />
    </div>

    <a-modal
      :visible="isProductUrlsModalActive"
      width="800px"
      :footer="null"
      @cancel="isProductUrlsModalActive = false"
    >
      <order-product-urls v-if="selectedProduct" :product="selectedProduct" :order-id="order.id" />
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "header": {
      "title": "Products in cart",
      "perItem": "Price per item",
      "discounted": "After discount",
      "quantity": "Quantity",
      "total": "Total"
    },
    "orderPaid": "Paid",
    "orderNotPaid": "Not paid",
    "summary": {
      "cart": "Cart total",
      "baseShipping": "Base shipping price",
      "shipping": "Shipping price",
      "discounts": "Discounts",
      "total": "Total"
    },
    "export": {
      "schemas": "Schemas",
      "vatRate": "VAT rate",
      "priceInitial": "Original price",
      "price": "Final price",
      "quantity": "Quantity",
      "total": "Total",
      "discounts": "Discounts",
      "isDelivered": "Delivered",
      "shippingDigital": "Digital shipping",
      "btn": "Export cart to XLSX"
    }
  },
  "pl": {
    "header": {
      "title": "Produkty w koszyku",
      "perItem": "Cena szt.",
      "discounted": "Po rabacie",
      "quantity": "Ilość",
      "total": "Wartość"
    },
    "orderPaid": "Opłacono",
    "orderNotPaid": "Nie opłacono",
    "summary": {
      "cart": "Wartość koszyka",
      "baseShipping": "Bazowa cena dostawy",
      "shipping": "Koszt przesyłki",
      "discounts": "Rabaty",
      "total": "Do zapłaty"
    },
    "export": {
      "schemas": "Schematy",
      "vatRate": "Stawka VAT",
      "priceInitial": "Cena początkowa",
      "price": "Cena końcowa",
      "quantity": "Ilość",
      "total": "Wartość",
      "discounts": "Rabaty",
      "isDelivered": "Dostarczono",
      "shippingDigital": "Dostawa cyfrowa",
      "btn": "Eksportuj koszyk do XLSX"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropOptions } from 'vue'
import { Order, OrderProduct, DiscountTargetType } from '@heseya/store-core'

import CartItem from '@/components/layout/CartItem.vue'
import Field from '../../Field.vue'
import OrderDiscountSummary from './OrderDiscountSummary.vue'
import OrderProductUrls from './OrderProductUrls.vue'

import { formatCurrency } from '@/utils/currency'
import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'
import XlsxDownloadButton from '@/components/XlsxDownloadButton.vue'

export default defineComponent({
  components: { CartItem, Field, OrderDiscountSummary, OrderProductUrls, XlsxDownloadButton },
  props: {
    order: {
      type: Object,
      required: true,
    } as PropOptions<Order>,
  },
  data: () => ({
    isProductUrlsModalActive: false,
    selectedProductId: null as string | null,
  }),
  computed: {
    DiscountTargetType(): typeof DiscountTargetType {
      return DiscountTargetType
    },

    totalDiscount(): number {
      return (
        this.order.discounts
          // Ignore shipping price discounts, they are already included in shipping price
          ?.filter((d) => d.target_type !== DiscountTargetType.ShippingPrice)
          .map((d) => d.applied_discount)
          .reduce((sum, discount) => sum + discount, 0) || 0
      )
    },

    selectedProduct(): OrderProduct | null {
      return this.order.products?.find((p) => p.id === this.selectedProductId) || null
    },

    xlsxFileConfig(): XlsxFileConfig<OrderProduct> {
      return {
        name: `${this.$t('header.title').toString().replaceAll(' ', '_')}-${this.order.code}`,
        headers: [
          {
            key: 'name',
            label: this.$t('common.form.name') as string,
          },
          {
            key: 'schemas',
            label: this.$t('export.schemas') as string,
            format(_k, item) {
              return item.schemas.map((s) => `${s.name}: ${s.value}`).join(', ') || '-'
            },
          },
          {
            key: 'price_initial',
            label: this.$t('export.priceInitial') as string,
          },
          {
            key: 'price',
            label: this.$t('export.price') as string,
          },
          {
            key: 'vat_rate',
            label: this.$t('export.vatRate') as string,
          },
          {
            key: 'quantity',
            label: this.$t('export.quantity') as string,
          },
          {
            // @ts-ignore custom key
            key: 'total',
            label: this.$t('export.total') as string,
            format(_k, item) {
              return item.price * item.quantity
            },
          },
          {
            key: 'discounts',
            label: this.$t('export.discounts') as string,
            format(_k, item) {
              return (
                item.discounts.map((d) => `${d.name} (-${d.applied_discount})`).join(', ') || '-'
              )
            },
          },
          {
            key: 'is_delivered',
            label: this.$t('export.isDelivered') as string,
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')) as string,
          },
          {
            key: 'shipping_digital',
            label: this.$t('export.shippingDigital') as string,
            format: (v: boolean) => (v ? this.$t('common.yes') : this.$t('common.no')) as string,
          },
        ],
      }
    },
  },
  methods: {
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
    },
    openProductUrls(item: OrderProduct) {
      this.isProductUrlsModalActive = true
      this.selectedProductId = item.id
    },
  },
})
</script>

<style lang="scss" scoped>
.order-cart {
  position: relative;

  &__summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    :deep(.field) {
      font-size: 1em;
    }
  }

  &__summary-total {
    margin-top: 16px;
  }

  &__summary-total :deep(.field__value) {
    font-size: 1.4em;
    font-weight: 600;
  }

  &__header-title {
    margin-left: 12px;

    @media ($viewport-8) {
      display: none;
    }
  }

  &__header {
    display: none;
    align-items: flex-start;
    grid-template-columns: 4fr 1fr 1.2fr 0.5fr 1fr;
    text-align: center;
    padding: 0 12px;

    @media ($viewport-8) {
      font-size: 0.8em;
      display: grid;
    }

    @media ($viewport-14) {
      font-size: 1em;
    }

    > * {
      padding: 4px;
    }

    > :first-child {
      text-align: left;
    }

    > :last-child {
      text-align: right;
    }
  }

  &__export-btn {
    @media ($viewport-4) {
      position: absolute;
      left: 0px;
      bottom: 0px;
    }
  }
}

.discount-summary {
  &__total {
    margin-right: 5px;
  }

  &__item {
    display: flex;
  }

  .bx {
    color: var(--primary-color-500);
    font-size: 0.8em;
  }
}
</style>
