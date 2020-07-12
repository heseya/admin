<template>
  <div>
    <top-nav :title="`Zamówienie nr ${order.code}`"> </top-nav>

    <div class="order">
      <card>
        <div class="flex-column">
          <h2 class="section-title">Koszyk</h2>
          <app-cart-item v-for="item in order.items" :key="item.id" :item="item" />
          <div class="cart-total">
            Łącznie: <b>{{ order.summary }} {{ currency }}</b>
          </div>
        </div>
      </card>

      <card>
        <br />
        <template v-if="order.status">
          <vs-select label="Status" v-model="status" :loading="isLoading">
            <vs-option v-for="status in statuses" :label="status.name" :value="status.id" :key="status.id">
              {{ status.name }}
            </vs-option>
          </vs-select>
        </template>
        <br />
        <h2 class="section-title">Próby płatności</h2>
        <div v-for="payment in order.payments" :key="payment.id" class="payment-method">
          <i class='bx bxs-check-circle payment-method__success' v-if="payment.payed"></i>
          <i class='bx bxs-x-circle payment-method__failed' v-if="!payment.payed"></i>
          <span class="payment-method__name">{{ payment.method }}</span>
          <span class="payment-method__amount">({{ payment.amount }} {{ currency }})</span>
        </div>
        <br />
        <br />
        <h2 class="section-title">Adres dostawy</h2>
        <app-address :address="order.delivery_address" />
        <br />
        <template v-if="order.invoice_address">
          <h2 class="section-title">Faktura</h2>
          <app-address :address="order.invoice_address" />
        </template>
        <br />
        <h2 class="section-title">Przesyłka</h2>
        <div class="shipping" v-if="order.shopping_method">
          <span class="shipping__name">{{ order.shopping_method.name }}</span>
          <small class="shipping__price">{{ order.shopping_method.price }} {{ currency }}</small>
        </div>
        <br />
        <template v-if="order.comment">
          <h2 class="section-title">Komentarz do zamówienia</h2>
          <p>{{ order.comment }}</p>
        </template>
        <br />
        <h2 class="section-title">Złożone</h2>
        <small>{{ relativeOrderedDate }}</small>
      </card>

      <card>
        <div class="flex-column send-package">
          <h2 class="section-title">Wyślij przesyłkę</h2>
          <br />
          <div class="flex">
            <vs-select label="Szablon przesyłki" placeholder="-- Wybierz szablon --" v-model="packageTemplate">
              <vs-option v-for="template in packageTemplates" :label="template.name" :value="template.id" :key="template.id">
                {{ template.name }}
              </vs-option>
            </vs-select>
            <vs-button color="dark" @click="createPackage">Utwórz&nbsp;przesyłkę</vs-button>
          </div>
        </div>
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
  data: () => ({
    status: '',
    packageTemplate: '',
    isLoading: false
  }),
  computed: {
    currency() {
      return this.$store.state.currency
    },
    order() {
      return this.$store.getters['orders/getSelected']
    },
    statuses() {
      return this.$store.getters['statuses/getData']
    },
    packageTemplates() {
      return this.$store.getters['packageTemplates/getData']
    },
    relativeOrderedDate() {
      return getRelativeDate(this.order.created_at)
    }
  },
  watch: {
    order(order) {
      this.status = order?.status?.id
    },
    status(status, prevStatus) {
      if (prevStatus === '') return
      this.setStatus(status)
    }
  },
  methods: {
    async setStatus(newStatus) {
      this.isLoading = true
      const success = await this.$store.dispatch('orders/changeStatus', { orderId: this.order.id, statusId: newStatus })
      if (success) {
        this.$vs.notification({
          color: 'success',
          title: 'Status zamówienia został zmieniony'
        })
      }
      this.isLoading = false
    },
    async createPackage() {
      if (!this.packageTemplate) return
      const loading = this.$vs.loading({ color: '#000' })
      // TODO
      console.log('create package')
      setTimeout(() => {
        loading.close()
      }, 1000)
    }
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })
    await Promise.all([
      this.$store.dispatch('orders/get', this.$route.params.id),
      this.$store.dispatch('statuses/fetch'),
      this.$store.dispatch('packageTemplates/fetch')
    ])
    loading.close()
  }
}
</script>

<style lang="scss" scoped>
.vs-select,
.vs-select-content {
  max-width: 100%;
  width: 100%;
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

.payment-method {
  display: flex;
  align-items: center;
  margin: 3px 0;

  &__name {
    font-family: $font-main;
    margin-left: 10px;
    margin-right: 4px;
    text-transform: capitalize;
  }

  &__amount {
    font-size: 0.7em;
    line-height: 1rem;
  }

  .bx {
    font-size: 1.3em;
    margin-top: 1px;
  }

  &__failed {
    color: #FC4757;
  }

  &__success {
    color: #46CA3A;
  }
}

.send-package {
  .vs-button {
    white-space: nowrap;
    flex-shrink: 0;
  }
}
</style>
