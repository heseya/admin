<template>
  <div>
    <PaginatedList :title="$t('title').toString()" store-key="priceMaps" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.PriceMaps.Add" to="/settings/price-maps/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Cenniki produktowe",
    "add": "Dodaj cennik"
  },
  "en": {
    "title": "Price Maps",
    "add": "Add price map"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { PriceMap } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'

import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title').toString() }
  },

  components: {
    PaginatedList,
  },

  computed: {
    tableConfig(): TableConfig<PriceMap> {
      return {
        rowUrlBuilder: (row) => `/settings/price-maps/${row.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name').toString() },
          { key: 'description', label: this.$t('common.form.description').toString() },
          {
            key: 'currency',
            label: this.$t('common.currency').toString(),
            render: (_, channel) => channel.currency || '-',
          },
          {
            key: 'is_net',
            label: this.$t('common.form.type').toString(),
            render: (_, channel) =>
              `${channel.is_net ? this.$t('common.net') : this.$t('common.gross')}`,
          },
        ],
      }
    },
  },
})
</script>
