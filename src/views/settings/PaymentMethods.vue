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

    {{ selectedMethod }}

    <PaymentMethodsForm
      :active="Boolean(selectedMethod)"
      :selected="selectedMethod"
      @close="selectedMethod = null"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Metody płatności"
  },
  "en": {
    "title": "Payment methods"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { PaymentMethod } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import Avatar from '@/components/layout/Avatar.vue'
import PaymentMethodsForm from '@/components/modules/paymentMethods/Form.vue'

import { UUID } from '@/interfaces/UUID'

export default Vue.extend({
  components: {
    PaginatedList,
    ListItem,
    Avatar,
    PaymentMethodsForm,
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
  flex-direction: row;
  align-items: flex-start;

  &__public,
  &__icon {
    margin-top: 6px;
  }

  &__public {
    width: 65px;
  }

  :first-child {
    margin-top: 0;
  }
}
</style>
