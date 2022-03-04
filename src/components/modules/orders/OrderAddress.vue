<template>
  <div class="address">
    <template v-if="address">
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
    <template v-else>
      <small class="address__error">{{ $t('common.none') }}</small>
    </template>
  </div>
</template>

<i18n>
{
  "pl": {
    "phone": "Telefon",
    "vat": "NIP"
  },
  "en": {
    "phone": "Phone",
    "vat": "VAT"
  }
}
</i18n>

<script lang="ts">
import { Address } from '@/interfaces/Address'
import Vue from 'vue'

export default Vue.extend({
  name: 'Address',
  props: {
    address: {
      type: Object,
      default: () => null,
    } as Vue.PropOptions<Address>,
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
    color: $gray-color-500;
    margin-top: 4px;
    margin-bottom: -4px;
  }

  &__error {
    counter-reset: #cccccc;
    font-weight: 300;
  }
}
</style>
