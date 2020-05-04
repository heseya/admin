<template>
  <div>
    <top-nav title="Zamówienia">
      <!-- <vs-button to="/orders/create" color="dark" icon>
        <i class="bx bx-plus"></i>
      </vs-button> -->
    </top-nav>

    <card>
      <list>
        <list-item v-for="order in orders" :key="order.id" :url="`/orders/${order.id}`">
          <template #avatar>
            <i class="bx bx-check-circle"></i>
          </template>
          {{ order.code }}
          <small>{{ order.summary }} PLN</small>
          <template #action>
            {{ getRelativeDate(order.created_at) }}
          </template>
        </list-item>
      </list>
    </card>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import List from '@/components/List.vue'
import ListItem from '@/components/ListItem.vue'
import { getRelativeDate } from '@/utils/utils'

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem
  },
  computed: {
    orders() {
      return this.$store.getters['orders/getData']
    }
  },
  methods: {
    getRelativeDate(date) {
      return getRelativeDate(date)
    },
    async getOrders() {
      const loading = this.$vs.loading({ color: '#000' })

      try {
        await this.$store.dispatch('orders/fetch')
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    }
  },
  created() {
    this.getOrders()
  }
}
</script>
