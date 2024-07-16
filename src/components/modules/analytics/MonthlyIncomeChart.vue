<template>
  <Bar :chart-options="options" :chart-data="chartData" dataset-id-key="label" :height="400" />
</template>

<i18n lang="json">
{
  "pl": {
    "income": "Przychód",
    "orders": "Ilość transakcji"
  },
  "en": {
    "income": "Income",
    "orders": "Number of transactions"
  }
}
</i18n>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AnalyticsPaymentsSummary, AnalyticsPayment } from '@heseya/store-core'
import { Bar } from 'vue-chartjs/legacy'
import ChartJS from 'chart.js'
import sub from 'date-fns/sub'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'
import { SETTINGS_KEYS } from '@/consts/featureFlags'

export default defineComponent({
  components: { Bar },
  props: {
    data: {
      type: Object as PropType<AnalyticsPaymentsSummary>,
      required: true,
    },
  },
  computed: {
    options(): ChartJS.ChartOptions {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          income: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          count: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
      }
    },

    enabledCurriencies(): string[] {
      const allowedCurrencies = this.$accessor.config.env[SETTINGS_KEYS.AnalyticsChartCurrencies]
      const currencies = this.$accessor.config.currencies.map((c) => c.code)
      if (!allowedCurrencies) return currencies
      return currencies.filter((c) => allowedCurrencies.includes(c))
    },

    chartData(): ChartJS.ChartData {
      const monthsInThisYear = Array.from({ length: 12 }, (_, i) =>
        sub(startOfMonth(Date.now()), { months: i }),
      ).sort((a, b) => a.getTime() - b.getTime())
      const labels = monthsInThisYear.map((d) => format(d, 'YYY-MM'))

      const getByCurrency = (data: AnalyticsPayment[], currency: string): AnalyticsPayment =>
        data?.find((d) => d.currency === currency) || { amount: '0', count: 0, currency }

      return {
        labels,
        datasets: [
          ...this.enabledCurriencies.map((currency) => ({
            label: `${this.$t('income')} (${currency})`,
            data: labels.map((l) => parseFloat(getByCurrency(this.data[l], currency).amount)),
            yAxisID: `income`,
            backgroundColor: '#8f022c',
          })),
          ...this.enabledCurriencies.map((currency) => ({
            label: `${this.$t('orders')} (${currency})`,
            data: labels.map((l) => getByCurrency(this.data[l], currency).count),
            yAxisID: 'count',
            backgroundColor: '#bd204f',
          })),
        ],
      }
    },
  },
})
</script>
