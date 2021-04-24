<template>
  <div>
    <top-nav :title="storeName"></top-nav>

    <div class="home">
      <div>
        <card>
          <div class="flex-column">
            <h2 class="section-title">Przychody</h2>

            <div class="incomes">
              <div class="income-box">
                <div class="income-box__title">W tym tygodniu</div>
                <div class="income-box__value">{{ currentWeekIncome }} {{ currency }}</div>
                <div class="income-box__orders">{{ currentWeekOrdersCount }} zamówień</div>
              </div>
              <div class="income-box">
                <div class="income-box__title">W tym miesiącu</div>
                <div class="income-box__value">{{ currentMonthIncome }} {{ currency }}</div>
                <div class="income-box__orders">{{ currentMonthOrdersCount }} zamówień</div>
              </div>
              <div class="income-box">
                <div class="income-box__title">W tym roku</div>
                <div class="income-box__value">{{ currentYearIncome }} {{ currency }}</div>
                <div class="income-box__orders">{{ currentYearOrdersCount }} zamówień</div>
              </div>
              <div class="income-box">
                <div class="income-box__title">W ubiegłym roku</div>
                <div class="income-box__value">{{ lastYearIncome }} {{ currency }}</div>
                <div class="income-box__orders">{{ lastYearOrdersCount }} zamówień</div>
              </div>
            </div>
          </div>
        </card>
      </div>

      <div>
        <card>
          <h2 class="section-title" style="margin-bottom: 20px">Ostatnie zamówienia</h2>
          <list-item
            class="order"
            v-for="order in orders"
            :key="order.id"
            :url="`/orders/${order.id}`"
          >
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
import format from 'date-fns/format'
import sub from 'date-fns/sub'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import startOfYear from 'date-fns/startOfYear'

import TopNav from '@/layout/TopNav.vue'
import Card from '@/components/Card.vue'
import { getRelativeDate } from '@/utils/utils'
import ListItem from '@/components/ListItem'
import { api } from '../api'

export default {
  components: {
    ListItem,
    TopNav,
    Card,
  },
  data: () => ({
    currentWeekIncome: 0,
    currentWeekOrdersCount: 0,
    currentMonthIncome: 0,
    currentMonthOrdersCount: 0,
    currentYearIncome: 0,
    currentYearOrdersCount: 0,
    lastYearIncome: 0,
    lastYearOrdersCount: 0,
  }),
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
    async getPaymentsCount(from, to) {
      const query = from
        ? `/analytics/payments/total?from=${format(from, 'yyyy-MM-dd')}&to=${format(
            to,
            'yyyy-MM-dd',
          )}`
        : '/analytics/payments/total'

      const { data } = await api.get(query)
      return data.data
    },
    async getOrders() {
      await this.$store.dispatch('orders/fetch', {
        page: 1,
        limit: 6,
      })
    },
  },
  async created() {
    const loading = this.$vs.loading({ color: '#000' })

    const yearStart = startOfYear(Date.now())
    const [, currentWeek, currentMonth, currentYear, lastYear] = await Promise.all([
      this.getOrders(),
      this.getPaymentsCount(startOfWeek(Date.now()), Date.now()),
      this.getPaymentsCount(startOfMonth(Date.now()), Date.now()),
      this.getPaymentsCount(startOfYear(Date.now()), Date.now()),
      this.getPaymentsCount(sub(yearStart, { years: 1 }), sub(yearStart, { days: 1 })),
    ])

    this.currentWeekIncome = currentWeek.amount
    this.currentWeekOrdersCount = currentWeek.count

    this.currentMonthIncome = currentMonth.amount
    this.currentMonthOrdersCount = currentMonth.count

    this.currentYearIncome = currentYear.amount
    this.currentYearOrdersCount = currentYear.count

    this.lastYearIncome = lastYear.amount
    this.lastYearOrdersCount = lastYear.count
    loading.close()
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

.incomes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  padding: 16px 0;
}

.income-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  box-shadow: $shadow;

  &__title {
    font-family: $font-sec;
  }

  &__value {
    font-family: $font-sec;
    font-size: 2.6rem;
    margin: 8px 0;
  }

  &__orders {
    font-size: 0.9rem;
    color: #aaa;
  }
}
</style>
