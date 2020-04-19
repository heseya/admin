<template>
  <div>
    <top-nav title="Opcje Dostawy"></top-nav>

    <card>
      <list>
        <list-item
          v-for="shippingMethod in shippingMethods"
          :key="shippingMethod.id"
          url="#"
          :hidden="!shippingMethod.public"
        >
          {{ shippingMethod.name }}
          <small>{{ shippingMethod.price }} zł</small>
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

export default {
  components: {
    TopNav,
    Card,
    List,
    ListItem
  },
  computed: {
    shippingMethods () {
      return this.$store.getters['shippingMethods/getData']
    }
  },
  methods: {
    async getShippingMethods () {
      const loading = this.$vs.loading({ color: '#000' })
      await this.$store.dispatch('shippingMethods/fetch')
      loading.close()
    }
  },
  created () {
    this.getShippingMethods()
  }
}
</script>
