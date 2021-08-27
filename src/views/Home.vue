<template>
  <div>
    <top-nav :title="storeName"></top-nav>

    <div class="home">
      <div>
        <card v-can="$p.Analytics.Payments">
          <div class="flex-column">
            <h2 class="section-title">Przychody</h2>

            <div class="incomes">
              <card class="income-box">
                <div class="income-box__title">W tym tygodniu</div>
                <div class="income-box__value">
                  {{ currentWeekIncome.toFixed(2) }} {{ currency }}
                </div>
                <div class="income-box__orders">{{ currentWeekOrdersCount }} zamówień</div>
              </card>
              <card class="income-box">
                <div class="income-box__title">W tym miesiącu</div>
                <div class="income-box__value">
                  {{ currentMonthIncome.toFixed(2) }} {{ currency }}
                </div>
                <div class="income-box__orders">{{ currentMonthOrdersCount }} zamówień</div>
              </card>
              <card class="income-box">
                <div class="income-box__title">W tym roku</div>
                <div class="income-box__value">
                  {{ currentYearIncome.toFixed(2) }} {{ currency }}
                </div>
                <div class="income-box__orders">{{ currentYearOrdersCount }} zamówień</div>
              </card>
              <card class="income-box">
                <div class="income-box__title">W ubiegłym roku</div>
                <div class="income-box__value">{{ lastYearIncome.toFixed(2) }} {{ currency }}</div>
                <div class="income-box__orders">{{ lastYearOrdersCount }} zamówień</div>
              </card>
            </div>
          </div>
        </card>
      </div>

      <div>
        <card v-can="$p.Orders.Show">
          <h2 class="section-title" style="margin-bottom: 20px">Ostatnie zamówienia</h2>
          <list-item
            v-for="order in orders"
            :key="order.id"
            class="order"
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

<script lang="ts">
import Vue from 'vue'
import sub from 'date-fns/sub'
import startOfMonth from 'date-fns/startOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import startOfYear from 'date-fns/startOfYear'

import { getPaymentsCount } from '@/services/statistics'
import { DateInput, getRelativeDate } from '@/utils/utils'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import ListItem from '@/components/layout/ListItem.vue'

import { Order } from '@/interfaces/Order'

export default Vue.extend({
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
    storeName(): string {
      return this.$accessor.env.store_name ?? 'E-Commerce Dog'
    },
    orders(): Order[] {
      return this.$accessor.orders.getData
    },
    currency(): string {
      return this.$accessor.currency
    },
  },
  async created() {
    this.$accessor.startLoading()

    try {
      const yearStart = startOfYear(Date.now())
      const [, currentWeek, currentMonth, currentYear, lastYear] = await Promise.all([
        this.getOrders(),
        getPaymentsCount(startOfWeek(Date.now()), Date.now()),
        getPaymentsCount(startOfMonth(Date.now()), Date.now()),
        getPaymentsCount(startOfYear(Date.now()), Date.now()),
        getPaymentsCount(sub(yearStart, { years: 1 }), sub(yearStart, { days: 1 })),
      ])

      this.currentWeekIncome = currentWeek.amount
      this.currentWeekOrdersCount = currentWeek.count

      this.currentMonthIncome = currentMonth.amount
      this.currentMonthOrdersCount = currentMonth.count

      this.currentYearIncome = currentYear.amount
      this.currentYearOrdersCount = currentYear.count

      this.lastYearIncome = lastYear.amount
      this.lastYearOrdersCount = lastYear.count
    } catch {}

    this.$accessor.stopLoading()
  },
  methods: {
    getRelativeDate(date: DateInput) {
      return getRelativeDate(date)
    },
    async getOrders() {
      await this.$accessor.orders.fetch({
        page: 1,
        limit: 6,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;

  @media ($viewport-10) {
    grid-template-columns: 1fr 0.6fr;
  }

  .order {
    padding: 10px 15px;
  }
}

.section-title {
  font-weight: 600;
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
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding: 16px 0;

  @media ($viewport-6) {
    grid-template-columns: 1fr 1fr;
  }
}

.income-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  margin-bottom: 0;
  padding: 32px 16px;

  &__title {
    font-weight: 600;
  }

  &__value {
    font-weight: 600;
    font-size: 2.6rem;
    line-height: 1em;
    margin: 8px 0;
  }

  &__orders {
    font-size: 0.9rem;
    color: #aaa;
  }
}
</style>
