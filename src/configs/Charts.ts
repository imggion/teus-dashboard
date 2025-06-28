export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest' as const,
    intersect: false,
    axis: 'x' as const,
  },
  animation: {
    duration: 0,
  },
  scales: {
    y: {
      beginAtZero: true,
      grace: '5%',
      grid: {
        color: 'rgba(255, 255, 255, 0.04)',
        lineWidth: 1,
        drawBorder: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          family: "'Inter', sans-serif",
          weight: 400,
          size: 11,
        },
        padding: 12,
        maxTicksLimit: 6,
        callback: function (value: any) {
          if (typeof value === 'number') {
            // Format based on value range
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`
            }
            return value.toFixed(1)
          }
          return value
        },
      },
      border: { display: false },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
        font: {
          family: "'Inter', sans-serif",
          weight: 400,
          size: 10,
        },
        padding: 8,
        maxTicksLimit: 5,
        maxRotation: 0,
        callback: function (value: any, index: number) {
          // Show only every other tick on mobile for better performance
          if (window.innerWidth < 768 && index % 2 !== 0) {
            return ''
          }
          return value
        },
      },
      border: { display: false },
    },
  },
  elements: {
    line: {
      tension: 0.3,
      borderWidth: 2,
      borderCapStyle: 'round' as const,
      borderJoinStyle: 'round' as const,
    },
    point: {
      radius: 0,
      hitRadius: 6,
      hoverRadius: 3,
      hoverBorderWidth: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 15, 0.95)',
      titleFont: {
        family: "'Inter', sans-serif",
        weight: 600,
        size: 13,
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        weight: 500,
        size: 12,
      },
      titleColor: 'rgba(255, 255, 255, 0.95)',
      bodyColor: 'rgba(255, 255, 255, 0.8)',
      padding: 12,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: false,
      caretSize: 6,
      caretPadding: 8,
      titleMarginBottom: 8,
      callbacks: {
        title: function (context: any[]) {
          return `Time: ${context[0].label}`
        },
        label: function (context: any) {
          const value = context.parsed.y
          const label = context.dataset.label || ''

          // Format value based on chart type
          if (label.toLowerCase().includes('cpu')) {
            return `${label}: ${value.toFixed(2)}%`
          } else if (
            label.toLowerCase().includes('ram') ||
            label.toLowerCase().includes('memory')
          ) {
            return `${label}: ${value.toFixed(2)} GB`
          }
          return `${label}: ${value.toFixed(2)}`
        },
      },
    },
  },
}

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0, // Disable animations for better performance
  },
  layout: {
    padding: {
      top: 8,
      bottom: 8,
      left: 4,
      right: 4,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      align: 'center' as const,
      // labels: {
      // color: 'rgba(255, 255, 255, 0.85)',
      // font: {
      //   family: "'Inter', sans-serif",
      //   size: 9,
      //   weight: 500,
      // },
      // padding: 6,
      // usePointStyle: true,
      // pointStyle: 'circle' as const,
      // boxWidth: 8,
      // boxHeight: 8,
      // useBorderRadius: false,
      // maxLineLength: 2,
      // textAlign: 'left' as const,
      // generateLabels: function (chart: any) {
      //   const data = chart.data
      //   if (data.labels.length && data.datasets.length) {
      //     return data.labels.map((label: string, i: number) => {
      //       const dataset = data.datasets[0]
      //       const backgroundColor = Array.isArray(dataset.backgroundColor)
      //         ? dataset.backgroundColor[i]
      //         : dataset.backgroundColor
      //       // Improved label truncation with smart breaks
      //       let displayText = label
      //       if (label.length > 20) {
      //         // Try to break at meaningful points
      //         const parts = label.split(' ')
      //         if (parts.length > 1) {
      //           let truncated = parts[0]
      //           for (let j = 1; j < parts.length; j++) {
      //             if ((truncated + ' ' + parts[j]).length <= 18) {
      //               truncated += ' ' + parts[j]
      //             } else {
      //               truncated += '...'
      //               break
      //             }
      //           }
      //           displayText = truncated
      //         } else {
      //           displayText = label.substring(0, 17) + '...'
      //         }
      //       }
      //       return {
      //         text: displayText,
      //         fillStyle: backgroundColor,
      //         strokeStyle: backgroundColor,
      //         lineWidth: 0,
      //         index: i,
      //       }
      //     })
      //   }
      //   return []
      // },
      // },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 15, 15, 0.96)',
      padding: 14,
      titleFont: {
        family: "'Inter', sans-serif",
        weight: 600,
        size: 12,
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        weight: 500,
        size: 11,
      },
      titleColor: 'rgba(255, 255, 255, 0.95)',
      bodyColor: 'rgba(255, 255, 255, 0.85)',
      cornerRadius: 10,
      caretSize: 5,
      caretPadding: 8,
      displayColors: true,
      usePointStyle: true,
      pointStyle: 'circle',
      callbacks: {
        title: function () {
          return 'Storage Details'
        },
        label: function (context: any) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'

          // Enhanced tooltip with size information
          const sizeGB = (value / 1024).toFixed(2)
          return `${label}\nSize: ${sizeGB} GB (${percentage}%)`
        },
        labelColor: function (context: any) {
          return {
            borderColor: context.dataset.backgroundColor[context.dataIndex],
            backgroundColor: context.dataset.backgroundColor[context.dataIndex],
          }
        },
      },
    },
  },
}
