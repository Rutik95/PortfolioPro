<template>
  <button
    @click="toggleAnimations"
    class="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
    :title="animationsEnabled ? 'Hide floating balls' : 'Show floating balls'"
  >
    <svg
      v-if="animationsEnabled"
      class="w-6 h-6 text-primary-600 dark:text-primary-400 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="8"/>
    </svg>
    <svg
      v-else
      class="w-6 h-6 text-gray-600 dark:text-gray-400 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3"/>
      <circle cx="12" cy="12" r="8"/>
      <line x1="3" y1="3" x2="21" y2="21"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Animation toggle state
const animationsEnabled = ref(true)

// Toggle animations function
const toggleAnimations = () => {
  animationsEnabled.value = !animationsEnabled.value
  localStorage.setItem('floatingElementsEnabled', animationsEnabled.value.toString())

  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('floatingElementsToggle', {
    detail: { enabled: animationsEnabled.value }
  }))
}

// Load animation preference on mount
onMounted(() => {
  const saved = localStorage.getItem('floatingElementsEnabled')
  if (saved !== null) {
    animationsEnabled.value = saved === 'true'
  }

  // Listen for animation toggle events from other components
  window.addEventListener('floatingElementsToggle', (event: any) => {
    animationsEnabled.value = event.detail.enabled
  })
})
</script>