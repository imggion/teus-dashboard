import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Performance optimization composable for better UX
 */
export function usePerformance() {
  const isSlowConnection = ref(false)
  const prefersReducedMotion = ref(false)
  const isLowPowerMode = ref(false)

  // Check connection speed
  const checkConnectionSpeed = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        // Consider slow if effective type is 2g or 3g
        isSlowConnection.value = ['slow-2g', '2g', '3g'].includes(connection.effectiveType)
      }
    }
  }

  // Check for reduced motion preference
  const checkReducedMotion = () => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // Check for battery status (if available)
  const checkBatteryStatus = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery()
        // Consider low power mode if battery is low and not charging
        isLowPowerMode.value = battery.level < 0.2 && !battery.charging

        const updateBatteryStatus = () => {
          isLowPowerMode.value = battery.level < 0.2 && !battery.charging
        }

        battery.addEventListener('levelchange', updateBatteryStatus)
        battery.addEventListener('chargingchange', updateBatteryStatus)

        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus)
          battery.removeEventListener('chargingchange', updateBatteryStatus)
        }
      } catch (error) {
        console.debug('Battery API not available')
      }
    }
  }

  // Debounce function for performance
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: number
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Throttle function for performance
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Request animation frame helper
  const requestIdleCallback = (callback: () => void) => {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback)
    } else {
      return setTimeout(callback, 1)
    }
  }

  // Optimize animations based on performance conditions
  const getOptimizedAnimationDuration = (defaultDuration: number): number => {
    if (prefersReducedMotion.value) return 0
    if (isSlowConnection.value || isLowPowerMode.value) return defaultDuration * 0.5
    return defaultDuration
  }

  // Optimize image loading
  const shouldLoadImages = (): boolean => {
    return !isSlowConnection.value
  }

  // Performance-aware intersection observer
  const createPerformantObserver = (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ): IntersectionObserver => {
    const optimizedOptions = {
      ...options,
      // Reduce frequency on slow connections
      rootMargin: isSlowConnection.value ? '50px' : '100px',
    }

    return new IntersectionObserver(
      throttle(callback, isSlowConnection.value ? 100 : 50),
      optimizedOptions,
    )
  }

  let cleanupFunctions: (() => void)[] = []

  onMounted(() => {
    checkConnectionSpeed()
    const cleanupReducedMotion = checkReducedMotion()
    if (cleanupReducedMotion) cleanupFunctions.push(cleanupReducedMotion)

    checkBatteryStatus().then((cleanup) => {
      if (cleanup) cleanupFunctions.push(cleanup)
    })
  })

  onUnmounted(() => {
    cleanupFunctions.forEach((cleanup) => cleanup())
  })

  return {
    isSlowConnection,
    prefersReducedMotion,
    isLowPowerMode,
    debounce,
    throttle,
    requestIdleCallback,
    getOptimizedAnimationDuration,
    shouldLoadImages,
    createPerformantObserver,
  }
}
