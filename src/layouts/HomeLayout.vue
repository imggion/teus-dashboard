<template>
  <div class="flex flex-col min-h-[100dvh] pb-10 bg-[#121212] relative overflow-hidden">
    <!-- Animated background gradient -->
    <div
      class="fixed inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 opacity-0 animate-background-fade pointer-events-none"
    ></div>

    <!-- Content wrapper with smooth entrance -->
    <div class="relative z-10 opacity-0 animate-content-fade">
      <slot />
    </div>

    <!-- Subtle floating particles for ambient effect -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400/20 rounded-full animate-float-slow"
      ></div>
      <div
        class="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-400/20 rounded-full animate-float-slower"
      ></div>
      <div
        class="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-300/10 rounded-full animate-float-medium"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes background-fade {
  to {
    opacity: 1;
  }
}

@keyframes content-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-10px) translateX(5px);
  }
  66% {
    transform: translateY(5px) translateX(-5px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-15px) translateX(8px);
  }
}

@keyframes float-slower {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-8px) translateX(-3px);
  }
  75% {
    transform: translateY(8px) translateX(3px);
  }
}

.animate-background-fade {
  animation: background-fade 2s ease-out 0.5s forwards;
}

.animate-content-fade {
  animation: content-fade 0.8s ease-out forwards;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 10s ease-in-out infinite;
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-background-fade,
  .animate-content-fade {
    animation-duration: 0.1s;
  }

  .animate-float-slow,
  .animate-float-medium,
  .animate-float-slower {
    animation: none;
  }
}
</style>
