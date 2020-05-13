<template>
  <div>
    <top-nav :title="`Zamówienie nr ${order.code}`"> </top-nav>

    <div class="order">
      <card>
        <div class="flex-column">
          <h2 class="section-title">Koszyk</h2>
          <app-cart-item v-for="item in order.items" :key="item.id" :item="item" />
          <div class="cart-total">
            Suma zamówienia: <b>{{ order.summary }} {{ currency }}</b>
          </div>
        </div>
      </card>

      <card>
        <h2 class="section-title">Adres dostawy</h2>
        <app-address :address="order.delivery_address" />
        <br />
        <template v-if="order.invoice_address">
          <h2 class="section-title">Faktura</h2>
          <app-address :address="order.invoice_address" />
        </template>
        <br />
        <h2 class="section-title">Przesyłka</h2>
        <div class="shipping">
          <span class="shipping__name">{{ order.shipping_method.name }}</span>
          <small class="shipping__price">{{ order.shipping_method.price }} {{ currency }}</small>
        </div>
        <br />
        <template v-if="comment">
          <h2 class="section-title">Komentarz do zamówienia</h2>
          <p>{{ comment }}</p>
        </template>
        <br />
        <h2 class="section-title">Złożone</h2>
        <small>{{ relativeOrderedDate }}</small>
      </card>
    </div>
  </div>
</template>

<script>
import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import Address from '@/components/Address.vue'
import CartItem from '@/components/CartItem.vue'
import { getRelativeDate } from '@/utils/utils'

export default {
  components: {
    TopNav,
    Card,
    appAddress: Address,
    appCartItem: CartItem
  },
  computed: {
    currency() {
      return this.$store.state.currency
    },
    order() {
      return this.$store.getters['orders/getSelected']
    },
    relativeOrderedDate() {
      return getRelativeDate(this.order.created_at)
    }
  },
  async created() {
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
  font-size: 1.5em;
  display: flex;
  align-items: center;

  .bx {
    font-size: 0.9em;
    margin-right: 4px;
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

.cart-total {
  font-family: $font-sec;
  font-size: 1.2em;
  margin-top: auto;
}

.order {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-gap: 32px;

  @media screen and (max-width: 780px) {
    grid-template-columns: 1fr;
  }

  .card {
    margin-bottom: 0;
  }
}
</style>
