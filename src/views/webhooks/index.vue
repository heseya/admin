<template>
  <div>
    <PaginatedList :title="$t('title')" store-key="webhooks" :table="tableConfig">
      <template #nav>
        <icon-button v-can="$p.Webhooks.Add" to="/webhooks/create">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #default="{ item: webhook }">
        <cms-table-row
          :key="webhook.id"
          :item="webhook"
          :headers="tableConfig.headers"
          :to="`/webhooks/${webhook.id}`"
        >
          <template #code>
            <b>{{ webhook.code }}</b>
          </template>
          <template #description="{ rawValue }">
            <small>{{ rawValue || '-' }}</small>
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
    "add": "Dodaj webhook"
  },
  "en": {
    "title": "Webhooks",
    "add": "Add webhook"
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
// import ListItem from '@/components/layout/ListItem.vue'
import PaginatedList from '@/components/PaginatedList.vue'
// import CmsTable from '@/components/cms/CmsTable.vue'
import { TableConfig } from '@/interfaces/CmsTable'
import CmsTableRow from '@/components/cms/CmsTableRow.vue'

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    // ListItem,
    PaginatedList,
    // CmsTable,
    CmsTableRow,
  },
  computed: {
    tableConfig(): TableConfig {
      return {
        headers: [
          {
            key: 'name',
            label: 'Nazwa',
            render: (v: any) => v,
            width: '0.8fr',
          },
          {
            key: 'url',
            label: 'Link',
            render: (v: any) => v,
            width: '1.2fr',
            wrap: true,
          },
          {
            key: 'events',
            label: 'Eventy',
            render: (events: string[]) => events,
            width: '1.2fr',
            wrap: true,
          },
          {
            key: 'secret',
            label: 'Secret',
            render: (v: string) => Boolean(v),
            width: '1fr',
          },
          {
            key: 'with_hidden',
            label: 'Z ukrytymi',
            render: (v: any) => v,
            width: '1fr',
          },
          {
            key: 'with_issuer',
            label: 'Z wywołującymi',
            render: (v: any) => v,
            width: '1fr',
          },
        ],
      }
    },
    webhooksTableConfig(): TableConfig {
      return {
        headers: [
          {
            key: 'name',
            label: 'hello',
            render: (v: any) => v,
          },
          {
            key: 'url',
            label: 'mello',
            render: (v: any) => v,
          },
          {
            key: 'c',
            label: 'tello',
            render: (v: any) => v,
          },
          // {
          //   key: 'method',
          //   label: this.$t('table.method') as string,
          //   render: (v: keyof typeof PAYMENT_METHODS) => PAYMENT_METHODS[v] || v,
          // },
          // {
          //   key: 'amount',
          //   label: this.$t('table.amount') as string,
          //   render: (v: number) => this.formatCurrency(v),
          // },
          // { key: 'paid', label: this.$t('table.success') as string },
        ],
      }
    },
  },
})
</script>
