<template>
  <card class="org-sales-channels">
    <top-nav
      tag="h2"
      :title="`${$t('title')}: ${organization.sales_channel.name}`"
      class="org-sales-channels__nav"
    >
      <icon-button size="small" type="primary" @click="$emit('edit')">
        <template #icon> <i class="bx bx-edit"></i> </template>
        {{ $t('action') }}
      </icon-button>
    </top-nav>

    <Loading :active="isLoading" />

    <div class="org-sales-channels__row">
      <AutocompleteInput
        v-model="form.price_map_id"
        mode="default"
        prop-mode="id"
        model-url="price-maps"
        rules="required"
        :label="$t('form.price_map').toString()"
      />

      <icon-button
        v-if="form.price_map_id"
        size="small"
        type="primary"
        :to="`/price-maps/${form.price_map_id}`"
        target="_blank"
      >
        <template #icon> <i class="bx bx-link-external"></i> </template>
      </icon-button>
    </div>

    <validated-input
      v-model="form.vat_rate"
      name="vat_rate"
      rules="required|not-negative|less-or-equal-than:100"
      :label="$t('form.vat_rate').toString()"
    />

    <AutocompleteInput
      v-model="form.shipping_method_ids"
      mode="multiple"
      prop-mode="id"
      model-url="shipping-methods"
      rules="required"
      :label="$t('form.shipping_methods').toString()"
    />
    <AutocompleteInput
      v-model="form.payment_method_ids"
      mode="multiple"
      prop-mode="id"
      model-url="payment-methods"
      rules="required"
      :label="$t('form.payment_methods').toString()"
    />

    <AutocompleteInput
      v-model="form.language_id"
      mode="default"
      prop-mode="id"
      model-url="languages"
      rules="required"
      :label="$t('form.language').toString()"
    />

    <app-button size="small" @click="handleSubmit">{{ $t('common.save') }}</app-button>
  </card>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Kanał sprzedaży",
    "action": "Zmień",
    "form": {
      "vat_rate": "Stawka VAT (%)",
      "language": "Język",
      "price_map": "Mapa cen",
      "shipping_methods": "Metody dostawy",
      "payment_methods": "Metody płatności"
    },
    "updated": "Zaktualizowano kanał sprzedaży",
    "updateFailed": "Aktualizacja nie powiodła się"
  },
  "en": {
    "title": "Sales channel",
    "action": "Change",
    "form": {
      "vat_rate": "VAT rate (%)",
      "language": "Language",
      "price_map": "Price map",
      "shipping_methods": "Shipping methods",
      "payment_methods": "Payment methods"
    },
    "updated": "Updated sales channel",
    "updateFailed": "Update failed"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Organization, SalesChannelUpdateDto } from '@heseya/store-core'

import Card from '@/components/layout/Card.vue'
import IconButton from '@/components/layout/IconButton.vue'
import TopNav from '@/components/layout/TopNav.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import Loading from '@/components/layout/Loading.vue'

export default defineComponent({
  components: { TopNav, Card, IconButton, AutocompleteInput, Loading },
  props: {
    organization: {
      type: Object as PropType<Organization>,
      required: true,
    },
  },
  data: () => ({
    isLoading: false,
    form: {
      price_map_id: '',
      vat_rate: '',
      shipping_method_ids: [],
      payment_method_ids: [],
      language_id: '',
    } as SalesChannelUpdateDto,
  }),

  watch: {
    organization: {
      handler(org: Organization) {
        this.form.price_map_id = org.sales_channel.price_map?.id ?? ''
        this.form.vat_rate = org.sales_channel.vat_rate ?? ''
        this.form.language_id = org.sales_channel.language?.id ?? ''
        this.form.shipping_method_ids = org.sales_channel.shipping_methods?.map((sm) => sm.id) ?? []
        this.form.payment_method_ids = org.sales_channel.payment_methods?.map((pm) => pm.id) ?? []
      },
      immediate: true,
    },
  },

  methods: {
    async handleSubmit() {
      this.isLoading = true
      const result = await this.$accessor.salesChannels.update({
        id: this.organization.sales_channel.id,
        item: this.form,
      })

      if (result) {
        this.$toast.success(this.$t('updated').toString())
        this.$emit('updated', result)
      } else {
        this.$toast.error(this.$t('updateFailed').toString())
      }
      this.isLoading = false
    },
  },
})
</script>

<style lang="scss" scoped>
.org-sales-channels {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  &__nav {
    margin-bottom: 8px;
  }

  &__row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4px;

    & > :first-child {
      flex-grow: 1;
    }
  }
}
</style>
