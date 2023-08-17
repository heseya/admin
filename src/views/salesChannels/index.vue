<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="salesChannels" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.SalesChannels.Add" to="/settings/sales-channels/create">
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
    "title": "Kanały sprzedaży",
    "add": "Dodaj kanał",
    "table": {
      "slug": "Identyfikator",
      "status": "Status",
      "default_currency": "Domyślna waluta",
      "default_language": "Domyślny język"
    }
  },
  "en": {
    "title": "Sales channels",
    "add": "Add channel",
    "table": {
      "slug": "Identifier",
      "status": "Status",
      "default_currency": "Default currency",
      "default_language": "Default language"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { SalesChannel } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'

import { TableConfig } from '@/interfaces/CmsTable'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },

  components: {
    PaginatedList,
  },

  computed: {
    tableConfig(): TableConfig<SalesChannel> {
      return {
        rowUrlBuilder: (row) => `/settings/sales-channels/${row.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'slug', label: this.$t('table.slug') as string },
          { key: 'status', label: this.$t('table.status') as string },
          { key: 'default_currency', label: this.$t('table.default_currency') as string },
          { key: 'default_language_id', label: this.$t('table.default_language') as string },
        ],
      }
    },
  },
})
</script>
