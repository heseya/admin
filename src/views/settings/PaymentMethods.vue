<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="paymentMethods">
      <template #default="{ item: paymentMethod }">
        <list-item :key="paymentMethod.id" @click="openModal(paymentMethod.id)">
          {{ paymentMethod.name }}
          <template #action>
            <boolean-tag
              :value="paymentMethod.public"
              :true-text="$t('common.visible')"
              :false-text="$t('common.hidden')"
          /></template>
        </list-item>
      </template>
    </PaginatedList>

    <a-modal
      v-if="selectedMethod"
      :visible="Boolean(selectedMethod)"
      width="550px"
      :title="$t('methodDetails')"
      :footer="null"
      @cancel="selectedMethod = null"
    >
      <div class="payment-method-details">
        <label>{{ $t('common.form.name') }}:</label>
        <span>{{ selectedMethod.name }}</span>

        <label>{{ $t('method.icon') }}:</label>
        <span>{{ selectedMethod.icon }}</span>

        <label>{{ $t('method.url') }}:</label>
        <span>{{ selectedMethod.url || $t('common.none') }}</span>

        <label>{{ $t('method.public') }} :</label>
        <boolean-tag :value="selectedMethod.public" class="payment-method-details__public" />
      </div>
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

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'

import { UUID } from '@/interfaces/UUID'
import { PaymentMethod } from '@/interfaces/PaymentMethod'

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
  },
  data: () => ({
    selectedMethod: null as PaymentMethod | null,
  }),

  methods: {
    openModal(id: UUID) {
      this.selectedMethod = this.$accessor.paymentMethods.getFromListById(id)
    },
  },
})
</script>

<style lang="scss" scoped>
.payment-method-details {
  display: flex;
  flex-direction: column;

  &__public {
    margin-top: 6px;
    width: 65px;
  }

  label {
    font-size: 0.8em;
    color: $gray-color-500;
    margin-top: 4px;
    margin-bottom: -4px;
  }
}
</style>
