<template>
  <div>
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

      <template #default="{ item: redirect }">
        <CmsTableRow
          :key="redirect.id"
          class="redirect-row"
          :item="redirect"
          :headers="tableConfig.headers"
          :to="`/settings/redirects/${redirect.id}`"
        >
          <template #type="{ rawValue }">
            <code :class="['http-code', `http-code--${rawValue}`]">{{ rawValue || '-' }}</code>
          </template>

          <template #source_url="{ rawValue }">
            <small>
              <code>{{ rawValue || '-' }}</code>
            </small>
          </template>

          <template #target_url="{ rawValue }">
            <small>
              <code>{{ rawValue || '-' }}</code>
            </small>
          </template>
        </CmsTableRow>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Przekierowania",
    "add": "Dodaj przekierowanie",
    "table": {
      "type": "Kod HTTP",
      "sourceUrl": "Źródło",
      "targetUrl": "Cel",
      "enabled": "Włączone"
    }
  },
  "en": {
    "title": "Redirects",
    "add": "Add redirect",
    "table": {
      "type": "HTTP Code",
      "sourceUrl": "Source",
      "targetUrl": "Target",
      "enabled": "Enabled"
    }
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import { Redirect } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CmsTableRow,
  },
  computed: {
    tableConfig(): TableConfig<Redirect> {
      return {
        rowUrlBuilder: (item) => `/settings/redirects/${item.id}`,
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string },
          { key: 'source_url', label: this.$t('table.sourceUrl') as string },
          { key: 'target_url', label: this.$t('table.targetUrl') as string },
          { key: 'type', label: this.$t('table.type') as string, width: `0.5fr` },
          { key: 'enabled', label: this.$t('table.enabled') as string, width: `0.5fr` },
        ],
      }
    },
  },
})
</script>

<style lang="scss">
.redirect-row .cms-table-row__col {
  padding: 8px;
}

.http-code {
  &--301,
  &--307 {
    background-color: #f6b758;
  }
  &--302,
  &--308 {
    background-color: #91e394;
  }
}
</style>
