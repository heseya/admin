<template>
  <div>
    <PaginatedList
      v-if="item"
      store-key="deposits"
      :filters="{ sku: item.sku }"
      :table="tableConfig"
    >
      <template #title>
        <span class="gray-text">{{ $t('title') }}:</span>
        {{ item.name }}
      </template>

      <template #default="{ item: deposit }">
        <cms-table-row :key="deposit.id" :item="deposit" :headers="tableConfig.headers" no-hover>
          <template #quantity="{ rawValue }">
            <span v-if="rawValue > 0" class="success-text"> +{{ rawValue }} </span>
            <span v-else class="danger-text"> {{ rawValue }} </span>
          </template>

          <template #order="{ rawValue }">
            <router-link v-if="rawValue" :to="`/orders/${rawValue.id}`">
              {{ rawValue.code }}
            </router-link>
            <small v-else> - </small>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Historia zmian w magazynie",
    "table": {
      "sku": "SKU",
      "quantity": "Zmiana ilości",
      "order": "Zamówienie"
    }
  },
  "en": {
    "title": "History of changes in warehouse",
    "table": {
      "sku": "SKU",
      "quantity": "Quantity change",
      "order": "Order"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import { WarehouseDeposit, WarehouseItem } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

import { TableConfig } from '@/interfaces/CmsTable'

import { formatDate } from '@/utils/dates'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CmsTableRow,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) this.isModalActive = false
    next()
  },
  data: () => ({
    isModalActive: false,
  }),
  computed: {
    item(): WarehouseItem | null {
      return this.$accessor.items.getSelected
    },
    tableConfig(): TableConfig<WarehouseDeposit> {
      return {
        headers: [
          { key: 'sku', label: this.$t('table.sku') as string },
          {
            key: 'quantity',
            label: this.$t('table.quantity') as string,
          },
          {
            key: 'order',
            label: this.$t('table.order') as string,
            render: (v) => v?.code || '-',
          },
          {
            key: 'created_at',
            label: this.$t('common.form.date') as string,
            render: (v) => formatDate(v) || '-',
          },
        ],
      }
    },
  },
  async created() {
    this.$accessor.startLoading()
    const success = await this.$accessor.items.get(this.$route.params.id)
    this.$accessor.stopLoading()

    if (!success) {
      this.$toast.error(this.$t('errors.CLIENT_ERROR.NOT_FOUND') as string)
      this.$router.push('/items')
    }
  },
})
</script>
