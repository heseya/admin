<template>
  <div class="narrower-page">
    <PaginatedList :title="$t('title')" store-key="pages" draggable :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Pages.Add" to="/pages/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: page }">
        <cms-table-row
          :key="page.id"
          :item="page"
          :headers="tableConfig.headers"
          :to="`/pages/${page.id}`"
          draggable
        >
          <template #slug="{ value }">
            <code>{{ value }}</code>
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Strony",
    "add": "Dodaj stronę"
  },
  "en": {
    "title": "Pages",
    "add": "Add page"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import PaginatedList from '@/components/PaginatedList.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import { Sale } from '@heseya/store-core'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    CmsTableRow,
    PaginatedList,
  },
  computed: {
    tableConfig(): TableConfig<Sale> {
      return {
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, width: '2fr' },
          { key: 'slug', label: this.$t('common.form.slug') as string, width: '3fr' },
          { key: 'public', label: this.$t('common.form.visibility') as string, width: '1fr' },
        ],
      }
    },
  },
})
</script>
