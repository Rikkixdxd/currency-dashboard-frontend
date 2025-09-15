<template>
  <div class="graph-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { computed } from 'vue'
import type { CurrencyHistoryPoint } from '@/types/CurrencyTypes'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  history: CurrencyHistoryPoint[]
}>()

const chartData = computed(() => {
  const labels = props.history.map(point => new Date(point.timestamp).toLocaleTimeString())
  const data = props.history.map(point => point.rate)
  const average = data.reduce((a, b) => a + b, 0) / data.length
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = (max - min) / 2

  return {
    labels,
    datasets: [
      {
        label: 'Exchange Rate',
        data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const data = props.history.map(point => point.rate)
  const average = data.reduce((a, b) => a + b, 0) / data.length
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = (max - min) / 2

  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Currency Rate History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: average - range,
        suggestedMax: average + range,
      },
    },
  }
})
</script>

<style scoped>
.graph-container {
  width: 100%;
  height: 400px;
}
</style>
