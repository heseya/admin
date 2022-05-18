<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="paymentMethods">
      <template #default="{ item: paymentMethod }">
        <list-item :key="paymentMethod.id" @click="openModal(paymentMethod.id)">
          {{ paymentMethod.name }}
        </list-item>
      </template>
    </PaginatedList>

    <a-modal v-model="isModalActive" width="550px" :title="$t('methodDetails')">
      <div class="payment-method-details">
        <label>{{ $t('common.form.name') }}:</label>
        <span>{{ selectedMethod.name }}</span>

        <label>{{ $t('method.icon') }}:</label>
        <span>{{ selectedMethod.icon }}</span>

        <label>{{ $t('method.url') }}:</label>
        <span>{{ selectedMethod.url || $t('common.none') }}</span>

        <label>{{ $t('method.public') }}:</label>
        <span>{{ isPublic }}</span>
      </div>

      <template #footer></template>
    </a-modal>
  </div>
</template>

<i18n>
{
  "pl": {
    "title": "Metody płatności",
    "methodDetails": "Szczegóły metody płatności",
    "method": {
      "icon":"Ikona",
      "url":"Url",
      "public":"Publiczna"
    }
  },
  "en": {
    "title": "Payment methods",
    "methodDetails": "Payment method details",
    "method": {
      "icon":"Icon",
      "url":"Url",
      "public":"Public"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { LocaleMessage } from 'vue-i18n'
import { clone } from 'lodash'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'

import { UUID } from '@/interfaces/UUID'
import { PaymentMethodDto } from '@/interfaces/PaymentMethod'

const CLEAR_PAYMENT_METHOD: PaymentMethodDto = {
  name: '',
  icon: '',
  public: false,
  url: '',
}

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
  },
  data: () => ({
    isModalActive: false,
    selectedMethod: clone(CLEAR_PAYMENT_METHOD) as PaymentMethodDto,
  }),
  computed: {
    isPublic(): LocaleMessage {
      return this.selectedMethod.public ? this.$t('common.yes') : this.$t('common.no')
    },
  },
  methods: {
    openModal(id: UUID) {
      this.isModalActive = true
      this.selectedMethod = clone(this.$accessor.paymentMethods.getFromListById(id))
    },
  },
})
</script>

<style lang="scss" scoped>
.payment-method-details {
  display: flex;
  flex-direction: column;
  label {
    font-size: 0.8em;
    color: $gray-color-500;
    margin-top: 4px;
    margin-bottom: -4px;
  }
}
</style>
