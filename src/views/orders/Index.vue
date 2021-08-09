<template>
  <div>
    <PaginatedList title="Zamówienia" :filters="filters" storeKey="orders">
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
    </PaginatedList>

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

<script lang="ts">
import Vue from 'vue'

import { DateInput, formatFilters, getRelativeDate } from '@/utils/utils'
import { ALL_FILTER_VALUE } from '@/consts/filters'

import ListItem from '@/components/layout/ListItem.vue'
import OrderFilter, { EMPTY_ORDER_FILTERS } from '@/components/modules/orders/OrderFilter.vue'
import ModalForm from '@/components/form/ModalForm.vue'
import PaginatedList from '@/components/PaginatedList.vue'

type OrderFilersType = typeof EMPTY_ORDER_FILTERS

export default Vue.extend({
  components: {
    ModalForm,
    OrderFilter,
    ListItem,
    PaginatedList,
  },
  data: () => ({
    filters: { ...EMPTY_ORDER_FILTERS } as OrderFilersType,
    areFiltersOpen: false,
  }),
  computed: {
    currency(): string {
      return this.$store.state.currency
    },
  },
  methods: {
    getRelativeDate(date: DateInput) {
      return getRelativeDate(date)
    },
    makeSearch(filters: OrderFilersType) {
      this.filters = filters

      const queryFilters = formatFilters(filters)

      this.$router.push({
        path: 'orders',
        query: { page: undefined, ...queryFilters },
      })
    },
  },
  created() {
    this.filters.search = (this.$route.query.search as string) || ''
    this.filters.status_id = (this.$route.query.status_id as string) || ALL_FILTER_VALUE
    this.filters.shipping_method_id =
      (this.$route.query.shipping_method_id as string) || ALL_FILTER_VALUE
  },
})
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
