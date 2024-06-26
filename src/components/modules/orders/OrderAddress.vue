<template>
  <div class="address">
    <template
      v-if="
        address &&
        (orderShippingType === ShippingType.Address ||
          orderShippingType === ShippingType.Point ||
          billing)
      "
    >
      <span class="address__name">{{ address.name }}</span>
      <span class="address__field">{{ address.address }}</span>
      <span class="address__field"> {{ address.zip }} {{ address.city }} </span>
      <span class="address__field">
        {{ address.country_name || address.country }}
      </span>
      <template v-if="address.vat">
        <span class="address__subtitle">{{ $t('vat') }}:</span>
        <span class="address__field">{{ address.vat }}</span>
      </template>
      <template v-if="address.phone">
        <span class="address__subtitle">{{ $t('phone') }}:</span>
        <span class="address__field">{{ address.phone }}</span>
      </template>

      <tag v-if="billing" :type="order.invoice_requested ? 'success' : 'gray'" small>
        <i v-if="order.invoice_requested" class="bx bx-check"></i>
        <i v-else class="bx bx-x"></i>
        {{ order.invoice_requested ? $t('invoiceRequested') : $t('noInvoice') }}
      </tag>
    </template>

    <template v-else-if="orderShippingType === ShippingType.PointExternal">
      <span class="address__subtitle">{{ $t('externalPoint') }}:</span>
      <span class="address__name">{{ order.shipping_place }}</span>
    </template>

    <template v-else>
      <small class="address__error">{{ $t('common.none') }}</small>
    </template>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "phone": "Telefon",
    "vat": "NIP",
    "externalPoint": "Zewnętrzny punkt dostawy",
    "invoiceRequested": "Faktura",
    "noInvoice": "Brak faktury"
  },
  "en": {
    "phone": "Phone",
    "vat": "VAT ID",
    "externalPoint": "External Point",
    "invoiceRequested": "Invoice",
    "noInvoice": "No invoice"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Address, Order, ShippingType } from '@heseya/store-core'

export default defineComponent({
  name: 'OrderAddress',
  props: {
    order: {
      type: Object as PropType<Order>,
      required: true,
    },
    billing: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    address(): Address | undefined {
      return this.billing ? this.order.billing_address : (this.order.shipping_place as Address)
    },
    orderShippingType(): ShippingType {
      return this.order.shipping_method?.shipping_type || ShippingType.Address
    },
    ShippingType(): typeof ShippingType {
      return ShippingType
    },
  },
})
</script>

<style lang="scss" scoped>
.address {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;

  &__field {
    display: block;
  }

  &__subtitle {
    font-size: 0.8em;
    color: var(--gray-color-500);
    margin-top: 4px;
    margin-bottom: -4px;
    display: flex;
    align-items: center;
  }

  &__error {
    counter-reset: #cccccc;
    font-weight: 300;
  }
}
</style>
