export const lineChartOptions = {
  animation: {
    duration: 800,
    easing: 'easeOutQuint' as const,
  },
  interaction: {
    mode: 'nearest',
    intersect: false,
    axis: 'x',
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.03)',
        lineWidth: 0.5,
        drawBorder: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        font: {
          family: "'Inter', sans-serif",
          weight: '300',
          size: 10,
        },
        padding: 8,
        maxTicksLimit: 5,
      },
      border: { display: false },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        font: {
          family: "'Inter', sans-serif",
          weight: '300',
          size: 10,
        },
        padding: 8,
        maxTicksLimit: 6,
        maxRotation: 0,
      },
      border: { display: false },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 1.5,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: 'rgba(13, 13, 13, 0.8)',
      titleFont: {
        family: "'Inter', sans-serif",
        weight: '500',
        size: 12,
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        weight: '400',
        size: 11,
      },
      padding: 10,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
    },
  },
}

export const doughnutChartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      align: 'center',
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          family: "'Inter', sans-serif",
          size: 11,
          weight: '400',
        },
        padding: 16,
        usePointStyle: true,
        pointStyle: 'rectRounded',
        boxWidth: 8,
        boxHeight: 8,
        useBorderRadius: true,
        borderRadius: 2,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(4px)',
      padding: 12,
      titleFont: {
        family: "'Inter', sans-serif",
        weight: '500',
        size: 12,
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        weight: '400',
        size: 11,
      },
      cornerRadius: 10,
      caretSize: 6,
      displayColors: false,
      callbacks: {
        label: (context: { label: any; formattedValue: any }) =>
          `${context.label}: ${context.formattedValue}`,
      },
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
