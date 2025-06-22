<template>
  <div class="chart-wrapper">
    <canvas :id="chartId" ref="chartCanvas" class="chart-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef, nextTick } from 'vue'
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
const systemService = SystemServices.getInstance()

// Debounce chart updates to prevent excessive re-renders
let updateTimeout: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_DELAY = 100

function debouncedUpdate(updateFn: () => void) {
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
  updateTimeout = setTimeout(updateFn, DEBOUNCE_DELAY)
}

function updateChartWithNewData() {
  if (!chartInstance.value || !chartDataRef.value) return

  debouncedUpdate(() => {
    const chart = chartInstance.value
    const data = chartDataRef.value
    if (!chart || !data) return

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      timeStyle: 'short',
    })

    // Format data based on chart type
    if (chart.data.labels && chart.data.datasets[0]) {
      // Efficiently update data without triggering layout shifts
      const labels = chart.data.labels as string[]
      const dataset = chart.data.datasets[0]

      labels.push(timestamp)

      // Format data differently based on what we're displaying
      let newValue = 0

      if (props.chartTitle.toLowerCase().includes('cpu')) {
        newValue = Math.round((data.cpu_usage ?? 0) * 100) / 100
      } else if (props.chartTitle.toLowerCase().includes('ram')) {
        const ramGB = (data.ram_usage ?? 0) / (1024 * 1024 * 1024)
        newValue = Math.round(ramGB * 100) / 100
      } else if (props.chartTitle.toLowerCase().includes('swap')) {
        const swapGB = (data.used_swap ?? 0) / (1024 * 1024 * 1024)
        newValue = Math.round(swapGB * 100) / 100
      } else {
        newValue = data.cpu_usage ?? 0
      }

      ;(dataset.data as number[]).push(newValue)

      // Keep only last 10 data points for performance
      if (labels.length > 10) {
        labels.shift()
        ;(dataset.data as number[]).shift()
      }

      // Use 'none' mode for better performance
      chart.update('none')
    }

    if (props.chartType === 'doughnut') {
      updateDoughnutChart()
    }
  })
}

function updateDoughnutChart() {
  if (!chartInstance.value || !chartDataRef.value) return

  const chart = chartInstance.value
  const disks = chartDataRef.value.disks || []

  // If no disk data, show a placeholder
  if (disks.length === 0) {
    chart.data.labels = ['No Data Available']
    chart.data.datasets[0].data = [1]
    chart.data.datasets[0].backgroundColor = ['rgba(255, 255, 255, 0.15)']
    chart.update('none')
    return
  }

  // Filter valid disks and remove duplicates by filesystem
  const validDisks = disks.filter((d) => d.filesystem !== '' && d.total_space > 0)

  // Remove duplicates by grouping by filesystem and summing the space
  const filesystemMap = new Map<
    string,
    {
      filesystem: string
      mount_point: string
      used_space: number
      total_space: number
      available_space: number
    }
  >()

  validDisks.forEach((disk) => {
    const key = disk.filesystem
    if (filesystemMap.has(key)) {
      // If filesystem already exists, sum the space usage
      const existing = filesystemMap.get(key)!
      existing.used_space += disk.used_space
      existing.total_space += disk.total_space
      existing.available_space += disk.available_space || disk.total_space - disk.used_space
      // Keep the shorter mount point for display
      if (disk.mount_point && disk.mount_point.length < existing.mount_point.length) {
        existing.mount_point = disk.mount_point
      }
    } else {
      filesystemMap.set(key, {
        filesystem: disk.filesystem,
        mount_point: disk.mount_point || disk.filesystem,
        used_space: disk.used_space,
        total_space: disk.total_space,
        available_space: disk.available_space || disk.total_space - disk.used_space,
      })
    }
  })

  const uniqueDisks = Array.from(filesystemMap.values())

  // If no valid unique disks, show placeholder
  if (uniqueDisks.length === 0) {
    chart.data.labels = ['No Valid Disks']
    chart.data.datasets[0].data = [1]
    chart.data.datasets[0].backgroundColor = ['rgba(255, 255, 255, 0.15)']
    chart.update('none')
    return
  }

  const mbToGB = (megabytes: number) => {
    const gb = megabytes / 1024
    return Math.round(gb * 100) / 100
  }

  // Create labels with better formatting
  const diskLabels = uniqueDisks.map((d) => {
    const usedGB = mbToGB(d.used_space)
    const totalGB = mbToGB(d.total_space)
    const usagePercent = d.total_space > 0 ? Math.round((d.used_space / d.total_space) * 100) : 0

    // Use mount point if it's meaningful, otherwise use filesystem name
    const displayName =
      d.mount_point === '/'
        ? 'Root'
        : d.mount_point.startsWith('/')
          ? d.mount_point.replace('/', '') || 'Root'
          : d.filesystem.replace('/dev/', '')

    return `${displayName} (${usedGB}/${totalGB}GB - ${usagePercent}%)`
  })

  const usedSpaceData = uniqueDisks.map((d) => d.used_space)

  // Calculate total free space from all unique disks
  const totalFreeSpace = uniqueDisks.reduce((acc, disk) => acc + disk.available_space, 0)

  // Only add free space if it's significant (> 1GB)
  if (totalFreeSpace > 1024) {
    diskLabels.push(`Free Space (${mbToGB(totalFreeSpace)}GB)`)
    usedSpaceData.push(totalFreeSpace)
  }

  // Only update if data has actually changed
  const currentLabels = chart.data.labels as string[]
  if (JSON.stringify(currentLabels) !== JSON.stringify(diskLabels)) {
    chart.data.labels = diskLabels
    chart.data.datasets[0].data = usedSpaceData

    // Enhanced color palette with more vibrant and distinguishable colors
    const colorPalette = [
      'rgb(168, 85, 247)', // Purple - Primary brand color
      'rgb(34, 197, 94)', // Green - Success/healthy
      'rgb(59, 130, 246)', // Blue - Information
      'rgb(245, 158, 11)', // Amber - Warning
      'rgb(239, 68, 68)', // Red - Danger/critical
      'rgb(20, 184, 166)', // Teal - Unique
      'rgb(217, 70, 239)', // Fuchsia - Distinctive
      'rgb(132, 204, 22)', // Lime - Fresh
      'rgb(251, 146, 60)', // Orange - Warm
      'rgb(99, 102, 241)', // Indigo - Deep
    ]

    // Free space gets a subtle color
    const freeSpaceColor = 'rgba(156, 163, 175, 0.4)'

    // Assign colors to disks, with free space getting the special color
    const backgroundColors = uniqueDisks.map((_, i) => colorPalette[i % colorPalette.length])

    if (totalFreeSpace > 1024) {
      backgroundColors.push(freeSpaceColor)
    }

    chart.data.datasets[0].backgroundColor = backgroundColors

    // Add subtle borders for better definition
    chart.data.datasets[0].borderColor = backgroundColors.map((color) =>
      color === freeSpaceColor ? 'rgba(156, 163, 175, 0.6)' : 'rgba(255, 255, 255, 0.1)',
    )
    chart.data.datasets[0].borderWidth = 1

    chart.update('none')
  }
}

onMounted(async () => {
  if (!chartCanvas.value) return

  await nextTick()

  const chartData = prepareChartData()
  const chartOptions = prepareChartOptions()

  try {
    chartInstance.value = new Chart(chartCanvas.value, {
      type: props.chartType as keyof ChartTypeRegistry,
      data: chartData,
      options: chartOptions,
    })

    // Start polling for auto-update charts (including doughnut charts that need data)
    if (props.autoUpdate) {
      const pollCallback = (data?: SystemSchema) => {
        if (data) {
          chartDataRef.value = data
          updateChartWithNewData()
        }
      }

      systemService.startPolling(pollCallback)

      // Store the callback for cleanup
      onBeforeUnmount(() => {
        systemService.stopPolling(pollCallback)
      })
    } else if (props.chartType === 'doughnut') {
      // For static doughnut charts, try to fetch initial data
      try {
        const initialData = await systemService.getSystemInfo()
        chartDataRef.value = initialData
        updateChartWithNewData()
      } catch (error) {
        console.warn('Failed to fetch initial data for doughnut chart:', error)
      }
    }
  } catch (error) {
    console.error('Error creating chart:', error)
  }
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
          cubicInterpolationMode: 'monotone' as const,
          borderJoinStyle: 'round' as const,
          borderCapStyle: 'round' as const,
        },
      ],
    }
  } else if (props.chartType === 'doughnut') {
    return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [props.backgroundColor],
          borderColor: [props.borderColor],
          borderWidth: 1,
          cutout: '75%',
          spacing: 2,
          borderRadius: 4,
          hoverBorderWidth: 2,
          hoverOffset: 6,
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
    // Disable all animations for better performance
    animation: {
      duration: 0,
    },
    // Optimize interactions
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
    // Reduce redraws
    elements: {
      point: {
        radius: 0,
        hoverRadius: 3,
      },
      arc: {
        borderWidth: 1,
        hoverBorderWidth: 2,
      },
    },
  }

  if (props.chartType === 'line') {
    return {
      ...baseOptions,
      ...lineChartOptions,
      animation: {
        duration: 0,
      },
      plugins: {
        ...lineChartOptions.plugins,
        legend: { display: false },
        title: {
          display: false, // Remove title to reduce overhead
        },
      },
    }
  } else if (props.chartType === 'doughnut') {
    return {
      ...baseOptions,
      ...doughnutChartOptions,
      plugins: {
        ...doughnutChartOptions.plugins,
        legend: {
          ...doughnutChartOptions.plugins.legend,
          labels: {
            // ...doughnutChartOptions.plugins.legend.labels,
            color: 'rgba(255, 255, 255, 0.9)', // Explicitly force white text
          },
        },
        title: {
          display: false, // Remove title to reduce overhead
        },
      },
      animation: {
        duration: 0,
      },
    }
  }

  return baseOptions
}

onBeforeUnmount(() => {
  // Clear all timeouts and intervals
  if (updateTimeout) {
    clearTimeout(updateTimeout)
    updateTimeout = null
  }

  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }

  // Polling cleanup is handled in the onMounted callback

  // Destroy chart instance
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
})
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  /* Remove transitions that cause layout shifts */
}

.chart-canvas {
  width: 100%;
  height: 100%;
  /* Remove all transforms and transitions that cause resizing */
}

/* Remove hover effects that cause layout shifts */
</style>
