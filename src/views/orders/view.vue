<template>
<div>
  <top-nav :title="`Zamówienie nr ${order.code}`"></top-nav>

  <div class="order">

    <card>
      Content
    </card>

  </div>

</div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'

export default {
  components: {
    TopNav,
    Card
  },
  computed: {
    order () {
      return this.$store.getters['orders/getSelected']
    }
  },
  async created () {
    const loading = this.$vs.loading({ color: '#000' })
    await this.$store.dispatch('orders/get', this.$route.params.id)
    loading.close()
  }
}
</script>

<style lang="scss">

</style>
