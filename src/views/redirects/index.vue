<template>
  <div class="narrower-page">
    <PaginatedList
      :title="$t('title').toString()"
      store-key="redirects"
      draggable
      :table="tableConfig"
    >
      <template #nav>
        <icon-button v-can="$p.Redirects.Add" to="/settings/redirects/create">
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
    "title": "Przekierowania",
    "add": "Dodaj przekierowanie"
  },
  "en": {
    "title": "Redirects",
    "add": "Add redirect"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Redirect } from '@heseya/store-core'

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
    tableConfig(): TableConfig<Redirect> {
      return {
        rowUrlBuilder: (item) => `/settings/redirects/${item.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'source_url', label: this.$t('table.source_url') as string },
          { key: 'target_url', label: this.$t('table_target_url') as string },
          { key: 'enabled', label: this.$t('table.enabled') as string },
        ],
      }
    },
  },
})
</script>
