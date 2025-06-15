<template>
  <div
    class="bg-[#1e1e1e] rounded-3xl p-4 border border-white/5 shadow-xl transition-transform duration-300 h-72"
  >
    <canvas :id="chartId" ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue'
import Chart from 'chart.js/auto'
import type { ChartTypeRegistry } from 'chart.js'
import { SystemServices } from '@/services/SystemServices'
import type { SystemSchema } from '@/types/Sysinfo'
import { doughnutChartOptions, lineChartOptions } from '@/configs/Charts'

const props = defineProps<{
  chartId: string
  chartType: string
  chartTitle: string
  autoUpdate: boolean
  borderColor: string
  backgroundColor: string
  staticData: boolean
}>()

const chartInstance = shallowRef<Chart | null>(null)
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartDataRef = ref<SystemSchema | null>(null)
let updateInterval: ReturnType<typeof setInterval> | null = null
const systemService = new SystemServices()

function updateChartWithNewData() {
  if (!chartInstance.value || !chartDataRef.value) return
  const chart = chartInstance.value
  const timestamp = new Date().toLocaleTimeString()

  // Format data based on chart type
  if (chart.data.labels && chart.data.datasets[0]) {
    chart.data.labels.push(timestamp)

    // Format data differently based on what we're displaying
    let newValue = 0

    if (props.chartTitle.toLowerCase().includes('cpu')) {
      // Format CPU as percentage with 2 decimal places
      newValue = parseFloat((chartDataRef.value.cpu_usage ?? 0).toFixed(2))
    } else if (props.chartTitle.toLowerCase().includes('ram')) {
      // Convert RAM to GB
      const ramGB = (chartDataRef.value.ram_usage ?? 0) / (1024 * 1024 * 1024)
      newValue = parseFloat(ramGB.toFixed(2))
      // Add GB label to the chart title for RAM
      if (!props.chartTitle.includes('GB') && chart.options?.plugins?.title) {
        chart.options.plugins.title.text = `${props.chartTitle} (GB)`
      }
    } else if (props.chartTitle.toLowerCase().includes('swap')) {
      // Convert Swap to GB
      const swapGB = (chartDataRef.value.used_swap ?? 0) / (1024 * 1024 * 1024)
      newValue = parseFloat(swapGB.toFixed(2))
    } else {
      // Default fallback
      newValue = chartDataRef.value.cpu_usage ?? 0
    }

    chart.data.datasets[0].data.push(newValue)

    if (chart.data.labels.length > 10) {
      chart.data.labels.shift()
      chart.data.datasets[0].data.shift()
    }
    chart.update()
  }

  if (props.chartType === 'doughnut') {
    updateDoughnutChart()
  }
}

function updateDoughnutChart() {
  if (!chartInstance.value || !chartDataRef.value) return

  const chart = chartInstance.value
  const disks = chartDataRef.value.disks || []

  const validDisks = disks.filter((d) => d.filesystem !== '' && d.total_space > 0)

  const mbToGB = (megabytes: number) => {
    // The backend returns values in MB, so we just divide by 1024 to get GB
    const gb = megabytes / 1024
    return parseFloat(gb.toFixed(2))
  }

  const diskLabels = validDisks.map(
    (d) => `${d.mount_point || d.filesystem} (${mbToGB(d.used_space)} GB)`,
  )
  const usedSpaceData = validDisks.map((d) => d.used_space)

  const totalFreeSpace = validDisks.reduce(
    (acc, disk) => acc + (disk.available_space || disk.total_space - disk.used_space),
    0,
  )

  diskLabels.push(`Free (${mbToGB(totalFreeSpace)} GB)`)
  usedSpaceData.push(totalFreeSpace)

  chart.data.labels = diskLabels
  chart.data.datasets[0].data = usedSpaceData

  const colorPalette = [
    'rgb(187, 134, 252)', // Viola
    'rgb(3, 218, 198)', // Turchese
    'rgb(255, 179, 0)', // Arancione
    'rgb(255, 105, 97)', // Rosso chiaro
    'rgb(77, 166, 255)', // Azzurro
    'rgb(172, 236, 119)', // Verde chiaro
    'rgb(250, 110, 190)', // Rosa
    'rgb(116, 106, 255)', // Indaco
  ]

  const freeSpaceColor = 'rgb(76, 175, 80)'

  const backgroundColors = validDisks.map((_, i) => colorPalette[i % colorPalette.length])
  backgroundColors.push(freeSpaceColor)

  chart.data.datasets[0].backgroundColor = backgroundColors

  chart.update()
}

onMounted(() => {
  if (!chartCanvas.value) return

  const chartData = prepareChartData()
  const chartOptions = prepareChartOptions()

  chartInstance.value = new Chart(chartCanvas.value, {
    type: props.chartType as keyof ChartTypeRegistry,
    data: chartData,
    // @ts-ignore
    options: chartOptions,
  })

  systemService.startPolling((data) => {
    chartDataRef.value = data as SystemSchema
    updateChartWithNewData()
  })
})

function prepareChartData() {
  if (props.chartType === 'line') {
    return {
      labels: [''],
      datasets: [
        {
          label: props.chartTitle,
          data: [0],
          borderColor: props.borderColor,
          backgroundColor: props.backgroundColor,
          fill: true,
          tension: 0.3,
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 3,
          cubicInterpolationMode: 'monotone',
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
        },
      ],
    }
  } else if (props.chartType === 'doughnut') {
    return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['rgb(187, 134, 252)', 'rgba(255, 255, 255, 0.1)'],
          borderWidth: 0,
          cutout: '85%',
        },
      ],
    }
  }

  return { labels: [], datasets: [] }
}

function prepareChartOptions() {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  if (props.chartType === 'line') {
    return {
      ...baseOptions,
      ...lineChartOptions,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: props.chartTitle,
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 15,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          padding: {
            top: 10,
            bottom: 16,
          },
          align: 'start', // Aligns the title to the left
        },
      },
    }
  } else if (props.chartType === 'doughnut') {
    return {
      ...baseOptions,
      plugins: {
        ...doughnutChartOptions.plugins,
        title: {
          display: true,
          text: props.chartTitle,
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 15,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          padding: {
            top: 10,
            bottom: 16,
          },
          align: 'start',
        },
      },
      cutout: '88%',
      spacing: 5,
      borderRadius: 4,
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 800,
        easing: 'easeOutCubic',
      },
    }
  }

  return baseOptions
}

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }

  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
})
</script>
