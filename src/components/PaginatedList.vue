<template>
  <div class="paginated-list">
    <AppTopNav :title="title">
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

    <div class="paginated-list__footer" v-if="meta.last_page">
      <vs-select
        class="per-page-select"
        :value="itemsPerPage"
        @input="changePerPage"
        label="Elementów na stronę"
      >
        <vs-option v-for="option in perPageOptions" :key="option" :label="option" :value="option">
          {{ option }}
        </vs-option>
      </vs-select>

      <AppPagination :value="page" @input="changePage" :length="meta.last_page" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Draggable from 'vuedraggable'

import TopNav from '@/layout/TopNav.vue'
import Empty from '@/components/layout/Empty.vue'
import Pagination from '@/components/Pagination.vue'
import Card from '@/components/layout/Card.vue'
import List from '@/components/layout/List.vue'

import { ResponseMeta } from '@/interfaces/Response'
import { formatFilters } from '@/utils/utils'
import { debounce } from 'lodash'
import { formatApiError } from '@/utils/errors'

export default Vue.extend({
  components: {
    AppTopNav: TopNav,
    AppEmpty: Empty,
    AppPagination: Pagination,
    AppCard: Card,
    AppList: List,
    Draggable,
  },
  props: {
    title: {
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
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    page: 1,
    itemsPerPage: 24,
  }),
  computed: {
    items: {
      get(): unknown[] {
        return this.$store.getters[`${this.storeKey}/getData`]
      },
      async set(items: any[]) {
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
    perPageOptions(): number[] {
      return [12, 24, 36, 48, 64, 128, 250, 500]
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
        this.$vs.notification({
          color: 'danger',
          ...formatApiError(error),
        })
      }
    },
    filters: debounce(function (this: any) {
      this.getItems()
    }, 300),
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
  beforeMount() {
    this.page = Number(this.$route.query.page) || 1
    this.itemsPerPage = +(localStorage.getItem(`${this.storeKey}_per_page`) || 24)
    this.getItems()
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

.per-page-select {
  max-width: 140px;
  margin: 0px 4px;

  .vs-select__label {
    color: #334656 !important;
    font-size: 0.6em;
  }

  .vs-select__input {
    background-color: #f0f3f4;
  }

  .vs-pagination-content {
    margin: 10px 0px;
  }
}
</style>
