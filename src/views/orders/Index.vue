<template>
  <div>
    <top-nav title="Zamówienia">
      <vs-button color="dark" @click="areFiltersOpen = true" icon>
        <i class="bx bx-filter-alt"></i>
      </vs-button>
    </top-nav>

    <card>
      <app-empty v-if="!orders.length">Nie ma żadnego zamówienia</app-empty>
      <list>
        <list-item v-for="order in orders" :key="order.id" :url="`/orders/${order.id}`">
          <template #avatar>
            <vs-avatar :success="order.payed" :danger="!order.payed">
              <i class="bx bx-dollar"></i>
            </vs-avatar>
          </template>
          {{ order.code }}
          <small>{{ order.summary }} {{ currency }}</small>
          <template #action>
            <div :style="{ color: `#${order.status.color}` }">{{ order.status.name }}</div>
            <div>{{ getRelativeDate(order.created_at) }}</div>
          </template>
        </list-item>
      </list>
    </card>

    <pagination v-if="meta.last_page" :value="page" @input="changePage" :length="meta.last_page" />

    <vs-dialog width="550px" not-center v-model="areFiltersOpen">
      <template #header>
        <h4>Filtry</h4>
      </template>
      <modal-form>
        <order-filter :filters="filters" @search="makeSearch" />
      </modal-form>
    </vs-dialog>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import { getRelativeDate } from '@/utils/utils'
import Pagination from '@/components/Pagination.vue'
import OrderFilter, {
  EMPTY_ORDER_FILTERS,
  ALL_FILTER_VALUE
} from '@/components/OrderFilter'
import ModalForm from '@/components/ModalForm'

export default {
  components: {
    ModalForm,
    OrderFilter,
    TopNav,
    Card,
    List,
    ListItem,
    appEmpty: Empty,
    Pagination,
  },
  data: () => ({
    page: 1,
    filters: { ...EMPTY_ORDER_FILTERS },
    areFiltersOpen: false,
  }),
  computed: {
    orders() {
      return this.$store.getters['orders/getData']
    },
    meta() {
      return this.$store.getters['orders/getMeta']
    },
    currency() {
      return this.$store.state.currency
    },
  },
  watch: {
    '$route.query'({ page }) {
      this.page = page || 1
      if (this.meta.current_page !== page) {
        this.getOrders()
        window.scrollTo(0, 0)
      }
    },
  },
  methods: {
    getRelativeDate(date) {
      return getRelativeDate(date)
    },
    changePage(page) {
      if (this.page !== page) {
        this.$router.push({ path: 'orders', query: { ...this.$route.query, page } })
      }
    },
    formatFilters(filters) {
      return Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== ALL_FILTER_VALUE && v !== ''),
      )
    },
    makeSearch(filters) {
      this.filters = filters

      const queryFilters = this.formatFilters(filters)

      this.$router.push({
        path: 'orders',
        query: { page: undefined, ...queryFilters },
      })
    },
    async getOrders() {
      const loading = this.$vs.loading({ color: '#000' })
      const queryFilters = this.formatFilters(this.filters)
      await this.$store.dispatch('orders/fetch', {
        page: this.page,
        ...queryFilters,
      })
      loading.close()
    },
  },
  created() {
    this.page = this.$route.query.page || 1
    this.filters.search = this.$route.query.search || ''
    this.filters.category = this.$route.query.category || ALL_FILTER_VALUE
    this.filters.brand = this.$route.query.brand || ALL_FILTER_VALUE
    this.getOrders()
  },
}
</script>
