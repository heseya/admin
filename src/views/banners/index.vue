<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title').toString()" store-key="banners" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Banners.Add" to="/settings/banners/create">
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
    "title": "Bannery",
    "add": "Dodaj banner",
    "table": {
      "slug": "Identyfikator",
      "quantity": "Ilosć grafik",
      "active": "Aktywny"
    }
  },
  "en": {
    "title": "Banners",
    "add": "Add banner",
    "table": {
      "slug": "Identifier",
      "quantity": "Quantity of graphics",
      "active": "Active"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Banner } from '@heseya/store-core'

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
    tableConfig(): TableConfig<Banner> {
      return {
        rowUrlBuilder: (row) => `/settings/banners/${row.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'slug', label: this.$t('table.slug') as string },
          {
            key: 'banner_media',
            label: this.$t('table.quantity') as string,
            render: (v) => v.length,
          },
          { key: 'active', label: this.$t('table.active') as string },
        ],
      }
    },
  },
})
</script>
