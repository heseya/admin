<template>
  <div class="paginated-list" :class="{ 'paginated-list--table': !!table }">
    <AppTopNav :title="title" :subtitle="subtitle">
      <slot name="nav"></slot>
    </AppTopNav>

    <AppCmsFilters v-if="$slots.filters" :filters="filters" @clear-filters="$emit('clear-filters')">
      <slot name="filters"></slot>
    </AppCmsFilters>

    <AppCard class="paginated-list__content">
      <Loading :active="isLoading"></Loading>

      <AppEmpty v-if="!items.length || isLoading">{{ emptyText }}</AppEmpty>
      <component
        :is="contentComponent"
        v-else
        v-model="items"
        :sort-filters="filters && filters.sort"
        v-bind="!!table ? { config: table, draggable } : {}"
        class="paginated-list__list"
        @sort="onSort"
      >
        <div v-for="item in items" :key="item.id" class="paginated-list__list-item">
          <slot :item="item">
            <cms-table-row
              v-if="table"
              :key="item.id"
              :item="item"
              :headers="table.headers"
              :to="table.rowUrlBuilder ? table.rowUrlBuilder(item) : null"
              @click="table.rowOnClick ? table.rowOnClick(item) : null"
            />
          </slot>
        </div>
      </component>
    </AppCard>

    <div v-if="meta.last_page" class="paginated-list__footer">
      <AppPagination :value="page" :length="meta.last_page" @input="changePage" />
      <AppPerPageSelect :value="itemsPerPage" @input="changePerPage" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import TopNav from '@/components/layout/TopNav.vue'
import Empty from '@/components/layout/Empty.vue'
import Pagination from '@/components/cms/Pagination.vue'
import Card from '@/components/layout/Card.vue'
import PerPageSelect from '@/components/cms/PerPageSelect.vue'
import CmsFilters from '@/components/cms/CmsFilters.vue'
import CmsTable from './cms/CmsTable.vue'
import CmsTableRow from './cms/CmsTableRow.vue'
import Loading from './layout/Loading.vue'

import { ResponseMeta } from '@/interfaces/Response'
import { TableConfig } from '@/interfaces/CmsTable'
import { StoreModulesKeys } from '@/store'
import { BaseItem } from '@/store/generator'

import { formatFilters } from '@/utils/utils'
import { formatApiNotificationError } from '@/utils/errors'

export default Vue.extend({
  components: {
    Draggable,
    AppTopNav: TopNav,
    AppEmpty: Empty,
    AppPagination: Pagination,
    AppCard: Card,
    AppPerPageSelect: PerPageSelect,
    AppCmsFilters: CmsFilters,
    Loading,
    CmsTable,
    CmsTableRow,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    storeKey: {
      type: String,
      required: true,
    } as Vue.PropOptions<Exclude<StoreModulesKeys, 'auth'>>,
    draggable: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'Nic nie znaleziono',
    },
    filters: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<Record<string, any>>,
    table: {
      type: Object,
      default: null,
    } as Vue.PropOptions<TableConfig>,
    params: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<Record<string, any>>,
  },
  data: () => ({
    page: 1,
    isLoading: false,
    itemsPerPage: 24,
  }),
  computed: {
    items: {
      get(): BaseItem[] {
        return this.$accessor[this.storeKey].getData
      },
      async set(items: BaseItem[]) {
        this.isLoading = true
        await this.$store.dispatch(
          `${this.storeKey}/reorder`,
          items.map(({ id }) => id),
        )
        await this.getItems()
        this.isLoading = false
      },
    },
    meta(): ResponseMeta {
      return this.$accessor[this.storeKey].getMeta
    },
    error(): any {
      return this.$accessor[this.storeKey].getError
    },
    contentComponent(): string {
      if (this.table) return 'CmsTable'
      return this.draggable ? 'Draggable' : 'div'
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = Number(page) || 1
      if (this.meta.current_page !== page) {
        this.getItems()
        window.scrollTo(0, 0)
      }
    },
    error(error) {
      if (error) {
        this.$toast.error(formatApiNotificationError(error))
      }
    },
  },
  beforeMount() {
    this.page = Number(this.$route.query.page) || 1
    this.itemsPerPage = +(localStorage.getItem(`${this.storeKey}_per_page`) || 24)
    this.getItems()
  },
  methods: {
    changePage(page: number) {
      if (this.page !== page) {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, page: String(page) },
        })
      }
    },
    changePerPage(perPage: number) {
      this.itemsPerPage = perPage
      localStorage.setItem(`${this.storeKey}_per_page`, String(perPage))

      if (this.page === 1) this.getItems()
      else this.$router.push({ path: this.$route.path, query: { ...this.$route.query, page: '1' } })
    },
    onSort(sortFilters: string) {
      this.$emit('search', { ...this.filters, sort: sortFilters })
    },
    async getItems() {
      this.isLoading = true

      const queryFilters = formatFilters(this.filters)
      await this.$accessor[this.storeKey].fetch({
        page: this.page,
        limit: this.itemsPerPage,
        ...queryFilters,
        ...this.params,
      })

      this.isLoading = false
    },
  },
})
</script>

<style lang="scss">
.paginated-list {
  position: relative;

  &__list {
    padding: 0;
  }

  &__list-item {
    width: 100%;

    > * {
      width: 100%;
    }
  }

  &__content {
    position: relative;
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-direction: column;

    > * {
      margin-top: 8px;
    }

    @media ($viewport-6) {
      flex-direction: row;

      > * {
        margin-top: 0;
      }
    }
  }

  &--table &__content {
    padding: 0;

    @media ($max-viewport-11) {
      all: unset;
    }
  }
}
</style>
