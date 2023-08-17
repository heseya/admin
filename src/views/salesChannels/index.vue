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
      "status": {
        "title": "Status",
        "active": "Aktywny",
        "inactive": "Nieaktywny",
        "hidden": "Ukryty"
      },
      "default_currency": "Domyślna waluta",
      "default_language": "Domyślny język"
    }
  },
  "en": {
    "title": "Sales channels",
    "add": "Add channel",
    "table": {
      "slug": "Identifier",
      "status": {
        "title": "Status",
        "active": "Active",
        "inactive": "Inactive",
        "hidden": "Hidden"
      },
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
    return { title: this.$t('title').toString() }
  },

  components: {
    PaginatedList,
  },

  computed: {
    tableConfig(): TableConfig<SalesChannel> {
      return {
        rowUrlBuilder: (row) => `/settings/sales-channels/${row.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name').toString() },
          { key: 'slug', label: this.$t('table.slug').toString() },
          {
            key: 'status',
            label: this.$t('table.status.title').toString(),
            render: (key) => this.$t(`table.status.${key}`).toString(),
          },
          { key: 'vat_rate', label: this.$t('table.vat_rate').toString() },
          {
            key: 'default_currency',
            label: this.$t('table.default_currency').toString(),
            render: (_, channel) => channel.default_currency.name,
          },
          {
            key: 'default_language',
            label: this.$t('table.default_language').toString(),
            render: (_, channel) => channel.default_language.name,
          },
        ],
      }
    },
  },
})
</script>
