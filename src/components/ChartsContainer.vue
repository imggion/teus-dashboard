<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
    <div class="opacity-0 animate-chart-slide-in" style="animation-delay: 0.1s">
      <ChartComponent
        :static-data="false"
        chart-id="cpuChart"
        chart-type="line"
        chart-title="CPU Usage"
        :auto-update="true"
        border-color="rgb(187, 134, 252)"
        background-color="rgba(187, 134, 252, 0.1)"
      />
    </div>

    <div class="opacity-0 animate-chart-slide-in" style="animation-delay: 0.3s">
      <ChartComponent
        :static-data="false"
        chart-id="ramChart"
        chart-type="line"
        chart-title="RAM Usage"
        :auto-update="true"
        border-color="rgb(3, 218, 198)"
        background-color="rgba(3, 218, 198, 0.1)"
      />
    </div>

    <div class="opacity-0 animate-chart-slide-in" style="animation-delay: 0.5s">
      <ChartComponent
        :static-data="true"
        chart-id="diskChart"
        chart-type="doughnut"
        chart-title="Disk Usage"
        :auto-update="true"
        border-color="rgb(3, 218, 198)"
        background-color="rgba(3, 218, 198, 0.1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChartComponent from '@/components/ChartComponent.vue'
</script>

<style scoped>
@keyframes chart-slide-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-chart-slide-in {
  animation: chart-slide-in 0.8s ease-out forwards;
}
</style>
