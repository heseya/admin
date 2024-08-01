<template>
  <div>
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
        "public": "Publiczny",
        "private": "Prywatny"
      },
      "activity": {
        "title": "Aktywność",
        "active": "Aktywny",
        "inactive": "Nieaktywny"
      },
      "language": "Język",
      "default": "Domyślny kanał",
      "has_organization": "Posiada organizację"
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
      "language": "Language",
      "default": "Default channel",
      "has_organization": "Has organization"
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
          {
            key: 'activity',
            label: this.$t('table.activity.title').toString(),
            render: (key) => this.$t(`table.activity.${key}`).toString(),
          },
          {
            key: 'language',
            label: this.$t('table.language').toString(),
            render: (_, channel) => channel.language?.name || '-',
          },
          {
            key: 'default',
            label: this.$t('table.default').toString(),
            render: (_, channel) => !!channel.default,
          },
          {
            key: 'has_organization',
            label: this.$t('table.has_organization').toString(),
            render: (_, channel) => channel.organization_count > 0,
          },
        ],
      }
    },
  },
})
</script>
