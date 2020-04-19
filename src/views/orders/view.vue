<template>
<div>
  <top-nav :title="`Zamówienie nr ${order.code}`"></top-nav>

  <div class="order">

    <card>
      <h2 class="section-title">Koszyk</h2>
      <div v-for="item in order.items" :key="item.id" class="product">
        <span>{{ item.product.name }}</span>&nbsp;<small>(x{{ item.qty }})</small><br />
        <small>{{ item.product.price }} PLN</small>
      </div>
    </card>

    <card>
      <h2 class="section-title">Przesyłka</h2>
      <div class="shipping">
        <span class="shipping__name">{{ order.shipping_method.name }}</span>
        <small class="shipping__price">{{ order.shipping_method.price }} PLN</small>
      </div>
      <br />
      <h2 class="section-title">Adres dostawy</h2>
      <app-address :address="order.delivery_address" />
      <br />
      <template v-if="order.invoice_address">
        <h2 class="section-title">Faktura</h2>
        <app-address :address="order.invoice_address" />
      </template>
    </card>

  </div>

</div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import Address from '@/components/Address.vue'

export default {
  components: {
    TopNav,
    Card,
    appAddress: Address
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

<style lang="scss" scoped>
  .section-title {
    font-family: $font-sec;
    font-weight: 300;
    margin: 0;
    font-size: 1.8em;
    display: flex;
    align-items: center;

    .bx {
      font-size: 0.9em;
      margin-right: 4px;
    }
  }

  .product {
    margin: 8px 0;
    padding: 12px;
    border-radius: 12px;
    transition: 0.3s;

    &:hover {
      background-color: #fafafa;
    }
  }

  .shipping {
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    color: #444;

    &__name {
      font-size: 1.1em;
      margin-bottom: 3px;
      color: #111;
    }
  }

  .order {
    display: grid;
    grid-template-columns: 1fr 300px;
    grid-gap: 32px;
  }
</style>
