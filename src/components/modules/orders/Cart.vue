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
      :currency="order.currency"
      @show-urls="openProductUrls(item)"
    />
    <hr />

    <XlsxDownloadButton
      v-if="order.products"
      class="order-cart__export-btn"
      :items="order.products"
      :xlsx-file-config="xlsxFileConfig"
      :text="$t('export.btn').toString()"
    />

    <div class="order-cart__summary">
      <field :label="$t('summary.cart').toString()" horizontal>
        {{ formatCurrency(order.cart_total_initial.net) }}
      </field>
      <field :label="$t('summary.shipping').toString()" horizontal>
        <div class="discount-summary">
          <span class="discount-summary__total">
            {{ formatCurrency(order.shipping_price.net) }}
          </span>
          <info-tooltip v-if="order.shipping_price.net !== order.shipping_price_initial.net">
            <b>
              {{ $t('summary.baseShipping') }}:
              {{ formatCurrency(order.shipping_price_initial.net) }}
            </b>
            <OrderDiscountSummary
              :discounts="orderDiscountsNet"
              :types="[DiscountTargetType.ShippingPrice]"
              :currency="order.currency"
            />
          </info-tooltip>
        </div>
      </field>
      <field
        v-if="order.discounts && totalDiscountGross > 0"
        :label="$t('summary.discounts').toString()"
        horizontal
      >
        <div class="discount-summary">
          <span class="discount-summary__total">
            {{ formatCurrency(-totalDiscountNet) }}
          </span>
          <info-tooltip>
            <OrderDiscountSummary
              :discounts="orderDiscountsNet"
              :types="[
                DiscountTargetType.CheapestProduct,
                DiscountTargetType.OrderValue,
                DiscountTargetType.Products,
              ]"
              :currency="order.currency"
            />
          </info-tooltip>
        </div>
      </field>
      <field
        class="order-cart__summary-total order-cart__summary-total--net"
        :label="
          $t('summary.total').toString() + ' (' + $t('common.net').toString().toLowerCase() + ')'
        "
        horizontal
      >
        {{ formatCurrency(order.summary.net) }}
      </field>
      <field
        class="order-cart__summary-total order-cart__summary-total--gross"
        :label="
          $t('summary.total').toString() + ' (' + $t('common.gross').toString().toLowerCase() + ')'
        "
        horizontal
      >
        {{ formatCurrency(order.summary.gross) }}
      </field>
      <SummaryPayment :order="order" />
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
      "currency": "Currency",
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
      "currency": "Waluta",
      "discounts": "Rabaty",
      "isDelivered": "Dostarczono",
      "shippingDigital": "Dostawa cyfrowa",
      "btn": "Eksportuj koszyk do XLSX"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Order, OrderProduct, DiscountTargetType, OrderDiscount } from '@heseya/store-core'

import CartItem from '@/components/layout/CartItem.vue'
import Field from '../../Field.vue'
import OrderDiscountSummary from './OrderDiscountSummary.vue'
import OrderProductUrls from './OrderProductUrls.vue'
import SummaryPayment from './SummaryPayment.vue'

import { formatCurrency } from '@/utils/currency'
import { XlsxFileConfig } from '@/interfaces/XlsxFileConfig'
import XlsxDownloadButton from '@/components/XlsxDownloadButton.vue'

export default defineComponent({
  components: {
    CartItem,
    Field,
    OrderDiscountSummary,
    OrderProductUrls,
    XlsxDownloadButton,
    SummaryPayment,
  },
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
  },
  data: () => ({
    isProductUrlsModalActive: false,
    selectedProductId: null as string | null,
  }),
  computed: {
    DiscountTargetType(): typeof DiscountTargetType {
      return DiscountTargetType
    },

    totalDiscountGross(): number {
      return (
        this.order.discounts
          // Ignore shipping price discounts, they are already included in shipping price
          ?.filter((d) => d.target_type !== DiscountTargetType.ShippingPrice)
          .map((d) => parseFloat(d.applied_discount))
          .reduce((sum, discount) => sum + discount, 0) || 0
      )
    },

    vatRate(): number {
      return +(this.order.summary.vat_rate ?? '0')
    },

    totalDiscountNet(): number {
      return this.calcGrossToNet(this.totalDiscountGross)
    },

    orderDiscountsNet(): OrderDiscount[] {
      return (this.order.discounts || []).map((discount) => ({
        ...discount,
        amount: discount.amount ? this.calcGrossToNet(+discount.amount).toString() : null,
        applied_discount:
          discount.applied_discount !== ''
            ? this.calcGrossToNet(+discount.applied_discount).toString()
            : '',
      }))
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
            format(k) {
              return k.net
            },
          },
          {
            key: 'price',
            label: this.$t('export.price') as string,
            format(k) {
              return k.net
            },
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
              return parseFloat(item.price.net) * item.quantity
            },
          },
          {
            // @ts-ignore custom key
            key: 'currency',
            label: this.$t('export.currency') as string,
            format: () => this.order.currency,
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
    calcGrossToNet(grossAmount: number): number {
      return Math.round(((grossAmount * 100) / ((1 + this.vatRate) * 100)) * 100) / 100
    },
    formatCurrency(amount: number | string) {
      return formatCurrency(amount, this.order.currency)
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
    &--net {
      margin-top: 16px;
      padding-bottom: 0;

      :deep(.field__value) {
        font-size: 1.4em;
        font-weight: 600;
      }
    }

    &--gross {
      padding-top: 0;

      :deep(.field__value) {
        font-size: 0.9em;
      }
    }
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
