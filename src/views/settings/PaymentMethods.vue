<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="paymentMethods">
      <template #default="{ item: paymentMethod }">
        <list-item :key="paymentMethod.id" @click="openModal(paymentMethod.id)">
          <template #avatar>
            <avatar color="#eee">
              <img v-if="paymentMethod.icon" :src="paymentMethod.icon" />
              <i v-else class="bx bx-image"></i>
            </avatar>
          </template>
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
        <avatar color="#eee" class="payment-method-details__icon">
          <img v-if="selectedMethod.icon" :src="selectedMethod.icon" />
          <i v-else class="bx bx-image"></i>
        </avatar>

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
import { PaymentMethod } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import Avatar from '@/components/layout/Avatar.vue'

import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    Avatar,
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

  &__public,
  &__icon {
    margin-top: 6px;
  }

  &__public {
    width: 65px;
  }

  label {
    font-size: 0.8em;
    color: $gray-color-500;
    margin-top: 4px;
    margin-bottom: -4px;
  }

  :first-child {
    margin-top: 0;
  }
}
</style>
