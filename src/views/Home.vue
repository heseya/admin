<template>
  <div>
    <top-nav :title="storeName"></top-nav>

    <div class="home">
      <card v-can="$p.Analytics.Payments" class="home__summary">
        <div class="flex-column">
          <h2 class="section-title">{{ $t('income.title') }}</h2>

          <div class="incomes">
            <card border class="income-box">
              <div class="income-box__title">
                {{ $t('income.week') }}
                <small class="income-box__date">
                  ({{ formatHourlessDate(dates.week.start) }} -
                  {{ formatHourlessDate(dates.week.end) }})
                </small>
              </div>
              <div class="income-box__value">
                {{ formatCurrency(currentWeekIncome) }}
              </div>
              <div class="income-box__orders">
                {{ $tc('income.orders', currentWeekOrdersCount) }}
              </div>
            </card>
            <card border class="income-box">
              <div class="income-box__title">
                {{ $t('income.month') }}
                <small class="income-box__date">
                  ({{ formatHourlessDate(dates.month.start) }} -
                  {{ formatHourlessDate(dates.month.end) }})
                </small>
              </div>
              <div class="income-box__value">
                {{ formatCurrency(currentMonthIncome) }}
              </div>
              <div class="income-box__orders">
                {{ $tc('income.orders', currentMonthOrdersCount) }}
              </div>
            </card>
            <card border class="income-box">
              <div class="income-box__title">
                {{ $t('income.year') }}
                <small class="income-box__date">
                  ({{ formatHourlessDate(dates.year.start) }} -
                  {{ formatHourlessDate(dates.year.end) }})
                </small>
              </div>
              <div class="income-box__value">
                {{ formatCurrency(currentYearIncome) }}
              </div>
              <div class="income-box__orders">
                {{ $tc('income.orders', currentYearOrdersCount) }}
              </div>
            </card>
            <card border class="income-box">
              <div class="income-box__title">
                {{ $t('income.lastYear') }}
                <small class="income-box__date">
                  ({{ formatHourlessDate(dates.lastYear.start) }} -
                  {{ formatHourlessDate(dates.lastYear.end) }})
                </small>
              </div>
              <div class="income-box__value">{{ formatCurrency(lastYearIncome) }}</div>
              <div class="income-box__orders">
                {{ $tc('income.orders', lastYearOrdersCount) }}
              </div>
            </card>
          </div>
        </div>
      </card>

      <card v-can="$p.Orders.Show" class="home__orders">
        <h2 class="section-title" style="margin-bottom: 20px">{{ $t('lastOrders.title') }}</h2>
        <list-item
          v-for="order in orders"
          :key="order.id"
          class="order"
          :url="`/orders/${order.id}`"
        >
          <div class="home-list-item__row">
            <tag small :color="`#${order.status.color}`">{{ order.status.name }}</tag>
            {{ order.code }}
          </div>

          <small> {{ formatDate(order.created_at) }} </small>
          <template #action>
            <div>{{ formatCurrency(order.summary) }}</div>
          </template>
        </list-item>
      </card>

      <card v-can="$p.Analytics.Payments" class="home__chart">
        <h2 class="section-title">{{ $t('chart.title') }}</h2>
        <monthly-income-chart :data="monthlyStats" />
      </card>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "pl": {
    "title": "Dashboard",
    "income": {
      "title": "Przychody",
      "orders": "brak zamówień | {count} zamówienie | {count} zamówienia | {count} zamówień",
      "week": "W tym tygodniu",
      "month": "W tym miesiącu",
      "year": "W tym roku",
      "lastYear": "W ubiegłym roku"
    },
    "chart": { "title": "Przychód na przełomie ostatniego roku" },
    "lastOrders": { "title": "Ostatnie zamówienia" }
  },
  "en": {
    "title": "Dashboard",
    "income": {
      "title": "Income",
      "orders": "no orders | 1 order | {count} orders",
      "week": "This week",
      "month": "This month",
      "year": "This year",
      "lastYear": "Previous year"
    },
    "chart": { "title": "Income over the last year" },
    "lastOrders": { "title": "Last orders" }
  }
}
</i18n>

<script lang="ts">
import Vue from 'vue'
import sub from 'date-fns/sub'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'
import startOfYear from 'date-fns/startOfYear'
import endOfYear from 'date-fns/endOfYear'
import { AnalyticsPaymentsSummary, Order } from '@heseya/store-core'

import { sdk } from '@/api'
import { getPaymentsCount } from '@/services/statistics'
import { DateInput, formatDate } from '@/utils/dates'
import { formatCurrency } from '@/utils/currency'

import TopNav from '@/components/layout/TopNav.vue'
import Card from '@/components/layout/Card.vue'
import ListItem from '@/components/layout/ListItem.vue'
import MonthlyIncomeChart from '@/components/modules/analytics/MonthlyIncomeChart.vue'

type DateRange = { start: Date; end: Date }

export default Vue.extend({
  metaInfo(this: any) {
    return { title: this.$t('nav.settings') as string }
  },
  components: {
    ListItem,
    TopNav,
    Card,
    MonthlyIncomeChart,
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
    monthlyStats: {} as AnalyticsPaymentsSummary,
  }),
  computed: {
    storeName(): string {
      return this.$accessor.config.env.store_name ?? 'Heseya Store'
    },
    orders(): Order[] {
      return this.$accessor.orders.getData
    },
    dates(): {
      week: DateRange
      month: DateRange
      year: DateRange
      lastYear: DateRange
    } {
      return {
        week: {
          start: startOfWeek(new Date(), { weekStartsOn: 1 }),
          end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        },
        month: {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        },
        year: {
          start: startOfYear(new Date()),
          end: endOfYear(new Date()),
        },
        lastYear: {
          start: startOfYear(sub(new Date(), { years: 1 })),
          end: endOfYear(sub(new Date(), { years: 1 })),
        },
      }
    },
  },
  async created() {
    this.$accessor.startLoading()

    try {
      const [, currentWeek, currentMonth, currentYear, lastYear, monthlyStats] = await Promise.all([
        this.getOrders(),
        getPaymentsCount(this.dates.week.start, this.dates.week.end),
        getPaymentsCount(this.dates.month.start, this.dates.month.end),
        getPaymentsCount(this.dates.year.start, this.dates.year.end),
        getPaymentsCount(this.dates.lastYear.start, this.dates.lastYear.end),
        sdk.Analytics.getPayments({
          group: 'monthly',
          from: startOfMonth(sub(Date.now(), { years: 1 })),
          to: new Date(),
        }),
      ])

      this.currentWeekIncome = currentWeek.amount
      this.currentWeekOrdersCount = currentWeek.count

      this.currentMonthIncome = currentMonth.amount
      this.currentMonthOrdersCount = currentMonth.count

      this.currentYearIncome = currentYear.amount
      this.currentYearOrdersCount = currentYear.count

      this.lastYearIncome = lastYear.amount
      this.lastYearOrdersCount = lastYear.count

      this.monthlyStats = monthlyStats
    } catch {}

    this.$accessor.stopLoading()
  },

  methods: {
    formatDate(date: DateInput) {
      return formatDate(date)
    },
    formatHourlessDate(date: DateInput) {
      return formatDate(date, false)
    },
    formatCurrency(amount: number) {
      return formatCurrency(amount, this.$accessor.config.currency)
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

<style lang="scss">
.home {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  grid-template-areas: 'summary' 'orders' 'chart';

  @media ($viewport-10) {
    grid-template-columns: 1fr 0.6fr;
    grid-template-areas: 'summary orders' 'chart chart';
  }

  .card {
    margin-bottom: 0;
  }

  .order {
    padding: 10px 15px;
  }

  &__summary {
    grid-area: summary;
  }
  &__orders {
    width: 100%;
    grid-area: orders;
  }
  &__chart {
    grid-area: chart;
    overflow-x: auto;
  }
}

.section-title {
  font-size: 1.1em;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
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
  padding: 12px;

  @media ($viewport-6) {
    padding: 32px 16px;
  }

  &__title {
    font-weight: 600;
  }

  &__date {
    color: $gray-color-600;
    font-weight: 400;
    font-style: italic;
  }

  &__value {
    font-weight: 600;
    font-size: 2rem;
    line-height: 1em;
    margin: 8px 0;

    @media ($viewport-13) {
      font-size: 2.6rem;
    }
  }

  &__orders {
    font-size: 0.9rem;
    color: var(--gray-color-400);
  }
}

.home-list-item__row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
