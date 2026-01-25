<template>
  <canvas
    v-if="particlesEnabled"
    ref="canvas"
    class="fixed inset-0 pointer-events-none"
    :style="{ background: 'transparent', zIndex: '-1' }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

const particlesEnabled = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number | undefined = undefined
let mouse = { x: 0, y: 0 }

// Theme store
const themeStore = useThemeStore()

// Particle configuration
const PARTICLE_COUNT = 1000
const MAX_SPEED = 0.3
const MIN_SIZE = 0.5
const MAX_SIZE = 2
const CONNECTION_DISTANCE = 60
const REPULSION_DISTANCE = 60
const REPULSION_FORCE = 0.5

// Reactive colors based on theme
const PARTICLE_COLORS = computed(() => {
  if (themeStore.isDark) {
    // White/light colors for dark background
    return [
      'rgba(255, 255, 255, 0.9)',
      'rgba(255, 255, 255, 0.7)',
      'rgba(248, 250, 255, 0.8)',
      'rgba(240, 248, 255, 0.6)',
      'rgba(255, 255, 255, 0.8)',
      'rgba(245, 248, 255, 0.7)',
      'rgba(255, 255, 255, 0.6)',
      'rgba(250, 252, 255, 0.8)'
    ]
  } else {
    // Black/dark colors for light background
    return [
      'rgba(0, 0, 0, 0.8)',
      'rgba(0, 0, 0, 0.6)',
      'rgba(10, 10, 10, 0.7)',
      'rgba(20, 20, 20, 0.5)',
      'rgba(0, 0, 0, 0.7)',
      'rgba(15, 15, 15, 0.6)',
      'rgba(0, 0, 0, 0.5)',
      'rgba(5, 5, 5, 0.7)'
    ]
  }
})

// Initialize particles
const initParticles = () => {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
      size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
      alpha: Math.random() * 0.4 + 0.3, // More subtle alpha for star-like appearance
      color: PARTICLE_COLORS.value[Math.floor(Math.random() * PARTICLE_COLORS.value.length)]
    })
  }
}

// Update particle colors when theme changes
const updateParticleColors = () => {
  particles.forEach(particle => {
    particle.color = PARTICLE_COLORS.value[Math.floor(Math.random() * PARTICLE_COLORS.value.length)]
  })
}

// Update particle positions
const updateParticles = () => {
  particles.forEach(particle => {
    // Apply mouse repulsion
    const dx = mouse.x - particle.x
    const dy = mouse.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < REPULSION_DISTANCE && distance > 0) {
      const force = (REPULSION_DISTANCE - distance) / REPULSION_DISTANCE
      const angle = Math.atan2(dy, dx)
      particle.vx -= Math.cos(angle) * force * REPULSION_FORCE
      particle.vy -= Math.sin(angle) * force * REPULSION_FORCE
    }

    // Update position
    particle.x += particle.vx
    particle.y += particle.vy

    // Apply friction to prevent particles from moving too fast
    particle.vx *= 0.98
    particle.vy *= 0.98

    // Wrap around edges for seamless star field effect
    if (particle.x < 0) particle.x = window.innerWidth
    if (particle.x > window.innerWidth) particle.x = 0
    if (particle.y < 0) particle.y = window.innerHeight
    if (particle.y > window.innerHeight) particle.y = 0
  })
}

// Draw particles and connections
const draw = () => {
  if (!ctx || !canvas.value) return

  // TypeScript knows ctx and canvas are not null here
  const context = ctx
  const canvasElement = canvas.value

  // Clear canvas
  context.clearRect(0, 0, canvasElement.width, canvasElement.height)

  // Draw connections between close particles (very subtle for star field)
  context.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  context.lineWidth = 0.3

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < CONNECTION_DISTANCE) {
        const alpha = 1 - (distance / CONNECTION_DISTANCE)
        context.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.03})`
        context.beginPath()
        context.moveTo(particles[i].x, particles[i].y)
        context.lineTo(particles[j].x, particles[j].y)
        context.stroke()
      }
    }
  }

  // Draw particles
  particles.forEach(particle => {
    context.save()
    context.globalAlpha = particle.alpha

    // Subtle glow effect for star-like appearance
    context.shadowColor = particle.color
    context.shadowBlur = particle.size * 1.5

    // Draw particle as a small star-like dot
    context.fillStyle = particle.color
    context.beginPath()
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    context.fill()

    context.restore()
  })
}

// Animation loop
const animate = () => {
  updateParticles()
  draw()
  animationId = requestAnimationFrame(animate)
}

// Handle mouse movement
const handleMouseMove = (event: MouseEvent) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

// Handle window resize
const handleResize = () => {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }
}

// Initialize canvas
const initCanvas = () => {
  if (!canvas.value) {
    return false
  }

  const canvasElement = canvas.value
  ctx = canvasElement.getContext('2d')
  if (!ctx) {
    return false
  }

  canvasElement.width = window.innerWidth
  canvasElement.height = window.innerHeight

  // Set canvas to be behind other content but above background
  canvasElement.style.position = 'fixed'
  canvasElement.style.top = '0'
  canvasElement.style.left = '0'
  canvasElement.style.pointerEvents = 'none'
  return true
}

// Load preference and set up event listeners
onMounted(() => {
  const saved = localStorage.getItem('starsEnabled')
  if (saved !== null) {
    particlesEnabled.value = saved === 'true'
  }

  // Listen for particle toggle events
  window.addEventListener('particlesToggle', (event: CustomEvent<{ enabled: boolean }>) => {
    const wasEnabled = particlesEnabled.value
    particlesEnabled.value = event.detail.enabled

    // Start or stop animation based on the new state
    if (particlesEnabled.value && !wasEnabled) {
      // Starting particles
      nextTick(() => {
        if (initCanvas()) {
          initParticles()
          animate()
        }
      })
    } else if (!particlesEnabled.value && wasEnabled) {
      // Stopping particles
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
        animationId = undefined
      }
    }
  })

  // Set up mouse tracking
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)

  // Watch for theme changes and update particle colors
  watch(() => themeStore.isDark, () => {
    if (particlesEnabled.value && particles.length > 0) {
      updateParticleColors()
    }
  })

  // Initialize if enabled
  if (particlesEnabled.value) {
    nextTick(() => {
      if (initCanvas()) {
        initParticles()
        animate()
      }
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  if (animationId !== undefined) {
    cancelAnimationFrame(animationId)
  }
})
</script>