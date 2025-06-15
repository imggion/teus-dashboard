<template>
  <div class="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
const { errorMessage } = defineProps<{
  errorMessage: string
}>()
</script>
