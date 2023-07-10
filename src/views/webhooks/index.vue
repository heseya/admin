<template>
  <div>
    <PaginatedList
      :title="$t('title').toString()"
      store-key="webhooks"
      :filters="filters"
      :table="tableConfig"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Webhooks.Add" to="/webhooks/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <WebhookFilter :filters="filters" @search="makeSearch" />
      </template>

      <template #default="{ item: webhook }">
        <cms-table-row
          :key="webhook.id"
          :item="webhook"
          :headers="tableConfig.headers"
          :to="`/webhooks/${webhook.id}`"
        >
          <template #events="{ value }">
            <CmsTableCellList :items="value" />
          </template>
        </cms-table-row>
      </template>
    </PaginatedList>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Webhooki",
    "add": "Dodaj webhook",
    "name": "Nazwa",
    "link": "Link",
    "events": "Eventy",
    "secret": "Secret",
    "withHidden": "Z ukrytymi",
    "withIssuer": "Z wywołującymi"
  },
  "en": {
    "title": "Webhooks",
    "add": "Add webhook",
    "name": "Name",
    "link": "Link",
    "events": "Events",
    "secret": "Secret",
    "withHidden": "With hidden",
    "withIssuer": "With issuer"
  }
}
</i18n>

<script lang="ts">
import { defineComponent } from 'vue'
import PaginatedList from '@/components/PaginatedList.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'
import WebhookFilter from '@/components/modules/webhooks/WebhookFilter.vue'
import {
  EMPTY_WEBHOOK_FILTERS,
  WebhookFilersType,
} from '@/components/modules/webhooks/WebhookFilter.vue'
import { formatFilters } from '@/utils/utils'
import CmsTableCellList from '@/components/cms/CmsTableCellList.vue'

export default defineComponent({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    CmsTableRow,
    WebhookFilter,
    CmsTableCellList,
  },
  data: () => ({
    filters: { ...EMPTY_WEBHOOK_FILTERS } as WebhookFilersType,
  }),
  computed: {
    tableConfig(): TableConfig {
      return {
        headers: [
          {
            key: 'name',
            label: this.$t('name') as string,
            render: (v: any) => v,
            width: '0.8fr',
            wordBreak: 'break-word',
          },
          {
            key: 'url',
            label: this.$t('link') as string,
            render: (v: any) => v,
            width: '1.2fr',
            wordBreak: 'break-all',
          },
          {
            key: 'events',
            label: this.$t('events') as string,
            render: (events: string[]) => events,
            width: '1.2fr',
            wordBreak: 'break-word',
          },
          {
            key: 'secret',
            label: this.$t('secret') as string,
            render: (v: string) => Boolean(v),
            width: '1fr',
          },
          {
            key: 'with_hidden',
            label: this.$t('withHidden') as string,
            render: (v: any) => v,
            width: '1fr',
          },
          {
            key: 'with_issuer',
            label: this.$t('withIssuer') as string,
            render: (v: any) => v,
            width: '1fr',
          },
        ],
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
  },
  methods: {
    makeSearch(filters: WebhookFilersType) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'webhooks',
        query: { page: undefined, ...queryFilters },
      })
    },

    clearFilters() {
      this.filters.search = ''
      this.makeSearch({ ...EMPTY_WEBHOOK_FILTERS })
    },
  },
})
</script>
