<template>
  <div>
    <ItemsPaginatedList title="Zamówienia" :filters="filters" storeKey="orders">
      <template #nav>
        <vs-button color="dark" @click="areFiltersOpen = true" icon>
          <i class="bx bx-filter-alt"></i>
        </vs-button>
      </template>

      <template v-slot="{ item: order }">
        <list-item :key="order.id" :url="`/orders/${order.id}`">
          <template #avatar>
            <vs-avatar :success="order.payed" :danger="!order.payed">
              <i class="bx bx-dollar"></i>
            </vs-avatar>
          </template>
          {{ order.code }}
          <span v-if="order.delivery_address"> - {{ order.delivery_address.name }}</span>
          <small>{{ order.summary }} {{ currency }}</small>
          <template #action>
            <div class="list-item__action--orders">
              <vs-tooltip>
                <div v-if="order.comment">
                  <i class="bx bx-comment"></i>
                </div>
                <template #tooltip>
                  {{ order.comment }}
                </template>
              </vs-tooltip>
              <div>
                <div :style="{ color: `#${order.status.color}` }">{{ order.status.name }}</div>
                <div>{{ getRelativeDate(order.created_at) }}</div>
              </div>
            </div>
          </template>
        </list-item>
      </template>
    </ItemsPaginatedList>

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
import ListItem from '@/components/ListItem.vue'
import { formatFilters, getRelativeDate } from '@/utils/utils'
import OrderFilter, { EMPTY_ORDER_FILTERS } from '@/components/OrderFilter'
import ModalForm from '@/components/ModalForm'
import ItemsPaginatedList from '@/components/ItemsPaginatedList.vue'
import { ALL_FILTER_VALUE } from '@/consts/filters'

export default {
  components: {
    ModalForm,
    OrderFilter,
    ListItem,
    ItemsPaginatedList,
  },
  data: () => ({
    filters: { ...EMPTY_ORDER_FILTERS },
    areFiltersOpen: false,
  }),
  computed: {
    currency() {
      return this.$store.state.currency
    },
  },
  methods: {
    getRelativeDate(date) {
      return getRelativeDate(date)
    },
    makeSearch(filters) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'orders',
        query: { page: undefined, ...queryFilters },
      })
    },
  },
  created() {
    this.filters.search = this.$route.query.search || ''
    this.filters.category = this.$route.query.category || ALL_FILTER_VALUE
    this.filters.brand = this.$route.query.brand || ALL_FILTER_VALUE
  },
}
</script>

<style lang="scss" scoped>
.list-item__action--orders {
  display: flex;
  align-items: center;

  .bx-comment {
    margin: 0 12px;
  }
}
</style>
