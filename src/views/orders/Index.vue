<template>
  <div>
    <top-nav title="Zamówienia">
      <!-- <vs-button to="/orders/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button> -->
    </top-nav>

    <card>
      <app-empty v-if="!orders.length">Nie ma żadnego zamówienia</app-empty>
      <list>
        <list-item v-for="order in orders" :key="order.id" :url="`/orders/${order.id}`">
          <template #avatar>
            <i class="bx bx-check-circle"></i>
          </template>
          {{ order.code }}
          <small>{{ order.summary }} {{ currency }}</small>
          <template #action>
            {{ getRelativeDate(order.created_at) }}
          </template>
        </list-item>
      </list>
    </card>

    <vs-pagination color="dark" v-if="meta.last_page" v-model="page" :length="meta.last_page" />
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import Empty from '@/components/Empty.vue'
import { getRelativeDate } from '@/utils/utils'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem,
    appEmpty: Empty
  },
  data: () => ({
    page: 1
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
    }
  },
  watch: {
    page(page) {
      if (this.meta.current_page !== page) this.getOrders(page)
      window.scrollTo(0, 0)
    }
  },
  methods: {
    getRelativeDate(date) {
      return getRelativeDate(date)
    },
    async getOrders(page) {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('orders/fetch', { page })
      loading.close()
    }
  },
  created() {
    this.getOrders(1)
  }
}
</script>
