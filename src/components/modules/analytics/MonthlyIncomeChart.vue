<template>
  <Bar :chart-options="options" :chart-data="chartData" dataset-id-key="label" :height="140" />
</template>

<i18n lang="json">
{
  "pl": {
    "income": "Przychód",
    "orders": "Ilość transakcjji"
  },
  "en": {
    "income": "Income",
    "orders": "Number of transactions"
  }
}
</i18n>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { AnalyticsPaymentsSummary } from '@heseya/store-core'

import sub from 'date-fns/sub'
import format from 'date-fns/format'
import startOfMonth from 'date-fns/startOfMonth'

import { Bar } from 'vue-chartjs/legacy'
import ChartJS from 'chart.js'

export default Vue.extend({
  components: { Bar },
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<AnalyticsPaymentsSummary>,
  },
  computed: {
    options(): ChartJS.ChartOptions {
      return {
        responsive: true,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
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
    chartData(): ChartJS.ChartData {
      const monthsInThisYear = Array.from({ length: 12 }, (_, i) =>
        sub(startOfMonth(Date.now()), { months: i }),
      ).sort((a, b) => a.getTime() - b.getTime())
      const labels = monthsInThisYear.map((d) => format(d, 'YYY-MM'))
      return {
        labels,
        datasets: [
          {
            label: `${this.$t('income')} (${this.$accessor.config.currency})`,
            data: labels.map((l) => this.data[l]?.amount || 0),
            yAxisID: 'y',
            backgroundColor: '#8f022c',
          },
          {
            label: `${this.$t('orders')}`,
            data: labels.map((l) => this.data[l]?.count || 0),
            yAxisID: 'y1',
            backgroundColor: '#bd204f',
          },
        ],
      }
    },
  },
})
</script>
