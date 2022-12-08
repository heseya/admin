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
    "externalPoint": "Zewnętrzny punkt dostawy"
  },
  "en": {
    "phone": "Phone",
    "vat": "VAT ID",
    "externalPoint": "External Point"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { Address, Order, ShippingType } from '@heseya/store-core'

export default Vue.extend({
  name: 'OrderAddress',
  props: {
    order: {
      type: Object,
      required: true,
    } as Vue.PropOptions<Order>,
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
