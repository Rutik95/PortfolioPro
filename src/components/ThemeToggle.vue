<template>
  <button
    @click="toggleTheme"
    class="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group dark:bg-gray-800/90 dark:border-gray-700 dark:shadow-black/20"
    :class="{ 'animate-pulse-glow': isDark }"
    aria-label="Toggle theme"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="!isDark"
      class="w-6 h-6 text-yellow-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-else
      class="w-6 h-6 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>

    <!-- Animated background glow -->
    <div
      v-if="isDark"
      class="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse-glow"
    ></div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>