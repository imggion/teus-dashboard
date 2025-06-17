<template>
  <div class="charts-grid">
    <!-- CPU Usage Chart -->
    <div class="chart-card chart-card--primary" data-chart="cpu">
      <div class="chart-header">
        <div class="chart-icon">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        </div>
        <div class="chart-title-group">
          <h3 class="chart-title">CPU Usage</h3>
          <p class="chart-subtitle">Processor Performance</p>
        </div>
        <div class="chart-status">
          <div class="status-indicator status-indicator--active"></div>
        </div>
      </div>

      <div class="chart-content">
        <ChartComponent
          :static-data="false"
          chart-id="cpuChart"
          chart-type="line"
          chart-title="CPU Usage"
          :auto-update="true"
          border-color="rgb(168, 85, 247)"
          background-color="rgba(168, 85, 247, 0.08)"
        />
      </div>
    </div>

    <!-- RAM Usage Chart -->
    <div class="chart-card chart-card--secondary" data-chart="ram">
      <div class="chart-header">
        <div class="chart-icon">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
            />
          </svg>
        </div>
        <div class="chart-title-group">
          <h3 class="chart-title">Memory Usage</h3>
          <p class="chart-subtitle">RAM Consumption</p>
        </div>
        <div class="chart-status">
          <div class="status-indicator status-indicator--active"></div>
        </div>
      </div>

      <div class="chart-content">
        <ChartComponent
          :static-data="false"
          chart-id="ramChart"
          chart-type="line"
          chart-title="RAM Usage"
          :auto-update="true"
          border-color="rgb(34, 197, 94)"
          background-color="rgba(34, 197, 94, 0.08)"
        />
      </div>
    </div>

    <!-- Disk Usage Chart -->
    <div class="chart-card chart-card--accent" data-chart="disk">
      <div class="chart-header">
        <div class="chart-icon">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <div class="chart-title-group">
          <h3 class="chart-title">Storage Usage</h3>
          <p class="chart-subtitle">Disk Space Overview</p>
        </div>
        <div class="chart-status">
          <div class="status-indicator status-indicator--active"></div>
        </div>
      </div>

      <div class="chart-content chart-content--compact">
        <ChartComponent
          :static-data="true"
          chart-id="diskChart"
          chart-type="doughnut"
          chart-title="Disk Usage"
          :auto-update="true"
          border-color="rgb(59, 130, 246)"
          background-color="rgba(59, 130, 246, 0.08)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartComponent from '@/components/ChartComponent.vue'
</script>

<style scoped>
/* Charts Grid Layout - Optimized for performance */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
  height: 100%;
  /* Use explicit height to prevent layout shifts */
  min-height: 280px;
}

@media (min-width: 1024px) {
  .charts-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

/* Modern Chart Card Design - Performance optimized */
.chart-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba(42, 42, 42, 0.8), rgba(30, 30, 30, 0.6));
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.15); /* Reduced shadow complexity */
  height: 280px; /* Fixed height to prevent resizing */
  display: flex;
  flex-direction: column;
  /* Remove backdrop-filter for better performance */
  will-change: auto; /* Reset will-change to prevent unnecessary layers */
}

/* Simplified hover effects - no layout changes */
.chart-card:hover {
  border-color: rgba(255, 255, 255, 0.08);
}

/* Chart Header - Performance optimized */
.chart-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.25rem 0.5rem;
  flex-shrink: 0;
  /* Fixed height to prevent shifts */
  height: 60px;
}

.chart-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.875rem;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  /* Fixed size to prevent layout shifts */
  flex-shrink: 0;
}

.chart-title-group {
  flex: 1;
  min-width: 0; /* Prevent flex item overflow */
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(to right, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  margin: 0; /* Remove default margins */
  line-height: 1.2; /* Fixed line height */
}

.chart-subtitle {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.125rem 0 0 0; /* Fixed margins */
  font-weight: 500;
  line-height: 1.2; /* Fixed line height */
}

.chart-status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator--active {
  background-color: rgb(74, 222, 128);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4); /* Reduced glow effect */
}

/* Chart Content - Fixed sizing */
.chart-content {
  flex: 1;
  padding: 0 1.25rem 1.25rem;
  display: flex;
  align-items: stretch;
  /* Fixed height calculation: 280px total - 60px header - 20px padding */
  height: 200px;
  overflow: hidden; /* Prevent content overflow */
}

.chart-content--compact {
  flex: 1;
  padding: 0 1.25rem 1.25rem;
  display: flex;
  align-items: stretch;
  height: 200px;
  overflow: hidden;
}

/* Simplified pulse animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Responsive Design - Fixed heights at all breakpoints */
@media (min-width: 1200px) {
  .chart-card {
    height: 260px; /* Smaller on large screens */
  }

  .chart-content,
  .chart-content--compact {
    height: 180px;
  }
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .chart-card {
    height: 300px;
  }

  .chart-content,
  .chart-content--compact {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-card {
    height: 280px;
  }

  .chart-content,
  .chart-content--compact {
    height: 200px;
  }
}

@media (max-width: 640px) {
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .chart-header {
    padding: 1rem 1rem 0.5rem;
    height: 56px; /* Slightly smaller on mobile */
  }

  .chart-content,
  .chart-content--compact {
    padding: 0 1rem 1rem;
    height: 204px; /* Adjusted for smaller header */
  }

  .chart-card {
    height: 260px;
  }
}

/* Focus states for accessibility */
.chart-card:focus-within {
  outline: 2px solid rgba(168, 85, 247, 0.5);
  outline-offset: 2px;
}

/* Performance optimizations */
.chart-card * {
  /* Prevent subpixel rendering issues */
  transform: translateZ(0);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
