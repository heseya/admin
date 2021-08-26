<template>
  <div class="paginated-list">
    <AppTopNav :title="title" :subtitle="subtitle">
      <slot name="nav"></slot>
    </AppTopNav>

    <AppCard>
      <AppEmpty v-if="!items.length">{{ emptyText }}</AppEmpty>
      <AppList class="paginated-list__list">
        <Draggable v-if="draggable" v-model="items">
          <template v-for="item in items">
            <slot :item="item" />
          </template>
        </Draggable>

        <template v-for="item in items" v-else>
          <slot :item="item" />
        </template>
      </AppList>
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
import List from '@/components/layout/List.vue'
import PerPageSelect from '@/components/cms/PerPageSelect.vue'

import { ResponseMeta } from '@/interfaces/Response'
import { formatFilters } from '@/utils/utils'
import { debounce } from 'lodash'
import { formatApiNotificationError } from '@/utils/errors'
import { BaseItem } from '@/store/generator'

export default Vue.extend({
  components: {
    Draggable,
    AppTopNav: TopNav,
    AppEmpty: Empty,
    AppPagination: Pagination,
    AppCard: Card,
    AppList: List,
    AppPerPageSelect: PerPageSelect,
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
    },
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
    params: {
      type: Object,
      default: () => ({}),
    } as Vue.PropOptions<Record<string, any>>,
  },
  data: () => ({
    page: 1,
    itemsPerPage: 24,
  }),
  computed: {
    items: {
      get(): BaseItem[] {
        return this.$store.getters[`${this.storeKey}/getData`]
      },
      async set(items: BaseItem[]) {
        this.$accessor.startLoading()
        await this.$store.dispatch(
          `${this.storeKey}/reorder`,
          items.map(({ id }) => id),
        )
        await this.getItems()
        this.$accessor.stopLoading()
      },
    },
    meta(): ResponseMeta {
      return this.$store.getters[`${this.storeKey}/getMeta`]
    },
    error(): any {
      return this.$store.getters[`${this.storeKey}/getError`]
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = page || 1
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
    filters: debounce(function (this: any) {
      this.getItems()
    }, 300),
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
    async getItems() {
      this.$accessor.startLoading()

      const queryFilters = formatFilters(this.filters)
      await this.$store.dispatch(`${this.storeKey}/fetch`, {
        page: this.page,
        limit: this.itemsPerPage,
        ...queryFilters,
        ...this.params,
      })

      this.$accessor.stopLoading()
    },
  },
})
</script>

<style lang="scss">
.paginated-list {
  &__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
}
</style>
