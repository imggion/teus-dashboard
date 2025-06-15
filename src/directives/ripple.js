export default {
  mounted(el) {
    // Ensure the element has relative positioning for ripple positioning
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }

    const createRipple = (e) => {
      // Remove any existing ripples that have finished animating
      const existingRipples = el.querySelectorAll('.button-ripple')
      existingRipples.forEach((ripple) => {
        if (ripple.animationPlayState === 'finished') {
          ripple.remove()
        }
      })

      const circle = document.createElement('span')
      const diameter = Math.max(el.clientWidth, el.clientHeight)
      const radius = diameter / 2

      // Calculate position relative to element
      const rect = el.getBoundingClientRect()
      const x =
        (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left - radius
      const y =
        (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top - radius

      // Set initial styles
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${x}px`
      circle.style.top = `${y}px`
      circle.classList.add('button-ripple')

      // Add ripple to element
      el.appendChild(circle)

      // Remove ripple after animation completes
      setTimeout(() => {
        if (circle.parentNode) {
          circle.remove()
        }
      }, 600)
    }

    // Support both mouse and touch events
    el.addEventListener('click', createRipple)
    el.addEventListener('touchstart', createRipple, { passive: true })

    // Store the handler for cleanup
    el._rippleHandler = createRipple
  },

  unmounted(el) {
    // Clean up event listeners
    if (el._rippleHandler) {
      el.removeEventListener('click', el._rippleHandler)
      el.removeEventListener('touchstart', el._rippleHandler)
    }

    // Remove any remaining ripples
    const ripples = el.querySelectorAll('.button-ripple')
    ripples.forEach((ripple) => ripple.remove())
  },
}
