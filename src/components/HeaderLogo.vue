<template>
  <h1
    class="text-3xl md:text-4xl font-bold bg-gradient-to-r text-purple-300 transform transition-all duration-500 relative opacity-0 translate-y-4 animate-fade-in-up"
  >
    <span class="inline-block animate-text-shimmer">{{ text }}</span>
  </h1>
</template>

<script setup lang="ts">
const { text } = defineProps<{
  text: string
}>()
</script>

<style scoped>
@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes text-shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out 0.2s forwards;
}

.animate-text-shimmer {
  background: linear-gradient(90deg, #a855f7, #c084fc, #a855f7);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-shimmer 3s ease-in-out infinite;
}
</style>
