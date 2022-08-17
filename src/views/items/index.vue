<template>
  <div>
    <PaginatedList
      :title="$t('title')"
      store-key="items"
      :filters="filters"
      :table="tableConfig"
      @search="makeSearch"
      @clear-filters="clearFilters"
    >
      <template #nav>
        <icon-button v-can="$p.Items.Add" data-cy="add-btn" @click="openModal()">
          <template #icon>
            <i class="bx bx-plus"></i>
          </template>
          {{ $t('add') }}
        </icon-button>
      </template>

      <template #filters>
        <items-filter :filters="filters" @search="makeSearch" />
      </template>
    </PaginatedList>

    <item-modal
      v-model="editedItem"
      :visible="isModalActive"
      :item="selectedItem"
      :disabled="!canModify"
      @close="isModalActive = false"
    />
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Magazyn",
    "add": "Dodaj przedmiot",
    "table": {
      "sku": "SKU",
      "quantity": "Ilość w magazynie",
      "unlimited": "Nieograniczona możliwość zakupu",
      "availibility": "Dostępność",
      "availibilityTime": "w {time} dni",
      "availibilityDate": "od {date}"
    }
  },
  "en": {
    "title": "Warehouse",
    "add": "Add item",
    "editTitle": "Edit item",
    "newTitle": "New item",
    "deleteText": "Are you sure you want to delete this item?",
    "table": {
      "sku": "SKU",
      "quantity": "Quantity in stock",
      "unlimited": "Unlimited purchase",
      "availibility": "Availibility",
      "availibilityTime": "in {time} days",
      "availibilityDate": "from {date}"
    }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { WarehouseItem, WarehouseItemCreateDto } from '@heseya/store-core'

import PaginatedList from '@/components/PaginatedList.vue'
import ItemsFilter, {
  EMPTY_ITEMS_FILTERS,
  ItemsFilersType,
} from '@/components/modules/items/ItemsFilter.vue'
import ItemModal from '@/components/modules/items/ItemModal.vue'

import { UUID } from '@/interfaces/UUID'
import { TableConfig } from '@/interfaces/CmsTable'

import { ALL_FILTER_VALUE } from '@/consts/filters'
import { formatFilters } from '@/utils/utils'
import { formatDate } from '@/utils/dates'

const EMPTY_FORM: WarehouseItemCreateDto = {
  name: '',
  sku: '',
  unlimited_stock_shipping_time: null,
  unlimited_stock_shipping_date: null,
}

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('title') as string }
  },
  components: {
    PaginatedList,
    ItemsFilter,
    ItemModal,
  },
  beforeRouteLeave(to, from, next) {
    if (this.isModalActive) this.isModalActive = false
    next()
  },
  data: () => ({
    filters: { ...EMPTY_ITEMS_FILTERS } as ItemsFilersType,
    isModalActive: false,
    editedItem: { ...EMPTY_FORM } as Omit<
      WarehouseItemCreateDto & Partial<WarehouseItem>,
      'metadata' | 'metadata_private'
    >,
    selectedItemId: null as null | UUID,
  }),
  computed: {
    depositsError(): Error | null {
      // @ts-ignore // TODO: fix extended store getters typings
      return this.$accessor.items.getDepositError
    },
    canModify(): boolean {
      return this.$can(this.editedItem.id ? this.$p.Items.Edit : this.$p.Items.Add)
    },
    selectedItem(): null | WarehouseItem {
      return this.$accessor.items.getSelected?.id === this.selectedItemId
        ? this.$accessor.items.getSelected
        : null
    },
    tableConfig(): TableConfig<WarehouseItem> {
      return {
        rowOnClick: (item) => this.openModal(item.id),
        headers: [
          { key: 'name', label: this.$t('common.form.name') as string, sortable: true },
          { key: 'sku', label: this.$t('table.sku') as string, width: '0.6fr', sortable: true },
          {
            key: 'quantity',
            label: this.$t('table.quantity') as string,
            width: '0.6fr',
            sortable: true,
          },
          {
            key: 'availibility',
            label: this.$t('table.availibility') as string,
            width: '0.6fr',
            sortable: true,
            render: (_v, item) => {
              if (item.shipping_time)
                return this.$t('table.availibilityTime', { time: item.shipping_time }) as string
              if (item.shipping_date)
                return this.$t('table.availibilityDate', {
                  date: formatDate(item.shipping_date),
                }) as string
              return '-'
            },
          },
          {
            key: 'unlimited',
            label: this.$t('table.unlimited') as string,
            width: '0.6fr',
            sortable: true,
            render: (_v, item) =>
              !!item.unlimited_stock_shipping_time || !!item.unlimited_stock_shipping_date,
          },
        ],
      }
    },
  },
  watch: {
    depositsError(depositsError) {
      if (depositsError) {
        // eslint-disable-next-line no-console
        console.error('depositsError', depositsError)
        this.$toast.error(depositsError.message)
      }
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.sold_out = (this.$route.query.sold_out as string) || ALL_FILTER_VALUE
    this.filters.sort = (this.$route.query.sort as string) || ''
  },
  methods: {
    makeSearch(filters: ItemsFilersType) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'items',
        query: { page: undefined, ...queryFilters },
      })
    },

    clearFilters() {
      this.filters.search = ''
      this.filters.sold_out = ALL_FILTER_VALUE
      this.makeSearch({ ...EMPTY_ITEMS_FILTERS })
    },

    async openModal(id?: UUID) {
      if (!this.$verboseCan(this.$p.Items.ShowDetails)) return
      this.isModalActive = true
      if (id) {
        const item = await this.$accessor.items.get(id)
        if (!item) return

        this.editedItem = cloneDeep(item)
        this.selectedItemId = id
      } else {
        this.editedItem = { ...EMPTY_FORM }
        this.selectedItemId = null
      }
    },
  },
})
</script>
