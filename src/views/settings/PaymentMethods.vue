<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="paymentMethods">
      <template #default="{ item: paymentMethod }">
        <list-item :key="paymentMethod.id" @click="openModal(paymentMethod.id)">
          <template #avatar>
            <avatar color="#eee">
              <img
                v-if="paymentMethod.icon"
                :src="paymentMethod.icon"
                style="object-fit: contain"
              />
              <i v-else class="bx bx-image"></i>
            </avatar>
          </template>
          {{ paymentMethod.name }}
          <small>{{ $t(`type.${paymentMethod.type}`) }}</small>
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
        <field :label="$t('method.icon').toString()">
          <avatar color="#eee" class="payment-method-details__icon">
            <img
              v-if="selectedMethod.icon"
              style="object-fit: contain"
              :src="selectedMethod.icon"
            />
            <i v-else class="bx bx-image"></i>
          </avatar>
        </field>

        <field :label="$t('common.form.name').toString()">
          <span>{{ selectedMethod.name }}</span>
        </field>

        <field :label="$t('common.form.type').toString()">
          <span>{{ $t(`type.${selectedMethod.type}`) }}</span>
        </field>

        <field :label="$t('method.public').toString()">
          <boolean-tag :value="selectedMethod.public" class="payment-method-details__tag" />
        </field>

        <field :label="$t('method.creates_default_payment').toString()">
          <boolean-tag
            :value="selectedMethod.creates_default_payment"
            class="payment-method-details__tag"
          />
        </field>
      </div>
    </a-modal>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Metody płatności",
    "methodDetails": "Szczegóły metody płatności",
    "method": {
      "icon": "Ikona",
      "public": "Publiczna",
      "type": {
        "prepaid": "Przedpłacona",
        "postpaid": "Opłacana po dostawie"
      },
      "creates_default_payment": "Tworzy płatność automatycznie po stworzeniu zamówienia"
    }
  },
  "en": {
    "title": "Payment methods",
    "methodDetails": "Payment method details",
    "method": {
      "icon": "Icon",
      "public": "Public",
      "type": {
        "prepaid": "Prepaid",
        "postpaid": "Postpaid"
      },
      "creates_default_payment": "Creates payment automatically after order creation"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { PaymentMethod } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ListItem from '@/components/layout/ListItem.vue'
import Avatar from '@/components/layout/Avatar.vue'
import Field from '@/components/Field.vue'

import { UUID } from '@/interfaces/UUID'

export default defineComponent({
  components: {
    PaginatedList,
    ListItem,
    Avatar,
    Field,
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
  align-items: flex-start;

  &__tag,
  &__icon {
    margin-top: 6px;
  }

  &__tag {
    width: 65px;
  }

  :first-child {
    margin-top: 0;
  }
}
</style>
