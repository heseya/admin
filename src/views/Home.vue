<template>
  <div>
    <top-nav :title="storeName"></top-nav>

    <div class="home">
      <div>
        <card>
          <div class="flex-column">
            <h2 class="section-title">Przychody</h2>
          </div>
        </card>
      </div>

      <div>
        <card>
          <h2 class="section-title" style="margin-bottom: 20px">Ostatnie zamówienia</h2>
          <list-item class="order" v-for="order in orders" :key="order.id" :url="`/orders/${order.id}`">
            <div>{{ order.code }}</div>
            <small>{{ getRelativeDate(order.created_at) }}</small>

            <template #action>
              <div>{{ order.summary }} {{ currency }}</div>
            </template>
          </list-item>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import { getRelativeDate } from '@/utils/utils'
import ListItem from '@/components/ListItem'

export default {
  components: {
    ListItem,
    TopNav,
    Card,
  },
  computed: {
    storeName() {
      return this.$store.state.env.store_name ?? 'E-Commerce Dog'
    },
    orders() {
      return this.$store.getters['orders/getData']
    },
    currency() {
      return this.$store.state.currency
    },
  },
  methods: {
    getRelativeDate(date) {
      return getRelativeDate(date)
    },
    async getOrders() {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('orders/fetch', {
        page: 1,
        limit: 6,
      })
      loading.close()
    },
  },
  created() {
    this.getOrders()
  },
}
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 32px;

  @media screen and (max-width: 780px) {
    grid-template-columns: 1fr;
  }

  .order {
    padding: 10px 15px;
  }
}

.section-title {
  font-family: $font-sec;
  font-weight: 300;
  margin: 0;
  font-size: 1.5em;
  display: flex;
  align-items: center;

  .bx {
    font-size: 0.9em;
    margin-right: 4px;
  }
}
</style>
