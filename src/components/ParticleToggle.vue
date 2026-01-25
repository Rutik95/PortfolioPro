<template>
  <button
    @click="toggleParticles"
    class="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
    :title="particlesEnabled ? 'Disable star background' : 'Enable star background'"
  >
    <svg
      v-if="particlesEnabled"
      class="w-6 h-6 text-primary-600 dark:text-primary-400 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
    </svg>
    <svg
      v-else
      class="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      <line x1="3" y1="3" x2="21" y2="21"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const particlesEnabled = ref(false)

// Toggle particles
const toggleParticles = () => {
  particlesEnabled.value = !particlesEnabled.value
  localStorage.setItem('starsEnabled', particlesEnabled.value.toString())

  // Dispatch event to sync with ParticleBackground component
  window.dispatchEvent(new CustomEvent('particlesToggle', {
    detail: { enabled: particlesEnabled.value }
  }))
}

// Load preference on mount
onMounted(() => {
  const saved = localStorage.getItem('starsEnabled')
  if (saved !== null) {
    particlesEnabled.value = saved === 'true'
  }

  // Listen for particle toggle events from other sources
  window.addEventListener('particlesToggle', (event: CustomEvent<{ enabled: boolean }>) => {
    particlesEnabled.value = event.detail.enabled
  })
})
</script>